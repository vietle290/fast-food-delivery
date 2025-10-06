import DeliveryAssign from "../models/deliveryAssign.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (cartItems.length === 0 || !cartItems) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const listItemsShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop._id;
      if (!listItemsShop[shopId]) {
        listItemsShop[shopId] = [];
      }
      listItemsShop[shopId].push(item);
    });
    const shopOrders = await Promise.all(
      Object.keys(listItemsShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(404).json({ message: "Shop not found" });
        }
        const items = listItemsShop[shopId];
        const subtotal = items.reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );
        // const shopItems = items.map((item) => ({
        //   item: item._id,
        //   name: item.name,
        //   price: item.price,
        //   quantity: item.quantity,
        // }));
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopItems: items.map((item) => ({
            item: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        };
      })
    );
    const order = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });
    await order.populate("shopOrders.shopItems.item", "name image price");
    await order.populate("shopOrders.shop", "name");
    return res.status(201).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error creating order: ${error.message}` });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role == "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "fullName email mobile")
        .populate("shopOrders.shopItems.item", "name image price")
        .populate("user", "fullName email mobile role isOtpVerified");
      return res.status(200).json(orders);
    } else if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopItems.item", "name image price")
        .populate("shopOrders.assignedShipper", "fullName mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        user: order.user,
        paymentMethod: order.paymentMethod,
        shopOrders: order.shopOrders.filter(
          (shopOrder) => shopOrder.owner == req.userId
        ),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        totalAmount: order.shopOrders.reduce((total, shopOrder) => {
          if (shopOrder.owner == req.userId) {
            return total + shopOrder.subtotal;
          }
          return total;
        }, 0),
      }));
      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting user orders: ${error.message}` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params; // shopId is the id of the shop in the shopOrders array
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const shopOrder = order.shopOrders.find(
      (shopOrder) => shopOrder.shop == shopId
    );
    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }
    shopOrder.status = status;
    let shippersPayload = [];
    if ((status === "pending" || status === "preparing") && shopOrder.assignment) {
      // If order is set back to pending or preparing, remove assignment
      console.log("Removing assignmentttttttttttttttttttttttttttttt");
      await DeliveryAssign.findByIdAndDelete(shopOrder.assignment);
      shopOrder.assignment = null;
      shopOrder.assignedShipper = null;
      await order.save();
      const updateShopOrder = order.shopOrders.find(
        (shopOrder) => shopOrder.shop == shopId
      );
      return res.status(200).json({
        shopOrder: updateShopOrder,
        assignedShipper: null,
        avaibleShippers: [],
        assignment: null,
      });
    }
    console.log("assignment:", shopOrder.assignment);
    if (status === "out-for-delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearestDriver = await User.find({ // Find users with role "shipper" within a radius of 1 km
        role: "shipper",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 10000, // 1 km
          },
        },
      });
      const nearestDriversId = nearestDriver.map((driver) => driver._id); // Extract their IDs
      // Find busy drivers who are already assigned to other orders
      // Exclude drivers who are in "broadcasted" or "completed" status
      const busyDriversId = await DeliveryAssign.find({
        assignedTo: { $in: nearestDriversId }, // Only consider drivers in the nearby list
        status: { $nin: ["broadcasted", "completed"] }, // Exclude "broadcasted" and "completed"
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyDriversId.map((id) => id.toString())); // Convert to string for easier comparison
      // Filter out busy drivers from the nearest drivers list
      // Only keep drivers who are not busy
      const availableDrivers = nearestDriver.filter(
        (b) => !busyIdSet.has(b._id.toString())
      );
      const cadidateDriver = availableDrivers.map((d) => d._id); // Extract their IDs

      if (cadidateDriver.length == 0) {
        await order.save();
        return res.status(404).json({ message: "No available drivers found" });
      }
      const deliveryAssign = await DeliveryAssign.create({
        shop: shopOrder.shop,
        order: orderId,
        shopOrderId: shopOrder._id,
        broadcastedTo: cadidateDriver,
        status: "broadcasted",
      });
      shopOrder.assignedShipper = deliveryAssign.assignedTo; // Initially null
      shopOrder.assignment = deliveryAssign._id;
      shippersPayload = availableDrivers.map((driver) => ({
        id: driver._id,
        fullName: driver.fullName,
        mobile: driver.mobile,
        email: driver.email,
        longitude: driver.location.coordinates[0],
        latitude: driver.location.coordinates[1],
      }));
    }
    // await shopOrder.save();
    await order.save();
    const updateShopOrder = order.shopOrders.find(
      (shopOrder) => shopOrder.shop == shopId
    );
    await order.populate("shopOrders.shop", "name");
    await order.populate("shopOrders.assignedShipper", "fullName email mobile");

    return res.status(200).json({
      shopOrder: updateShopOrder,
      assignedShipper: updateShopOrder?.assignedShipper,
      avaibleShippers: shippersPayload,
      assignment: updateShopOrder?.assignment?._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating order status: ${error.message}` });
  }
};

export const getAssignmentOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const assignments = await DeliveryAssign.find({
      broadcastedTo: userId, // Only get orders assigned to the shipper
      status: "broadcasted", // Only get active assignments
    })
    .populate("order")
    .populate("shop")

    const formattedAssignment = assignments.map(a => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items: a.order.shopOrders.find(so => so.shop.toString() === a.shop._id.toString())?.shopItems || [],
      subtotal: a.order.shopOrders.find(so => so.shop.toString() === a.shop._id.toString())?.subtotal || 0,
    }));
    return res.status(200).json(formattedAssignment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting assignment orders: ${error.message}` });
  }
};

export const acceptAssignment = async (req, res) => {
  try {
    const userId = req.userId;
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssign.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    if (assignment.status !== "broadcasted") {
      return res.status(400).json({ message: "Assignment already accepted or completed" });
    }
    // if (assignment.assignedTo !== userId) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    const alreadyAssigned = await DeliveryAssign.findOne({
      assignedTo: userId,
      status: { $nin: ["broadcasted", "completed"] },
    });
    if (alreadyAssigned) {
      return res.status(400).json({ message: "You already have an active assignment" });
    }
    assignment.assignedTo = userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();
    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const shopOrder = order.shopOrders.id(assignment.shopOrderId);
    shopOrder.assignedShipper = userId;
    await order.save();
    return res.status(200).json({ message: "Order accepted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error accepting assignment: ${error.message}` });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const currentAssignment = await DeliveryAssign.findOne({
      assignedTo: userId,
      status: "assigned",
    })
    .populate("shop", "name")
    .populate("assignedTo", "fullName email mobile location")
    .populate({
      path: "order",
      populate: { path: "user", select: "fullName email mobile location" }
    });

    if (!currentAssignment) {
      return res.status(404).json({ message: "No current assignment found" });
    }

    if(!currentAssignment.order) {
      return res.status(404).json({ message: "No order found for this assignment" });
    }
    const shopOrder = currentAssignment.order.shopOrders.id(currentAssignment.shopOrderId);
    if (!shopOrder) {
      return res.status(404).json({ message: "No shop order found for this assignment" });
    }
    let shipperLocation = {latitude: null, longitude: null};
    if (currentAssignment.assignedTo?.location?.coordinates) {
    shipperLocation.latitude = currentAssignment.assignedTo?.location?.coordinates[1] || null;
    shipperLocation.longitude = currentAssignment.assignedTo?.location?.coordinates[0] || null;
    }

    let customerLocation = {latitude: null, longitude: null};
    if (currentAssignment.order?.deliveryAddress) {
    customerLocation.latitude = currentAssignment.order?.deliveryAddress?.latitude || null;
    customerLocation.longitude = currentAssignment.order?.deliveryAddress?.longitude || null;
    }
    return res.status(200).json({
      _id: currentAssignment.order._id,
      user: currentAssignment.order.user,
      shop: currentAssignment.shop,
      shopOrder,
      deliveryAddress: currentAssignment.order.deliveryAddress,
      shipperLocation,
      customerLocation,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting current order: ${error.message}` });
  }
}
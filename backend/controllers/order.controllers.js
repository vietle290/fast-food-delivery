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
        .populate("shopOrders.shopItems.item", "name image price");

        const filteredOrders = orders.map((order => ({
          _id: order._id,
          user: order.user,
          paymentMethod: order.paymentMethod,
          shopOrders: order.shopOrders.filter(shopOrder => shopOrder.owner == req.userId),
          createdAt: order.createdAt,
          deliveryAddress: order.deliveryAddress,
          totalAmount: order.shopOrders.reduce((total, shopOrder) => {
            if (shopOrder.owner == req.userId) {
              return total + shopOrder.subtotal;
            }
            return total;
          }, 0),
        })))
      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting user orders: ${error.message}` });
  }
};

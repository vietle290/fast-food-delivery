import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";

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

    cartItems.forEach(item => {
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
            item: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
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
    return res.status(201).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error creating order: ${error.message}` });
  }
};

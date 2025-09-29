import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    name: String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true }
);
const shopOrderSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subtotal: Number,
    shopItems: [shopItemSchema],
  },
  { timestamps: true }
);
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    deliveryAddress: { text: String, latitude: Number, longitude: Number },
    totalAmount: { type: Number },
    shopOrders: [shopOrderSchema],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

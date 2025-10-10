import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
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
    status: { type: String, enum: ["pending", "preparing", "out-for-delivery", "delivered"], default: "pending" },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAssign", default: null }, // Reference to DeliveryAssign
    assignedShipper: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Shipper assigned to this shop order
    deliveryOtp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
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
    payment:  { type: Boolean, default: false },
    payosOrderId: { type: String, default: "" },
    payosPaymentId: {type: String, default: "" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

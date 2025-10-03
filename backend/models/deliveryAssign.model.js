import mongoose from "mongoose";

const deliveryAssignSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    shopOrderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Shipper assigned
    broadcastedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Candidate shippers
    status: { type: String, enum: ["broadcasted", "assigned", "completed"], default: "broadcasted" },
    acceptedAt: { type: Date, default: null },
}, { timestamps: true })

const DeliveryAssign = mongoose.model("DeliveryAssign", deliveryAssignSchema);
export default DeliveryAssign;
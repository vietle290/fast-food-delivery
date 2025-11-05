import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        address: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [106.660172, 10.762622] } },
    },
    { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
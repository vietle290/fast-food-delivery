import mongoose from "mongoose";

const NutritionSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
});

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    image: { type: String, required: true },
    description: { type: String },
    nutrition: { type: NutritionSchema },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    type: { type: String, enum: ["Veg", "Non-veg", "Others"], required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    sell: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;

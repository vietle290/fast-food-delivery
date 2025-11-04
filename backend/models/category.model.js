import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image : { type: String },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    image: { type: String, required: true },
    // category: {
    //   type: String,
    //   enum: [
    //     "Burgers and Fries",
    //     "Pizza",
    //     "Fried Chicken",
    //     "Tacos and Mexican Food",
    //     "Sandwiches and Subs",
    //     "Hot Dogs",
    //     "Seafood (e.g., Fish and Chips)",
    //     "Asian Fusion (e.g., Chinese, Japanese takeout)",
    //     "Breakfast Items (e.g., Muffins, Burritos)",
    //     "Salads and Healthy Options",
    //     "Ice Cream and Desserts",
    //     "Coffee and Beverages",
    //     "Donuts and Pastries",
    //     "Wraps and Pitas",
    //     "Barbecue and Grilled Meats",
    //     "All"
    //   ],
    //   required: true,
    // },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    type: { type: String, enum: ["Veg", "Non-veg", "Others"], required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;

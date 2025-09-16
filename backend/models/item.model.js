import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Pizza",
        "Burger",
        "Dessert",
        "Drink",
        "Snack",
        "Chicken nuts",
        "Pasta",
        "Egg Tart",
        "Milk shake",
        "Ice cream",
        "Bacon",
        "Chips",
        "Sandwich",
        "Noodles",
        "Soda",
        "Sausage",
        "Others",
      ],
      required: true,
    },
    type: { type: String, enum: ["Veg", "Non-veg", "Others"], required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;

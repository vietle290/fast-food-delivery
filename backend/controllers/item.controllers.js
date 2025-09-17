import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, type, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      type,
      price,
      image,
      shop: shop._id,
    });

    return res.status(201).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error adding item: ${error.message}` });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { name, category, type, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
    }
    const item = await Item.findByIdAndUpdate(req.params.id, {
      name,
      category,
      type,
      price,
      image,
    }, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating item: ${error.message}` });
  }
};

import Category from "../models/category.model.js";
import Shop from "../models/shop.model.js";
import uploadCloudinary from "../utils/cloudinary.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json(categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting categories: ${error.message}` });
  }
};

export const getCategoryByShopId = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId).populate({
      path: "categories",
      options: { sort: { updatedAt: -1 } },
    }); // Sort items by updatedAt in descending order
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting categories by shop: ${error.message}` });
  }
};

// create new category with name and image url and creator id from req.userId
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let image;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });
    const category = await Category.create({
      name,
      image,
      shop: shop,
    });
    shop.categories.push(category._id); // add category id to shop's categories array
    await shop.save();
    // await shop.populate("owner");
    // await shop.populate({
    //   path: "categories",
    //   options: { sort: { updatedAt: -1 } },
    // });
    console.log("Created Category:", shop);
    return res.status(201).json(shop.categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error creating category: ${error.message}` });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let image;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
    }
    const cate = await Category.findByIdAndUpdate(
      req.params.itemId,
      {
        name,
        image,
      },
      { new: true }
    );
    if (!cate) {
      return res.status(404).json({ message: "category not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "categories",
      options: { sort: { updatedAt: -1 } }, // Sort items by updatedAt in descending order
    });
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating item: ${error.message}` });
  }
};

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
      options: { sort: { updatedAt: -1 },
      populate: {
        path: "shop",
        select: "name",
      }
    },
    }); 
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
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      select: "name price image type category rating shop",
      populate: {
        path: "category", 
        select: "name shop", 
      },
    });
    await shop.populate("categories");

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
      req.params.categoryId,
      {
        name,
        image,
      },
      { new: true }
    );
    if (!cate) {
      return res.status(404).json({ message: "category not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    await shop.save();
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      select: "name price image type category rating shop",
      populate: {
        path: "category", 
        select: "name shop",
      },
    });
    await shop.populate("categories");
    return res.status(200).json(shop.categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating item: ${error.message}` });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const cate = await Category.findByIdAndDelete(req.params.categoryId);
    if (!cate) {
      return res.status(404).json({ message: "Category not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    shop.categories = shop.categories.filter(
      (category) => category._id.toString() !== req.params.categoryId
    );
    await shop.save();
    await shop.populate("owner");
    await shop.populate("categories");
    return res.status(200).json(shop.categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error deleting category: ${error.message}` });
  }
};

export const deleteMultipleCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body; 
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ message: "No category IDs provided" });
    }
    const deletedCategories = await Category.deleteMany({ _id: { $in: categoryIds } });
    if (deletedCategories.deletedCount === 0) {
      return res.status(404).json({ message: "No categories found to delete" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    await shop.save();
    await shop.populate("owner");
    await shop.populate("categories");
    return res.status(200).json(shop.categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error deleting categories: ${error.message}` });
  }
};

export const searchCategories = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }
    const categories = await Category.find({ name: { $regex: query, $options: "i" } });
    return res.status(200).json(categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error searching categories: ${error.message}` });
  }
};
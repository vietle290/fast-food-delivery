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

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } }, // Sort items by updatedAt in descending order
    });
    return res.status(201).json(shop);
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
    const item = await Item.findByIdAndUpdate(
      req.params.itemId,
      {
        name,
        category,
        type,
        price,
        image,
      },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } }, // Sort items by updatedAt in descending order
    });
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating item: ${error.message}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting item: ${error.message}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    shop.items = shop.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );
    await shop.save();
    await shop.populate({
      path: "items owner",
      options: { sort: { updatedAt: -1 } }, // Sort items by updatedAt in descending order
    });
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error deleting item: ${error.message}` });
  }
};

export const getItemByLocation = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) return res.status(404).json({ message: "City not found" });
    const shop = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const shopId = shop.map((shop) => shop._id);
    const items = await Item.find({ shop: { $in: shopId } }).populate("shop");
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting items by location: ${error.message}` });
  }
};

export const getItemByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json({ shop, items: shop.items });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting items by shop: ${error.message}` });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;
    if (!query || !city) return null;
    const shop = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const shopId = shop.map((shop) => shop._id);
    const items = await Item.find({
      shop: { $in: shopId },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ]
    }).populate("shop");
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error searching items: ${error.message}` });
  }
};

export const rating = async (req, res) => {
  try {
    const { rating, itemId } = req.body;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const newCount = item.rating.count + 1;
    const newAverage = (item.rating.average * item.rating.count + rating) / newCount;
    item.rating.count = newCount;
    item.rating.average = newAverage;
    await item.save();
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error rating item: ${error.message}` });
  }
}

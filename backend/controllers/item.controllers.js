import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, type, price, description, nutrition } = req.body;
    const nutritionObj = JSON.parse(nutrition);
    let image;
    if (!name || !category || !type || !price || !description || !nutrition) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
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
      description,
      nutrition: nutritionObj,
      image,
      shop: shop._id,
      sell: true,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } }, // Sort items by updatedAt in descending order
    });
    await shop.populate({
      path: "items",
      select: "name price image type category rating shop description nutrition",
      populate: {
        path: "category",
        select: "name shop",
      },
    });
    await shop.populate("categories");
    return res.status(201).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error adding item: ${error.message}` });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { name, category, type, price, description, nutrition } = req.body;
    const nutritionObj = JSON.parse(nutrition);
    let image;
    if (!name || !category || !type || !price || !description || !nutrition) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (price <= 0) {
      return res.status(400).json({ message: "All fields are required" });
    }
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
        description,
        nutrition: nutritionObj,
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
    await shop.populate({
      path: "items",
      select: "name price image type category rating shop description nutrition",
      populate: {
        path: "category",
        select: "name shop",
      },
    });
    await shop.populate("categories");
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating item: ${error.message}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId).populate("shop");
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

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ updatedAt: -1 }).populate("shop"); // Sort items by updatedAt in descending order
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting items: ${error.message}` });
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
    await shop.populate({
      path: "items",
      select: "name price image type category rating shop description nutrition",
      populate: {
        path: "category",
        select: "name shop",
      },
    });
    await shop.populate("categories");
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error deleting item: ${error.message}` });
  }
};

// export const getItemByLocation = async (req, res) => {
//   try {
//     const { city } = req.params;
//     if (!city) return res.status(404).json({ message: "City not found" });
//     const shop = await Shop.find({
//       city: { $regex: new RegExp(`^${city}$`, "i") },
//     }).populate("items");
//     if (!shop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }
//     const shopId = shop.map((shop) => shop._id);
//     const items = await Item.find({ shop: { $in: shopId } })
//       .populate("shop")
//       .populate("category");
//     return res.status(200).json(items);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `Error getting items by location: ${error.message}` });
//   }
// };

export const getItemByLocation = async (req, res) => {
  try {
    const { city } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    if (!shops.length) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const shopIds = shops.map((s) => s._id);

    const items = await Item.find({ shop: { $in: shopIds } })
      .populate("shop")
      .populate("category")
      .skip((page - 1) * limit) 
      .limit(limit)             
      .sort({ createdAt: -1 }); 

    const totalItems = await Item.countDocuments({
      shop: { $in: shopIds },
    });

    return res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasMore: page * limit < totalItems,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error getting items by location: ${error.message}`,
    });
  }
};


export const getItemByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const items = await Item.find({ shop: shopId }).populate("shop");
    return res.status(200).json({ shop, items });
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
        // { category: { $regex: query, $options: "i" } },
      ],
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
    const newAverage =
      (item.rating.average * item.rating.count + rating) / newCount;
    item.rating.count = newCount;
    item.rating.average = newAverage;
    await item.save();
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error rating item: ${error.message}` });
  }
};

export const toggleSellItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item.sell = !item.sell;
    await item.save();
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error toggling sell item: ${error.message}` });
  }
};

export const filterItemsByNameShopType = async (req, res) => {
  try {
    const { name, type, city } = req.query;

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    if (!shops.length) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const shopIds = shops.map((shop) => shop._id);

    const filter = {
      shop: { $in: shopIds },
    };

    filter.sell = true;


    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }


    if (type) {
      filter.type = type; 
    }

    const items = await Item.find(filter).populate("shop");

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


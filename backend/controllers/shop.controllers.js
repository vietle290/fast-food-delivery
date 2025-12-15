import Shop from "../models/shop.model.js";
import uploadCloudinary from "../utils/cloudinary.js";

export const createAndUpdateShop = async (req, res) => {
  try {
    const { name, city, state, address, latitude, longitude } = req.body;
    let image;
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        location: { type: 'Point', coordinates: [longitude, latitude] },
        owner: req.userId,
      });
    } else {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          location: { type: 'Point', coordinates: [longitude, latitude] },
          owner: req.userId,
        },
        { new: true }
      );
    }
    await shop.populate("owner items"); // populate the owner field
    return res.status(201).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `create shop failed ${error.message}` });
  }
};

export const getShop = async (req, res) => {
  try {
    // const shop = await Shop.findOne({ owner: req.userId }).populate("owner items categories");
    const shop = await Shop.findOne({ owner: req.userId })
      .populate("owner")
      .populate({
        path: "items",
        select: "name price image type category rating shop sell",
        populate: {
          path: "category", // populate category field inside each item
          select: "name shop", // optional: specify fields you want
        },
      })
      .populate("categories");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get shop failed ${error.message}` });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const shop = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get shop by city failed ${error.message}` });
  }
};

export const searchShopByName = async (req, res) => {
  try {
    const { name, city } = req.query;
    const shop = await Shop.find({
      $and: [
        { name: { $regex: name, $options: "i" } },
        { city: { $regex: city, $options: "i" } },
      ],
    }).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `search shop by name failed ${error.message}` });
  }
};
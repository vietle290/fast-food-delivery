import Shop from "../models/shop.model.js";
import uploadCloudinary from "../utils/cloudinary.js";

export const createAndUpdateShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
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
        owner: req.userId,
      });
    } else {
      shop = await Shop.findByIdAndUpdate(shop._id, {
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      }, { new: true });
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
    const shop = await Shop.findOne({ owner: req.userId }).populate("owner items");
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
    const shop = await Shop.find({ city:{ $regex: new RegExp(`^${city}$`, "i")} }).populate("items");
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

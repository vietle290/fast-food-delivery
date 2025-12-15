import express from "express";
import { addItem, deleteItem, getAllItems, getItemById, getItemByLocation, getItemByShop, rating, searchItems, toggleSellItem, updateItem } from "../controllers/item.controllers.js";
import { upload } from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";

const itemRouter = express.Router();

itemRouter.post("/create-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/update-item/:itemId", isAuth, upload.single("image"), updateItem);
itemRouter.get("/get-item-by-id/:itemId", isAuth, getItemById);
itemRouter.get("/delete-item/:itemId", isAuth, deleteItem);
itemRouter.get("/get-item-by-location/:city", isAuth, getItemByLocation);
itemRouter.get("/get-item-by-shop/:shopId", isAuth, getItemByShop);
itemRouter.get("/search-item", isAuth, searchItems);
itemRouter.post("/rating", isAuth, rating);
itemRouter.get("/get-all-items", isAuth, getAllItems);
itemRouter.post("/toggle-sell/:itemId", isAuth, toggleSellItem);

export default itemRouter;
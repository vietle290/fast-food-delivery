import express from "express";
import { addItem, deleteItem, getItemById, getItemByLocation, getItemByShop, updateItem } from "../controllers/item.controllers.js";
import { upload } from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";

const itemRouter = express.Router();

itemRouter.post("/create-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/update-item/:itemId", isAuth, upload.single("image"), updateItem);
itemRouter.get("/get-item-by-id/:itemId", isAuth, getItemById);
itemRouter.get("/delete-item/:itemId", isAuth, deleteItem);
itemRouter.get("/get-item-by-location/:city", isAuth, getItemByLocation);
itemRouter.get("/get-item-by-shop/:shopId", isAuth, getItemByShop);

export default itemRouter;
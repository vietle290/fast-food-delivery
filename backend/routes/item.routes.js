import express from "express";
import { addItem, updateItem } from "../controllers/item.controllers.js";
import { upload } from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";

const itemRouter = express.Router();

itemRouter.post("/create-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/update-item/:itemId", isAuth, upload.single("image"), updateItem);


export default itemRouter;
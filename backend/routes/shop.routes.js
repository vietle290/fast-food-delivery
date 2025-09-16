import express from "express";
import isAuth from "../middlewares/isAuth";
import { createAndUpdateShop } from "../controllers/shop.controllers.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.get("/create-update", isAuth, upload.single("image"), createAndUpdateShop);


export default shopRouter;
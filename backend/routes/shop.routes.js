import express from "express";
import { createAndUpdateShop, getShop, getShopByCity, searchShopByName } from "../controllers/shop.controllers.js";
import { upload } from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";

const shopRouter = express.Router();

shopRouter.post("/create-update-restaurant", isAuth, upload.single("image"), createAndUpdateShop);
shopRouter.get("/get-shop", isAuth, getShop);
shopRouter.get("/get-shop-by-city/:city", isAuth, getShopByCity);
shopRouter.get("/search-shop-by-name", isAuth, searchShopByName);


export default shopRouter;
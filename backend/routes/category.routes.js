import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { createCategory, getAllCategories, getCategoryByShopId } from "../controllers/category.controllers.js";

const categoryRouter = express.Router();

categoryRouter.get("/get-all-category", isAuth, getAllCategories);
categoryRouter.post("/create-category", isAuth, upload.single("image"), createCategory);
categoryRouter.get("/get-category-by-shop/:shopId", isAuth, getCategoryByShopId);


export default categoryRouter;
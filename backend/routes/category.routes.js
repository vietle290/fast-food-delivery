import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { createCategory, deleteCategory, deleteMultipleCategories, getAllCategories, getCategoryByShopId, searchCategories, updateCategory } from "../controllers/category.controllers.js";

const categoryRouter = express.Router();

categoryRouter.get("/get-all-category", isAuth, getAllCategories);
categoryRouter.post("/create-category", isAuth, upload.single("image"), createCategory);
categoryRouter.post("/update-category/:categoryId", isAuth, upload.single("image"), updateCategory);
categoryRouter.get("/delete-category/:categoryId", isAuth, deleteCategory);
categoryRouter.post("/delete-multiple-categories", isAuth, deleteMultipleCategories);
categoryRouter.get("/get-category-by-shop/:shopId", isAuth, getCategoryByShopId);
categoryRouter.get("/search-category", isAuth, searchCategories);


export default categoryRouter;
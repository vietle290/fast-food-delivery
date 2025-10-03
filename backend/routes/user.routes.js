import express from "express";
import { getCurrentUser, updateUserLocation } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, (getCurrentUser));
userRouter.post("/update-location", isAuth, updateUserLocation);


export default userRouter;
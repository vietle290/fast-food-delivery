import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getUserOrders, placeOrder } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/get-user-orders", isAuth, getUserOrders);

export default orderRouter;
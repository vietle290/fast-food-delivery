import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getAssignmentOrders, getUserOrders, placeOrder, updateOrderStatus } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/get-user-orders", isAuth, getUserOrders);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.get("/get-shipper-assignments", isAuth, getAssignmentOrders);

export default orderRouter;
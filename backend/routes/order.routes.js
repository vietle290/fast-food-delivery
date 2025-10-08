import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { acceptAssignment, getAssignmentOrders, getCurrentOrder, getOrderById, getUserOrders, placeOrder, sendShipperOtp, updateOrderStatus, verifyShipperOtp } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/get-user-orders", isAuth, getUserOrders);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.post("/send-delivery-otp", isAuth, sendShipperOtp)
orderRouter.post("/verify-delivery-otp", isAuth, verifyShipperOtp)
orderRouter.get("/get-shipper-assignments", isAuth, getAssignmentOrders);
orderRouter.get("/accept-assignment/:assignmentId", isAuth, acceptAssignment);
orderRouter.get("/get-current-order", isAuth, getCurrentOrder);
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById);


export default orderRouter;
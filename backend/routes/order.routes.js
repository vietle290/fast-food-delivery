import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { acceptAssignment, cancelChooseShopOrder, getAssignmentOrders, getCurrentOrder, getOrderById, getTodayDeliveries, getUserOrders, placeOrder, sendShipperOtp, updateOrderStatus, verifyPayment, verifyShipperOtp } from "../controllers/order.controllers.js";

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
orderRouter.post("/verify-payment", isAuth, verifyPayment);
orderRouter.get("/get-today-deliveries", isAuth, getTodayDeliveries);
orderRouter.post("/cancel-order/:orderId/:shopOrderId", isAuth, cancelChooseShopOrder);


export default orderRouter;
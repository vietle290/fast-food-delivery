import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { acceptAssignment, cancelChooseShopOrder, getAssignedShipperOrderByShipperId, getAssignmentOrders, getCurrentOrder, getOrderById, getTodayDeliveries, getUserOrders, placeOrder, sendShipperOtp, updateOrderStatus, verifyPayment, verifyShipperOtp, getAllTodayDeliveredOrders, getThreeLatestUpdatedAtOrderByShop, getTotalOfSubTotalDeliveredOrdersByShop, getTotalNumberOfActiveSellingFoodsByShop, getPerDaysWeeklyTotalDeliveredOrdersByShop, getTotalActiveOrdersByShop } from "../controllers/order.controllers.js";

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
orderRouter.get("/get-shipper-order-by-id/:shipperId", isAuth, getAssignedShipperOrderByShipperId);
orderRouter.get("/get-all-today-delivered-orders", isAuth, getAllTodayDeliveredOrders);
orderRouter.get("/get-three-latest-updated-at-orders/:shopId", isAuth, getThreeLatestUpdatedAtOrderByShop);
orderRouter.get("/get-total-of-subtotal-delivered-orders-by-shop/:shopId", isAuth, getTotalOfSubTotalDeliveredOrdersByShop);
orderRouter.get("/get-total-number-of-active-selling-foods-by-shop/:shopId", isAuth, getTotalNumberOfActiveSellingFoodsByShop);
orderRouter.get("/get-per-days-weekly-total-delivered-orders-by-shop/:shopId", isAuth, getPerDaysWeeklyTotalDeliveredOrdersByShop);
orderRouter.get("/get-total-active-orders-by-shop/:shopId", isAuth, getTotalActiveOrdersByShop);

export default orderRouter;
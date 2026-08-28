const express = require("express");
const orderRouter = express.Router();
 
const {createCheckoutSession, webhookHandler, getMyOrders, getAllOrders, updateOrderStatus, trackOrder, getOrderById, createOrderAndSession, verifyPayment, createSwatchOrder} = require("../Controller/Orders/orderController");
const { createPayItMonthlyCheckout } = require("../Controller/Orders/payItMonthlyController");
const {protect} = require("../Middleware/authMiddleware");
const {adminOnly} = require("../Middleware/checkAdmin");

orderRouter.post("/createCheckoutSession", protect, createCheckoutSession);
orderRouter.post("/createPayItMonthlyCheckout", protect, createPayItMonthlyCheckout);
orderRouter.post("/createOrderAndSession", createOrderAndSession);
orderRouter.post("/verifyPayment", protect, verifyPayment);
orderRouter.post("/webhook",express.raw({ type: "application/json" }), webhookHandler);
orderRouter.post("/swatch", createSwatchOrder);
orderRouter.get("/getMyOrders", protect, getMyOrders);
orderRouter.get("/getAllOrders", protect, adminOnly, getAllOrders);
orderRouter.put("/updateOrderStatus/:id", protect,adminOnly, updateOrderStatus);
orderRouter.get("/track/:id", protect, trackOrder);
orderRouter.get("/getOrderById/:id", protect, getOrderById); 



module.exports = orderRouter;
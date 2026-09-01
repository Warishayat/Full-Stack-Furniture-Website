const express = require("express");
const orderRouter = express.Router();
 
const {createCheckoutSession, webhookHandler, getMyOrders, getAllOrders, updateOrderStatus, trackOrder, getOrderById, createOrderAndSession, verifyPayment, updatePaymentStatus, createSwatchOrder, deleteOrder, updateOrderDetails} = require("../Controller/Orders/orderController");
const { createPayItMonthlyCheckout, pimWebhookHandler } = require("../Controller/Orders/payItMonthlyController");
const {protect} = require("../Middleware/authMiddleware");
const {adminOnly} = require("../Middleware/checkAdmin");

orderRouter.post("/createCheckoutSession", protect, createCheckoutSession);
orderRouter.post("/createPayItMonthlyCheckout", createPayItMonthlyCheckout);
orderRouter.post("/createOrderAndSession", createOrderAndSession);
orderRouter.post("/verifyPayment", protect, verifyPayment);
orderRouter.post("/webhook",express.raw({ type: "application/json" }), webhookHandler);
orderRouter.post("/pim-webhook", express.raw({ type: "application/json" }), pimWebhookHandler);
orderRouter.post("/swatch", createSwatchOrder);
orderRouter.get("/getMyOrders", protect, getMyOrders);
orderRouter.get("/getAllOrders", protect, adminOnly, getAllOrders);
orderRouter.put("/updateOrderStatus/:id", protect,adminOnly, updateOrderStatus);
orderRouter.put("/updatePaymentStatus/:id", protect, adminOnly, updatePaymentStatus);
orderRouter.put("/updateOrderDetails/:id", protect, adminOnly, updateOrderDetails);
orderRouter.delete("/deleteOrder/:id", protect, adminOnly, deleteOrder);
orderRouter.get("/track/:id", protect, trackOrder);
orderRouter.get("/getOrderById/:id", protect, getOrderById); 




module.exports = orderRouter;
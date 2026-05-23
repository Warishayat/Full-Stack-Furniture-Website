const express = require("express");
const orderRouter = express.Router();
 
const {createCheckoutSession, webhookHandler, getMyOrders, getAllOrders, updateOrderStatus, trackOrder, getOrderById, createOrderAndSession, verifyPayment, createSwatchOrder} = require("../Controller/Orders/orderController");
const {protect} = require("../Middleware/authMiddleware");
const {adminOnly} = require("../Middleware/checkAdmin");

orderRouter.post("/createCheckoutSession", protect, createCheckoutSession);
orderRouter.post("/createOrderAndSession", createOrderAndSession);
orderRouter.post("/verifyPayment", verifyPayment);
orderRouter.post("/webhook",express.raw({ type: "application/json" }), webhookHandler);
orderRouter.post("/swatch", createSwatchOrder);
orderRouter.get("/getMyOrders", protect, getMyOrders);
orderRouter.get("/getAllOrders", protect, adminOnly, getAllOrders);
orderRouter.put("/updateOrderStatus/:id", protect,adminOnly, updateOrderStatus);
orderRouter.get("/track/:id", trackOrder); 
orderRouter.get("/getOrderById/:id", protect, getOrderById); 



module.exports = orderRouter;
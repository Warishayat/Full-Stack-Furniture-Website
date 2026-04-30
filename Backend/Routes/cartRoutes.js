const express = require("express");
const cartRouter = express.Router();
const {getCart, addToCart, updateCart, deleteFromCart, deleteAllCart} = require("../Controller/Cart/cart");
const {protect} = require("../Middleware/authMiddleware");

cartRouter.get("/getCart", protect, getCart);
cartRouter.post("/addToCart", protect, addToCart);
cartRouter.put("/updateCart/:id", protect, updateCart);
cartRouter.delete("/deleteFromCart/:id", protect, deleteFromCart);   
cartRouter.delete("/deleteAllCart", protect, deleteAllCart);

module.exports = cartRouter;
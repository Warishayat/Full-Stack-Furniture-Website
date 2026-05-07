const express = require("express");
const cartRouter = express.Router();
const {getCart, addToCart, updateCart, deleteFromCart, deleteAllCart} = require("../Controller/Cart/cart");
const {protect} = require("../Middleware/authMiddleware");

cartRouter.get("/getallcart", protect, getCart);
cartRouter.post("/addtocart", protect, addToCart);
cartRouter.put("/item/:id", protect, updateCart);
cartRouter.delete("/deleteFromCart/:id", protect, deleteFromCart);
cartRouter.delete("/dltAllCart", protect, deleteAllCart);

module.exports = cartRouter;
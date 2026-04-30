const express = require("express");
const product_router = express.Router();
const {createProduct,getAllProducts,deleteProduct,updateProduct,getSingleProduct} = require("../Controller/Admin/ProductApi");
const {protect} = require("../Middleware/authMiddleware");
const {adminOnly} = require("../Middleware/checkAdmin");
const upload = require("../Middleware/uploadMedia");
const {SearchProduct} = require("../Controller/Admin/ProductApi");

product_router.post("/createProduct",protect,adminOnly,upload.array("images", 3), createProduct);
product_router.get("/getAllProducts",getAllProducts);
product_router.delete("/deleteProduct/:id",protect,adminOnly, deleteProduct);
product_router.put("/updateProduct/:id",protect,adminOnly,upload.array("images", 3), updateProduct);
product_router.get("/getSingleProduct/:id", getSingleProduct);
product_router.get("/search",SearchProduct);

module.exports = product_router;
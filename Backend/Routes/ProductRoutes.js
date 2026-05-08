const express = require("express");
const product_router = express.Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getSingleProduct,
  SearchProduct
} = require("../Controller/Admin/ProductApi");

const { protect } = require("../Middleware/authMiddleware");
const { adminOnly } = require("../Middleware/checkAdmin");
const upload = require("../Middleware/uploadMedia");

product_router.post(
  "/createProduct",
  protect,
  adminOnly,
  upload.fields([
    { name: "images", maxCount: 150 },
    { name: "swatches", maxCount: 100 },
    { name: "sizeChart", maxCount: 1 }
  ]),
  createProduct
);

product_router.get("/getAllProducts", getAllProducts);
product_router.get("/search", SearchProduct);
product_router.get("/getSingleProduct/:id", getSingleProduct);
product_router.put(
  "/updateProduct/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "images", maxCount: 150 },
    { name: "swatches", maxCount: 100 },
    { name: "sizeChart", maxCount: 1 }
  ]),
  updateProduct
);
product_router.delete(
  "/deleteProduct/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = product_router;
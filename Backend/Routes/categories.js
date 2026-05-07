const express = require("express");
const categories_router = express.Router();
const {createCategory,getAllCategories,deleteCategory,getSingleCategory} = require("../Controller/Category/categories");
const   {protect} = require("../Middleware/authMiddleware");
const {adminOnly} = require("../Middleware/checkAdmin");
const upload = require("../Middleware/uploadMedia");


categories_router.post("/createCategory", upload.single("image"),protect, adminOnly, createCategory);
categories_router.get("/getallCategories", getAllCategories);
categories_router.delete("/deleteCategory/:id", protect, adminOnly, deleteCategory);
categories_router.get("/getSingleCategory/:id", getSingleCategory);

module.exports = categories_router;
const express = require("express");
const mongoose = require("mongoose");
const review_router = express.Router();
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getProductRating,
  getOverallRating,
  updateProductRating,
  getallReviews
} = require("../Controller/Review/ReviewApi");
const { protect } = require("../Middleware/authMiddleware");

review_router.post("/", protect, createReview);
review_router.get("/all-reviews", getallReviews);
review_router.get("/product/:productId", getProductReviews);
review_router.put("/:id", protect, updateReview);
review_router.delete("/delete/:id", protect, deleteReview);
review_router.get("/product/:productId/rating", getProductRating);
review_router.get("/overall", getOverallRating);
module.exports = review_router;
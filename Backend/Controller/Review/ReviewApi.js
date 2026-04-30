const Review = require("../../Schemas/Review");
const mongoose = require('mongoose');


const getallReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("userId", "name");
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: "ProductId and rating are required"
      });
    }

    const existingReview = await Review.findOne({ userId, productId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product"
      });
    }

    const review = await Review.create({
      userId,
      productId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name");

    res.status(200).json({
      success: true,
      reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getProductRating = async (req, res) => {
  try {
    const { productId } = req.params;

    const stats = await Review.aggregate([
      {
        $match: { productId: new mongoose.Types.ObjectId(productId) }
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: stats[0]?.totalReviews || 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOverallRating = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: stats[0]?.totalReviews || 0
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: { productId: new mongoose.Types.ObjectId(productId) }
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats[0]?.averageRating || 0,
    numReviews: stats[0]?.totalReviews || 0
  });
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getProductRating,
  getOverallRating,
  getallReviews,
  updateProductRating
};
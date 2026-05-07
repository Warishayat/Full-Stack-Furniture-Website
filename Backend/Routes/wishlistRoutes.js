const express = require("express");
const router = express.Router();
const { getWishlist, toggleWishlist } = require("../Controller/User/wishlistController");
const { protect } = require("../Middleware/authMiddleware");

router.get("/get", protect, getWishlist);
router.post("/toggle", protect, toggleWishlist);

module.exports = router;

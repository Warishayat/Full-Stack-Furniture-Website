const express = require("express");
const router = express.Router();
const { subscribe, getAllSubscribers, deleteSubscriber } = require("../Controller/Support/newsletterController");
const { protect } = require("../Middleware/authMiddleware");
const { adminOnly } = require("../Middleware/checkAdmin");

router.post("/subscribe", subscribe);
router.get("/all", protect, adminOnly, getAllSubscribers);
router.delete("/delete/:id", protect, adminOnly, deleteSubscriber);

module.exports = router;

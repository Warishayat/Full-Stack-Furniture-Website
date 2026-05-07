const express = require("express");
const router = express.Router();
const { submitContactForm, getAllMessages } = require("../Controller/Support/contactController");
const { protect } = require("../Middleware/authMiddleware");
const { adminOnly } = require("../Middleware/checkAdmin");

router.post("/submit", submitContactForm);
router.get("/all", protect, adminOnly, getAllMessages);

module.exports = router;

const express = require("express");
const router = express.Router();
const { submitContactForm, getAllMessages, updateMessageStatus, deleteMessage } = require("../Controller/Support/contactController");
const { protect } = require("../Middleware/authMiddleware");
const { adminOnly } = require("../Middleware/checkAdmin");

router.post("/submit", submitContactForm);
router.get("/all", protect, adminOnly, getAllMessages);
router.put("/status/:id", protect, adminOnly, updateMessageStatus);
router.delete("/delete/:id", protect, adminOnly, deleteMessage);

module.exports = router;

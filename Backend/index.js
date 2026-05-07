const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./Config/database");

const authRouter = require("./Routes/authRoutes");
const product_router = require("./Routes/ProductRoutes");
const category_router = require("./Routes/categories");
const cartRouter = require("./Routes/cartRoutes");  
const filter_router = require("./Routes/filteringRoutes");
const orderRouter = require("./Routes/orderRoutes");
const review_router = require("./Routes/RatingReviewRoutes");
const contactRouter = require("./Routes/contactRoutes");
const newsletterRouter = require("./Routes/newsletterRoutes");
const wishlistRouter = require("./Routes/wishlistRoutes");
const { webhookHandler } = require("./Controller/Orders/orderController");

const app = express();

app.use(cors());
connectDB();

// ==========================
// 🔥 STRIPE WEBHOOK (FIRST)
// ==========================
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

// ==========================
// 👇 JSON PARSER (AFTER WEBHOOK)
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// ROUTES
// ==========================
app.use("/auth", authRouter);
app.use("/product", product_router);
app.use("/category", category_router);
app.use("/cart", cartRouter);
app.use("/filter", filter_router);
app.use("/api/order", orderRouter);
app.use("/review", review_router);
app.use("/support", contactRouter);
app.use("/newsletter", newsletterRouter);
app.use("/wishlist", wishlistRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
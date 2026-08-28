const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./Config/database");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

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

app.use(cors({
  origin: ['https://eliteseatingltd.co.uk', 'http://localhost:5173'],
  credentials: true
}));

app.use(helmet());

// Generic rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(apiLimiter);

// Strict rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many login attempts, please try again after 15 minutes."
});
app.use("/auth/login", loginLimiter);
app.use(compression());
connectDB();

app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

const { pimWebhookHandler } = require("./Controller/Orders/payItMonthlyController");
app.post(
  "/api/order/pim-webhook",
  express.raw({ type: "application/json" }),
  pimWebhookHandler
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  if (req.query) mongoSanitize.sanitize(req.query, { replaceWith: '_' });
  if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  next();
});


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
app.use("/", require("./Routes/feedRoutes"));

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
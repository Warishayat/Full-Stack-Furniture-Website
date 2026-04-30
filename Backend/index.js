const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./Config/database');

const authRouter = require("./Routes/authRoutes");
const product_router = require('./Routes/ProdductRoutes');
const category_router = require('./Routes/categories');
const cartRouter = require('./Routes/cartRoutes');
const orderRouter = require('./Routes/orderRoutes');
const review_router = require('./Routes/RatingReviewRoutes');

const app = express();

app.use(cors());
connectDB();

app.use(
  "/api/order/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRouter);
app.use("/product", product_router);
app.use("/category", category_router);
app.use("/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/review", review_router);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
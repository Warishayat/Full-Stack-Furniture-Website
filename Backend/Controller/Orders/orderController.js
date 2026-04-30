const Order = require("../../Schemas/Order");
const Cart = require("../../Schemas/Cart");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",

      metadata: {
        userId: req.user.id
      },

      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    res.status(200).json({
      success: true,
      url: session.url
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const webhookHandler = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const userId = session.metadata.userId;

      const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

      if (!cart) return;

      const items = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const order = new Order({
        user: userId,
        items,
        totalPrice: cart.totalPrice,
        paymentStatus: "paid",
        stripeSessionId: session.id
      });

      await order.save();

      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();

      console.log(" Order created via webhook");

    } catch (err) {
      console.log("Order creation error:", err.message);
    }
  }

  res.status(200).json({ received: true });
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product");

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["processing", "shipped", "delivered"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createCheckoutSession,
  webhookHandler,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
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
        currency: "gbp",
        product_data: {
          name: item.product.title,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "afterpay_clearpay"],
      mode: "payment",
      line_items: lineItems,

      customer_email: req.user.email,

      shipping_address_collection: {
        allowed_countries: ["GB"],
      },

      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        userId: req.user.id
      },

      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({
      success: true,
      url: session.url
    });

  } catch (error) {
    console.error("Checkout Error:", error.message);
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

    console.log("Webhook received:", event.type);

  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      console.log("Session ID:", session.id);

      const existingOrder = await Order.findOne({
        stripeSessionId: session.id
      });

      if (existingOrder) {
        console.log("Order already exists");
        return res.status(200).json({ received: true });
      }


      const userId = session.metadata?.userId;

      if (!userId) {
        console.log("User ID missing");
        return res.status(200).json({ received: true });
      }

      const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

      if (!cart || cart.items.length === 0) {
        console.log("Cart empty");
        return res.status(200).json({ received: true });
      }

      const items = cart.items.map(item => ({
        product: item.product?._id,
        quantity: item.quantity,
        price: item.product?.price
      }));

      let paymentMethod = "card";

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );

        const method = paymentIntent.payment_method_types?.[0];

        if (method === "afterpay_clearpay") {
          paymentMethod = "afterpay_clearpay";
        } else if (method === "card") {
          paymentMethod = "card";
        }

        console.log("Payment method:", paymentMethod);

      } catch (err) {
        console.log("PaymentIntent fetch failed, fallback to card");
      }

      const order = new Order({
        user: userId,
        items,

        totalPrice: (session.amount_total || 0) / 100,

        paymentStatus: "paid",
        paymentMethod,

        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent,

        customerDetails: {
          name: session.customer_details?.name || "",
          email: session.customer_details?.email || "",
          phone: session.customer_details?.phone || "",
          address: session.customer_details?.address || {}
        }
      });

      await order.save();

      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();

      console.log("Order created successfully");

    } catch (err) {
      console.error("Order creation error:", err.message);
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
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

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


const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }

    const order = await Order.findById(id).select("orderStatus createdAt totalPrice items");
    if (!order) {
      return res.status(404).json({ success: false, message: "No order found with this reference" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  webhookHandler,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  trackOrder
};
const Order = require("../../Schemas/Order");
const Cart = require("../../Schemas/Cart");
const Product = require("../../Schemas/Product");
const User = require("../../Schemas/User");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const lineItems = cart.items.map((item) => {
      const product = item.product;

      const variant = product?.variants?.find(
        (v) => v.name === item.variant
      );

      const material = variant?.materials?.find(
        (m) => m.name === item.material
      );

      const color = material?.colors?.find(
        (c) => c.name === item.color
      );

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.title,
            images: color?.images?.length
              ? color.images
              : product.images || [],
          },
          unit_amount: Math.round((color?.price || 0) * 100),
        },
        quantity: item.quantity,
      };
    });

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

      // 🔥 ONLY KEEP USER ID
      metadata: {
        userId: req.user._id.toString(),
      },

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    console.error("Checkout Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
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
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      // =========================
      // AVOID DUPLICATE ORDERS
      // =========================
      const existingOrder = await Order.findOne({
        stripeSessionId: session.id,
      });

      if (existingOrder) {
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

      // =========================
      // BUILD ITEMS (SCHEMA MATCH)
      // =========================
      const items = cart.items.map((item) => {
        const product = item.product;

        const variant = product?.variants?.find(
          (v) => v.name === item.variant
        );

        const material = variant?.materials?.find(
          (m) => m.name === item.material
        );

        const color = material?.colors?.find(
          (c) => c.name === item.color
        );

        return {
          product: product._id,
          title: product.title,
          image: color?.images?.[0] || product.images?.[0] || "",

          variant: { name: item.variant },
          material: { name: item.material },
          color: { name: item.color },

          sku: color?.sku || "",

          quantity: item.quantity,
          price: color?.price || 0,
        };
      });

      // =========================
      // FULL SHIPPING (SCHEMA MATCH)
      // =========================
      const addressObj = session.customer_details?.address;

      const shippingAddress = {
        fullName: session.customer_details?.name || "",
        phone: session.customer_details?.phone || "",

        address: addressObj?.line1 || "",
        city: addressObj?.city || "",
        postalCode: addressObj?.postal_code || "",
        country: addressObj?.country || "",
      };

      // =========================
      // REAL PAYMENT METHOD
      // =========================
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );

      const methodType =
        paymentIntent.payment_method_types?.[0] || "card";

      let paymentMethod = "card";

      if (methodType === "afterpay_clearpay") {
        paymentMethod = "afterpay_clearpay";
      }

      // =========================
      // CREATE ORDER
      // =========================
      const order = new Order({
        user: userId,
        items,

        totalPrice: (session.amount_total || 0) / 100,

        shippingAddress,

        paymentMethod,
        paymentStatus: "paid",

        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
      });

      await order.save();

      // =========================
      // CLEAR CART
      // =========================
      cart.items = [];
      await cart.save();

      console.log("Order created with FULL correct data");

    } catch (err) {
      console.error("Order creation error:", err.message);
    }
  }

  return res.status(200).json({ received: true });
};
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    const cleanedOrders = orders.map((order) => {
      const orderObj = order.toObject();

      orderObj.items = orderObj.items.map((item) => ({
        ...item,
        product: item.product || null,
      }));

      return orderObj;
    });

    return res.status(200).json({
      success: true,
      orders: cleanedOrders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const cleanedOrders = orders.map((order) => {
      const orderObj = order.toObject();

      orderObj.items = orderObj.items.map((item) => ({
        ...item,
        product: item.product || null, // safe fallback if deleted
      }));

      return orderObj;
    });

    return res.status(200).json({
      success: true,
      orders: cleanedOrders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // =========================
    // VALID STATUSES
    // =========================
    const validStatus = [
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!orderStatus || !validStatus.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // =========================
    // FIND ORDER
    // =========================
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // =========================
    // AVOID DUPLICATE UPDATE
    // =========================
    if (order.orderStatus === orderStatus) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${orderStatus}`,
      });
    }

    // =========================
    // UPDATE
    // =========================
    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: {
        _id: order._id,
        orderStatus: order.orderStatus,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim().replace(/^#/, '');
    let order;


    if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(cleanId)
        .select("orderStatus createdAt totalPrice items");
    } else {
      // Try searching for the ID as a substring (e.g., last 8 chars)
      // MongoDB ObjectID string is lowercase, so we compare with lowercase input
      order = await Order.findOne({
        $expr: {
          $eq: [
            { $substrCP: [{ $toString: "$_id" }, 16, 8] },
            cleanId.toLowerCase()
          ]
        }
      })
      .select("orderStatus createdAt totalPrice items");

      // Fallback: search by exact string if any other field matches (like stripeSessionId)
      if (!order) {
        order = await Order.findOne({ stripeSessionId: cleanId })
          .select("orderStatus createdAt totalPrice items");
      }
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "No order found with this reference" });
    }

    // Manual Repair for items
    const orderObj = order.toObject();
    for (let item of orderObj.items) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          item.product = product;
        }
      }
    }

    res.status(200).json({ success: true, order: orderObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim();

    let order = null;

    // =========================
    // 1. FULL MONGO ID CHECK
    // =========================
    if (/^[0-9a-fA-F]{24}$/.test(cleanId)) {
      order = await Order.findById(cleanId)
        .populate("user", "name email")
        .populate("items.product");
    }

    // =========================
    // 2. SHORT ID FALLBACK (SAFE VERSION)
    // =========================
    if (!order) {
      const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product");

      order = orders.find((o) =>
        o._id.toString().slice(-8).toLowerCase() === cleanId.toLowerCase()
      );
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // =========================
    // CLEAN RESPONSE
    // =========================
    const orderObj = order.toObject();

    orderObj.items = orderObj.items.map((item) => ({
      ...item,
      product: item.product || null,
    }));

    return res.status(200).json({
      success: true,
      order: orderObj,
    });

  } catch (error) {
    console.error("getOrderById Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCheckoutSession,
  webhookHandler,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  trackOrder,
  getOrderById
};
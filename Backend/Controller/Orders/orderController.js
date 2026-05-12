const Order = require("../../Schemas/Order");
const Cart = require("../../Schemas/Cart");
const Product = require("../../Schemas/Product");
const User = require("../../Schemas/User");
const Stripe = require("stripe");
const { sendOrderConfirmationEmail } = require("../../Utils/emailService");

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

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `${product.title} - ${item.variant} (${item.color})`,
            images: variant?.images?.length
              ? variant.images
              : product.images || [],
          },
          unit_amount: Math.round((variant?.price || 0) * 100),
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
      // CHECK PRE-CREATED PENDING ORDERS
      // =========================
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          if (order.paymentStatus === "pending") {
            order.paymentStatus = "paid";
            order.orderStatus = "confirmed";
            order.stripePaymentIntentId = session.payment_intent;
            
            if (session.payment_intent) {
              try {
                const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
                  expand: ["payment_method"]
                });
                if (paymentIntent && paymentIntent.payment_method && paymentIntent.payment_method.type === "afterpay_clearpay") {
                  order.paymentMethod = "afterpay_clearpay";
                } else {
                  order.paymentMethod = "card";
                }
              } catch (err) {
                order.paymentMethod = "card";
              }
            }
            await order.save();
            
            if (order.user) {
              await Cart.findOneAndDelete({ user: order.user });
            }
            console.log("Order Confirmed");

            // Dispatch premium order confirmation email
            const customerEmail = session.customer_details?.email || session.metadata?.customerEmail;
            let finalEmail = customerEmail;
            if (!finalEmail && order.user) {
              const userDoc = await User.findById(order.user);
              if (userDoc) finalEmail = userDoc.email;
            }
            if (finalEmail) {
              await sendOrderConfirmationEmail(finalEmail, order);
            }
          }
          return res.status(200).json({ received: true });
        }
      }

      // Fallback: search by stripeSessionId if metadata is missing
      const existingOrder = await Order.findOne({
        stripeSessionId: session.id,
      });

      if (existingOrder) {
        if (existingOrder.paymentStatus === "pending") {
          existingOrder.paymentStatus = "paid";
          existingOrder.orderStatus = "confirmed";
          existingOrder.stripePaymentIntentId = session.payment_intent;
          
          if (session.payment_intent) {
            try {
              const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
                expand: ["payment_method"]
              });
              if (paymentIntent && paymentIntent.payment_method && paymentIntent.payment_method.type === "afterpay_clearpay") {
                existingOrder.paymentMethod = "afterpay_clearpay";
              } else {
                existingOrder.paymentMethod = "card";
              }
            } catch (err) {
              existingOrder.paymentMethod = "card";
            }
          }
          await existingOrder.save();
          
          if (existingOrder.user) {
            await Cart.findOneAndDelete({ user: existingOrder.user });
          }
          console.log("Order Confirmed");

          // Dispatch premium order confirmation email
          const customerEmail = session.customer_details?.email || session.metadata?.customerEmail;
          let finalEmail = customerEmail;
          if (!finalEmail && existingOrder.user) {
            const userDoc = await User.findById(existingOrder.user);
            if (userDoc) finalEmail = userDoc.email;
          }
          if (finalEmail) {
            await sendOrderConfirmationEmail(finalEmail, existingOrder);
          }
        }
        return res.status(200).json({ received: true });
      }

      const userId = session.metadata?.userId;

      if (!userId) {
        return res.status(200).json({ received: true });
      }

      const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

      if (!cart || cart.items.length === 0) {
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

        return {
          product: product._id,
          title: product.title,
          image: variant?.images?.[0] || product.images?.[0] || "",

          variant: { name: item.variant },
          material: { name: item.material },
          color: { name: item.color },

          sku: variant?.sku || "",

          quantity: item.quantity,
          price: variant?.price || 0,
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

      console.log("Order Confirmed");

    } catch (err) {
      console.log("Order Confirmation Failed");
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

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createOrderAndSession = async (req, res) => {
  try {
    const { items, shippingAddress, email, createAccount, deliveryDate } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in checkout" });
    }

    // Try to retrieve user from auth token (optional authentication)
    let orderUser = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        orderUser = await User.findById(decoded.id).select("-password");
      } catch (err) {
        console.log("Optional auth token failed:", err.message);
      }
    }

    let resolvedUser = orderUser;

    // If guest and chose to create account, register them automatically
    if (!resolvedUser && createAccount && email) {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        const tempPassword = `ES-${Math.random().toString(36).substring(2, 10).toUpperCase()}!`;
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const name = shippingAddress?.fullName || email.split("@")[0];
        
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          role: "user"
        });
        await newUser.save();
        resolvedUser = newUser;
        
        // Resolved user
      } else {
        resolvedUser = existingUser;
      }
    }

    // Format order items conforming to schema
    const orderItems = items.map((item) => ({
      product: item.product,
      title: item.title,
      image: item.image,
      variant: { name: item.variant || "Standard" },
      material: { name: item.material || "" },
      color: { name: item.color || "Default" },
      sku: item.sku || "",
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
    }));

    // Calculate total price: Strictly sum of items (no VAT or delivery)
    const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Create a new pending order
    const order = new Order({
      user: resolvedUser ? resolvedUser._id : undefined,
      items: orderItems,
      totalPrice,
      shippingAddress: {
        fullName: shippingAddress?.fullName || "Guest Customer",
        phone: shippingAddress?.phone || "",
        address: shippingAddress?.address || "",
        city: shippingAddress?.city || "",
        postalCode: shippingAddress?.postalCode || "",
        country: shippingAddress?.country || "GB",
      },
      paymentMethod: "card",
      paymentStatus: "pending",
      orderStatus: "processing",
      notes: deliveryDate ? `Delivery Date: ${deliveryDate}` : "",
    });

    await order.save();

    // Map to Stripe line items
    const lineItems = orderItems.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: `${item.title} - ${item.variant?.name || "Standard"} (${item.color?.name || "Default"})`,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // convert to cents
      },
      quantity: item.quantity,
    }));

    // Generate success and cancel URLs
    const success_url = `http://localhost:5173/success?orderId=${order._id}`;
    const cancel_url = `http://localhost:5173/cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "afterpay_clearpay"],
      mode: "payment",
      line_items: lineItems,
      customer_email: email || resolvedUser?.email,
      metadata: {
        orderId: order._id.toString(),
        customerEmail: email || resolvedUser?.email,
      },
      success_url,
      cancel_url,
    });

    // Save Stripe session ID to order
    order.stripeSessionId = session.id;
    await order.save();

    return res.status(200).json({
      success: true,
      url: session.url,
      orderId: order._id,
    });

  } catch (error) {
    console.log("Order Confirmation Failed");
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, sessionId } = req.body;
    if (!orderId) {
      console.log("Order Confirmation Failed");
      return res.status(400).json({ success: false, message: "Missing order ID" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.log("Order Confirmation Failed");
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // If already marked as paid, return success directly
    if (order.paymentStatus === "paid") {
      console.log("Order Confirmed");
      return res.status(200).json({ success: true, order });
    }

    // Retrieve Stripe Session to verify payment
    const targetSessionId = sessionId || order.stripeSessionId;
    if (targetSessionId) {
      const session = await stripe.checkout.sessions.retrieve(targetSessionId);
      if (session && session.payment_status === "paid") {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        if (session.payment_intent) {
          order.stripePaymentIntentId = session.payment_intent;
          
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
              expand: ["payment_method"]
            });
            if (paymentIntent && paymentIntent.payment_method && paymentIntent.payment_method.type === "afterpay_clearpay") {
              order.paymentMethod = "afterpay_clearpay";
            } else {
              order.paymentMethod = "card";
            }
          } catch (err) {
            order.paymentMethod = "card";
          }
        }
        await order.save();

        // Clear user's cart if they were logged in
        if (order.user) {
          await Cart.findOneAndUpdate({ user: order.user }, { items: [], totalPrice: 0 });
        }

        // Dispatch premium order confirmation email
        const customerEmail = session.customer_details?.email || session.metadata?.customerEmail;
        let finalEmail = customerEmail;
        if (!finalEmail && order.user) {
          const userDoc = await User.findById(order.user);
          if (userDoc) finalEmail = userDoc.email;
        }
        if (finalEmail) {
          await sendOrderConfirmationEmail(finalEmail, order);
        }

        console.log("Order Confirmed");
        return res.status(200).json({ success: true, message: "Payment verified successfully", order });
      }
    }

    console.log("Order Confirmation Failed");
    return res.status(400).json({ success: false, message: "Payment has not been completed or verified yet" });

  } catch (error) {
    console.log("Order Confirmation Failed");
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
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
  getOrderById,
  createOrderAndSession,
  verifyPayment
};
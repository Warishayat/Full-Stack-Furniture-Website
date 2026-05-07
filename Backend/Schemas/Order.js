const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    image: String,

    variant: {
      name: String, // 2 Seater
    },

    material: {
      name: String, // Leather
    },

    color: {
      name: String, // Black
    },

    sku: String,

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

 
    items: [OrderItemSchema],

 
    totalPrice: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: String,
      address: { type: String, required: true },
      city: String,
      postalCode: String,
      country: String,
    },

    paymentMethod: {
      type: String,
      enum: ["afterpay_clearpay", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    stripeSessionId: String,
    stripePaymentIntentId: String,

   
    notes: String,
  },
  { timestamps: true }
);

module.exports = model("Order", OrderSchema);
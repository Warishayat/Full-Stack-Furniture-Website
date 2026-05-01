const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product"
        },
        title: String,
        image: String,
        quantity: Number,
        price: Number
      }
    ],

    totalPrice: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing"
    },

    stripeSessionId: {
      type: String
    }

  },
  { timestamps: true }
);

const Order = model("Order", OrderSchema);
module.exports = Order;
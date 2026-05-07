const { Schema, model } = require("mongoose");

const CartSchema = new Schema(
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
          ref: "Product",
          required: true
        },

        variant: {
          type: String, // e.g. "2 Seater"
          required: true
        },

        material: {
          type: String, // e.g. "Leather"
          required: true
        },

        color: {
          type: String, // e.g. "Black"
          required: true
        },

        price: {
          type: Number,
          required: true
        },

        image: {
          type: String
        },

        quantity: {
          type: Number,
          min: 1,
          default: 1
        }
      }
    ],

    totalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = model("Cart", CartSchema);
const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({

  title: String,
  description: String,
  price: Number,
  stock: Number,
  oldprice: Number,
  images: [String],
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },

  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },

  colors: [String],
  specifications: {
    general: {
      material: String,
      finish: String,
      warranty: String
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: "cm"
      }
    },

    packaging: {
      boxWeight: String,
      packagingDetails: String
    },

    care: {
      instructions: String
    },

    assembly: {
      required: Boolean,
      details: String
    },

    delivery: {
      time: String,
      charges: String
    }
  }

}, { timestamps: true });
const Product = model("Product", ProductSchema);
module.exports = Product;
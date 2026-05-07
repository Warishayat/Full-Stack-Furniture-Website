const { Schema, model } = require("mongoose");

const ColorSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  oldPrice: {
    type: Number
  },

  stock: {
    type: Number,
    default: 0
  },

  images: [String], 

  sku: String 
});

const MaterialSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  colors: [ColorSchema]
});

const VariantSchema = new Schema({
  name: {
    type: String,
    required: true // 1 Seater, 2 Seater
  },

  materials: [MaterialSchema]
});

// 🔥 MAIN PRODUCT
const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true
    },

    description: {
      type: String
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    images: [String],

    variants: [VariantSchema],

    averageRating: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    },

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
        },

        sizeChart: String // 🔥 image
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
      },
      
      returns: {
        policy: String,
        link: String
      }
    }
  },
  {
    timestamps: true
  }
);

const Product = model("Product", ProductSchema);

module.exports = Product;
const mongoose = require("mongoose");
const {Schema,model} = require("mongoose");

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"]
    },
    image:{
      type:String
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

const Category = model("Category", CategorySchema);
module.exports = Category;
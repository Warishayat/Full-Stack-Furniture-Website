const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"]
    },
    image: {
      type: String,
      default: ""
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
  }
);

CategorySchema.pre("save", async function () {
  if (this.parent && this.parent.equals(this._id)) {
    throw new Error("Category cannot be its own parent");
  }
});

module.exports = model("Category", CategorySchema);
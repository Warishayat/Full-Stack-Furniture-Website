const Product = require("../../Schemas/Product");
const Category = require("../../Schemas/Category");
const mongoose = require("mongoose");

// Helper to escape special regex characters safely
const escapeRegex = (string) => {
  if (!string) return "";
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const getFilteredProducts = async (req, res) => {
  try {
    const { variant, material, color, category, minPrice, maxPrice, search } = req.query;

    let query = {};

    if (category) {
      let targetCategoryId = null;
      if (mongoose.Types.ObjectId.isValid(category)) {
        targetCategoryId = new mongoose.Types.ObjectId(category);
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          targetCategoryId = foundCategory._id;
        }
      }

      if (targetCategoryId) {
        // Resolve subcategories so parent category returns parent + child products!
        const subCategories = await Category.find({ parent: targetCategoryId });
        const categoryIds = [targetCategoryId, ...subCategories.map(c => c._id)];
        query.category = { $in: categoryIds };
      } else {
        // In case category is not found, default query to category
        query.category = category;
      }
    }

    if (search) {
      query.title = { $regex: escapeRegex(search), $options: "i" };
    }

    if (variant) {
      // Support matching size/variant names with safe regex escaping
      query["variants.name"] = { $regex: new RegExp(`^${escapeRegex(variant)}$`, "i") };
    }

    if (material) {
      query["variants.materials.name"] = { $regex: new RegExp(`^${escapeRegex(material)}$`, "i") };
    }

    if (color) {
      query["variants.materials.colors.name"] = { $regex: new RegExp(`^${escapeRegex(color)}$`, "i") };
    }

    if (minPrice || maxPrice) {
      query["variants.price"] = {};
      if (minPrice) query["variants.price"].$gte = Number(minPrice);
      if (maxPrice) query["variants.price"].$lte = Number(maxPrice);
    }

    console.log("FILTER QUERY:", JSON.stringify(query, null, 2));
    const products = await Product.find(query).populate("category").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products: products
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFilterOptions = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      let targetCategoryId = null;
      if (mongoose.Types.ObjectId.isValid(category)) {
        targetCategoryId = new mongoose.Types.ObjectId(category);
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          targetCategoryId = foundCategory._id;
        }
      }

      if (targetCategoryId) {
        const subCategories = await Category.find({ parent: targetCategoryId });
        const categoryIds = [targetCategoryId, ...subCategories.map(c => c._id)];
        query.category = { $in: categoryIds };
      } else {
        query.category = category;
      }
    }

    const products = await Product.find(query);

    const variants = new Set();
    const materials = new Set();
    const colors = new Set();

    products.forEach(product => {
      product.variants.forEach(v => {
        if (v.name) variants.add(v.name);

        v.materials.forEach(m => {
          if (m.name) materials.add(m.name);

          m.colors.forEach(c => {
            if (c.name) colors.add(c.name);
          });
        });
      });
    });

    res.json({
      success: true,
      variants: [...variants].sort(),
      materials: [...materials].sort(),
      colors: [...colors].sort()
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFilteredProducts, getFilterOptions };
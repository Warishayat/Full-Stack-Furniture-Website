const Category = require("../../Schemas/Category");
const slugify = require("slugify");
const mongoose = require("mongoose");

const createCategory = async (req, res) => {
  try {
    let name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const parent = req.body?.parent || null;

    const baseSlug = slugify(name, { lower: true });
    let slug = baseSlug;
    let count = 1;

    while (await Category.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    let image = "";
    if (req.file) {
      image = req.file.path || req.file.secure_url;
    }

    const category = new Category({
      name,
      slug,
      image,
      parent
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    console.error("CATEGORY CREATE ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      message: categories.length
        ? "Categories fetched successfully"
        : "No categories found",
      categories,
    });

  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const childExists = await Category.findOne({ parent: id });
    if (childExists) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with subcategories",
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });

  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id)
      .select("name slug image parent createdAt")
      .populate("parent", "name slug");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const children = await Category.find({ parent: id }).select("name slug");

    res.status(200).json({
      success: true,
      category,
      children,
    });

  } catch (error) {
    console.error("GET SINGLE CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  deleteCategory,
  getSingleCategory,
}
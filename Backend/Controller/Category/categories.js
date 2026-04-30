const Category = require("../../Schemas/Category");
const slugify = require("slugify");

const createCategory = async (req, res) => {
  try {
    const name = req.body?.name;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const image = req.file?.path || req.file?.secure_url || "";

    const category = new Category({
      name,
      slug: slugify(name, { lower: true }),
      image,
    });

    await category.save();

    res.status(201).json({
      success: true,
      category,
    });

  } catch (error) {
    console.error("CATEGORY CREATE ERROR:", error);
    
    // Check for duplicate key error (11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This category name already exists. Please choose another name."
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred while creating the category.",
    });
  }
};

const getallCategories = async(req,res) =>{
  try {
    const categories = await Category.find();
    if(!categories){
      return res.status(404).json({
        success: false,
        message: "Categories not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteCategory = async(req,res) =>{
  try {
    const {id} = req.params;
    const category = await Category.findByIdAndDelete(id);
    if(!category){
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const getSingleCategory = async(req,res) => {
  try {
    const {id} = req.params;
    const category = await Category.findById(id);
    if(!category){
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createCategory,
  getallCategories,
  deleteCategory,
  getSingleCategory,
};
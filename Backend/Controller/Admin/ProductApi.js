const Product = require("../../Schemas/Product");
const mongoose = require("mongoose");
const slugify = require("slugify");

const createProduct = async (req, res) => {
  try {
    console.log("CREATE PRODUCT REQUEST BODY:", JSON.stringify(req.body, null, 2));
    console.log("CREATE PRODUCT FILES:", req.files);
    
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty. Ensure multipart/form-data is sent correctly with boundary."
      });
    }

    const { title, description, category, variants, specifications } = req.body;

    if (!title || !description || !category || !variants) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (title, description, category, variants)"
      });
    }

    const images = req.files?.images || [];
    const sizeChartFile = req.files?.sizeChart?.[0];
    const sizeChart = sizeChartFile ? sizeChartFile.path : "";

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required"
      });
    }

    const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();
    
    // Parse variants and specifications safely
    let parsedVariants;
    try {
      parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid JSON format in variants" });
    }

    let parsedSpecifications;
    try {
      parsedSpecifications = typeof specifications === "string" ? JSON.parse(specifications) : (specifications || {});
      if (parsedSpecifications === null) parsedSpecifications = {};
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid JSON format in specifications" });
    }

    if (!Array.isArray(parsedVariants)) {
      return res.status(400).json({
        success: false,
        message: "Variants must be an array"
      });
    }

    const allImages = images.map(file => file.path);

    // Map image indexes to Cloudinary URLs for each variant/color
    parsedVariants.forEach((variant) => {
      if (!variant) return;
      if (!variant.materials || !Array.isArray(variant.materials)) {
        throw new Error(`Variant "${variant.name || 'Unknown'}" must have materials array`);
      }

      variant.materials.forEach((material) => {
        if (!material) return;
        if (!material.colors || !Array.isArray(material.colors)) {
          throw new Error(`Material "${material.name || 'Unknown'}" must have colors array`);
        }

        material.colors.forEach((color) => {
          if (!color) return;
          if (color.price === undefined || color.price === null || color.price === "") {
            throw new Error(`Color "${color.name || 'Unknown'}" in variant "${variant.name || 'Unknown'}" must have a price`);
          }

          // Convert price and stock to numbers
          color.price = Number(color.price);
          color.oldPrice = color.oldPrice ? Number(color.oldPrice) : undefined;
          color.stock = color.stock ? Number(color.stock) : 0;

          if (color.oldPrice && color.oldPrice < color.price) {
            throw new Error(`Old price for color "${color.name}" must be greater than current price`);
          }

          // Map the image indexes to actual URLs
          const mappedImages = (color.imageIndexes || [])
            .map(i => allImages[i])
            .filter(Boolean);

          // If no images were linked but images were uploaded, default to the first image
          if (mappedImages.length === 0 && allImages.length > 0) {
            color.images = [allImages[0]];
          } else {
            color.images = mappedImages;
          }
          
          delete color.imageIndexes;
        });
      });
    });

    const product = await Product.create({
      title,
      slug,
      description,
      category,
      images: allImages,
      variants: parsedVariants,
      specifications: {
        ...parsedSpecifications,
        dimensions: {
          ...parsedSpecifications.dimensions,
          sizeChart: sizeChart || parsedSpecifications.dimensions?.sizeChart
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in variants or specifications"
      });
    }

    res.status(error.name === 'ValidationError' ? 400 : 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: {
        _id: product._id,
        title: product.title
      }
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, variants, specifications } = req.body;

    const files = req.files;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (title !== undefined) {
      product.title = title;
      product.slug = slugify(title, { lower: true }) + "-" + Date.now(); 
    }

    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;

    let allImages = product.images;

    if (files?.images?.length > 0) {
      allImages = files.images.map(f => f.path);
      product.images = allImages;
    }


    if (variants !== undefined) {
      let parsedVariants =
        typeof variants === "string" ? JSON.parse(variants) : variants;

      if (!Array.isArray(parsedVariants)) {
        return res.status(400).json({
          success: false,
          message: "Variants must be an array"
        });
      }

      parsedVariants.forEach((variant) => {
        variant.materials?.forEach((material) => {
          material.colors?.forEach((color) => {

            if (!color.price) {
              throw new Error("Each color must have price");
            }

            if (color.oldPrice && color.oldPrice < color.price) {
              throw new Error("Old price must be greater than price");
            }

            color.images = (color.imageIndexes || [])
              .map(i => allImages[i])
              .filter(Boolean);

            delete color.imageIndexes;
          });
        });
      });

      product.variants = parsedVariants;
    }

    if (specifications !== undefined) {
      const parsedSpecs =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;

      product.specifications = parsedSpecs;
    }

    const sizeChartImage = files?.sizeChart?.[0]?.path;

    if (sizeChartImage) {
      if (!product.specifications) product.specifications = {};
      if (!product.specifications.dimensions)
        product.specifications.dimensions = {};

      product.specifications.dimensions.sizeChart = sizeChartImage;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in variants/specifications"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id)
      .populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const firstVariant = product.variants?.[0] || null;
    const firstMaterial = firstVariant?.materials?.[0] || null;
    const firstColor = firstMaterial?.colors?.[0] || null;

    res.status(200).json({
      success: true,
      product,

      defaultSelection: {
        variant: firstVariant?.name || null,
        material: firstMaterial?.name || null,
        color: firstColor?.name || null,
        images: firstColor?.images || product.images || []
      }
    });

  } catch (error) {
    console.error("GET SINGLE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const SearchProduct = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const searchRegex = new RegExp(query, "i");

    const skip = (page - 1) * limit;

    const products = await Product.find({
      $or: [
        { title: searchRegex }
      ]
    })
      .populate("category", "name slug")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({
      $or: [
        { title: searchRegex },
      ]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products
    });

  } catch (error) {
    console.error("SEARCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getSingleProduct,
  SearchProduct
};
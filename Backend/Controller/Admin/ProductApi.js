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

    const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();

    const allImages = (req.files?.images || []).map(file => file.path);
    const allSwatches = (req.files?.swatches || []).map(file => file.path);
    const sizeChartFile = req.files?.sizeChart?.[0];
    const sizeChart = sizeChartFile ? sizeChartFile.path : "";

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

    // Map image indexes and values for each variant
    parsedVariants.forEach((variant, vIdx) => {
      if (!variant) return;

      // Set unique variant slug
      if (variant.name) {
        variant.slug = slugify(variant.name, { lower: true, strict: true }) + "-" + Date.now() + "-" + vIdx;
      }

      // Convert pricing/stock to numbers
      if (variant.price === undefined || variant.price === null || variant.price === "") {
        throw new Error(`Variant "${variant.name || 'Unknown'}" must have a price`);
      }
      variant.price = Number(variant.price);
      variant.oldPrice = variant.oldPrice ? Number(variant.oldPrice) : undefined;
      variant.stock = variant.stock !== undefined && variant.stock !== "" ? Number(variant.stock) : 0;

      if (variant.oldPrice && variant.oldPrice < variant.price) {
        throw new Error(`Old price for variant "${variant.name}" must be greater than current price`);
      }

      // Map the variant image indexes to actual URLs
      const mappedImages = (variant.imageIndexes || [])
        .map(i => allImages[i])
        .filter(Boolean);

      // Default to first global image if no specific images are mapped
      if (mappedImages.length === 0 && allImages.length > 0) {
        variant.images = [allImages[0]];
      } else {
        variant.images = mappedImages;
      }

      delete variant.imageIndexes;

      // Handle variant dimensions parsing
      if (variant.dimensions) {
        variant.dimensions.length = variant.dimensions.length ? Number(variant.dimensions.length) : undefined;
        variant.dimensions.width = variant.dimensions.width ? Number(variant.dimensions.width) : undefined;
        variant.dimensions.height = variant.dimensions.height ? Number(variant.dimensions.height) : undefined;
      }

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
          
          // Map color swatch index to actual path
          if (color.swatchImageIndex !== undefined && color.swatchImageIndex !== null && color.swatchImageIndex !== "") {
            color.swatchImage = allSwatches[Number(color.swatchImageIndex)] || "";
          } else {
            color.swatchImage = color.swatchImage || "";
          }

          delete color.swatchImageIndex;
          delete color.price;
          delete color.oldPrice;
          delete color.stock;
          delete color.sku;
          delete color.images;
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

    const allImages = (files?.images || []).map(f => f.path);
    const allSwatches = (files?.swatches || []).map(f => f.path);

    if (variants !== undefined) {
      let parsedVariants =
        typeof variants === "string" ? JSON.parse(variants) : variants;

      if (!Array.isArray(parsedVariants)) {
        return res.status(400).json({
          success: false,
          message: "Variants must be an array"
        });
      }

      parsedVariants.forEach((variant, vIdx) => {
        if (!variant) return;

        // Keep or regenerate slug
        if (variant.name && !variant.slug) {
          variant.slug = slugify(variant.name, { lower: true, strict: true }) + "-" + Date.now() + "-" + vIdx;
        }

        // Convert variant pricing / stock / dimensions to numbers
        if (variant.price === undefined || variant.price === null || variant.price === "") {
          throw new Error(`Variant "${variant.name || 'Unknown'}" must have a price`);
        }
        variant.price = Number(variant.price);
        variant.oldPrice = variant.oldPrice ? Number(variant.oldPrice) : undefined;
        variant.stock = variant.stock !== undefined && variant.stock !== "" ? Number(variant.stock) : 0;

        if (variant.oldPrice && variant.oldPrice < variant.price) {
          throw new Error("Old price must be greater than price");
        }

        // Handle variant images: combine existing strings and newly uploaded file paths
        const existing = variant.existingImages || variant.images || [];
        const uploaded = (variant.imageIndexes || [])
          .map(i => allImages[i])
          .filter(Boolean);
        variant.images = [...existing.filter(img => typeof img === "string"), ...uploaded];

        delete variant.imageIndexes;
        delete variant.existingImages;

        // Handle variant dimensions parsing
        if (variant.dimensions) {
          variant.dimensions.length = variant.dimensions.length ? Number(variant.dimensions.length) : undefined;
          variant.dimensions.width = variant.dimensions.width ? Number(variant.dimensions.width) : undefined;
          variant.dimensions.height = variant.dimensions.height ? Number(variant.dimensions.height) : undefined;
        }

        variant.materials?.forEach((material) => {
          material.colors?.forEach((color) => {
            // Support swatch image updates
            if (color.swatchImageIndex !== undefined && color.swatchImageIndex !== null && color.swatchImageIndex !== "") {
              color.swatchImage = allSwatches[Number(color.swatchImageIndex)] || "";
            } else {
              color.swatchImage = color.swatchImage || "";
            }

            delete color.swatchImageIndex;
            delete color.price;
            delete color.oldPrice;
            delete color.stock;
            delete color.sku;
            delete color.images;
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
        images: firstVariant?.images || product.images || [],
        price: firstVariant?.price || 0,
        stock: firstVariant?.stock || 0
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
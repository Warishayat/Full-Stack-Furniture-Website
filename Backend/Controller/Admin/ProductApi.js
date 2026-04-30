const Product = require("../../Schemas/Product");

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      stock,
      colors,
      oldprice,
      specifications
    } = req.body;
    const files = req.files;

    if (!title || !description || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required"
      });
    }

    if (oldprice && Number(oldprice) < Number(price)) {
      return res.status(400).json({
        success: false,
        message: "Old price must be greater than current price"
      });
    }

    const imageURL = files.map((file) => file.path);

    let parsedColors = [];
    let parsedSpecs = {};

    if (colors) {
      parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;
    }

    if (specifications) {
      parsedSpecs =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      oldprice: oldprice ? Number(oldprice) : undefined,
      category,
      stock: stock ? Number(stock) : 0,
      images: imageURL,
      colors: parsedColors,
      specifications: parsedSpecs
});

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in colors/specifications"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};
  
const getAllProducts = async(req,res) => {
  try {
    const products = await Product.find();
    if(products.length === 0){
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });         
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const deleteProduct = async(req,res) => {
  try {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    if(!product){
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });         
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      category,
      stock,
      colors,
      oldprice,
      specifications
    } = req.body;

    const files = req.files;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 🔥 price validation
    if (
      oldprice !== undefined &&
      price !== undefined &&
      Number(oldprice) < Number(price)
    ) {
      return res.status(400).json({
        success: false,
        message: "Old price must be greater than current price"
      });
    }

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (oldprice !== undefined) product.oldprice = oldprice; // ✅ added
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;

    if (colors !== undefined) {
      product.colors =
        typeof colors === "string" ? JSON.parse(colors) : colors;
    }

    if (specifications !== undefined) {
      product.specifications =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;
    }

    if (files && files.length > 0) {
      product.images = files.map((file) => file.path);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in colors/specifications"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSingleProduct = async(req,res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });         
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const SearchProduct = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query"
      });
    }

    const searchTerms = query.split(' ').filter(word => word.length > 0);
    
    // Create regex that handles optional trailing 's' or plural forms
    const searchRegex = searchTerms.map(term => {
      const baseTerm = term.toLowerCase().endsWith('s') ? term.slice(0, -1) : term;
      const pattern = `(${term}|${baseTerm})`;
      return {
        $or: [
          { title: { $regex: pattern, $options: "i" } },
          { description: { $regex: pattern, $options: "i" } }
        ]
      };
    });

    const products = await Product.find({
      $and: searchRegex
    }).populate('category');

    res.status(200).json({
      success: true,
      products 
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {createProduct,getAllProducts,deleteProduct,updateProduct,getSingleProduct,SearchProduct};
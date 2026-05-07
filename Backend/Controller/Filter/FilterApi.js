const Product = require("../../Schemas/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { variant, material, color, category, minPrice, maxPrice, search } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (variant) {
      query["variants.name"] = variant;
    }
    if (material) {
      query["variants.materials.name"] = material;
    }
    if (color) {
      query["variants.materials.colors.name"] = color;
    }

    if (minPrice || maxPrice) {
      query["variants.materials.colors.price"] = {};
      if (minPrice) query["variants.materials.colors.price"].$gte = Number(minPrice);
      if (maxPrice) query["variants.materials.colors.price"].$lte = Number(maxPrice);
    }

    console.log("FILTER QUERY:", JSON.stringify(query, null, 2));
    const products = await Product.find(query).populate("category");

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
      query.category = category;
    }

    const products = await Product.find(query);

    const variants = new Set();
    const materials = new Set();
    const colors = new Set();

    products.forEach(product => {
      product.variants.forEach(v => {
        variants.add(v.name);

        v.materials.forEach(m => {
          materials.add(m.name);

          m.colors.forEach(c => {
            colors.add(c.name);
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

module.exports = { getFilteredProducts,getFilterOptions };
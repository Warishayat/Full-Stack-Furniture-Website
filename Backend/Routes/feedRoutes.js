const express = require("express");
const { Parser } = require("json2csv");
const Product = require("../Schemas/Product"); 

const router = express.Router();

const generateFeed = async (req, res) => {
  try {
    // Populate category to get product_type
    const products = await Product.find({}).populate("category", "name").lean();
    
    const feedData = [];

    for (const product of products) {
      if (!product.variants || product.variants.length === 0) continue;

      for (const variant of product.variants) {
        // We only want variants that have distinct images
        if (!variant.images || variant.images.length === 0) continue;

        const stock = variant.stock || 0;
        const availability = stock > 0 ? "in stock" : "out of stock";
        
        let priceStr = `${variant.price} GBP`;
        let salePriceStr = "";

        // If oldPrice is greater than price, oldPrice is original price, price is sale price
        if (variant.oldPrice && variant.oldPrice > variant.price) {
          priceStr = `${variant.oldPrice} GBP`;
          salePriceStr = `${variant.price} GBP`;
        }

        // SKU is fallback if not present
        const sku = variant.sku || `${product._id}-${variant._id}`;

        // Get color and material as comma separated strings
        let colors = new Set();
        let materials = new Set();
        if (variant.materials) {
           variant.materials.forEach(m => {
              if (m.name) materials.add(m.name);
              if (m.colors) {
                 m.colors.forEach(c => {
                    if (c.name) colors.add(c.name);
                 });
              }
           });
        }

        const colorStr = Array.from(colors).join(", ");
        const materialStr = Array.from(materials).join(", ");

        let dimensionsStr = "";
        if (variant.dimensions) {
           const { length, width, height, unit } = variant.dimensions;
           const parts = [];
           if (length) parts.push(`L:${length}`);
           if (width) parts.push(`W:${width}`);
           if (height) parts.push(`H:${height}`);
           if (parts.length > 0) dimensionsStr = `${parts.join('x')} ${unit || 'cm'}`;
        }

        feedData.push({
          id: sku,
          title: `${product.title} - ${variant.name}`,
          description: product.description || product.title,
          availability: availability,
          condition: "new",
          price: priceStr,
          sale_price: salePriceStr,
          link: `https://eliteseatingltd.co.uk/product/${product.slug || product._id}?variant=${encodeURIComponent(variant.name)}`,
          image_link: variant.images[0],
          additional_image_link: variant.images.slice(1).join(","),
          brand: "Elite Seating Ltd.",
          product_type: product.category?.name || "Furniture",
          item_group_id: product.slug || product._id.toString(),
          variant_name: variant.name,
          color: colorStr,
          material: materialStr,
          custom_label_0: dimensionsStr
        });
      }
    }

    const fields = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "sale_price",
      "link",
      "image_link",
      "additional_image_link",
      "brand",
      "product_type",
      "item_group_id",
      "variant_name",
      "color",
      "material",
      "custom_label_0"
    ];

    const json2csvParser = new Parser({ fields, withBOM: true });
    const csv = json2csvParser.parse(feedData);

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("catalog.csv");
    return res.status(200).send(csv);

  } catch (error) {
    console.error("Error generating product CSV feed:", error);
    return res.status(500).json({ success: false, message: "Error generating CSV feed" });
  }
};

router.get("/product.csv", generateFeed);
router.get("/catalog.csv", generateFeed);

module.exports = router;

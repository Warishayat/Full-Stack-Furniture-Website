const express = require("express");
const { Parser } = require("json2csv");
const Product = require("../Schemas/Product"); // Adjust path if necessary

const router = express.Router();

router.get("/product.csv", async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    const feedData = products.map((product) => {
      const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
      
      const stock = firstVariant && firstVariant.stock ? firstVariant.stock : 0;
      const availability = stock > 0 ? "in stock" : "out of stock";
      const priceValue = firstVariant && firstVariant.price ? firstVariant.price : 0;
      const formattedPrice = `${priceValue} GBP`;
      const firstImage = product.images && product.images.length > 0 ? product.images[0] : "";

      return {
        id: product._id.toString(),
        title: product.title,
        description: product.description || "",
        availability: availability,
        condition: "new", 
        price: formattedPrice,
        link: `https://eliteseatingltd.co.uk/product/${product._id.toString()}`,
        image_link: firstImage,
        brand: "Elite Seating Ltd."
      };
    });

    const fields = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "brand"
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(feedData);

    res.header("Content-Type", "text/csv");
    res.attachment("product.csv");
    return res.status(200).send(csv);

  } catch (error) {
    console.error("Error generating product CSV feed:", error);
    return res.status(500).json({ success: false, message: "Error generating CSV feed" });
  }
});

module.exports = router;

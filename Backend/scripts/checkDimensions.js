const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../Schemas/Product");

mongoose.connect(process.env.DATABASE_URI).then(async () => {
  const checkProduct = await Product.findOne({ title: { $regex: /Verona Sofas/i } });
  
  checkProduct.variants.forEach(v => {
    console.log(`Variant ${v.name} Size Chart: ${v.dimensions?.sizeChart || 'None'}`);
  });
  
  process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

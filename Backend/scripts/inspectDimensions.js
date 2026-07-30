const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the Backend directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../Schemas/Product");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("Connected to MongoDB");
  
  const sourceProduct = await Product.findOne({ title: { $regex: /Sims Black Trims Sofa/i } });
  if (!sourceProduct) {
    console.log("Source product not found!");
    process.exit(1);
  }
  
  console.log("Found Source Product:", sourceProduct.title);
  // Log variants with sizeChart
  sourceProduct.variants.forEach(v => {
    if (v.dimensions && v.dimensions.sizeChart) {
      console.log(`Variant ${v.name} has size chart: ${v.dimensions.sizeChart}`);
    }
  });
  if (sourceProduct.specifications?.dimensions?.sizeChart) {
      console.log(`Product global size chart: ${sourceProduct.specifications.dimensions.sizeChart}`);
  }
  
  process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

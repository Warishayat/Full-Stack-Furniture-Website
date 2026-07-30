const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../Schemas/Product");

mongoose.connect(process.env.DATABASE_URI).then(async () => {
  console.log("Connected to MongoDB");
  
  const sourceProduct = await Product.findOne({ title: { $regex: /Sims Black Trims Sofa/i } });
  if (!sourceProduct) {
    console.log("Source product not found!");
    process.exit(1);
  }
  
  console.log("Found Source Product:", sourceProduct.title);
  
  // Extract dimension mapping
  const sourceCharts = {};
  if (sourceProduct.specifications?.dimensions?.sizeChart) {
      sourceCharts.global = sourceProduct.specifications.dimensions.sizeChart;
      console.log(`Global Size Chart: ${sourceCharts.global}`);
  }
  
  sourceProduct.variants.forEach(v => {
    if (v.dimensions?.sizeChart) {
      sourceCharts[v.name.toLowerCase().trim()] = v.dimensions.sizeChart;
      console.log(`Variant ${v.name} Size Chart: ${v.dimensions.sizeChart}`);
    }
  });
  
  if (Object.keys(sourceCharts).length === 0) {
      console.log("No size charts found in source product!");
      process.exit(1);
  }

  // Find all other sofas to update
  // We'll exclude terms like 'u shape', 'l shape', 'corner'
  const excludeRegex = /(u shape|l shape|u-shape|l-shape|corner)/i;
  const includeRegex = /sofa/i;

  const allProducts = await Product.find({});
  let updateCount = 0;

  for (let prod of allProducts) {
      if (prod._id.toString() === sourceProduct._id.toString()) continue;
      
      const title = prod.title;
      // If it's a sofa and not L/U/Corner shape
      if (includeRegex.test(title) && !excludeRegex.test(title)) {
          console.log(`Updating Product: ${title}`);
          let modified = false;

          if (sourceCharts.global) {
              if (!prod.specifications) prod.specifications = {};
              if (!prod.specifications.dimensions) prod.specifications.dimensions = {};
              prod.specifications.dimensions.sizeChart = sourceCharts.global;
              modified = true;
          }

          prod.variants.forEach(v => {
              const vName = v.name.toLowerCase().trim();
              if (sourceCharts[vName]) {
                  if (!v.dimensions) v.dimensions = {};
                  v.dimensions.sizeChart = sourceCharts[vName];
                  modified = true;
              } else if (vName === "3+2 seater" && sourceCharts["3+2 seater"]) {
                  if (!v.dimensions) v.dimensions = {};
                  v.dimensions.sizeChart = sourceCharts["3+2 seater"];
                  modified = true;
              }
          });

          if (modified) {
              await prod.save();
              updateCount++;
          }
      }
  }

  console.log(`Updated ${updateCount} products successfully.`);
  process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

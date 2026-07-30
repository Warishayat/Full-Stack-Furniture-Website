const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../Schemas/Product");
const Category = require("../Schemas/Category"); // Assuming there is a Category schema if needed

mongoose.connect(process.env.DATABASE_URI).then(async () => {
  console.log("Connected to MongoDB for Sofa Cum Bed copy");
  
  const sourceProduct = await Product.findOne({ title: { $regex: /Sims Black Trims Sofa/i } });
  if (!sourceProduct) {
    console.log("Source product not found!");
    process.exit(1);
  }
  
  // Extract dimension mapping from source
  const sourceCharts = {};
  if (sourceProduct.specifications?.dimensions?.sizeChart) {
      sourceCharts.global = sourceProduct.specifications.dimensions.sizeChart;
  }
  
  sourceProduct.variants.forEach(v => {
    if (v.dimensions?.sizeChart) {
      sourceCharts[v.name.toLowerCase().trim()] = v.dimensions.sizeChart;
    }
  });

  // Find all products that might be sofa cum beds (by title or maybe by category name)
  const allProducts = await Product.find({}).populate("category");
  let updateCount = 0;

  for (let prod of allProducts) {
      const title = prod.title.toLowerCase();
      const catName = prod.category?.name?.toLowerCase() || "";

      // Check if it's a sofa cum bed
      if (title.includes("cum bed") || title.includes("pull out bed") || catName.includes("cum bed") || catName.includes("pull out bed") || title.includes("sofa bed")) {
          console.log(`Updating Sofa Cum Bed: ${prod.title}`);
          let modified = false;

          if (sourceCharts.global) {
              if (!prod.specifications) prod.specifications = {};
              if (!prod.specifications.dimensions) prod.specifications.dimensions = {};
              prod.specifications.dimensions.sizeChart = sourceCharts.global;
              modified = true;
          }

          prod.variants.forEach(v => {
              const vName = v.name.toLowerCase().trim();
              let matchedKey = null;

              if (vName.includes("3+2") || vName.includes("3 + 2")) {
                  matchedKey = "3+2 seater";
              } else if (vName.includes("2c2") || vName.includes("corner")) {
                  matchedKey = "2c2 corner";
              } else if (vName.includes("1")) {
                  matchedKey = "1 seater";
              } else if (vName.includes("2")) {
                  matchedKey = "2 seater";
              } else if (vName.includes("3")) {
                  matchedKey = "3 seater";
              } else if (vName.includes("4")) {
                  matchedKey = "4 seater";
              }

              if (matchedKey && sourceCharts[matchedKey]) {
                  if (!v.dimensions) v.dimensions = {};
                  v.dimensions.sizeChart = sourceCharts[matchedKey];
                  console.log(` -> Mapped variant "${v.name}" to source chart "${matchedKey}"`);
                  modified = true;
              }
          });

          if (modified) {
              await prod.save();
              console.log(`✅ Saved ${prod.title}`);
              updateCount++;
          }
      }
  }

  console.log(`Updated ${updateCount} Sofa Cum Beds successfully.`);
  process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

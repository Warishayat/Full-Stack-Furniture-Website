const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../Schemas/Product");

mongoose.connect(process.env.DATABASE_URI).then(async () => {
  console.log("Connected to MongoDB for targeted copy");
  
  const sourceProduct = await Product.findOne({ title: { $regex: /Sims Black Trims Sofa/i } });
  if (!sourceProduct) {
    console.log("Source product not found!");
    process.exit(1);
  }
  
  // Extract dimension mapping
  const sourceCharts = {};
  if (sourceProduct.specifications?.dimensions?.sizeChart) {
      sourceCharts.global = sourceProduct.specifications.dimensions.sizeChart;
  }
  
  sourceProduct.variants.forEach(v => {
    if (v.dimensions?.sizeChart) {
      sourceCharts[v.name.toLowerCase().trim()] = v.dimensions.sizeChart;
    }
  });
  
  const targetTitles = [
    "Rio Chesterfield Sofas", 
    "Moderate Gold & Silver Trim Sofa", 
    "Ambassador Sofas", 
    "Bella Sofas", 
    "elite cozy corner sofa"
  ];

  for (let title of targetTitles) {
      const prod = await Product.findOne({ title: { $regex: new RegExp(title, "i") } });
      if (!prod) {
          console.log(`Product not found: ${title}`);
          continue;
      }
      
      console.log(`Updating Product: ${prod.title}`);
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
          
          // Also try direct match from sourceCharts keys
          let exactMatch = Object.keys(sourceCharts).find(k => k.trim() === vName);
          if (exactMatch) {
              matchedKey = exactMatch;
          }

          if (matchedKey && sourceCharts[matchedKey]) {
              if (!v.dimensions) v.dimensions = {};
              v.dimensions.sizeChart = sourceCharts[matchedKey];
              console.log(` -> Mapped variant "${v.name}" to source chart "${matchedKey}"`);
              modified = true;
          } else {
             console.log(` -> Could not map variant "${v.name}"`);
          }
      });

      if (modified) {
          await prod.save();
          console.log(`✅ Saved ${prod.title}`);
      }
  }

  process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

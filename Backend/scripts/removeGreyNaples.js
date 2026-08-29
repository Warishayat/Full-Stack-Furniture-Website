const mongoose = require('mongoose');
const Product = require('../Schemas/Product');
require('dotenv').config({ path: '../.env' });

async function removeGreyFromNaples() {
  try {
    const uri = process.env.DATABASE_URI;
    if (!uri) throw new Error("DATABASE_URI not found");
    
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const products = await Product.find({});
    let updatedCount = 0;

    for (let product of products) {
      let productChanged = false;

      if (product.variants && product.variants.length > 0) {
        for (let variant of product.variants) {
          if (variant.materials && variant.materials.length > 0) {
            for (let material of variant.materials) {
              if (material.name && material.name.toLowerCase().includes('naples')) {
                // Find if there is a 'grey' color
                const originalLength = material.colors.length;
                material.colors = material.colors.filter(
                  color => !color.name.toLowerCase().includes('grey')
                );

                if (material.colors.length < originalLength) {
                  productChanged = true;
                }
              }
            }
          }
        }
      }

      if (productChanged) {
        await product.save();
        updatedCount++;
        console.log(`Updated product: ${product.title}`);
      }
    }

    console.log(`Successfully updated ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

removeGreyFromNaples();

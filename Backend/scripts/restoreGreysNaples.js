const mongoose = require('mongoose');
const Product = require('../Schemas/Product');
require('dotenv').config({ path: '../.env' });

async function restoreGreysInNaples() {
  try {
    const uri = process.env.DATABASE_URI;
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
                
                // Check if Seal Grey exists
                const hasSeal = material.colors.some(c => c.name.toLowerCase() === 'seal grey');
                if (!hasSeal) {
                  material.colors.push({ name: 'Seal Grey', swatchImage: '' });
                  productChanged = true;
                }

                // Check if Slate Grey exists
                const hasSlate = material.colors.some(c => c.name.toLowerCase() === 'slate grey');
                if (!hasSlate) {
                  material.colors.push({ name: 'Slate Grey', swatchImage: '' });
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
        console.log(`Restored colors in product: ${product.title}`);
      }
    }

    console.log(`Successfully restored colors in ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

restoreGreysInNaples();

const mongoose = require('mongoose');
const Product = require('../Schemas/Product');
require('dotenv').config({ path: '../.env' });

async function findGreyColors() {
  try {
    const uri = process.env.DATABASE_URI;
    await mongoose.connect(uri);

    const products = await Product.find({});
    const greyColors = new Map();

    for (let product of products) {
      if (product.variants && product.variants.length > 0) {
        for (let variant of product.variants) {
          if (variant.materials && variant.materials.length > 0) {
            for (let material of variant.materials) {
              if (material.colors && material.colors.length > 0) {
                for (let color of material.colors) {
                  if (color.name.toLowerCase().includes('grey')) {
                    if (!greyColors.has(color.name)) {
                      greyColors.set(color.name, new Set());
                    }
                    if (color.swatchImage) {
                      greyColors.get(color.name).add(color.swatchImage);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    for (let [name, images] of greyColors.entries()) {
      console.log(`Found color: ${name} with images:`, Array.from(images));
    }
    
    if (greyColors.size === 0) {
      console.log("No grey colors found in the entire DB.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

findGreyColors();

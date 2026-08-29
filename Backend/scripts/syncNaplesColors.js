const mongoose = require('mongoose');
const Product = require('../Schemas/Product');
require('dotenv').config({ path: '../.env' });

async function syncNaplesColorsFromChelsea() {
  try {
    const uri = process.env.DATABASE_URI;
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // 1. Find Chelsea Sofa
    // Since title matching might be tricky due to casing or spaces, we'll use a regex
    const chelseaSofa = await Product.findOne({ title: /Chelsea Sofa/i });
    if (!chelseaSofa) {
      throw new Error("Chelsea Sofa not found in DB");
    }

    // 2. Extract the target colors from Chelsea Sofa's Naples Fabric
    let sealGreyData = null;
    let slateGreyData = null;
    let sodiumData = null;

    if (chelseaSofa.variants && chelseaSofa.variants.length > 0) {
      for (let variant of chelseaSofa.variants) {
        if (variant.materials && variant.materials.length > 0) {
          for (let material of variant.materials) {
            if (material.name && material.name.toLowerCase().includes('naples')) {
              for (let color of material.colors) {
                const cName = color.name.toLowerCase();
                if (cName === 'seal grey' || cName === 'seal-grey') {
                  sealGreyData = { name: 'Seal Grey', swatchImage: color.swatchImage || '' };
                }
                if (cName === 'slate grey' || cName === 'slate-grey') {
                  slateGreyData = { name: 'Slate Grey', swatchImage: color.swatchImage || '' };
                }
                if (cName === 'sodium') {
                  sodiumData = { name: 'Sodium', swatchImage: color.swatchImage || '' };
                }
              }
            }
          }
        }
      }
    }

    console.log("Extracted from Chelsea Sofa:");
    console.log("Seal Grey:", sealGreyData);
    console.log("Slate Grey:", slateGreyData);
    console.log("Sodium:", sodiumData);

    if (!sealGreyData && !slateGreyData && !sodiumData) {
       console.log("Could not find the new colors in Chelsea Sofa. Did you add them to Naples Fabric?");
       process.exit(1);
    }

    // 3. Update all other products
    const products = await Product.find({});
    let updatedCount = 0;

    for (let product of products) {
      // Skip Chelsea Sofa since it's our source
      if (product._id.toString() === chelseaSofa._id.toString()) continue;

      let productChanged = false;

      if (product.variants && product.variants.length > 0) {
        for (let variant of product.variants) {
          if (variant.materials && variant.materials.length > 0) {
            for (let material of variant.materials) {
              if (material.name && material.name.toLowerCase().includes('naples')) {
                
                const updateOrAddColor = (targetData) => {
                  if (!targetData) return;
                  
                  const targetNameLower = targetData.name.toLowerCase();
                  let colorExists = false;
                  
                  for (let i = 0; i < material.colors.length; i++) {
                    const existingNameLower = material.colors[i].name.toLowerCase();
                    // Match against space or hyphen versions
                    if (existingNameLower === targetNameLower || existingNameLower === targetNameLower.replace(' ', '-')) {
                      colorExists = true;
                      if (material.colors[i].swatchImage !== targetData.swatchImage) {
                        material.colors[i].swatchImage = targetData.swatchImage;
                        productChanged = true;
                      }
                      break;
                    }
                  }

                  if (!colorExists) {
                    material.colors.push({ name: targetData.name, swatchImage: targetData.swatchImage });
                    productChanged = true;
                  }
                };

                updateOrAddColor(sealGreyData);
                updateOrAddColor(slateGreyData);
                updateOrAddColor(sodiumData);
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

    console.log(`Successfully synced colors to ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

syncNaplesColorsFromChelsea();

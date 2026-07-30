const Cart = require("../../Schemas/Cart");
const Product = require("../../Schemas/Product");


const calculateTotal = (cart) => {
  return cart.items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);
};


const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "title"); 

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalPrice: 0 }
      });
    }

    let total = 0;

    const updatedItems = cart.items.map(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      let itemTitle = item.product?.title;
      if (item.variant === "Fabric Swatches Bundle") {
         itemTitle = `Free Swatches Bundle - ${item.product?.title}`;
      } else if (item.variant === "Fabric Swatch") {
         itemTitle = `Free Swatch - ${item.product?.title}`;
      }

      return {
        _id: item._id,
        product: item.product?._id,
        title: itemTitle,
        variant: item.variant,
        material: item.material,
        color: item.color,
        leg: item.leg,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        itemTotal
      };
    });

    res.status(200).json({
      success: true,
      cart: {
        items: updatedItems,
        totalPrice: total
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, variant, material, color, leg, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || !variant) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (productId, variant)"
      });
    }

    const qty = Number(quantity);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const isSwatch = variant === "Fabric Swatches Bundle" || variant === "Fabric Swatch";

    let finalMaterial = material;
    let finalColor = color;
    let finalPrice = 0;
    let finalImage = req.body.image || product.images?.[0] || "";

    if (!isSwatch) {
      let selectedVariant = product.variants.find(v => v.name === variant);
      if (!selectedVariant) {
        return res.status(400).json({
          success: false,
          message: `Size variant "${variant}" is not valid for this product`
        });
      }

      const hasMaterials = selectedVariant.materials && selectedVariant.materials.length > 0;
      let colorFound = false;

      if (hasMaterials) {
        if (!material || !color) {
          return res.status(400).json({
            success: false,
            message: "Material and Color finishes are required for this product"
          });
        }

        selectedVariant.materials.forEach(m => {
          if (m.name === material) {
            m.colors.forEach(c => {
              if (c.name === color) {
                colorFound = true;
              }
            });
          }
        });

        if (!colorFound) {
          return res.status(400).json({
            success: false,
            message: "Specified material/color finish configuration is not valid"
          });
        }
      } else {
        colorFound = true;
      }

      finalMaterial = hasMaterials ? material : "Standard";
      finalColor = hasMaterials ? color : "Default";

      if (qty > selectedVariant.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${selectedVariant.stock} items left in stock`
        });
      }
      
      finalPrice = selectedVariant.price;
      finalImage = selectedVariant.images?.[0] || product.images?.[0] || "";
    } else {
      finalMaterial = material || "Mixed Fabrics";
      finalColor = color || "Mixed Colors";
      finalPrice = 0;
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(item =>
      item.product.toString() === productId &&
      item.variant === variant &&
      item.material === finalMaterial &&
      item.color === finalColor &&
      item.leg === leg
    );

    if (index > -1) {
      cart.items[index].quantity += qty;
    } else {
      cart.items.push({
        product: productId,
        variant,
        material: finalMaterial,
        color: finalColor,
        leg: leg,
        price: finalPrice,
        image: finalImage,
        quantity: qty
      });
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Added to cart",
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.id(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    item.quantity = Number(quantity);

    cart.totalPrice = calculateTotal(cart);
    
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;   
    const userId = req.user.id;     

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    cart.totalPrice = cart.items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed",
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteAllCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
        cart: { items: [], totalPrice: 0 }
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {getCart, addToCart, updateCart, deleteFromCart, deleteAllCart};

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

      return {
        _id: item._id,
        product: item.product?._id,
        title: item.product?.title,
        variant: item.variant,
        material: item.material,
        color: item.color,
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
    const { productId, variant, material, color, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || !variant || !material || !color) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
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

    let selectedColor;

    product.variants.forEach(v => {
      if (v.name === variant) {
        v.materials.forEach(m => {
          if (m.name === material) {
            m.colors.forEach(c => {
              if (c.name === color) {
                selectedColor = c;
              }
            });
          }
        });
      }
    });

    if (!selectedColor) {
      return res.status(400).json({
        success: false,
        message: "Variant not found"
      });
    }

    if (qty > selectedColor.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock"
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(item =>
      item.product.toString() === productId &&
      item.variant === variant &&
      item.material === material &&
      item.color === color
    );

    if (index > -1) {
      cart.items[index].quantity += qty;
    } else {
      cart.items.push({
        product: productId,
        variant,
        material,
        color,
        price: selectedColor.price,
        image: selectedColor.images?.[0],
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
    console.log("ADD TO CART ERROR:", error);
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
    console.log("DELETE CART ERROR:", error);
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
    console.log("CLEAR CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {getCart, addToCart, updateCart, deleteFromCart, deleteAllCart};

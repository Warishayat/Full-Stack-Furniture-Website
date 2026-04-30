const Cart = require("../../Schemas/Cart");
const Product = require("../../Schemas/Product");


const calculateTotal = async (cart) => {
  let total = 0;

  for (let item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  return total;
};


const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalPrice: 0 }
      });
    }

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    let { productId, product, quantity = 1 } = req.body;
    const userId = req.user.id;
    const finalProductId = productId || product;

    quantity = Number(quantity);

    const productData = await Product.findById(finalProductId);
    if (!productData) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (quantity > productData.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock"
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(
      item => item.product.toString() === finalProductId
    );

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: finalProductId, quantity });
    }

    cart.totalPrice = await calculateTotal(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Added to cart",
      cart
    });

  } catch (error) {
    console.log(error);
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

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "productId is required"
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(
      item =>
        (item._id && item._id.toString() === id.toString()) ||
        (item.product && item.product.toString() === id.toString())
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    cart.items[itemIndex].quantity = Number(quantity);

    cart.totalPrice = await calculateTotal(cart);
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    cart.items = cart.items.filter(item => {
      const matchId = item._id && item._id.toString() === id;
      const matchProduct = item.product && item.product.toString() === id;
      return !matchId && !matchProduct;
    });

    cart.totalPrice = await calculateTotal(cart);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Removed",
      cart
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAllCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {getCart, addToCart, updateCart, deleteFromCart, deleteAllCart};

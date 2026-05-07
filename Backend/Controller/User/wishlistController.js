const Wishlist = require("../../Schemas/Wishlist");

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate("products");

    if (!wishlist) {
      return res.status(200).json({ success: true, products: [] });
    }

    // Filter out any products that might have been deleted (would be null after populate)
    const validProducts = wishlist.products.filter(p => p !== null);
    res.status(200).json({ success: true, products: validProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
      await wishlist.save();
      return res.status(200).json({ success: true, message: "Added to wishlist", added: true });
    }

    const index = wishlist.products.indexOf(productId);
    if (index > -1) {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return res.status(200).json({ success: true, message: "Removed from wishlist", added: false });
    } else {
      wishlist.products.push(productId);
      await wishlist.save();
      return res.status(200).json({ success: true, message: "Added to wishlist", added: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

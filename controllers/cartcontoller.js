import User from "../Model/userModel.js";
import Cart from "../Model/cartModel.js";

// ✅ Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({ success: true, cart: [] });
    }

    return res.status(200).json({ success: true, cart: cart.items });
  } catch (error) {
    console.error("❌ Get cart error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Add to Cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    let cart = await Cart.findOne({ user: userId });

    // Create a new cart if none exists
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product is already in the cart
    const productExists = cart.items.includes(productId.toString());
    if (productExists) {
      return res.status(400).json({ success: false, message: "Product already in cart" });
    }

    cart.items.push(productId.toString());
    await cart.save();

    return res.status(200).json({ success: true, message: "Added to cart", cart: cart.items });
  } catch (error) {
    console.error("❌ Add to cart error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.toString() !== productId.toString());

    if (cart.items.length === initialLength) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    await cart.save();

    return res.status(200).json({ success: true, message: "Removed from cart", cart: cart.items });
  } catch (error) {
    console.error("❌ Remove from cart error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("❌ Clear cart error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Export all cart functions
export { getCart, addToCart, removeFromCart, clearCart };

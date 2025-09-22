const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price imageUrl');
    
    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    // Calculate total
    let total = 0;
    cart.items.forEach(item => {
      total += item.product.price * item.quantity;
    });

    res.json({
      items: cart.items,
      total: total.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if size is available
    if (!product.sizes.includes(size)) {
      return res.status(400).json({ message: 'Size not available for this product' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        size,
        quantity: parseInt(quantity)
      });
    }

    await cart.save();

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.id(req.params.itemId).remove();
    await cart.save();

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

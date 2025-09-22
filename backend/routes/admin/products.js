const express = require('express');
const Product = require('../../models/Product');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

// Get all products (admin view with additional info)
router.get('/', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new product
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, sizes, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category,
      sizes,
      stock: stock || 0
    });

    await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, sizes, stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        imageUrl,
        category,
        sizes,
        stock
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product statistics
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);
    
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stock' } } }
    ]);

    res.json({
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();


// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      // from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmation</h2>
          <p>Thank you for your order!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
          </div>
          
          <h3>Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Size</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.size}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">$${item.price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <p style="margin-top: 20px;">We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Create order
router.post('/create', auth, async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: cartItem.size,
        quantity: cartItem.quantity
      });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    await order.save();

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // Send confirmation email
    await sendOrderConfirmationEmail(order, req.user.email);

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

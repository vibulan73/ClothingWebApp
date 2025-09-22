const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI; 

mongoose.connect(MONGODB_URI, {})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Admin Routes
app.use('/api/admin/products', require('./routes/admin/products'));
app.use('/api/admin/orders', require('./routes/admin/orders'));
app.use('/api/admin/users', require('./routes/admin/users'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Clothing E-commerce API is running!' });
});

const PORT = process.env.PORT; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

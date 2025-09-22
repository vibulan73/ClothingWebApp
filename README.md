# Clothing E-commerce MERN Stack Application

A fully functional e-commerce web application for a fictional clothing brand built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### ✅ Core Requirements Implemented

1. **User Accounts & Authentication**
   - User registration (name, email, password)
   - User login with JWT-based authentication
   - Secure password storage with bcrypt
   - Protected routes for authenticated users

2. **Product Management**
   - Clothing catalog with 20+ seeded items
   - Product details: name, description, price, image URL, category, sizes
   - Categories: Men, Women, Kids
   - Sizes: S, M, L, XL
   - Product detail pages

3. **Search, Filters & Pagination**
   - Search products by name/description
   - Filter by category, size, and price range
   - Multiple filters work together
   - Pagination with configurable page size
   - Sort by price, name, date

4. **Shopping Cart**
   - Add clothing items with selected size
   - Update quantities and remove items
   - Cart saved per user
   - Guest cart support (add to cart when not logged in)

5. **Checkout & Orders**
   - Mock checkout process (no real payments)
   - Orders saved in MongoDB with:
     - User reference
     - Items purchased (with sizes/quantities)
     - Total price
     - Order date
     - Shipping address

6. **Order Confirmation Email**
   - Email sent after successful checkout using Nodemailer
   - Email includes:
     - Order summary (products, sizes, quantities, total)
     - Order ID
     - Order date


## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** (comes with Node.js)

## MongoDB Setup

1. **Download and Install MongoDB:**

2. **Start MongoDB Service:**

3. **Verify Installation:**
   ```bash
   mongod --version
   ```
## Installation & Setup

### 1. Clone or Download the Project

```bash
# If you have git installed
git clone <repository-url>
cd ClothingWebApp

# Or download and extract the ZIP file
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Copy the example below and create .env file
```

**Create `.env` file in backend directory:**

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/clothing-ecommerce
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing-ecommerce

# JWT Secret Key (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000

# Email Configuration (for order confirmations)
EMAIL_HOST='smtp.gmail.com'
EMAIL_PORT='465'
EMAIL_USER='your-email@gmail.com'
EMAIL_PASS='your-app-password'

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Database Seeding

```bash
# From backend directory
npm run seed
```

This will populate your database with 20+ sample clothing products and create an admin user.

**Admin Credentials:**
- Email: `admin@alphaclothing.com`
- Password: `admin123`

## Running the Application

### 1. Start the Backend Server

```bash
# From backend directory
npm run dev
# OR
npm start
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
# From frontend directory
npm start
```

The frontend will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Email Configuration (Optional)

To enable order confirmation emails:

1. **Gmail Setup:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password:
     - Go to Google Account settings
     - Security → 2-Step Verification → App passwords
     - Generate password for "Mail"
   - Use this app password in your `.env` file

2. **Other Email Providers:**
   - Update `EMAIL_HOST`, `EMAIL_PORT` in `.env`
   - Use appropriate credentials

## Sample Data

The application comes with 20+ pre-seeded clothing items including:

- **Men's Clothing:** T-shirts, jeans, jackets, hoodies, polo shirts, chinos
- **Women's Clothing:** Dresses, jeans, blouses, sweaters, skirts, crop tops
- **Kids' Clothing:** T-shirts, hoodies, jeans, dresses, shorts

## Features Overview

### User Experience
- **Home Page:** Welcome section with category navigation
- **Product Catalog:** Search, filter, and browse products
- **Product Details:** Detailed view with size selection
- **Shopping Cart:** Add, update, remove items
- **Checkout:** Shipping information and order placement
- **Order History:** View past orders and details

### Admin Features
- **Admin Dashboard:** Overview of products, orders, and users
- **Product Management:** Add, edit, delete products with full CRUD operations
- **Order Management:** View all orders, update order status, analytics
- **User Management:** View users, manage user roles, user statistics
- **Analytics:** Sales data, order statistics, user metrics

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database credentials

2. **Port Already in Use:**
   - Change PORT in `.env` file
   - Kill existing processes on ports 3000/5000

3. **Email Not Sending:**
   - Check email credentials in `.env`
   - Verify Gmail app password
   - Check firewall settings

4. **CORS Errors:**
   - Ensure frontend URL is correct in `.env`
   - Check if both servers are running

### Development Tips

1. **Database Reset:**
   ```bash
   # Clear and reseed database
   npm run seed
   ```

2. **Check Logs:**
   - Backend logs in terminal
   - Browser console for frontend errors

3. **API Testing:**
   - Use Postman or similar tool
   - Test endpoints with proper authentication headers

## Production Deployment

For production deployment:

1. **Environment Variables:**
   - Use secure JWT secret
   - Configure production MongoDB
   - Set up production email service

2. **Security:**
   - Enable HTTPS
   - Use environment variables for secrets
   - Implement rate limiting
   - Add input validation

3. **Performance:**
   - Enable MongoDB indexing
   - Implement caching
   - Optimize images
   - Use CDN for static assets

## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, React Router, Axios
- **Authentication:** JWT, bcrypt
- **Email:** Nodemailer
- **Styling:** CSS3 with responsive design

## License

This project is created for educational purposes. Feel free to use and modify as needed.


**Happy Shopping! 🛍️**

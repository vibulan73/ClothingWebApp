import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to Alpha Clothing Store</h1>
          <p>Discover the latest fashion trends for Men, Women, and Kids</p>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>Safe and secure payment processing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy for all items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="grid grid-3">
            <Link to="/products?category=Men" className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" alt="Men's Clothing" />
              </div>
              <h3>Men's Clothing</h3>
              <p>Stylish and comfortable clothing for men</p>
            </Link>
            <Link to="/products?category=Women" className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400" alt="Women's Clothing" />
              </div>
              <h3>Women's Clothing</h3>
              <p>Trendy and elegant clothing for women</p>
            </Link>
            <Link to="/products?category=Kids" className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" alt="Kids' Clothing" />
              </div>
              <h3>Kids' Clothing</h3>
              <p>Fun and comfortable clothing for kids</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

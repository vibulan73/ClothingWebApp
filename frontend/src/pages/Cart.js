import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { items, total, loading, updateCartItem, removeFromCart, fetchCart, isGuestCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchCart();
  //   }
  // }, [isAuthenticated, fetchCart]);
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);


  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      const result = await removeFromCart(itemId);
      if (result && !result.success) {
        alert(result.error || 'Failed to remove item from cart');
      }
    } else {
      const result = await updateCartItem(itemId, newQuantity);
      if (result && !result.success) {
        alert(result.error || 'Failed to update cart item');
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      const result = await removeFromCart(itemId);
      if (result && !result.success) {
        alert(result.error || 'Failed to remove item from cart');
      }
    }
  };

  // Show login prompt only if cart is empty and user is not authenticated
  if (!isAuthenticated && items.length === 0) {
    return (
      <div className="cart-login-required">
        <h2>Your Cart is Empty</h2>
        <p>Add some items to your cart to get started.</p>
        <div className="cart-actions">
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some items to your cart to get started.</p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.imageUrl} alt={item.product.name} />
                </div>
                
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p className="cart-item-category">{item.product.category}</p>
                  <p className="cart-item-size">Size: {item.size}</p>
                  <p className="cart-item-price">${item.product.price}</p>
                </div>
                
                <div className="cart-item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-total">
                  <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <div className="cart-item-actions">
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total}</span>
              </div>
              
              {!isAuthenticated ? (
                <div className="checkout-login-prompt">
                  <p className="login-message">
                    Please login to proceed with checkout
                  </p>
                  <div className="checkout-actions">
                    <Link to="/login" className="btn btn-primary btn-large">
                      Login to Checkout
                    </Link>
                    <Link to="/register" className="btn btn-secondary btn-large">
                      Create Account
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-primary btn-large"
                >
                  Proceed to Checkout
                </button>
              )}
              
              <Link to="/products" className="btn btn-secondary btn-large">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

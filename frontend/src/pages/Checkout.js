import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: formData
      };

      const response = await ordersAPI.createOrder(orderData);
      
      if (response.status === 201) {
        await clearCart();
        navigate('/orders', { 
          state: { 
            message: 'Order placed successfully! You will receive a confirmation email shortly.' 
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="checkout-login-required">
        <h2>Login Required</h2>
        <p>Please login to proceed with checkout.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Login
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some items to your cart before checkout.</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-section">
            <div className="checkout-form-card">
              <h2>Shipping Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="street">Street Address</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-large"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="checkout-summary-section">
            <div className="checkout-summary-card">
              <h3>Order Summary</h3>
              
              <div className="order-items">
                {items.map(item => (
                  <div key={item._id} className="order-item">
                    <div className="order-item-image">
                      <img src={item.product.imageUrl} alt={item.product.name} />
                    </div>
                    <div className="order-item-info">
                      <h4>{item.product.name}</h4>
                      <p>Size: {item.size}</p>
                      <p>Qty: {item.quantity}</p>
                      <p className="order-item-price">${item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${total}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

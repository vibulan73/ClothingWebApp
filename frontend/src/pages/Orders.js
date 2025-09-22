import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders();
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-login-required">
        <h2>Login Required</h2>
        <p>Please login to view your orders.</p>
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

  return (
    <div className="orders">
      <div className="orders-container">
        <h1>My Orders</h1>
        
        {location.state?.message && (
          <div className="success-message">
            {location.state.message}
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {orders.length === 0 ? (
          <div className="orders-empty">
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          <img src={item.imageUrl} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <h5>{item.name}</h5>
                          <p>Size: {item.size}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p className="item-price">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                    className="btn btn-secondary"
                  >
                    {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
                
                {selectedOrder === order._id && (
                  <div className="order-details">
                    <h4>Shipping Address</h4>
                    <div className="shipping-address">
                      {order.shippingAddress && (
                        <div>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

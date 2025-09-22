import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminProductsAPI, adminOrdersAPI, adminUsersAPI } from '../services/adminAPI';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: {},
    orders: {},
    users: {}
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchDashboardStats();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [productStats, orderStats, userStats] = await Promise.all([
        adminProductsAPI.getProductStats(),
        adminOrdersAPI.getOrderStats(),
        adminUsersAPI.getUserStats()
      ]);

      setStats({
        products: productStats.data,
        orders: orderStats.data,
        users: userStats.data
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user.name}!</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Products</h3>
            <div className="stat-number">{stats.products.totalProducts || 0}</div>
            <p>Total Products</p>
            <div className="stat-detail">
              <span>Stock: {stats.products.totalStock || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <h3>Orders</h3>
            <div className="stat-number">{stats.orders.totalOrders || 0}</div>
            <p>Total Orders</p>
            <div className="stat-detail">
              <span>Revenue: ${stats.orders.totalRevenue?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="stat-card">
            <h3>Users</h3>
            <div className="stat-number">{stats.users.totalUsers || 0}</div>
            <p>Total Users</p>
            <div className="stat-detail">
              <span>Admins: {stats.users.adminCount || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <h3>Recent Activity</h3>
            <div className="stat-number">{stats.orders.recentOrders?.length || 0}</div>
            <p>Recent Orders</p>
            <div className="stat-detail">
              <span>Last 5 orders</span>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button
              onClick={() => navigate('/admin/products')}
              className="btn btn-primary"
            >
              Manage Products
            </button>
            {/* <button
              onClick={() => navigate('/admin/orders')}
              className="btn btn-primary"
            >
              Manage Orders
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="btn btn-primary"
            >
              Manage Users
            </button> */}
          </div>
        </div>

        {stats.orders.recentOrders && stats.orders.recentOrders.length > 0 && (
          <div className="recent-orders">
            <h2>Recent Orders</h2>
            <div className="orders-list">
              {stats.orders.recentOrders.map(order => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <h4>Order #{order.orderNumber}</h4>
                    <p>{order.user?.name} - ${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

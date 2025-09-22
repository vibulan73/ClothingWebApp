import api from './api';

// Admin Products API
export const adminProductsAPI = {
  getProducts: () => api.get('/admin/products'),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getProductStats: () => api.get('/admin/products/stats/overview'),
};

// Admin Orders API
export const adminOrdersAPI = {
  getOrders: (params) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getOrderStats: () => api.get('/admin/orders/stats/overview'),
  getSalesAnalytics: (period) => api.get('/admin/orders/analytics/sales', { params: { period } }),
};

// Admin Users API
export const adminUsersAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserStats: () => api.get('/admin/users/stats/overview'),
};

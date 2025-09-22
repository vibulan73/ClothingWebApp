import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories/list'),
  getSizes: () => api.get('/products/sizes/list'),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (item) => api.post('/cart/add', item),
  updateCartItem: (itemId, quantity) => api.put(`/cart/update/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders/create', orderData),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
};

export default api;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminProductsAPI } from '../services/adminAPI';
import { useNavigate } from 'react-router-dom';
import './AdminProducts.css';

const AdminProducts = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'Men',
    sizes: [],
    stock: ''
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchProducts();
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminProductsAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await adminProductsAPI.updateProduct(editingProduct._id, productData);
      } else {
        await adminProductsAPI.createProduct(productData);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: 'Men',
        sizes: [],
        stock: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      sizes: product.sizes,
      stock: product.stock.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminProductsAPI.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      category: 'Men',
      sizes: [],
      stock: ''
    });
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
    <div className="admin-products">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Manage Products</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Add New Product
          </button>
        </div>

        {showForm && (
          <div className="product-form-overlay">
            <div className="product-form">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Available Sizes</label>
                    <div className="size-checkboxes">
                      {['S', 'M', 'L', 'XL'].map(size => (
                        <label key={size} className="size-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.sizes.includes(size)}
                            onChange={() => handleSizeChange(size)}
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-stock">Stock: {product.stock}</p>
                <div className="product-sizes">
                  Sizes: {product.sizes.join(', ')}
                </div>
              </div>
              <div className="product-actions">
                <button
                  onClick={() => handleEdit(product)}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;

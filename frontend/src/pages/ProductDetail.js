import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id);
      setProduct(response.data);
      if (response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      setError(null);
    } catch (err) {
      setError('Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const result = await addToCart(product._id, selectedSize, quantity);
    if (result.success) {
      alert('Item added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
        
        <div className="product-info-section">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-price">${product.price}</p>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-sizes">
            <h3>Available Sizes</h3>
            <div className="size-options">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-quantity">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-large"
            >
              Add to Cart
            </button>
            <button
              onClick={() => navigate('/products')}
              className="btn btn-secondary btn-large"
            >
              Continue Shopping
            </button>
          </div>

          <div className="product-stock">
            <p>Stock: {product.stock} items available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

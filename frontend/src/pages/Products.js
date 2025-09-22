import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Products.css';

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: '1',
    limit: '10'
  });

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts();
      setAllProducts(response.data.products);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await productsAPI.getSizes();
      setSizes(response.data);
    } catch (err) {
      console.error('Error fetching sizes:', err);
    }
  };

  // Client-side filtering function
  const applyFilters = useCallback(() => {
    let filtered = [...allProducts];

    // Apply search filter
    if (searchInput.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        product.category.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply size filter
    if (filters.size) {
      filtered = filtered.filter(product => product.sizes.includes(filters.size));
    }

    // Apply price filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return filters.sortOrder === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'price':
          return filters.sortOrder === 'asc'
            ? a.price - b.price
            : b.price - a.price;
        case 'createdAt':
        default:
          return filters.sortOrder === 'asc'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredProducts(filtered);
  }, [allProducts, searchInput, filters]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSizes();
  }, []);

  // Apply filters whenever allProducts, searchInput, or filters change
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
  }, [allProducts, searchInput, filters, applyFilters]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: '1' };
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page: page.toString() };
    setFilters(newFilters);
  };

  // Calculate pagination for filtered products
  const getPaginatedProducts = () => {
    const currentPage = parseInt(filters.page) || 1;
    const itemsPerPage = parseInt(filters.limit) || 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      products: filteredProducts.slice(startIndex, endIndex),
      pagination: {
        currentPage,
        totalPages: Math.ceil(filteredProducts.length / itemsPerPage),
        hasPrev: currentPage > 1,
        hasNext: endIndex < filteredProducts.length,
        totalItems: filteredProducts.length
      }
    };
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      category: '',
      size: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: '1',
      limit: '10'
    };
    setFilters(defaultFilters);
    setSearchInput('');
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddToCart = async (productId, product) => {
    // Check if product has multiple sizes
    if (product.sizes.length > 1) {
      const selectedSize = selectedSizes[productId];
      if (!selectedSize) {
        alert('Please select a size before adding to cart');
        return;
      }
      
      const result = await addToCart(productId, selectedSize, 1);
      if (result.success) {
        alert('Item added to cart!');
      } else {
        alert(result.error || 'Failed to add to cart');
      }
    } else {
      const result = await addToCart(productId, product.sizes[0], 1);
      if (result.success) {
        alert('Item added to cart!');
      } else {
        alert(result.error || 'Failed to add to cart');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const paginatedData = getPaginatedProducts();
  const products = paginatedData.products;
  const pagination = paginatedData.pagination;

  // Fallback: if no filtered products, show all products
  const displayProducts = products.length > 0 ? products : allProducts.slice(0, 10);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Products</h1>
        <p>Discover our collection of clothing items</p>
      </div>

      <div className="products-content">
        <div className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="btn btn-secondary btn-sm">
              Clear All
            </button>
          </div>
          
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="Search products..."
              className="form-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Size</label>
            <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="form-select"
            >
              <option value="">All Sizes</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min"
                className="form-input"
              />
              <span>to</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max"
                className="form-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="form-select"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="products-main">
          {error && <div className="error-message">{error}</div>}
          
          <div className="products-grid">
            {displayProducts.map(product => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </Link>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">${product.price}</p>
                  {product.sizes.length > 1 ? (
                    <div className="product-sizes-selection">
                      <label>Select Size:</label>
                      <div className="size-buttons">
                        {product.sizes.map(size => (
                          <button
                            key={size}
                            className={`size-btn ${selectedSizes[product._id] === size ? 'selected' : ''}`}
                            onClick={() => handleSizeSelect(product._id, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="product-sizes">
                      <span>Sizes: </span>
                      {product.sizes.map(size => (
                        <span key={size} className="size-tag">{size}</span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handleAddToCart(product._id, product)}
                    className="btn btn-primary"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {displayProducts.length === 0 && !loading && (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="btn btn-secondary"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

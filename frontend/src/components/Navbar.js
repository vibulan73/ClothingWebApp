import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = getCartItemCount();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Alpha Clothing Store
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/products" className="navbar-link">
            Products
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="navbar-link">
                Orders
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link">
                  Admin
                </Link>
              )}
              <div className="navbar-user">
                <span>Welcome, {user?.name}</span>
                {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </div>
          )}

          <Link to="/cart" className="navbar-cart">
            Cart ({cartItemCount})
          </Link>
        </div>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div className="navbar-mobile">
          <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Orders
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
          <Link to="/cart" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Cart ({cartItemCount})
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

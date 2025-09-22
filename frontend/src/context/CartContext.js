import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartAPI, productsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false,
        isGuestCart: action.payload.isGuestCart || false,
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_FROM_CART':
      const remainingItems = state.items.filter(item => item._id !== action.payload);
      const newTotal = remainingItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return {
        ...state,
        items: remainingItems,
        total: newTotal.toFixed(2),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  isGuestCart: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load guest cart from localStorage
  const loadGuestCart = useCallback(() => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        const cartData = JSON.parse(guestCart);
        dispatch({
          type: 'SET_CART',
          payload: {
            items: cartData.items || [],
            total: cartData.total || 0,
            isGuestCart: true,
          },
        });
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
    }
  }, []);

  // Save guest cart to localStorage
  const saveGuestCart = (items) => {
    try {
      const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const guestCart = { items, total: total.toFixed(2) };
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  const fetchCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.getCart();
      dispatch({
        type: 'SET_CART',
        payload: response.data,
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch cart' });
    }
  }, []);

  // Sync guest cart with server when user logs in
  const syncGuestCartWithServer = useCallback(async () => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart && isAuthenticated) {
        const cartData = JSON.parse(guestCart);
        for (const item of cartData.items) {
          await cartAPI.addToCart({
            productId: item.product._id,
            size: item.size,
            quantity: item.quantity,
          });
        }
        localStorage.removeItem('guestCart');
        fetchCart(); // Load the synced cart from server
      }
    } catch (error) {
      console.error('Error syncing guest cart:', error);
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (isAuthenticated) {
      // Sync guest cart with server when user logs in
      syncGuestCartWithServer();
      fetchCart();
    } else {
      loadGuestCart();
    }
  }, [isAuthenticated, syncGuestCartWithServer, fetchCart, loadGuestCart]);

  const addToCart = async (productId, size, quantity = 1) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.addToCart({ productId, size, quantity });
        if (response.status === 200) {
          fetchCart(); // Refresh cart
          return { success: true };
        }
      } else {
        // Handle guest cart
        const response = await productsAPI.getProduct(productId);
        const product = response.data;
        
        // Check if item already exists in guest cart
        const existingItemIndex = state.items.findIndex(
          item => item.product._id === productId && item.size === size
        );

        let newItems = [...state.items];
        
        if (existingItemIndex > -1) {
          // Update quantity
          newItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          newItems.push({
            _id: `guest_${Date.now()}_${Math.random()}`,
            product: product,
            size,
            quantity: quantity
          });
        }

        // Update state and save to localStorage
        dispatch({
          type: 'SET_CART',
          payload: {
            items: newItems,
            total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2),
            isGuestCart: true,
          },
        });
        
        saveGuestCart(newItems);
        return { success: true };
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        return await removeFromCart(itemId);
      }

      if (isAuthenticated) {
        const response = await cartAPI.updateCartItem(itemId, quantity);
        if (response.status === 200) {
          dispatch({ type: 'UPDATE_CART_ITEM', payload: { itemId, quantity } });
          await fetchCart(); // Refresh cart to get updated total
          return { success: true };
        } else {
          return { success: false, error: 'Failed to update item' };
        }
      } else {
        // Handle guest cart
        const newItems = state.items.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        );
        
        dispatch({
          type: 'SET_CART',
          payload: {
            items: newItems,
            total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2),
            isGuestCart: true,
          },
        });
        
        saveGuestCart(newItems);
        return { success: true };
      }
    } catch (error) {
      console.error('Update cart item error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to update cart' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.removeFromCart(itemId);
        if (response.status === 200) {
          // Update local state immediately
          dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
          return { success: true };
        } else {
          return { success: false, error: 'Failed to remove item' };
        }
      } else {
        // Handle guest cart
        const newItems = state.items.filter(item => item._id !== itemId);
        
        dispatch({
          type: 'SET_CART',
          payload: {
            items: newItems,
            total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2),
            isGuestCart: true,
          },
        });
        
        saveGuestCart(newItems);
        return { success: true };
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to remove from cart' 
      };
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartAPI.clearCart();
      if (response.status === 200) {
        dispatch({ type: 'CLEAR_CART' });
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to clear cart' };
    }
  };

  const getCartItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartItemCount,
        syncGuestCartWithServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

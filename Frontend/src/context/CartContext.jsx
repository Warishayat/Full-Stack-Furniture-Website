import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart/getCart');
      // Depending on how backend sends it, maybe data.cart.items
      setCartItems(data.cart?.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await API.post('/cart/addToCart', { productId, quantity });
      toast.success('Item added to cart');
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const updateCart = async (itemId, quantity) => {
    try {
      await API.put(`/cart/updateCart/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await API.delete(`/cart/deleteFromCart/${itemId}`);
      toast.success('Item removed');
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart/deleteAllCart');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

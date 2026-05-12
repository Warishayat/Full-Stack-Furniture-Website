import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync / Fetch cart when user state changes
  useEffect(() => {
    if (user) {
      const storedGuestCart = JSON.parse(localStorage.getItem('guest_cart_items') || '[]');
      if (storedGuestCart.length > 0) {
        mergeGuestCart(storedGuestCart);
      } else {
        fetchCart();
      }
    } else {
      const storedGuestCart = JSON.parse(localStorage.getItem('guest_cart_items') || '[]');
      setCartItems(storedGuestCart);
    }
  }, [user]);

  const mergeGuestCart = async (guestItems) => {
    try {
      setLoading(true);
      for (const item of guestItems) {
        try {
          await API.post('/cart/addtocart', { 
            productId: item.product, 
            quantity: item.quantity,
            variant: item.variant,
            material: item.material,
            color: item.color
          });
        } catch (err) {
          console.error(`Failed to merge item ${item.product}:`, err);
        }
      }
      localStorage.removeItem('guest_cart_items');
      toast.success('Your guest cart was merged with your account!');
      await fetchCart();
    } catch (error) {
      console.error('Error merging guest cart:', error);
      fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart/getallcart');
      setCartItems(data.cart?.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, options = {}) => {
    const { variant, material, color, price, title, image } = options;
    
    if (!user) {
      // Guest mode: save to localStorage
      const currentGuestCart = JSON.parse(localStorage.getItem('guest_cart_items') || '[]');
      const existingItemIndex = currentGuestCart.findIndex(item => 
        item.product === productId &&
        item.variant === variant &&
        item.material === material &&
        item.color === color
      );

      if (existingItemIndex > -1) {
        currentGuestCart[existingItemIndex].quantity += quantity;
      } else {
        const newItem = {
          _id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          product: productId,
          title: title || 'Premium Piece',
          image: image || 'https://placehold.co/400x400?text=Premium+Furniture',
          variant: variant || 'Standard',
          material: material || '',
          color: color || 'Default',
          quantity,
          price: Number(price) || 0
        };
        currentGuestCart.push(newItem);
      }

      localStorage.setItem('guest_cart_items', JSON.stringify(currentGuestCart));
      setCartItems(currentGuestCart);
      toast.success('Item added to cart');
      return;
    }

    // Logged in mode
    try {
      await API.post('/cart/addtocart', { 
        productId, 
        quantity,
        variant,
        material,
        color
      });
      toast.success('Item added to cart');
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const updateCart = async (itemId, quantity) => {
    if (!user) {
      // Guest mode
      const currentGuestCart = JSON.parse(localStorage.getItem('guest_cart_items') || '[]');
      const updatedCart = currentGuestCart.map(item => {
        if (item._id === itemId) {
          return { ...item, quantity };
        }
        return item;
      });
      localStorage.setItem('guest_cart_items', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      return;
    }

    // Logged in mode
    try {
      await API.put(`/cart/item/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) {
      // Guest mode
      const currentGuestCart = JSON.parse(localStorage.getItem('guest_cart_items') || '[]');
      const filteredCart = currentGuestCart.filter(item => item._id !== itemId);
      localStorage.setItem('guest_cart_items', JSON.stringify(filteredCart));
      setCartItems(filteredCart);
      toast.success('Item removed');
      return;
    }

    // Logged in mode
    try {
      await API.delete(`/cart/deleteFromCart/${itemId}`);
      toast.success('Item removed');
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Guest mode
      localStorage.removeItem('guest_cart_items');
      setCartItems([]);
      return;
    }

    // Logged in mode
    try {
      await API.delete('/cart/dltAllCart');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * item.quantity,
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

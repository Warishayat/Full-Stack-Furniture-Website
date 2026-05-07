import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await API.get('/wishlist/get');
      setWishlist(data.products || []);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.info('Please login to curate your wishlist');
      return;
    }
    try {
      const { data } = await API.post('/wishlist/toggle', { productId });
      if (data.added) {
        toast.success('Added to your curated selection');
      } else {
        toast.info('Removed from selection');
      }
      fetchWishlist();
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

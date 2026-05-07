import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, loading, toggleWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D7282F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Curations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Curated Selection</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-24">
        <div className="mb-16">
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Your Collection</span>
           <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 mb-4 tracking-tighter">The <span className="italic text-gray-400">Wishlist</span></h1>
           <p className="text-gray-600 text-lg font-medium leading-relaxed max-w-2xl">
              A private archive of your desired curations, waiting to be brought home.
           </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-32 text-center bg-[#F2EDE7] rounded-sm border border-gray-100">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-black text-gray-900 mb-2">Selection Empty</h3>
            <p className="text-gray-500 font-medium mb-10">You haven't curated any pieces yet.</p>
            <Link to="/products" className="px-10 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#D7282F] transition-all">
               Explore Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
            {wishlist.map((product) => {
              if (!product) return null;
              return (
                <div key={product._id} className="relative group">
                  <ProductCard product={product} />
                  <button 
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-4 left-4 z-20 p-2 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-500 hover:text-white"
                    title="Remove from selection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="mt-20 p-12 bg-gray-900 text-white rounded-sm flex flex-col md:flex-row items-center justify-between gap-10">
             <div>
                <h3 className="text-3xl font-serif font-black italic mb-2 tracking-tight">Ready to acquire?</h3>
                <p className="text-gray-400 font-medium">Your curated pieces are in stock and ready for immediate dispatch.</p>
             </div>
             <Link to="/cart" className="px-12 py-5 bg-[#D7282F] text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-gray-900 transition-all flex items-center gap-4">
                View Acquisition Bag <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

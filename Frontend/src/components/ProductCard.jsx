import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-700 ease-out flex flex-col h-full border border-primary-100">
      <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-primary-50">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x800?text=No+Image'}
          alt={product.title || product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute top-6 left-6">
          {product.stock <= 5 && product.stock > 0 ? (
             <span className="bg-rose-500 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
               Limited Stock
             </span>
          ) : (
             <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-primary-900 uppercase">4.9</span>
             </div>
          )}
        </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="mb-3">
           <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em]">Premium Selection</span>
        </div>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-2xl font-serif font-bold text-primary-950 mb-3 hover:text-rose-500 transition-colors line-clamp-1 leading-tight">
            {product.title || product.name}
          </h3>
        </Link>
        <p className="text-sm text-primary-700 mb-8 line-clamp-2 leading-relaxed font-medium">
          {product.description}
        </p>
        
        <div className="flex items-end justify-between mt-auto pt-6 border-t border-primary-100 gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] block text-primary-400 font-black uppercase tracking-[0.3em] mb-2">Investment</span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-2xl font-bold text-primary-950 leading-none">
                £{product.price?.toLocaleString() || '0'}
              </span>
              {product.oldprice && (
                <span className="text-xs font-bold text-primary-300 line-through decoration-rose-500/40">
                  £{product.oldprice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product._id, 1);
            }}
            className="w-12 h-12 rounded-xl bg-primary-950 flex items-center justify-center text-white hover:bg-rose-500 transition-all duration-500 shadow-xl shadow-primary-900/10 group-hover:shadow-rose-500/30 shrink-0"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5 stroke-[2px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

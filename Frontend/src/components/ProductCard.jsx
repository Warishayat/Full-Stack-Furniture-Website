import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const activeInWishlist = isInWishlist(product._id);

  // Calculate "Starting From" Price and extract unique colors
  const { minPrice, oldPrice, displayImage, allColors } = useMemo(() => {
    let min = Infinity;
    let old = 0;
    let img = product.images?.[0] || '';
    let colors = new Set();

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        if (variant.materials) {
          variant.materials.forEach(material => {
            if (material.colors) {
              material.colors.forEach(color => {
                if (color.price < min) {
                  min = color.price;
                  old = color.oldPrice || 0;
                  if (color.images && color.images.length > 0) {
                    img = color.images[0];
                  }
                }
                if (color.name) colors.add(color.name);
              });
            }
          });
        }
      });
    }

    return { 
      minPrice: min === Infinity ? (product.price || 0) : min, 
      oldPrice: old || (product.oldPrice || 0), 
      displayImage: img,
      allColors: Array.from(colors)
    };
  }, [product]);

  return (
    <div className="group bg-white overflow-hidden transition-all duration-300 flex flex-col h-full relative">
      {/* Sale Badge */}
      {oldPrice > minPrice && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#D7282F] text-white text-[10px] font-bold px-3 py-1 rounded-sm shadow-sm uppercase">
            £{(oldPrice - minPrice).toLocaleString()} OFF
          </span>
        </div>
      )}

      {/* Wishlist Heart */}
      <button 
        onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
        className={`absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors ${activeInWishlist ? 'text-[#D7282F]' : 'text-gray-400 hover:text-[#D7282F]'}`}
      >
        <Heart className={`w-5 h-5 ${activeInWishlist ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </Link>
      
      {/* Content Area */}
      <div className="pt-4 flex flex-col flex-1">
        {/* Real Color Swatches */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {allColors.slice(0, 5).map((color, i) => (
            <div 
              key={i} 
              title={color}
              className={`w-4 h-4 rounded-full border border-gray-200 cursor-pointer transition-transform hover:scale-110`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
          {allColors.length > 5 && (
            <span className="text-[10px] text-gray-400 font-bold ml-1">+{allColors.length - 5}</span>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="block mb-1">
          <h3 className="text-xl font-serif text-gray-900 hover:text-gray-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
          {product.variants?.[0]?.name || 'Premium'} Sofa in {allColors[0] || 'Selection'}
        </p>

        {/* Real Ratings */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(product.averageRating || 5) ? 'fill-current' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-bold">({product.numReviews || 0})</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-[#D7282F]">£{minPrice.toLocaleString()}</span>
            {oldPrice > minPrice && (
              <span className="text-sm text-gray-400 line-through font-medium italic">was £{oldPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#51823F]">
            <CheckCircle className="w-3 h-3" />
            <span>{product.specifications?.delivery?.time || 'In stock. Fast delivery.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;

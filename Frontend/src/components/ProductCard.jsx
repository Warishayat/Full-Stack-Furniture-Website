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
  const { minPrice, oldPrice, displayImage, allColors, defaultVariantName, defaultMaterialName } = useMemo(() => {
    let min = Infinity;
    let old = 0;
    let colors = new Map();
    let cheapestVariant = null;
    let variant2c2 = null;
    let variant3plus2 = null;

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        const vName = (variant.name || '').toLowerCase();
        if (vName.includes('2c2')) {
          variant2c2 = variant;
        } else if (vName.includes('3+2')) {
          variant3plus2 = variant;
        }

        if (variant.price < min) {
          min = variant.price;
          old = variant.oldPrice || 0;
          cheapestVariant = variant;
        }
        if (variant.materials) {
          variant.materials.forEach(material => {
            if (material.colors) {
              material.colors.forEach(color => {
                if (color.name) {
                  if (!colors.has(color.name) || (color.swatchImage && !colors.get(color.name).swatchImage)) {
                    colors.set(color.name, { name: color.name, swatchImage: color.swatchImage });
                  }
                }
              });
            }
          });
        }
      });
    }

    let defaultVariantName = '';
    let defaultMaterialName = '';
    let img = product.images?.[0] || '';

    // Priority: 2c2 -> 3+2 -> cheapestVariant
    const targetVariant = variant2c2 || variant3plus2 || cheapestVariant;

    if (targetVariant) {
      defaultVariantName = targetVariant.name || '';
      
      // Prioritize the target variant's image so it matches the name!
      if (targetVariant.images && targetVariant.images.length > 0) {
        img = targetVariant.images[0];
      }

      if (targetVariant.materials && targetVariant.materials.length > 0) {
        defaultMaterialName = targetVariant.materials[0].name || '';
      }
    }

    return { 
      minPrice: min === Infinity ? (product.price || 0) : min, 
      oldPrice: old || (product.oldPrice || 0), 
      displayImage: img || product.images?.[0] || '',
      allColors: Array.from(colors.values()),
      defaultVariantName,
      defaultMaterialName
    };
  }, [product]);

  const isVideo = (url) => {
    return url && (!!url.match(/\.(mp4|mov|webm|ogg)$/i) || url.includes('video/upload'));
  };

  return (
    <div className="group bg-white overflow-hidden transition-all duration-300 flex flex-col h-full relative">
      {oldPrice > minPrice && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gray-700 text-white text-[10px] font-bold px-3 py-1 rounded-sm shadow-sm uppercase">
            £{(oldPrice - minPrice).toLocaleString()} OFF
          </span>
        </div>
      )}

      {/* Wishlist Heart */}
      <button type="button" 
        onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
        className={`absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors ${activeInWishlist ? 'text-[#D7282F]' : 'text-gray-400 hover:text-[#D7282F]'}`}
      >
        <Heart className={`w-5 h-5 ${activeInWishlist ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center group">
        <img
          src={isVideo(displayImage) ? displayImage.replace(/\.(mp4|mov|webm|ogg)$/i, '.jpg') : displayImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain object-center mix-blend-multiply scale-125 origin-center group-hover:scale-[1.35] transition-transform duration-700"
        />
        {isVideo(displayImage) && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full z-10 flex items-center gap-1.5">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="text-[9px] text-white font-bold uppercase tracking-widest">Video</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </Link>
      
      {/* Content Area */}
      <div className="pt-4 flex flex-col flex-1">
        
        {/* Colors */}
        {allColors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            {allColors.slice(0, 5).map((color, idx) => (
              <Link 
                key={idx}
                to={`/product/${product._id}?color=${encodeURIComponent(color.name)}`}
                className="w-5 h-5 rounded-full border border-gray-300 overflow-hidden hover:border-[#D7282F] transition-colors"
                title={color.name}
              >
                {color.swatchImage ? (
                  <img src={color.swatchImage} alt={color.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </Link>
            ))}
            {allColors.length > 5 && (
              <span className="text-[10px] text-gray-500 font-medium ml-1">+{allColors.length - 5}</span>
            )}
          </div>
        )}

        <Link to={`/product/${product._id}`} className="block mb-1">
          <h3 className="text-xl font-serif text-gray-900 hover:text-gray-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {defaultVariantName ? `${product.title} ${defaultVariantName}, ${defaultMaterialName}` : product.category?.name || 'Luxury Collection'}
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
            <span className="text-2xl font-bold text-gray-700">£{minPrice.toLocaleString()}</span>
            {oldPrice > minPrice && (
              <span className="text-sm text-gray-500 line-through font-medium">was £{oldPrice.toLocaleString()}</span>
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

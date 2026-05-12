import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Check, ShieldCheck, Truck, ChevronDown, Info, Ruler, Star, CreditCard, Sparkles, Calendar, X, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [reviews, setReviews] = useState([]);

  const getEstimatedDeliveryRange = () => {
    const currentDate = new Date();
    
    // Start date (8 days from now)
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() + 8);
    
    // End date (10 days from now)
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 10);
    
    const options = { day: 'numeric', month: 'long' };
    const startStr = startDate.toLocaleDateString('en-GB', options); 
    const endStr = endDate.toLocaleDateString('en-GB', options);     
    
    return `${startStr} - ${endStr}`;
  };

  // Selection State
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedMaterialIdx, setSelectedMaterialIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [hoveredSwatchIdx, setHoveredSwatchIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.swatch-container')) {
        setHoveredSwatchIdx(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobile]);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get(`/product/getSingleProduct/${id}`);
        const p = data.product || data;
        setProduct(p);
        
        // Fetch Related Products (same category) - Wrapped in try/catch to prevent breaking main page
        if (p.category?._id) {
          try {
            const { data: relData } = await API.get('/product/getAllProducts', { 
              params: { category: p.category._id } 
            });
            setRelatedProducts((relData.products || []).filter(item => item._id !== id).slice(0, 8));
          } catch (relErr) {
            console.error('Related Products Fetch Error:', relErr);
          }
        }

        // Update Recently Viewed
        updateRecentlyViewed(p);
      } catch (err) {
        console.error('Product Fetch Error:', err);
        setError('The product is currently unavailable.');
        toast.error('Unable to retrieve product details');
      } finally {
        setLoading(false);
      }
    };

    const updateRecentlyViewed = (currentProduct) => {
      let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      // Calculate min price for storage
      let minPrice = currentProduct.price || 0;
      if (currentProduct.variants && currentProduct.variants.length > 0) {
        let min = Infinity;
        currentProduct.variants.forEach(v => {
          if (v.price < min) min = v.price;
        });
        if (min !== Infinity) minPrice = min;
      }

      viewed = viewed.filter(p => p._id !== currentProduct._id);
      viewed.unshift({
        _id: currentProduct._id,
        title: currentProduct.title,
        price: minPrice,
        oldprice: currentProduct.oldprice || 0,
        images: currentProduct.images
      });
      viewed = viewed.slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
      setRecentlyViewed(viewed.filter(p => p._id !== currentProduct._id));
    };

    if (id) fetchProductAndRelated();
  }, [id]);

  useEffect(() => {
    setSelectedVariantIdx(0);
    setSelectedMaterialIdx(0);
    setSelectedColorIdx(0);
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(viewed.filter(p => p?._id !== id));
  }, [id]);

  const currentVariant = product?.variants?.[selectedVariantIdx];
  const currentMaterial = currentVariant?.materials?.[selectedMaterialIdx];
  const currentColor = currentMaterial?.colors?.[selectedColorIdx];

  const currentPrice = currentVariant?.price || product?.price || 0;
  const currentOldPrice = currentVariant?.oldPrice || product?.oldprice || 0;
  const currentStock = currentVariant?.stock || 0;

  useEffect(() => {
    if (currentVariant?.images?.length > 0) {
      setActiveImage(currentVariant.images[0]);
    } else if (product?.images?.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product, currentVariant]);

  const getCategoryLabel = () => {
    if (!product) return 'Size';
    const catName = product.category?.name?.toLowerCase() || '';
    const title = product.title?.toLowerCase() || '';
    
    if (catName.includes('sofa') || title.includes('sofa')) return 'Sofa';
    if (catName.includes('bed') || title.includes('bed')) return 'Bed';
    if (catName.includes('dining') || catName.includes('dinning') || title.includes('dining') || title.includes('dinning')) return 'Dining Set';
    if (catName.includes('table') || title.includes('table')) return 'Table';
    if (catName.includes('chair') || title.includes('chair')) return 'Chair';
    
    if (product.category?.name) {
        return product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1);
    }
    
    return 'Product';
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity, {
        variant: currentVariant?.name,
        material: currentMaterial?.name,
        color: currentColor?.name,
        price: currentPrice,
        title: product.title,
        image: activeImage
      });
    }
  };

  if (loading) return (
    <div className="bg-white min-h-screen pt-28 lg:pt-36 animate-pulse">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Breadcrumbs skeleton */}
        <div className="h-3.5 bg-slate-100 rounded w-1/4 mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Gallery skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] bg-slate-100 rounded-sm" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-sm" />
              ))}
            </div>
          </div>
          
          {/* Info details skeleton */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="h-3 bg-slate-100 rounded w-1/6" />
              <div className="h-10 bg-slate-100 rounded w-4/5" />
              <div className="h-5 bg-slate-100 rounded w-1/3" />
            </div>
            
            <div className="h-28 bg-slate-100 rounded-sm w-full" />
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="h-8 bg-slate-100 rounded w-1/2" />
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-lg" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-16 bg-slate-100 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center pt-20">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">Product Not Found</h2>
      <button onClick={() => navigate('/products')} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all">Back to Products</button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-28 lg:pt-36">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 mb-8">
        <nav className="flex text-xs text-gray-500 gap-2 items-center">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>›</span>
          <Link to="/products" className="hover:text-gray-900">Sofas</Link>
          <span>›</span>
          <span className="text-gray-400 font-medium truncate">{product.title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left: Product Media */}
          <div className="lg:w-[60%] space-y-4">
            <div className="relative bg-white border border-gray-100 overflow-hidden">
               {/* Hot Sell Badge */}
               <div className="absolute top-4 left-0 z-10">
                  <span className="bg-[#D7282F] text-white text-[10px] font-bold px-4 py-1 uppercase shadow-sm">Hot Sell</span>
               </div>
               
               <img 
                 src={activeImage} 
                 alt={product.title} 
                 className="w-full h-auto object-contain aspect-square"
               />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
               {(currentVariant?.images?.length > 0 ? currentVariant.images : product?.images || []).map((img, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setActiveImage(img)}
                   className={`w-20 h-20 border-2 flex-shrink-0 transition-all ${
                     activeImage === img ? 'border-[#D7282F]' : 'border-gray-50 opacity-80 hover:opacity-100 hover:border-gray-200'
                   }`}
                 >
                   <img src={img} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          </div>

          {/* Right: Selection & Checkout */}
          <div className="lg:w-[40%] flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-serif text-gray-800 mb-2 leading-tight">
                {product.title}
              </h1>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                {product.description?.split('.')[0] || product.title} - {currentColor?.name || 'Premium'} finish.
              </p>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor((reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) || 5) ? 'fill-current' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l pl-3 border-gray-200">
                  {reviews.length} Reviews
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-bold text-[#D7282F]">£{currentPrice.toLocaleString()}</span>
                {currentOldPrice > currentPrice && (
                  <span className="text-lg text-gray-400 line-through font-medium italic">was £{currentOldPrice.toLocaleString()}</span>
                )}
                <span className="bg-[#D7282F] text-white text-[10px] font-bold px-2 py-0.5 ml-2 uppercase">SAVE</span>
              </div>

              <div className="text-sm font-bold text-[#D7282F] underline underline-offset-4 mb-8 flex items-center gap-2 cursor-pointer">
                 <CreditCard className="w-4 h-4" /> Interest Free Credit From £99.00 / mo
              </div>

              {/* Selection Sections */}
              <div className="space-y-8 border-t border-gray-100 pt-8">
                {product.variants?.length > 1 && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900 flex justify-between">
                       <span>{getCategoryLabel()} size: <span className="text-gray-400 font-medium">{currentVariant?.name}</span></span>
                       <span 
                         onClick={() => {
                           setIsSizeGuideOpen(true);
                           setZoomScale(1);
                         }}
                         className="text-xs font-extrabold text-[#D7282F] uppercase tracking-widest cursor-pointer hover:text-gray-900 underline underline-offset-4 decoration-2 transition-colors"
                       >
                         Size guide
                       </span>
                    </label>
                    <div className="relative">
                      <select 
                        value={selectedVariantIdx}
                        onChange={(e) => { setSelectedVariantIdx(parseInt(e.target.value)); setSelectedMaterialIdx(0); setSelectedColorIdx(0); }}
                        className="w-full border border-gray-200 py-3 px-4 text-sm font-medium focus:border-gray-400 outline-none appearance-none rounded-sm"
                      >
                        {product.variants.map((v, i) => (
                          <option key={i} value={i}>{v.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {currentVariant?.materials?.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">
                       Material: <span className="text-gray-400 font-medium">{currentMaterial?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {currentVariant.materials.map((m, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setSelectedMaterialIdx(i); setSelectedColorIdx(0); }}
                          className={`px-4 py-2 border rounded-sm text-xs font-black uppercase tracking-widest transition-all ${
                            selectedMaterialIdx === i 
                              ? 'border-gray-900 bg-gray-900 text-white shadow-sm' 
                              : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-slate-50'
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentMaterial?.colors?.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-900">
                      Colour options: <span className="text-gray-400 font-medium">{currentColor?.name}</span>
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-8">
                      {currentMaterial.colors.map((c, i) => {
                        const isSelected = selectedColorIdx === i;
                        const swatchUrl = c.swatchImage;
                        const hasSwatch = !!swatchUrl;
                        
                        return (
                          <div 
                            key={i} 
                            className="flex flex-col items-center relative swatch-container"
                            onMouseEnter={() => !isMobile && setHoveredSwatchIdx(i)}
                            onMouseLeave={() => !isMobile && setHoveredSwatchIdx(null)}
                          >
                            {/* Animated Enlarged Preview Popup */}
                            <AnimatePresence>
                              {hoveredSwatchIdx === i && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  className="absolute bottom-full mb-3 z-30 bg-white p-2.5 rounded-xl border border-gray-100 shadow-xl flex flex-col items-center gap-1.5 pointer-events-none w-28"
                                >
                                  {hasSwatch ? (
                                    <img 
                                      src={swatchUrl} 
                                      alt={c.name} 
                                      className="w-16 h-16 object-cover rounded-lg border border-gray-50"
                                    />
                                  ) : (
                                    <div 
                                      className="w-16 h-16 rounded-lg border border-gray-100 shadow-inner" 
                                      style={{ backgroundColor: c.name.toLowerCase() === 'beige' ? '#f5f5dc' : c.name.toLowerCase() === 'grey' ? '#808080' : c.name.toLowerCase() === 'black' ? '#000000' : c.name.toLowerCase().replace(/ /g, '') }}
                                    />
                                  )}
                                  <span className="text-[10px] font-black uppercase text-gray-900 tracking-wider text-center line-clamp-1 w-full">{c.name}</span>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <motion.button 
                              type="button"
                              title={c.name}
                              onClick={() => {
                                setSelectedColorIdx(i);
                                if (isMobile) {
                                  setHoveredSwatchIdx(hoveredSwatchIdx === i ? null : i);
                                }
                              }}
                              whileHover={{ scale: 1.12 }}
                              whileTap={{ scale: 0.95 }}
                              className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all p-0.5 flex-shrink-0 shadow-sm relative ${
                                isSelected 
                                  ? 'border-gray-950 ring-2 ring-gray-950/20 ring-offset-1 scale-105' 
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              {hasSwatch ? (
                                <img 
                                  src={swatchUrl} 
                                  alt={c.name} 
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <div 
                                  className="w-full h-full rounded-md border border-gray-50 shadow-inner" 
                                  style={{ backgroundColor: c.name.toLowerCase() === 'beige' ? '#f5f5dc' : c.name.toLowerCase() === 'grey' ? '#808080' : c.name.toLowerCase() === 'black' ? '#000000' : c.name.toLowerCase().replace(/ /g, '') }} 
                                />
                              )}
                              
                              {isSelected && (
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-md">
                                  <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-md">
                                    <Check className="w-3.5 h-3.5 text-gray-900 stroke-[3]" />
                                  </div>
                                </div>
                              )}
                            </motion.button>
                            
                            <span className="text-[9px] text-center text-gray-500 mt-2 font-black uppercase tracking-wider line-clamp-1 w-16 leading-tight">
                              {c.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Checkout Block */}
              <div className="mt-10 p-6 bg-gray-50 border border-gray-100 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white border border-gray-200">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900"><Minus className="w-3 h-3" /></button>
                      <input type="text" readOnly value={quantity} className="w-8 text-center bg-transparent font-bold text-sm" />
                      <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900"><Plus className="w-3 h-3" /></button>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">In stock. Best price guarantee</p>
                 </div>

                 <button 
                   onClick={handleAddToCart}
                   className="w-full h-14 bg-[#51823F] text-white font-bold hover:bg-[#457036] transition-all flex items-center justify-center gap-3 rounded-sm text-lg shadow-sm"
                 >
                   Add to Basket
                 </button>

                 <div className="grid grid-cols-2 gap-y-4 pt-2">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                        <Check className="w-3.5 h-3.5 text-[#51823F]" /> 0% APR AVAILABLE
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#51823F]" /> 15 YEAR GUARANTEE
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                        <Info className="w-3.5 h-3.5 text-[#51823F]" /> BEST PRICE GUARANTEE
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-[#D7282F]">
                        <Truck className="w-3.5 h-3.5 text-[#D7282F]" /> FREE DELIVERY
                     </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-sm border border-primary-100/50 flex items-center gap-4 animate-fade-in">
                     <div className="w-10 h-10 rounded-full bg-[#51823F]/10 flex items-center justify-center text-[#51823F] shrink-0 shadow-sm animate-pulse">
                        <Calendar className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Estimated Delivery</p>
                        <p className="text-gray-900 font-bold text-sm font-serif italic">{getEstimatedDeliveryRange()}</p>
                     </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Accordion */}
        <div className="mt-20 max-w-4xl border-t border-gray-100">
          {[
            { id: 'description', label: 'Description', content: product.description },
            { id: 'reviews', label: 'Reviews', content: <ReviewsSection productId={id} reviews={reviews} setReviews={setReviews} /> },
            { id: 'specifications', label: 'Specifications' },
            { id: 'dimensions', label: 'Dimensions' },
            { id: 'care', label: 'Care and assembly' },
            { id: 'delivery', label: 'Delivery' },
            { id: 'returns', label: 'Returns' },
          ].map((item) => (
            <div key={item.id} className="border-b border-gray-100">
              <button 
                onClick={() => setActiveAccordion(activeAccordion === item.id ? '' : item.id)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className={`text-xl font-serif transition-colors ${activeAccordion === item.id ? 'text-[#D7282F]' : 'text-gray-800 group-hover:text-gray-500'}`}>{item.label}</span>
                <Plus className={`w-5 h-5 transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-45 text-[#D7282F]' : 'text-gray-300'}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ${activeAccordion === item.id ? 'max-h-[2000px] pb-10' : 'max-h-0'}`}>
                <div className="text-gray-600 leading-relaxed text-sm">
                  {item.id === 'description' && (
                    <div className="space-y-6">
                       <p>{item.content || 'No description available for this piece.'}</p>
                    </div>
                  )}
                  {item.id === 'reviews' && item.content}
                  {item.id === 'specifications' && (
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                       <div><p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Primary Material</p><p className="text-gray-900 font-medium">{product.specifications?.general?.material || 'Hand-selected premium materials'}</p></div>
                       <div><p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Artisanal Finish</p><p className="text-gray-900 font-medium">{product.specifications?.general?.finish || 'Bespoke hand-finish'}</p></div>
                       <div><p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Heritage Warranty</p><p className="text-gray-900 font-medium">{product.specifications?.general?.warranty || '15 Year Structural Guarantee'}</p></div>
                       <div><p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Logistics Weight</p><p className="text-gray-900 font-medium">{product.specifications?.packaging?.boxWeight || 'N/A'}</p></div>
                    </div>
                  )}
                  {item.id === 'dimensions' && (
                    <div className="space-y-10">
                       <div className="grid grid-cols-3 gap-8">
                          <div>
                            <p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Width</p>
                            <p className="text-gray-900 text-xl font-serif font-black italic">
                              {currentVariant?.dimensions?.width || product.specifications?.dimensions?.width || '--'} {currentVariant?.dimensions?.unit || product.specifications?.dimensions?.unit || 'cm'}
                            </p>
                          </div>
                          <div>
                            <p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Height</p>
                            <p className="text-gray-900 text-xl font-serif font-black italic">
                              {currentVariant?.dimensions?.height || product.specifications?.dimensions?.height || '--'} {currentVariant?.dimensions?.unit || product.specifications?.dimensions?.unit || 'cm'}
                            </p>
                          </div>
                          <div>
                            <p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Depth</p>
                            <p className="text-gray-900 text-xl font-serif font-black italic">
                              {currentVariant?.dimensions?.length || product.specifications?.dimensions?.length || '--'} {currentVariant?.dimensions?.unit || product.specifications?.dimensions?.unit || 'cm'}
                            </p>
                          </div>
                       </div>
                       {(currentVariant?.dimensions?.sizeChart || product.specifications?.dimensions?.sizeChart) && (
                         <div className="mt-10 border border-gray-100 p-8 bg-gray-50/50">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-[0.4em]">Technical Blueprint</p>
                            <img src={currentVariant?.dimensions?.sizeChart || product.specifications.dimensions.sizeChart} alt="Size Chart" className="max-w-xl mx-auto mix-blend-multiply" />
                         </div>
                       )}
                    </div>
                  )}
                  {item.id === 'care' && (
                    <div className="space-y-8">
                       <div>
                          <p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Preservation Guide</p>
                          <p className="text-gray-900 leading-loose">{product.specifications?.care?.instructions || 'Avoid direct sunlight and use specialized cleaners for premium materials.'}</p>
                       </div>
                       {product.specifications?.assembly?.required !== undefined && (
                         <div>
                            <p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Assembly Architecture</p>
                            <p className="text-gray-900 font-bold mb-2">{product.specifications.assembly.required ? 'Professional Assembly Recommended' : 'Delivered Fully Assembled'}</p>
                            <p className="text-gray-600">{product.specifications.assembly.details}</p>
                         </div>
                       )}
                    </div>
                  )}
                  {item.id === 'delivery' && (
                    <div className="space-y-8">
                       <div className="flex flex-col md:flex-row gap-12">
                          <div className="flex-1">
                             <p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Lead Time</p>
                             <p className="text-gray-900 text-3xl font-serif font-black italic">{getEstimatedDeliveryRange()}</p>
                             <p className="text-xs text-gray-400 mt-2">Calculated dynamically based on standard white-glove shipping queue.</p>
                          </div>
                          <div className="flex-1">
                             <p className="font-black uppercase text-[10px] text-gray-400 mb-2 tracking-widest">Service Level</p>
                             <p className="text-gray-900 font-bold">{product.specifications?.delivery?.charges || 'White-Glove UK Mainland Delivery'}</p>
                          </div>
                       </div>
                    </div>
                  )}
                  {item.id === 'returns' && (
                    <div className="space-y-6">
                       <p className="text-gray-900 leading-loose">{product.specifications?.returns?.policy || 'We offer a standard 14-day hassle-free return policy for all signature pieces. Items must be in original condition with all documentation.'}</p>
                       <Link to={product.specifications?.returns?.link || "/returns-policy"} className="text-[10px] font-black text-[#D7282F] uppercase tracking-[0.3em] border-b border-[#D7282F] pb-1 hover:text-gray-900 hover:border-gray-900 transition-all block w-fit">View Full Protocol</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Sliders Section */}
        <div className="mt-32 space-y-24">
           {relatedProducts.length > 0 && (
             <SectionSlider title="Shop the collection" products={relatedProducts} />
           )}
           {relatedProducts.length > 0 && (
             <SectionSlider title="You may also like" products={[...relatedProducts].reverse()} />
           )}
           {recentlyViewed.length > 0 && (
             <SectionSlider title="Recently viewed" products={recentlyViewed} />
           )}
        </div>
      </div>

      {/* Newsletter Block */}
      <div className="bg-[#F2EDE7] py-20">
         <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
               <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6">JOIN US</h2>
               <p className="text-gray-600 mb-10 text-lg leading-relaxed">Sign up to our newsletter for exclusive offers and interior inspiration.</p>
               <div className="flex gap-2">
                  <input type="email" placeholder="Your email address" className="flex-1 px-6 py-4 border-none outline-none text-sm rounded-sm" />
                  <button className="px-10 py-4 bg-gray-800 text-white font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-gray-700 transition-all">Join</button>
               </div>
            </div>
            <div className="w-full md:w-[45%] aspect-[16/9] bg-gray-200 relative overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Interior" />
            </div>
         </div>
      </div>

       {/* Size Guide Lightbox Modal */}
       <AnimatePresence>
         {isSizeGuideOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
             onClick={() => setIsSizeGuideOpen(false)}
           >
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               transition={{ type: 'spring', duration: 0.4 }}
               className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
               onClick={(e) => e.stopPropagation()}
             >
               {/* Header */}
               <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                 <div>
                   <h3 className="text-lg font-serif font-black text-gray-900 uppercase tracking-wider">
                     {product?.title} - Size Guide
                   </h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                     Interactive technical blueprint drawing
                   </p>
                 </div>
                 <div className="flex items-center gap-2">
                   {/* Zoom Controls */}
                   <button
                     onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 3))}
                     disabled={zoomScale >= 3}
                     className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                     title="Zoom In"
                   >
                     <ZoomIn className="w-5 h-5" />
                   </button>
                   <button
                     onClick={() => setZoomScale(prev => Math.max(prev - 0.25, 1))}
                     disabled={zoomScale <= 1}
                     className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                     title="Zoom Out"
                   >
                     <ZoomOut className="w-5 h-5" />
                   </button>
                   <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
                   <button
                     onClick={() => setIsSizeGuideOpen(false)}
                     className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all"
                     title="Close"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
               </div>

               {/* Blueprint Image Content Area */}
               <div className="flex-1 overflow-auto p-8 flex items-center justify-center min-h-[350px] bg-slate-50/30 relative">
                 {(currentVariant?.dimensions?.sizeChart || product?.specifications?.dimensions?.sizeChart || product?.images?.[0]) ? (
                   <div 
                     className="transition-all duration-300 ease-out select-none relative"
                     style={{ 
                       transform: `scale(${zoomScale})`, 
                       cursor: zoomScale > 1 ? 'zoom-out' : 'zoom-in',
                       transformOrigin: 'center center'
                     }}
                     onClick={() => {
                       if (zoomScale > 1) {
                         setZoomScale(1);
                       } else {
                         setZoomScale(2);
                       }
                     }}
                   >
                     <img
                       src={currentVariant?.dimensions?.sizeChart || product?.specifications?.dimensions?.sizeChart || product?.images?.[0]}
                       alt="Size Chart Drawing"
                       className="max-h-[60vh] max-w-full object-contain mx-auto mix-blend-multiply transition-shadow duration-300"
                       style={{
                         boxShadow: zoomScale > 1 ? '0 10px 30px rgba(0,0,0,0.08)' : 'none'
                       }}
                     />
                   </div>
                 ) : (
                   <div className="text-center space-y-4">
                     <Ruler className="w-12 h-12 text-gray-300 mx-auto animate-pulse" />
                     <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                       Technical drawing is being compiled by our artisans.
                     </p>
                   </div>
                 )}
               </div>

               {/* Footer status / help */}
               <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 text-center">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                   {zoomScale > 1 ? "Drag or scroll to pan. Click drawing to reset zoom." : "Click drawing to zoom 2x."} Current Zoom: {Math.round(zoomScale * 100)}%
                 </p>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

    </div>
  );
};

const SectionSlider = ({ title, products = [] }) => (
  <div>
    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
      <h3 className="text-3xl font-serif text-gray-800">{title}</h3>
      <div className="flex gap-2">
        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all"><ArrowLeft className="w-4 h-4" /></button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all rotate-180"><ArrowLeft className="w-4 h-4" /></button>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
       {products.slice(0, 4).map((p, i) => (
         <Link to={`/product/${p._id}`} key={p._id} className="group space-y-4 cursor-pointer">
            <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
               {p.oldprice > p.price && (
                 <div className="absolute top-4 left-4 z-10 bg-[#D7282F] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">Sale</div>
               )}
               <img 
                 src={p.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                 alt={p.title} 
               />
            </div>
            <div>
               <h4 className="text-sm font-serif text-gray-800 group-hover:text-[#D7282F] transition-colors line-clamp-1">{p.title}</h4>
               <div className="flex items-center gap-2 mt-1">
                 <p className="text-xs font-bold text-[#D7282F]">£{(p.price || 0).toLocaleString()}</p>
                 {p.oldprice > p.price && (
                   <p className="text-[10px] text-gray-400 line-through font-normal">£{p.oldprice?.toLocaleString()}</p>
                 )}
               </div>
            </div>
         </Link>
       ))}
    </div>
  </div>
);

const ReviewsSection = ({ productId, reviews = [], setReviews }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/review/product/${productId}`);
      setReviews(data.reviews || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to leave a review'); return; }
    try {
      setSubmitting(true);
      await API.post('/review', { productId, rating, comment });
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-16 py-8">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left/Top: Review Form */}
        <div className="lg:w-2/5">
          <div className="bg-[#F2EDE7]/50 p-10 border border-gray-100 rounded-sm">
            <h3 className="text-2xl font-serif text-gray-900 mb-2">Write a Review</h3>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-8">Share your expertise with our community</p>

            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Rating</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setRating(s)} 
                        className={`transition-all ${rating >= s ? 'text-[#D7282F]' : 'text-gray-200 hover:text-red-200'}`}
                      >
                        <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Observations</p>
                  <textarea 
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                    placeholder="Describe the craftsmanship, comfort, and aesthetic impact..."
                    className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-[#D7282F] outline-none resize-none min-h-[120px]"
                    required
                  />
                </div>

                <button 
                  disabled={submitting} 
                  type="submit" 
                  className="w-full py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D7282F] transition-all"
                >
                  {submitting ? 'Authenticating...' : 'Publish Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-10 bg-white border border-gray-100">
                 <p className="text-sm text-gray-500 mb-6 font-medium">Please sign in to provide a patron review.</p>
                 <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-[#D7282F] hover:underline">Sign In Now</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Review List */}
        <div className="lg:w-3/5">
          <div className="flex items-baseline gap-4 mb-10">
             <h3 className="text-4xl font-serif text-gray-900 italic">Patron Gallery</h3>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l pl-4 border-gray-200">{reviews.length} Contributions</span>
          </div>

          {loading ? (
             <div className="space-y-8">
                {[1, 2].map(i => <div key={i} className="h-32 bg-gray-50 animate-pulse border border-gray-100" />)}
             </div>
          ) : reviews.length > 0 ? (
             <div className="space-y-10">
                {[...reviews].reverse().map((r, i) => (
                   <div key={i} className="group border-b border-gray-50 pb-10 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#F2EDE7] text-[#D7282F] flex items-center justify-center font-black text-xs">
                               {r.userId?.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                               <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{r.userId?.name || 'Verified Patron'}</h4>
                               <p className="text-[9px] text-[#51823F] font-black uppercase tracking-tighter">Authenticated Purchase</p>
                            </div>
                         </div>
                         <span className="text-[9px] text-gray-400 font-bold">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-1 mb-4 text-[#D7282F]">
                         {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-gray-100'}`} />)}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed italic font-medium">
                         "{r.comment}"
                      </p>
                   </div>
                ))}
             </div>
          ) : (
             <div className="py-20 text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
                <Sparkles className="w-10 h-10 text-gray-100 mb-4" />
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">No reviews yet for this masterpiece.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Check, ShieldCheck, Truck, ChevronDown, CreditCard, Box, HelpCircle } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [activeAccordion, setActiveAccordion] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching piece with ID:', id);
        const { data } = await API.get(`/product/getSingleProduct/${id}`);
        console.log('Piece Data Received:', data);
        const p = data.product || data;
        setProduct(p);
        if (p.images && p.images.length > 0) {
          setActiveImage(p.images[0]);
        }
      } catch (err) {
        console.error('Masterpiece Fetch Error:', err);
        setError(err.response?.data?.message || 'The requested piece is currently unavailable.');
        toast.error('Unable to retrieve this piece');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (product) {
      addToCart(product._id, quantity);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.info('Please login to continue to checkout');
      navigate('/login');
      return;
    }
    if (product) {
      await addToCart(product._id, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] gap-6">
        <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] animate-pulse">Awaiting Masterpiece...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-8 text-center">
        <h2 className="text-5xl font-serif font-black text-white mb-8 uppercase tracking-widest italic">Lost in Curation</h2>
        <p className="text-white/40 text-sm mb-12 max-w-md leading-relaxed">
          {error || 'The piece you are looking for has been moved or is currently unavailable in our luxury collection.'}
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="px-12 py-5 bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen pt-24 lg:pt-32 pb-24 lg:pb-32">
      <div className="container mx-auto px-4 lg:px-12">
        
        <button 
          onClick={() => navigate(-1)} 
          className="group inline-flex items-center text-primary-400 hover:text-accent mb-12 transition-all font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
          Back to Collection
        </button>

        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-primary-900/5 border border-primary-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Image Gallery */}
            <div className="p-8 lg:p-16 bg-primary-50/50 flex flex-col">
              <div className="relative w-full aspect-square mb-10 overflow-hidden rounded-[2rem] bg-white shadow-inner flex items-center justify-center p-8 group">
                <img 
                  src={activeImage || 'https://placehold.co/800x800?text=No+Image'} 
                  alt={product.title || product.name} 
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 right-6">
                  <span className="bg-white/80 backdrop-blur-md text-primary-950 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                    In Stock
                  </span>
                </div>
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-5 overflow-x-auto pb-4 justify-center">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 p-1 bg-white ${
                        activeImage === img ? 'border-accent shadow-lg shadow-accent/20' : 'border-transparent opacity-50 hover:opacity-100 hover:border-primary-200'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-xl" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-20 flex flex-col justify-center">
              <div className="mb-6">
                {product.category && (
                  <span className="text-xs font-bold text-accent mb-4 uppercase tracking-[0.4em] block animate-fade-in">
                    {product.category.name || 'Signature Collection'}
                  </span>
                )}
                <h1 className="text-4xl lg:text-6xl font-serif font-bold text-primary-950 mb-6 leading-tight animate-fade-in-up">
                  {product.title || product.name}
                </h1>
                <div className="flex flex-col gap-4 mb-10 animate-fade-in-up delay-100">
                  <div className="flex items-center gap-6">
                    <div className="bg-primary-50 px-6 py-2 rounded-2xl border border-primary-100 shadow-sm flex items-baseline gap-3">
                      <span className="text-3xl lg:text-4xl font-bold text-primary-950">
                        £{product.price ? product.price.toLocaleString() : '0'}
                      </span>
                      {product.oldprice && (
                        <span className="text-lg font-bold text-primary-300 line-through decoration-accent/50">
                          £{product.oldprice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-primary-300 text-[10px] font-bold uppercase tracking-widest">Incl. VAT & Insurance</span>
                  </div>

                  {/* Clearpay Installments */}
                  <div className="flex items-center gap-4 bg-white border border-primary-100 rounded-2xl p-5 shadow-sm max-w-sm group hover:border-accent transition-all duration-500">
                    <div className="w-12 h-12 bg-[#B2FCE4] rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                       <span className="text-[#000000] font-black text-[9px] uppercase tracking-tighter text-center leading-none">Clear<br/>pay</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest leading-tight">
                        Interest-Free Installments
                      </p>
                      <p className="text-[13px] font-black text-primary-950 mt-1">
                        4 payments of <span className="text-accent italic">£{(product.price / 4).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Available Finishes (Colors) - Restored */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="mb-10 animate-fade-in-up delay-150">
                  <label className="text-[10px] font-black text-primary-950 uppercase tracking-[0.3em] block mb-5">Available Finishes</label>
                  <div className="flex flex-wrap gap-4">
                    {product.colors.map((color, idx) => (
                      <div key={idx} className="group relative">
                        <div className="w-12 h-12 rounded-full border-2 border-primary-100 shadow-sm hover:border-accent hover:scale-110 transition-all cursor-pointer bg-white flex items-center justify-center p-1">
                          <div 
                            className="w-full h-full rounded-full shadow-inner" 
                            style={{ backgroundColor: typeof color === 'string' ? color.toLowerCase().replace(/\s+/g, '') : '#ccc' }}
                          ></div>
                        </div>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-primary-950 text-white text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20 pointer-events-none whitespace-nowrap shadow-xl">
                          {String(color)}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-950 rotate-45"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Interactive Information Accordion */}
              <div className="mb-12 space-y-4 animate-fade-in-up delay-200">
                {/* Description Section */}
                <div className="border-b border-primary-50 pb-4">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === 'description' ? '' : 'description')}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeAccordion === 'description' ? 'bg-accent text-white' : 'bg-primary-50 text-primary-400'}`}>
                        <Box className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-950">Description</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary-300 transition-transform duration-500 ${activeAccordion === 'description' ? 'rotate-180 text-accent' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === 'description' ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-14 pr-4">
                      <p className="text-primary-500 leading-relaxed italic border-l-2 border-accent/20 pl-6">
                        "{product.description || 'This exquisite piece is a testament to timeless design and unparalleled craftsmanship.'}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specifications Section */}
                <div className="border-b border-primary-50 pb-4">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === 'specs' ? '' : 'specs')}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeAccordion === 'specs' ? 'bg-accent text-white' : 'bg-primary-50 text-primary-400'}`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-950">Technical Specifications</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary-300 transition-transform duration-500 ${activeAccordion === 'specs' ? 'rotate-180 text-accent' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === 'specs' ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-14 pr-4 space-y-8">
                      {/* Composition */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-50 hover:border-accent/20 transition-colors">
                          <p className="text-[8px] font-black text-primary-400 uppercase tracking-widest mb-4">Material & Finish</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-1">
                               <p className="text-[8px] font-bold text-primary-300 uppercase tracking-widest">Material</p>
                               <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest">{product.specifications?.general?.material || 'Hand-picked Timber'}</p>
                             </div>
                             <div className="space-y-1">
                               <p className="text-[8px] font-bold text-primary-300 uppercase tracking-widest">Finish</p>
                               <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest">{product.specifications?.general?.finish || 'Premium Varnish'}</p>
                             </div>
                          </div>
                        </div>
                        
                        <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-50 hover:border-accent/20 transition-colors">
                          <p className="text-[8px] font-black text-primary-400 uppercase tracking-widest mb-4">Scale & Protection</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-1">
                               <p className="text-[8px] font-bold text-primary-300 uppercase tracking-widest">L × W × H ({product.specifications?.dimensions?.unit || 'cm'})</p>
                               <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest">
                                 {product.specifications?.dimensions?.length || 0} × {product.specifications?.dimensions?.width || 0} × {product.specifications?.dimensions?.height || 0}
                               </p>
                             </div>
                             <div className="space-y-1">
                               <p className="text-[8px] font-bold text-primary-300 uppercase tracking-widest">Warranty</p>
                               <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest">{product.specifications?.general?.warranty || 'Lifetime Structural'}</p>
                             </div>
                          </div>
                        </div>
                      </div>

                      {/* Packaging & Logistics */}
                      <div className="bg-primary-50/50 p-6 rounded-3xl border border-primary-50">
                        <h5 className="text-[9px] font-black text-primary-950 uppercase tracking-[0.2em] mb-4 border-b border-primary-100 pb-2">Packaging & Logistics</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div>
                              <p className="text-[8px] font-black text-primary-400 uppercase tracking-widest mb-1">Package Weight</p>
                              <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest">{product.specifications?.packaging?.boxWeight || 'Calculated at checkout'}</p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-primary-400 uppercase tracking-widest mb-1">Packaging Details</p>
                              <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest">{product.specifications?.packaging?.packagingDetails || 'Secure transit-safe crates'}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery & Assembly */}
                <div className="border-b border-primary-50 pb-4">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === 'delivery' ? '' : 'delivery')}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeAccordion === 'delivery' ? 'bg-accent text-white' : 'bg-primary-50 text-primary-400'}`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-950">Delivery & Assembly</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary-300 transition-transform duration-500 ${activeAccordion === 'delivery' ? 'rotate-180 text-accent' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === 'delivery' ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-14 pr-4">
                      <div className="bg-primary-50/50 p-6 rounded-2xl space-y-4 border border-primary-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div>
                              <p className="text-[8px] font-black text-primary-400 uppercase tracking-widest mb-1">Est. Delivery Time</p>
                              <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest">{product.specifications?.delivery?.time || '7-14 Business Days'}</p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-primary-400 uppercase tracking-widest mb-1">Delivery Charges</p>
                              <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest">{product.specifications?.delivery?.charges || 'Complimentary White-Glove'}</p>
                           </div>
                        </div>
                        <div className="pt-4 border-t border-primary-100">
                          <div className="flex items-start gap-4">
                             <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                             <div>
                                <p className="text-[10px] font-black text-primary-950 uppercase tracking-widest mb-1">Assembly Details</p>
                                <p className="text-[10px] text-primary-500 italic leading-relaxed">
                                   {product.specifications?.assembly?.details || (product.specifications?.assembly?.required ? 'Our professional team will handle the full assembly and installation of your piece upon arrival.' : 'This piece is delivered fully assembled and ready for immediate use.')}
                                </p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Care Instructions */}
                <div className="pb-4">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeAccordion === 'care' ? 'bg-accent text-white' : 'bg-primary-50 text-primary-400'}`}>
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-950">Care & Maintenance</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary-300 transition-transform duration-500 ${activeAccordion === 'care' ? 'rotate-180 text-accent' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === 'care' ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-14 pr-4">
                      <div className="bg-primary-50/50 p-6 rounded-2xl">
                        <p className="text-[10px] text-primary-600 italic leading-relaxed">
                          "{product.specifications?.care?.instructions || 'Dust regularly with a soft, dry cloth. Avoid direct sunlight and heat sources to preserve the natural beauty of the materials.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection & Actions */}
              <div className="space-y-8 mb-12">
                <div>
                  <label className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block mb-4">Select Quantity</label>
                  <div className="inline-flex items-center bg-primary-50 rounded-full p-1.5 border border-primary-100">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-primary-950 hover:bg-white hover:shadow-md rounded-full transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-bold text-lg text-primary-950">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-primary-950 hover:bg-white hover:shadow-md rounded-full transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <button 
                    onClick={handleAddToCart}
                    className="flex items-center justify-center px-8 h-20 bg-white border-2 border-primary-950 text-primary-950 font-bold rounded-full hover:bg-primary-950 hover:text-white transition-all duration-500 text-[10px] uppercase tracking-[0.2em] group"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Add to Curation
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex items-center justify-center px-8 h-20 bg-primary-950 text-white font-bold rounded-full hover:bg-accent transition-all duration-500 shadow-xl shadow-primary-950/20 text-[10px] uppercase tracking-[0.2em] group"
                  >
                    <CreditCard className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Buy It Now
                  </button>
                </div>
              </div>

              {/* Luxury Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-primary-50 pt-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0 text-accent">
                    <Truck className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-950 text-xs uppercase tracking-widest">White-Glove Delivery</h4>
                    <p className="text-[10px] text-primary-400 mt-1 uppercase tracking-wider">Professional assembly included</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0 text-accent">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-950 text-xs uppercase tracking-widest">Lifetime Warranty</h4>
                    <p className="text-[10px] text-primary-400 mt-1 uppercase tracking-wider">Structural integrity guaranteed</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection productId={id} />
      </div>
    </div>
  );
};

const ReviewsSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/review/product/${productId}`);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to leave a review');
      return;
    }

    try {
      setSubmitting(true);
      await API.post('/review', { productId, rating, comment });
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-24">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Review Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-primary-900/5 border border-primary-50 sticky top-32">
            <h3 className="text-2xl font-serif font-bold text-primary-950 mb-8">Share Your <span className="italic text-accent">Experience</span></h3>
            
            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-primary-950 uppercase tracking-widest block mb-4">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 transition-all ${rating >= star ? 'text-accent' : 'text-primary-100'}`}
                      >
                        <StarIcon filled={rating >= star} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-primary-950 uppercase tracking-widest block mb-4">Your Thoughts</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-6 py-4 bg-primary-50 border border-primary-100 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all resize-none placeholder:text-primary-300 min-h-[120px]"
                    placeholder="Tell us about the craftsmanship..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-primary-950 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-accent transition-all shadow-xl shadow-primary-950/20 disabled:opacity-70"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <p className="text-primary-400 text-sm mb-6">Please login to share your thoughts on this masterpiece.</p>
                <Link to="/login" className="inline-block px-10 py-4 bg-primary-950 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-accent transition-all">
                  Join EliteSeating
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:w-2/3">
          <div className="mb-10">
            <h3 className="text-3xl font-serif font-bold text-primary-950 mb-2">Curated <span className="italic text-accent">Feedback</span></h3>
            <p className="text-primary-400 text-sm uppercase tracking-widest font-bold">{reviews.length} Verified Owners</p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map(i => <div key={i} className="bg-white h-40 rounded-[2rem] animate-pulse shadow-sm"></div>)}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-primary-900/5 border border-primary-50 animate-fade-in-up">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent font-serif font-bold text-xl">
                        {review.userId?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-950 text-sm uppercase tracking-widest">{review.userId?.name || 'Anonymous User'}</h4>
                        <p className="text-[10px] text-primary-300 font-bold uppercase tracking-widest mt-1">Verified Purchase</p>
                      </div>
                    </div>
                    <div className="flex gap-1 text-accent">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} filled={i < review.rating} size={14} />
                      ))}
                    </div>
                  </div>
                  <p className="text-primary-600 leading-relaxed italic border-l-2 border-accent/20 pl-6">"{review.comment}"</p>
                  <p className="text-[9px] text-primary-300 font-bold uppercase tracking-widest mt-6 text-right">
                    {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[3rem] border border-dashed border-primary-200 text-center">
              <p className="text-primary-400 text-sm uppercase tracking-widest font-bold">Be the first to review this masterpiece.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StarIcon = ({ filled, size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProductDetail;

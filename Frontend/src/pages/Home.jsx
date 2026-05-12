import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Star, Play, Award, Zap, Sparkles, ChevronLeft, ChevronRight, Crown, Plus, Minus } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Hero from '../components/Hero';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [ratingData, setRatingData] = useState({ averageRating: 4.6, totalReviews: 30069 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes, reviewRes, overallRes] = await Promise.all([
          API.get('/category/getallCategories'),
          API.get('/product/getAllProducts', { params: { limit: 100 } }),
          API.get('/review/all-reviews'),
          API.get('/review/overall').catch(() => ({ data: { success: false } }))
        ]);
        
        setCategories(catRes.data.categories || catRes.data || []);
        const prodData = prodRes.data.products || prodRes.data || [];
        setFeaturedProducts(prodData);
        setReviews(reviewRes.data.reviews || []);

        if (overallRes?.data?.success) {
          const dbRating = overallRes.data.averageRating || 0;
          const dbCount = overallRes.data.totalReviews || 0;
          if (dbCount > 0) {
            const blendedRating = ((30069 * 4.6) + (dbCount * dbRating)) / (30069 + dbCount);
            setRatingData({
              averageRating: parseFloat(blendedRating.toFixed(1)),
              totalReviews: 30069 + dbCount
            });
          }
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % (reviews.length || 1));
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + (reviews.length || 1)) % (reviews.length || 1));

  const sofaProducts = featuredProducts.filter(p => {
    const catName = p.category?.name || p.category?.title || p.category?.slug || '';
    const title = p.title || '';
    const categoryId = p.category?._id || p.category || '';
    
    const catObj = categories.find(c => c._id === categoryId);
    const parentId = catObj?.parent?._id || catObj?.parent || '';
    const parentObj = parentId ? categories.find(c => c._id === parentId) : null;
    
    const isSofaCategory = 
      catName.toLowerCase().includes('sofa') || 
      (catObj?.slug || '').toLowerCase().includes('sofa') ||
      (parentObj?.name || '').toLowerCase().includes('sofa') ||
      (parentObj?.slug || '').toLowerCase().includes('sofa');

    return isSofaCategory || title.toLowerCase().includes('sofa');
  });

  const diningProducts = featuredProducts.filter(p => {
    const catName = p.category?.name || p.category?.title || p.category?.slug || '';
    const title = p.title || '';
    const categoryId = p.category?._id || p.category || '';
    
    const catObj = categories.find(c => c._id === categoryId);
    const parentId = catObj?.parent?._id || catObj?.parent || '';
    const parentObj = parentId ? categories.find(c => c._id === parentId) : null;
    
    const isDiningCategory = 
      catName.toLowerCase().includes('dining') || 
      catName.toLowerCase().includes('dinning') ||
      (catObj?.slug || '').toLowerCase().includes('dining') ||
      (catObj?.slug || '').toLowerCase().includes('dinning') ||
      (parentObj?.name || '').toLowerCase().includes('dining') ||
      (parentObj?.name || '').toLowerCase().includes('dinning') ||
      (parentObj?.slug || '').toLowerCase().includes('dining') ||
      (parentObj?.slug || '').toLowerCase().includes('dinning');

    return isDiningCategory || title.toLowerCase().includes('dining') || title.toLowerCase().includes('dinning');
  });

  const displaySofaProducts = sofaProducts;
  const displayDiningProducts = diningProducts;

  return (
    <div className="bg-white overflow-hidden pt-20 lg:pt-24">
      <Hero />



      {/* Premium Category Showcase Section */}
      <section className="py-24 bg-[#F2EDE7]/25 border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="text-[#D7282F] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                The Curated Archive
              </span>
              <h3 className="text-4xl md:text-5xl font-serif font-black text-gray-900 tracking-tighter">
                Shop by <span className="italic text-gray-400">Collection</span>
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest max-w-xs lg:text-right leading-relaxed">
              Explore our architectural series, handcrafted to define spaces and elevate environments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading ? (
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="aspect-[4/5] bg-slate-100 rounded-sm animate-pulse flex flex-col justify-end p-6 space-y-3">
                  <div className="h-4 bg-slate-200/60 rounded w-1/3" />
                  <div className="h-6 bg-slate-200/60 rounded w-2/3" />
                </div>
              ))
            ) : (
              categories.filter(cat => !cat.parent).map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Mobile-visible Premium Craftsmanship Heritage Banner */}
      <section className="lg:hidden py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Subtle luxury abstract glow background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D7282F]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="text-[#D7282F] font-black text-[9px] uppercase tracking-[0.5em] mb-4 block">
            Crafted for Royalty
          </span>
          <h3 className="text-3xl font-serif font-black text-white tracking-tight mb-4">
            Handcrafted In <span className="italic text-gray-400">Great Britain</span>
          </h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-sm mx-auto mb-8">
            Every EliteSeating piece is meticulously hand-carved and custom upholstered using heritage fabrics, sustainable hardwood frames, and premium cushioning for lifetime longevity.
          </p>
          
          {/* Key USPs styled beautifully */}
          <div className="grid grid-cols-3 gap-3 mb-10 max-w-sm mx-auto">
            <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm">
              <p className="text-sm font-black text-white mb-0.5">100%</p>
              <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Hardwood</p>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm">
              <p className="text-sm font-black text-[#D7282F] mb-0.5">25 Yr</p>
              <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Warranty</p>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm">
              <p className="text-sm font-black text-white mb-0.5">Bespoke</p>
              <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Finishes</p>
            </div>
          </div>

          <Link to="/about" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#D7282F] hover:text-white transition-all shadow-xl active:scale-95">
            Discover Our Story <ArrowRight className="w-4 h-4 text-[#D7282F]" />
          </Link>
        </div>
      </section>

      {/* Flash Sofa Sale Section */}
      <section className="py-32 bg-white hidden lg:block">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Large Banner */}
            <div className="lg:w-1/2 relative group overflow-hidden">
              <div className="aspect-[4/5] lg:aspect-[16/10] xl:aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2670&auto=format&fit=crop" 
                  alt="Flash Sofa Sale"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] mb-6">Seasonal Event</span>
                <h2 className="text-7xl md:text-9xl font-serif font-black mb-10 leading-[0.8] tracking-tighter">
                  Flash<br /><span className="italic text-gray-400">Sofa</span> Sale
                </h2>
                <Link to="/products?category=sofas" className="px-12 py-5 bg-white text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D7282F] hover:text-white transition-all shadow-2xl">
                  Explore The Collection
                </Link>
              </div>
              <div className="absolute inset-8 border border-white/20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
            </div>

            {/* Product Grid */}
            <div className="lg:w-1/2">
               <div className="mb-12">
                  <span className="text-[#D7282F] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Handcrafted Excellence</span>
                  <h3 className="text-4xl font-serif font-black text-gray-900 tracking-tighter">Featured <span className="italic text-gray-400">Masterpieces</span></h3>
               </div>
                <div className="grid grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
                  {loading ? (
                    [...Array(4)].map((_, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="aspect-[4/5] bg-slate-100 rounded-sm animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                          <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse" />
                        </div>
                      </div>
                    ))
                  ) : (
                    displaySofaProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  )}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Dining Sale Section */}
      <section className="py-32 bg-[#F2EDE7]/30 hidden lg:block">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-16 lg:gap-24">
            {/* Large Banner */}
            <div className="lg:w-1/2 relative group overflow-hidden">
              <div className="aspect-[4/5] lg:aspect-[16/10] xl:aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?q=80&w=2671&auto=format&fit=crop" 
                  alt="Flash Dining Sale"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] mb-6">Culinary Elegance</span>
                <h2 className="text-7xl md:text-9xl font-serif font-black mb-10 leading-[0.8] tracking-tighter">
                  Dining<br /><span className="italic text-gray-400">Affair</span>
                </h2>
                <Link to="/products?category=dining" className="px-12 py-5 bg-white text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D7282F] hover:text-white transition-all shadow-2xl">
                  Shop The Suite
                </Link>
              </div>
              <div className="absolute inset-8 border border-white/20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
            </div>

            {/* Product Grid */}
            <div className="lg:w-1/2">
               <div className="mb-12">
                  <span className="text-[#D7282F] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Exquisite Artistry</span>
                  <h3 className="text-4xl font-serif font-black text-gray-900 tracking-tighter">Luxury <span className="italic text-gray-400">Settings</span></h3>
               </div>
                <div className="grid grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
                  {loading ? (
                    [...Array(4)].map((_, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="aspect-[4/5] bg-slate-100 rounded-sm animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                          <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse" />
                        </div>
                      </div>
                    ))
                  ) : (
                    displayDiningProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  )}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Patron Narratives */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto mb-20">
            <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Verified Excellence</span>
            <h2 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 tracking-tighter leading-tight mb-8">
              What our patrons <br /><span className="italic text-gray-400">experience</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-center mb-24 p-10 bg-[#F2EDE7]/50 border border-gray-50 rounded-sm">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-serif font-black italic">Excellent</span>
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-10 h-10 flex items-center justify-center ${i < Math.round(ratingData.averageRating) ? 'bg-green-600' : 'bg-gray-200'} shadow-sm`}>
                    <span className="text-white text-xl">★</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Rated {ratingData.averageRating} / 5 based on {ratingData.totalReviews.toLocaleString()} reviews on <span className="text-gray-900 font-black italic underline decoration-[#D7282F]">★ Trustpilot</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.slice(0, 4).map((review, i) => (
              <div key={i} className="bg-white p-10 text-left border border-gray-100 hover:border-[#D7282F] transition-all group relative overflow-hidden">
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-green-600 flex items-center justify-center shadow-sm">
                      <span className="text-white text-[10px]">★</span>
                    </div>
                  ))}
                  <span className="ml-4 text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#D7282F]" /> Authenticated
                  </span>
                </div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{review.userId?.name || 'Private Patron'}</p>
                <p className="text-[9px] text-gray-400 mb-6 font-medium italic">Verified Acquisition</p>
                <p className="text-lg font-serif font-black text-gray-800 mb-4 tracking-tight line-clamp-1">"{review.comment.split(' ')[0]} Masterpiece"</p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-4 font-medium italic">
                  "{review.comment}"
                </p>
                <div className="absolute bottom-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                   <Crown className="w-6 h-6 text-[#D7282F]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Trust Bar - Executive Standards */}
      <section className="bg-white py-16 border-t border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center text-center">
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Global Logistics</p>
                <p className="text-[9px] font-bold text-gray-400 italic">White-Glove Delivery</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Elite Returns</p>
                <p className="text-[9px] font-bold text-gray-400 italic">14-Day Assurance</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Capital Strategy</p>
                <p className="text-[9px] font-bold text-gray-400 italic">0% APR Available</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Patron Rating</p>
                <p className="text-[9px] font-bold text-gray-400 italic">29,000+ Five-Star</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">British Lineage</p>
                <p className="text-[9px] font-bold text-gray-400 italic">Family Operated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke Showroom & FAQ Accordion Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="mb-16 text-center">
            <span className="text-[#D7282F] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
              Curator Assistance
            </span>
            <h3 className="text-3xl md:text-5xl font-serif font-black text-gray-900 tracking-tighter">
              Bespoke <span className="italic text-gray-400">Inquiries</span>
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is your typical delivery timeframe?",
                a: "Our standard premium white-glove shipping takes 7 to 14 working days. Our premier concierge logistics team will contact you directly to schedule a precise room-of-choice setup appointment and remove all packaging materials."
              },
              {
                q: "Can I customize the upholstery, sizing, or fabrics?",
                a: "Absolutely. We specialize in bespoke, hand-crafted master-tailoring. You can order complimentary fabric/leather swatches or customize details by contacting our London Concierge Desk directly."
              },
              {
                q: "What warranty do you offer on frames?",
                a: "Every single EliteSeating frame is backed by our signature 25-Year Quality Frame Guarantee, insuring your pieces against structural defects for generations to come."
              },
              {
                q: "Do you offer flexible financing?",
                a: "Yes, we support secure interest-free installments and premier credit terms during checkout, allowing you to invest in hand-crafted luxury with seamless flexibility."
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-gray-100 rounded-sm hover:border-gray-200 transition-colors bg-white overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left outline-none"
                  >
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-900 leading-snug">
                      {faq.q}
                    </span>
                    <span className="p-2 bg-gray-50 rounded-full text-gray-500 group-hover:text-gray-900 shrink-0 ml-4 transition-colors">
                      {isOpen ? <Minus className="w-3.5 h-3.5 text-[#D7282F]" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="p-6 pt-0 border-t border-gray-50 bg-[#F2EDE7]/10 animate-fade-in">
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

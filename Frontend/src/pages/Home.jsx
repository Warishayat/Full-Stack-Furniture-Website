import { useState, useEffect, useMemo } from 'react';
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
  const [ratingData, setRatingData] = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes, reviewRes, overallRes] = await Promise.all([
          API.get('/category/getallCategories'),
          API.get('/product/getAllProducts', { params: { limit: 100, lite: true } }),
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
          setRatingData({
            averageRating: parseFloat(dbRating.toFixed(1)),
            totalReviews: dbCount
          });
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

  const displaySofaProducts = useMemo(() => {
    return featuredProducts.filter(p => {
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
  }, [featuredProducts, categories]);

  const displaySofaBedProducts = useMemo(() => {
    return featuredProducts.filter(p => {
      const catName = p.category?.name || p.category?.title || p.category?.slug || '';
      const title = p.title || '';
      const categoryId = p.category?._id || p.category || '';
      
      const catObj = categories.find(c => c._id === categoryId);
      const parentId = catObj?.parent?._id || catObj?.parent || '';
      const parentObj = parentId ? categories.find(c => c._id === parentId) : null;
      
      const isSofaBedCategory = 
        catName.toLowerCase().includes('sofa bed') || 
        catName.toLowerCase().includes('sofa cum bed') ||
        (catObj?.slug || '').toLowerCase().includes('sofa-bed') ||
        (catObj?.slug || '').toLowerCase().includes('sofa-cum-bed') ||
        (parentObj?.name || '').toLowerCase().includes('sofa bed') ||
        (parentObj?.name || '').toLowerCase().includes('sofa cum bed') ||
        (parentObj?.slug || '').toLowerCase().includes('sofa-bed') ||
        (parentObj?.slug || '').toLowerCase().includes('sofa-cum-bed');

      return isSofaBedCategory || title.toLowerCase().includes('sofa bed') || title.toLowerCase().includes('sofa cum bed');
    });
  }, [featuredProducts, categories]);

  return (
    <div className="bg-white overflow-hidden pt-20 lg:pt-24">
      <Hero />



      {/* Premium Category Showcase Section */}
      <section className="py-24 bg-[#F2EDE7]/25 border-b border-gray-100">
        <div className="w-full px-4 lg:px-12">
          <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="text-[#D7282F] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                The Curated Archive
              </span>
              <h3 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 tracking-tighter">
                Shop by Collection
              </h3>
            </div>
            <p className="text-lg text-gray-500 font-medium max-w-xs lg:text-right leading-relaxed">
              Explore our architectural series, handcrafted to define spaces and elevate environments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading ? (
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="aspect-square bg-slate-100 rounded-sm animate-pulse flex flex-col justify-end p-6 space-y-3">
                  <div className="h-4 bg-slate-200/60 rounded w-1/3" />
                  <div className="h-6 bg-slate-200/60 rounded w-2/3" />
                </div>
              ))
            ) : (
              categories.filter(cat => !cat.parent && !['dinning sets', 'chairs', 'tables'].includes(cat.name.toLowerCase())).map((cat) => (
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

        <div className="w-full px-6 text-center relative z-10">
          <span className="text-[#D7282F] font-black text-[9px] uppercase tracking-[0.5em] mb-4 block">
            Crafted for Royalty
          </span>
          <h3 className="text-3xl font-serif font-medium text-white tracking-tight mb-4">
            Handcrafted In Great Britain
          </h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-sm mx-auto mb-8">
            Every EliteSeating piece is meticulously hand-carved and custom upholstered using heritage fabrics, sustainable hardwood frames, and premium cushioning for 2-year guaranteed longevity.
          </p>
          
          {/* Key USPs styled beautifully */}
          <div className="grid grid-cols-3 gap-3 mb-10 max-w-sm mx-auto">
            <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm">
              <p className="text-sm font-black text-white mb-0.5">100%</p>
              <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Hardwood</p>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm">
              <p className="text-sm font-black text-[#D7282F] mb-0.5">2 Yr</p>
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
      <section className="py-24 bg-white">
        <div className="w-full px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Large Banner */}
            <div className="lg:w-1/2 relative group overflow-hidden">
              <div className="aspect-[4/5] lg:aspect-[16/10] xl:aspect-[16/10] overflow-hidden">
                <img 
                  src="/FlashSofa.jpeg" 
                  alt="Flash Sofa Sale"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] mb-6">Seasonal Event</span>
                <h2 className="text-7xl md:text-9xl font-serif font-medium mb-10 leading-[0.8] tracking-tighter">
                  Flash<br />Sofa Sale
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
                  <h3 className="text-4xl font-serif font-medium text-gray-900 tracking-tighter">Featured Masterpieces</h3>
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

      {/* Sofa Cum Bed Section */}
      <section className="py-24 bg-[#F2EDE7]/30">
        <div className="w-full px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-16 lg:gap-24">
            {/* Large Banner */}
            <div className="lg:w-1/2 relative group overflow-hidden">
              <div className="aspect-[4/5] lg:aspect-[16/10] xl:aspect-[16/10] overflow-hidden">
                <img 
                  src="/SofaBed.jpeg" 
                  alt="Sofa Cum Bed Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] mb-6">Versatile Elegance</span>
                <h2 className="text-7xl md:text-9xl font-serif font-medium mb-10 leading-[0.8] tracking-tighter">
                  Sofa<br />Beds
                </h2>
                <Link to="/products?category=sofa-bed" className="px-12 py-5 bg-white text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D7282F] hover:text-white transition-all shadow-2xl">
                  Shop Sofa Beds
                </Link>
              </div>
              <div className="absolute inset-8 border border-white/20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
            </div>

            {/* Product Grid */}
            <div className="lg:w-1/2">
               <div className="mb-12">
                  <span className="text-[#D7282F] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Smart Living</span>
                  <h3 className="text-4xl font-serif font-medium text-gray-900 tracking-tighter">Sofa Cum Bed</h3>
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
                    displaySofaBedProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  )}
                </div>
            </div>
          </div>
        </div>
      </section>



      {/* Trustpilot Review Collector Widget */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="w-full px-6 lg:px-12">
          <div className="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="6a7987fa254a994d52d90630" data-style-height="52px" data-style-width="100%" data-token="387e78c2-3e26-4779-ac50-3071185415ef">
            <a href="https://www.trustpilot.com/review/eliteseatingltd.co.uk" target="_blank" rel="noopener">Trustpilot</a>
          </div>
        </div>
      </section>

      {/* Trust Bar - Executive Standards */}
      <section className="bg-white py-16 border-t border-b border-gray-100">
        <div className="w-full px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center text-center">
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Global Logistics</p>
                <p className="text-[9px] font-bold text-gray-400 ">White-Glove Delivery</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Elite Returns</p>
                <p className="text-[9px] font-bold text-gray-400 ">14-Day Assurance</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Capital Strategy</p>
                <p className="text-[9px] font-bold text-gray-400 ">0% APR Available</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Patron Rating</p>
                <p className="text-[9px] font-bold text-gray-400 ">29,000+ Five-Star</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F] group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">British Lineage</p>
                <p className="text-[9px] font-bold text-gray-400 ">Family Operated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke Showroom & FAQ Accordion Section */}
      <section className="py-24 bg-white">
        <div className="w-full px-6 lg:px-12 max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[#D7282F] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
              Curator Assistance
            </span>
            <h3 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 tracking-tighter">
              Bespoke Inquiries
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
                a: "Every single EliteSeating frame is backed by our signature 2-Year Quality Frame Guarantee, insuring your pieces against structural defects for generations to come."
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
                  <button type="button"
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

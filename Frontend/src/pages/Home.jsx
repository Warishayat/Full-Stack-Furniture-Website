import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Star, Play, Award, Zap, Sparkles, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes, reviewRes] = await Promise.all([
          API.get('/category/getallCategories'),
          API.get('/product/getAllProducts'),
          API.get('/review/all-reviews')
        ]);
        
        setCategories(catRes.data.categories || catRes.data || []);
        const prodData = prodRes.data.products || prodRes.data || [];
        setFeaturedProducts(prodData.slice(0, 8));
        setReviews(reviewRes.data.reviews || []);
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

  return (
    <div className="bg-white overflow-hidden pt-20 lg:pt-24">
      <Hero />

      {/* Trust Bar - Executive Standards */}
      <section className="bg-white py-12 border-b border-gray-50">
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

      {/* Flash Sofa Sale Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Large Banner */}
            <div className="lg:w-1/2 relative group overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
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
               <div className="grid grid-cols-2 gap-8 lg:gap-12">
                 {featuredProducts.slice(0, 4).map((product) => (
                   <ProductCard key={product._id} product={product} />
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Dining Sale Section */}
      <section className="py-32 bg-[#F2EDE7]/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-16 lg:gap-24">
            {/* Large Banner */}
            <div className="lg:w-1/2 relative group overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
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
               <div className="grid grid-cols-2 gap-8 lg:gap-12">
                 {featuredProducts.slice(4, 8).map((product) => (
                   <ProductCard key={product._id} product={product} />
                 ))}
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
                  <div key={i} className={`w-10 h-10 flex items-center justify-center ${i < 4 ? 'bg-green-600' : 'bg-gray-200'} shadow-sm`}>
                    <span className="text-white text-xl">★</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Rated 4.6 / 5 based on 30,069 reviews on <span className="text-gray-900 font-black italic underline decoration-[#D7282F]">★ Trustpilot</span>
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
    </div>
  );
};

export default Home;

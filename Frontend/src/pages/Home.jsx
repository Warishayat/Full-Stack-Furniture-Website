import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Star, Play, Award, Zap, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import HeroSlider from '../components/HeroSlider';

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
        
        // Fetch Categories
        const catRes = await API.get('/category/getallCategories');
        const catData = catRes.data.categories || catRes.data || [];
        setCategories(catData);

        // Fetch Products
        const prodRes = await API.get('/product/getAllProducts');
        const prodData = prodRes.data.products || prodRes.data || [];
        setFeaturedProducts(prodData.slice(0, 8));

        // Fetch Live Reviews
        const reviewRes = await API.get('/review/all-reviews');
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
    <div className="bg-white">
      {/* Hero Slider - Renders immediately */}
      <HeroSlider />

      {/* Stats Section - Renders immediately */}
      <section className="bg-primary-950 border-y border-white/5 py-6 lg:py-12 relative overflow-hidden">
         <div className="container mx-auto px-6 lg:px-12 xl:px-20 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8 items-center">
               <div className="flex items-center justify-center lg:justify-start gap-4 lg:gap-8 group">
                  <p className="text-5xl lg:text-6xl xl:text-8xl font-serif font-bold text-white group-hover:text-accent transition-colors">12k+</p>
                  <div className="text-left">
                     <p className="text-[10px] text-primary-400 font-bold uppercase tracking-[0.4em] mb-1">Satisfied</p>
                     <p className="text-[10px] text-white font-bold uppercase tracking-[0.4em]">Homeowners</p>
                  </div>
               </div>
               
               <div className="flex items-center justify-center gap-4 lg:gap-8 group border-y md:border-y-0 md:border-x border-white/10 py-8 md:py-0">
                  <p className="text-5xl lg:text-6xl xl:text-8xl font-serif font-bold text-white group-hover:text-accent transition-colors">25+</p>
                  <div className="text-left">
                     <p className="text-[10px] text-primary-400 font-bold uppercase tracking-[0.4em] mb-1">Design</p>
                     <p className="text-[10px] text-white font-bold uppercase tracking-[0.4em]">Excellence</p>
                  </div>
               </div>
               
               <div className="flex items-center justify-center lg:justify-end gap-4 lg:gap-8 group">
                  <p className="text-5xl lg:text-6xl xl:text-8xl font-serif font-bold text-white group-hover:text-accent transition-colors">100%</p>
                  <div className="text-left">
                     <p className="text-[10px] text-primary-400 font-bold uppercase tracking-[0.4em] mb-1">Organic</p>
                     <p className="text-[10px] text-white font-bold uppercase tracking-[0.4em]">Sourcing</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Featured Collections */}
      <section className="pt-32 pb-16 bg-secondary/30 section-optimized">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24 gap-10 text-center md:text-left">
            <div className="max-w-2xl">
              <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-black mb-6 block animate-fade-in">Curated Anthology</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-primary-950 leading-tight">
                Browse our <br/> <span className="text-accent italic">Departments</span>
              </h2>
            </div>
            <Link to="/products" className="group flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary-950 hover:text-accent transition-all pb-2 border-b-2 border-primary-100 hover:border-accent">
              Explore Full Catalog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-primary-100 rounded-[3rem] h-[30rem]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {categories.slice(0, 6).map(cat => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Signature Pieces (Products) */}
      <section className="pt-16 pb-32 bg-white relative overflow-hidden section-optimized">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-[15rem] font-serif font-black text-primary-50/50 -rotate-90 select-none">
          LUXURY
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">Premium Curation</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary-950 mb-8">
              Signature <span className="italic text-accent">Masterpieces</span>
            </h2>
            <div className="w-32 h-[2px] bg-accent/20 mx-auto"></div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-primary-50 rounded-[2.5rem] h-[28rem]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-12">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-24 text-center">
            <Link 
              to="/products" 
              className="inline-flex items-center px-14 py-6 bg-primary-950 text-white font-bold rounded-full hover:bg-accent transition-all shadow-2xl shadow-primary-900/20 uppercase tracking-[0.2em] text-[10px]"
            >
              Shop All Creations
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Carousel */}
      {reviews.length > 0 && (
        <section className="py-32 bg-secondary/30 relative overflow-hidden section-optimized">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-24">
              <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Testimonials</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary-950 mb-8">
                What our <span className="italic text-accent">clients are saying</span>
              </h2>
              <div className="w-32 h-[2px] bg-accent/20 mx-auto"></div>
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-700 ease-in-out" 
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {reviews.map((testimonial, i) => (
                    <div key={i} className="w-full flex-shrink-0 px-4">
                      <div className={`p-10 md:p-14 rounded-[2.5rem] transition-all duration-500 ${i % 2 === 1 ? 'bg-primary-950 text-white' : 'bg-white text-primary-950 border border-primary-100'}`}>
                        <div className="flex gap-1 text-accent mb-8">
                          {[...Array(testimonial.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="font-serif text-xl md:text-2xl italic mb-10 leading-relaxed">
                          "{testimonial.comment}"
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${i % 2 === 1 ? 'text-white' : 'text-primary-950'}`}>{testimonial.userId?.name || 'Valued Client'}</p>
                            <p className={`text-[9px] font-bold uppercase tracking-widest ${i % 2 === 1 ? 'text-accent' : 'text-primary-400'}`}>Verified Purchase</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              {reviews.length > 1 && (
                <>
                  <div className="flex justify-center mt-16 gap-6">
                    <button 
                      onClick={prevTestimonial}
                      className="w-14 h-14 rounded-full border border-primary-200 flex items-center justify-center text-primary-950 hover:bg-primary-950 hover:text-white transition-all shadow-xl shadow-primary-900/5 group"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      className="w-14 h-14 rounded-full border border-primary-200 flex items-center justify-center text-primary-950 hover:bg-primary-950 hover:text-white transition-all shadow-xl shadow-primary-900/5 group"
                    >
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Pagination Dots */}
                  <div className="flex justify-center mt-10 gap-3">
                    {reviews.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentTestimonial(i)}
                        className={`h-1 rounded-full transition-all duration-500 ${currentTestimonial === i ? 'w-12 bg-accent' : 'w-6 bg-primary-100'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section className="py-32 bg-primary-950 text-white overflow-hidden relative section-optimized">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
           <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=2628&auto=format&fit=crop" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="lg:w-1/2">
                <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-10 block">Our Craft</span>
                <h2 className="text-6xl lg:text-8xl font-serif font-bold text-white mb-12 leading-tight">
                   Built for <br/>
                   <span className="italic text-accent">Generations</span>
                </h2>
                <p className="text-xl lg:text-2xl text-primary-300 mb-16 leading-relaxed font-light text-left">
                   "We don't just sell furniture; we curate legacies. Every piece is an investment in comfort, quality, and timeless aesthetic."
                </p>
                
                <div className="grid grid-cols-2 gap-12 text-left">
                   <div className="space-y-4">
                      <Zap className="w-8 h-8 text-accent" />
                      <h4 className="font-bold uppercase tracking-widest text-xs">Innovation</h4>
                      <p className="text-primary-400 text-sm">Advanced ergonomics meets heritage design.</p>
                   </div>
                   <div className="space-y-4">
                      <Award className="w-8 h-8 text-accent" />
                      <h4 className="font-bold uppercase tracking-widest text-xs">Quality</h4>
                      <p className="text-primary-400 text-sm">Rigorous 50-point inspection on every unit.</p>
                   </div>
                </div>
             </div>
             
             <div className="lg:w-1/2 relative group">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                   <img 
                      src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2678&auto=format&fit=crop" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                   />
                </div>
                <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-accent p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl max-w-[200px] md:max-w-[280px] text-left">
                   <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white mb-4 md:mb-6" />
                   <h4 className="font-serif font-bold text-xl md:text-2xl text-white mb-2 md:mb-4 italic">Bespoke Design</h4>
                   <p className="text-white/80 text-[9px] md:text-xs leading-relaxed uppercase tracking-widest font-bold">Custom tailored for your space.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Final Trust Section */}
      <section className="py-32 bg-white section-optimized">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="group text-center">
              <div className="w-24 h-24 bg-primary-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:bg-primary-950 group-hover:text-white transition-all duration-700 shadow-xl shadow-primary-900/5">
                <Truck className="w-10 h-10 text-primary-950 group-hover:text-accent transition-all" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-primary-950 mb-4">Elite Delivery</h3>
              <p className="text-primary-400 text-xs font-bold tracking-[0.2em] uppercase">White-Glove Service Worldwide</p>
            </div>
            <div className="group text-center">
              <div className="w-24 h-24 bg-primary-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:bg-primary-950 group-hover:text-white transition-all duration-700 shadow-xl shadow-primary-900/5">
                <ShieldCheck className="w-10 h-10 text-primary-950 group-hover:text-accent transition-all" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-primary-950 mb-4">Certified Quality</h3>
              <p className="text-primary-400 text-xs font-bold tracking-[0.2em] uppercase">Lifetime Structural Warranty</p>
            </div>
            <div className="group text-center">
              <div className="w-24 h-24 bg-primary-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:bg-primary-950 group-hover:text-white transition-all duration-700 shadow-xl shadow-primary-900/5">
                <Star className="w-10 h-10 text-primary-950 group-hover:text-accent transition-all" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-primary-950 mb-4">Legacy Build</h3>
              <p className="text-primary-400 text-xs font-bold tracking-[0.2em] uppercase">Sustainability Certified</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

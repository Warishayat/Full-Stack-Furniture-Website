import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-gray-900 py-8 lg:py-24">
      {/* Background Image with Parallax-like effect */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2670&auto=format&fit=crop"
          alt="Elite Seating Collection"
          className="w-full h-full object-cover object-center lg:object-[50%_40%] opacity-60 scale-105 animate-subtle-zoom"
        />
        {/* Advanced Layered Overlays - Much stronger for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 md:hidden" />
      </div>

      <div className="container mx-auto px-6 lg:px-24 relative z-10 pt-4 lg:pt-6 pb-8">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 md:px-6 md:py-2.5 bg-white/5 backdrop-blur-md border border-white/10 text-white mb-6 md:mb-8 shadow-2xl animate-fade-in rounded-full">
             <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-[#D7282F] animate-pulse" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em]">The Signature Collection 2026</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl lg:text-[8rem] xl:text-[9.5rem] font-serif text-white leading-[0.9] md:leading-[0.8] mb-6 md:mb-8 lg:mb-10 tracking-tighter animate-fade-in-up drop-shadow-2xl font-black">
            Master <br />
            <span className="italic text-gray-400 relative inline-block">
              Atmosphere
              <div className="absolute -bottom-2 md:-bottom-4 left-0 w-1/3 h-1 bg-[#D7282F] opacity-50" />
            </span>
          </h1>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start mb-6 md:mb-10 lg:mb-12 animate-fade-in-up delay-200">
            <p className="text-white/80 text-sm md:text-lg font-medium max-w-lg leading-relaxed italic border-l-2 border-[#D7282F] pl-6 md:pl-8">
              Handcrafted pieces designed to define your sanctuary. 
              Elevating the ordinary into the extraordinary through architectural precision.
            </p>
            <div className="hidden lg:flex items-center gap-8 pt-2">
               <div className="flex flex-col">
                  <span className="text-white font-black text-2xl tracking-tighter">2.9k+</span>
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Bespoke Pieces</span>
               </div>
               <div className="w-[1px] h-10 bg-white/10" />
               <div className="flex flex-col">
                  <span className="text-white font-black text-2xl tracking-tighter">14d</span>
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Master Crafting</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 animate-fade-in-up delay-400">
            <Link
              to="/products?category=sofas"
              className="relative group overflow-hidden px-10 py-5 md:px-16 md:py-7 bg-[#D7282F] text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all shadow-xl flex items-center justify-center gap-4"
            >
              <span className="relative z-10 flex items-center gap-4">
                Explore Sofas <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
            </Link>

            <Link
              to="/products"
              className="px-10 py-5 md:px-16 md:py-7 bg-white/5 border border-white/20 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-white hover:text-gray-900 transition-all backdrop-blur-xl flex items-center justify-center gap-4 group rounded-sm"
            >
              The Full Gallery <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;

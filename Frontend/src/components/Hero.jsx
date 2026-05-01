import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImage from "../assets/images/Hero/HeroImage-1.webp";

const Hero = () => {
  const slide = {
    subtitle: 'Haute Couture 2026',
    title: 'The Art of Exceptional Comfort',
    description: 'Discover furniture that transcends time. Handcrafted masterpieces designed to bring soul and elegance to your modern living spaces.'
  };

  return (
    <section className="relative h-screen flex items-center bg-primary-950 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={slide.title}
          className="w-full h-full object-cover object-center brightness-[0.6] animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10 h-full flex flex-col pt-24 pb-32 lg:pt-32 lg:pb-0 justify-start">
        <div className="max-w-4xl">
          <div 
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">{slide.subtitle}</span>
          </div>

          <h1 
            className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white leading-tight mb-10 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            {slide.title.split(' ').map((word, i) => (
              <span key={i} className="inline-block">
                {word === 'Exceptional' || word === 'Modern' || word === 'Exclusive' ? (
                  <span className="text-shine italic mr-4">{word}</span>
                ) : (
                  <span className="mr-4">{word}</span>
                )}
                {i === 1 && <br />}
              </span>
            ))}
          </h1>

          <p 
            className="text-base md:text-xl text-primary-200 mb-12 max-w-2xl leading-relaxed border-l-4 border-accent pl-10 animate-fade-in-up"
            style={{ animationDelay: '600ms' }}
          >
            {slide.description}
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up"
            style={{ animationDelay: '800ms' }}
          >
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-accent text-white font-bold rounded-full overflow-hidden transition-all shadow-2xl shadow-accent/20 text-[10px] uppercase tracking-widest"
            >
              <span className="relative z-10 flex items-center">
                Explore Collections
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
            </Link>

            <Link
              to="/products"
              className="group inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-primary-950 transition-all duration-500 text-[10px] uppercase tracking-widest"
            >
              Watch Lookbook
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-accent to-transparent mx-auto animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;

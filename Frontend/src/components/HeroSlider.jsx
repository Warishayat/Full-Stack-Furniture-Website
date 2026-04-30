import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/src/assets/images/hero/HeroImage-1.jpg',
      subtitle: 'Haute Couture 2026',
      title: 'The Art of Exceptional Comfort',
      description: 'Discover furniture that transcends time. Handcrafted masterpieces designed to bring soul and elegance to your modern living spaces.'
    },
    {
      image: '/src/assets/images/hero/HeroImage-2.jpg',
      subtitle: 'Timeless Elegance',
      title: 'Crafted for Modern Living',
      description: 'Experience the perfect blend of traditional craftsmanship and contemporary design for your sanctuary.'
    },
    {
      image: '/src/assets/images/hero/HeroImage-3.jpg',
      subtitle: 'Luxury Redefined',
      title: 'Exclusive Living Spaces',
      description: 'Elevate your home with our curated collection of premium furniture, where every piece tells a story of luxury.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen flex items-center bg-primary-950 overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >

          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover object-center brightness-[0.6] transition-transform duration-[6000ms] ease-linear ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent" />
          </div>

          <div className="container mx-auto px-6 lg:px-20 relative z-10 h-full flex flex-col pt-24 pb-32 lg:pt-32 lg:pb-0 justify-start">
            <div className="max-w-4xl">
              <div 
                className={`inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8 transition-all duration-700 delay-300 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">{slide.subtitle}</span>
              </div>

              <h1 
                className={`text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white leading-tight mb-10 transition-all duration-700 delay-500 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
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
                className={`text-base md:text-xl text-primary-200 mb-12 max-w-2xl leading-relaxed transition-all duration-700 delay-700 border-l-4 border-accent pl-10 ${
                  index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
              >
                {slide.description}
              </p>

              <div 
                className={`flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all duration-700 delay-1000 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
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
        </div>
      ))}

      <div className="absolute bottom-10 right-10 z-20 flex gap-4">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all group"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-10 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all duration-500 rounded-full ${
              index === currentSlide ? 'w-12 bg-accent' : 'w-6 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-accent to-transparent mx-auto animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSlider;

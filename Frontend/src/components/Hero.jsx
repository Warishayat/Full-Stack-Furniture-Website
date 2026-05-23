import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Clock } from 'lucide-react';

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 15, mins: 42, secs: 47 });

  useEffect(() => {
    // Changed key to force reset the timer to 28 days for everyone
    let endtime = localStorage.getItem('saleEndTime_28days');
    if (!endtime) {
      endtime = new Date().getTime() + (28 * 24 * 60 * 60 * 1000) + (15 * 60 * 60 * 1000) + (42 * 60 * 1000) + (47 * 1000);
      localStorage.setItem('saleEndTime_28days', endtime);
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endtime - now;

      if (distance < 0) {
        const newEndtime = new Date().getTime() + (28 * 24 * 60 * 60 * 1000) + (15 * 60 * 60 * 1000);
        localStorage.setItem('saleEndTime_28days', newEndtime);
        endtime = newEndtime;
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] w-full flex flex-col items-center justify-between pb-12 md:pb-16 pt-28 overflow-hidden">
      {/* Background Image - Clean, No Dark Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-light-sofa.png"
          alt="Spring Sale"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle overlay only to ensure white text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Text Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-grow text-center px-4 mt-4 md:mt-8">
        <h2 className="text-white text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-serif mb-2 md:mb-4 drop-shadow-md font-medium tracking-wide">
          Spring Sale
        </h2>
        <h1 className="text-white text-[5rem] md:text-7xl lg:text-8xl xl:text-[8.5rem] font-serif drop-shadow-2xl leading-[1.1] md:leading-[0.95] font-medium tracking-tight mb-8 md:mb-12">
          Up to <br className="md:hidden" />
          50% off
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto animate-fade-in-up delay-200 px-4 sm:px-0 mb-8 md:mb-16">
          <Link
            to="/products?category=sofas"
            className="w-full sm:w-auto px-8 py-4 bg-[#D7282F] text-white text-xs md:text-sm font-black uppercase tracking-[0.2em] transition-all hover:bg-red-700 shadow-xl flex items-center justify-center gap-3"
          >
            Sofas Collection <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto px-8 py-4 bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
          >
            Overall Collection
          </Link>
        </div>
      </div>

      {/* Timer Cards at Bottom */}
      <div className="relative z-10 w-full flex justify-center px-2 mt-auto pb-4 md:pb-8">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="bg-white rounded-lg shadow-xl px-2 py-3 md:px-8 md:py-6 flex flex-col items-center justify-center w-[72px] md:w-32 transform transition-transform hover:-translate-y-1">
            <span className="text-black font-black text-2xl md:text-5xl">{timeLeft.days}</span>
            <div className="w-8 md:w-16 h-[2px] bg-gray-200 my-1 md:my-3" />
            <span className="text-gray-500 text-[9px] md:text-sm font-bold capitalize">Days</span>
          </div>
          <div className="bg-white rounded-lg shadow-xl px-2 py-3 md:px-8 md:py-6 flex flex-col items-center justify-center w-[72px] md:w-32 transform transition-transform hover:-translate-y-1">
            <span className="text-black font-black text-2xl md:text-5xl">{timeLeft.hours}</span>
            <div className="w-8 md:w-16 h-[2px] bg-gray-200 my-1 md:my-3" />
            <span className="text-gray-500 text-[9px] md:text-sm font-bold capitalize">Hours</span>
          </div>
          <div className="bg-white rounded-lg shadow-xl px-2 py-3 md:px-8 md:py-6 flex flex-col items-center justify-center w-[72px] md:w-32 transform transition-transform hover:-translate-y-1">
            <span className="text-black font-black text-2xl md:text-5xl">{timeLeft.mins}</span>
            <div className="w-8 md:w-16 h-[2px] bg-gray-200 my-1 md:my-3" />
            <span className="text-gray-500 text-[9px] md:text-sm font-bold capitalize">Minutes</span>
          </div>
          <div className="bg-white rounded-lg shadow-xl px-2 py-3 md:px-8 md:py-6 flex flex-col items-center justify-center w-[72px] md:w-32 transform transition-transform hover:-translate-y-1">
            <span className="text-black font-black text-2xl md:text-5xl">{timeLeft.secs}</span>
            <div className="w-8 md:w-16 h-[2px] bg-gray-200 my-1 md:my-3" />
            <span className="text-gray-500 text-[9px] md:text-sm font-bold capitalize">Seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = memo(({ category }) => {
  return (
    <Link 
      to={`/products?category=${category._id}`} 
      className="group relative block overflow-hidden bg-white aspect-[4/5] transition-all duration-700 ease-in-out border border-gray-100"
    >
      <img
        src={category.image || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
        <div className="overflow-hidden mb-2">
           <span className="text-[9px] font-black text-[#D7282F] uppercase tracking-[0.5em] block translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out">
             Archive Selection
           </span>
        </div>
        <h3 className="text-3xl lg:text-4xl font-serif font-black text-white leading-tight mb-6 transform transition-transform duration-700 group-hover:-translate-y-2 tracking-tighter">
          {category.name} <span className="italic text-gray-400">Series</span>
        </h3>
        
        <div className="flex items-center gap-4 text-white/70 group-hover:text-white transition-colors duration-500">
           <div className="h-[1px] w-12 bg-[#D7282F] group-hover:w-20 transition-all duration-700" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Explore Collection</span>
        </div>
      </div>
      
      {/* Decorative Frame */}
      <div className="absolute inset-6 border border-white/5 pointer-events-none group-hover:inset-4 group-hover:border-white/10 transition-all duration-700" />
    </Link>
  );
});

export default CategoryCard;

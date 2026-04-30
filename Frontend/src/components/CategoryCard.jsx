import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/products?category=${category._id}`} 
      className="group relative block overflow-hidden rounded-[2.5rem] bg-primary-100 aspect-[4/5] shadow-2xl hover:shadow-primary-950/20 transition-all duration-700 ease-in-out border border-primary-50"
    >
      <img
        src={category.image || 'https://placehold.co/600x800?text=Category'}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
      />
      
      {/* Dynamic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-primary-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
        <div className="overflow-hidden mb-2">
           <span className="text-[10px] font-bold text-accent uppercase tracking-[0.4em] block translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out">
             Signature Collection
           </span>
        </div>
        <h3 className="text-3xl lg:text-4xl font-serif font-bold text-white leading-tight mb-6 transform transition-transform duration-700 group-hover:-translate-y-2">
          {category.name}
        </h3>
        
        <div className="flex items-center gap-4 text-white/60 group-hover:text-accent transition-colors duration-500">
           <div className="h-[1px] w-12 bg-white/30 group-hover:w-16 group-hover:bg-accent transition-all duration-700" />
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Explore</span>
        </div>
      </div>
      
      {/* Decorative Border */}
      <div className="absolute inset-6 border border-white/10 rounded-[2rem] pointer-events-none group-hover:inset-4 group-hover:border-white/20 transition-all duration-700" />
    </Link>
  );
};

export default CategoryCard;

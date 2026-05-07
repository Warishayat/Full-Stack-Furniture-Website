import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

const Inspiration = () => {
  const galleries = [
    {
      title: "The Modern Manor",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop",
      category: "Architectural Living"
    },
    {
      title: "Nordic Serenity",
      image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop",
      category: "Minimalist Design"
    },
    {
      title: "Urban Opulence",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop",
      category: "Bespoke Curation"
    },
    {
      title: "Heritage Reborn",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1974&auto=format&fit=crop",
      category: "Classic Luxury"
    }
  ];

  const socialFeed = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615873968403-89e068628265?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616137422495-1e90553547b3?q=80&w=2000&auto=format&fit=crop"
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Design Inspiration</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="max-w-4xl mb-24">
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Elite Interiors</span>
           <h1 className="text-5xl lg:text-8xl font-serif font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
              Curate Your <br/><span className="italic text-gray-400 text-6xl lg:text-7xl">Sanctuary</span>
           </h1>
           <p className="text-gray-600 text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
              Explore our curated galleries of architectural spaces featuring EliteSeating pieces—where heritage meets modern living.
           </p>
        </div>

        {/* Featured Galleries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-32">
           {galleries.map((gallery, idx) => (
             <div key={idx} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-8 relative">
                   <img 
                     src={gallery.image} 
                     alt={gallery.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                   />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                         <Play className="w-5 h-5 text-gray-900 fill-current" />
                      </div>
                   </div>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <span className="text-[#D7282F] uppercase tracking-widest text-[9px] font-black block mb-2">{gallery.category}</span>
                      <h3 className="text-3xl font-serif font-black text-gray-900 tracking-tighter">{gallery.title}</h3>
                   </div>
                   <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-[#D7282F] transition-colors" />
                </div>
             </div>
           ))}
        </div>

        {/* Customer Stories Section */}
        <div className="bg-gray-900 text-white p-12 lg:p-24 rounded-sm mb-32 relative overflow-hidden">
           <div className="max-w-2xl relative z-10">
              <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-8 block">Customer Homes</span>
              <h2 className="text-4xl lg:text-6xl font-serif font-black mb-10 tracking-tighter italic">Real Spaces. Real Stories.</h2>
              <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
                 Join our community of collectors and designers. Share your EliteSeating sanctuary and inspire others to define their own luxury.
              </p>
              <button className="px-12 py-5 bg-[#D7282F] text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-gray-900 transition-all">
                 Share Your Space
              </button>
           </div>
           <div className="absolute top-0 right-0 w-[500px] h-full hidden lg:block opacity-40 grayscale group hover:grayscale-0 transition-all duration-1000">
              <img src="https://images.unsplash.com/photo-1598300042247-d317fb674c3b?q=80&w=1965&auto=format&fit=crop" className="w-full h-full object-cover" />
           </div>
        </div>

        {/* Social Feed Grid */}
        <div className="mb-32 text-center">
           <div className="flex items-center justify-center gap-3 mb-12">
              <FaInstagram className="w-5 h-5 text-[#D7282F]" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#MyEliteSeating Sanctuary</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
              {socialFeed.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 overflow-hidden group">
                   <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
           </div>
        </div>

        {/* CTA */}
        <div className="text-center py-24 border-t border-gray-100">
           <Sparkles className="w-10 h-10 text-[#D7282F] mx-auto mb-8" />
           <h2 className="text-4xl font-serif font-black text-gray-900 mb-10 tracking-tighter italic">Ready to curate your home?</h2>
           <Link to="/products" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 border-b-2 border-gray-900 pb-2 hover:text-[#D7282F] hover:border-[#D7282F] transition-all">
              Explore The Full Collection <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Inspiration;

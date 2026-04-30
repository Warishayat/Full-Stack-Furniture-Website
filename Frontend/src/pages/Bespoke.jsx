import { Sparkles, Ruler, Palette, PenTool, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bespoke = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-24 items-center mb-32">
           <div className="lg:w-1/2">
              <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block animate-fade-in">Tailored for You</span>
              <h1 className="text-6xl lg:text-8xl font-serif font-bold text-primary-950 mb-10 leading-tight">Bespoke <br/><span className="italic text-shine">Signature</span> Design</h1>
              <p className="text-lg text-primary-500 mb-12 leading-relaxed">
                 For those who seek the extraordinary. Our bespoke service allows you to work directly with our master designers to create unique pieces tailored specifically to your architectural space and personal aesthetic.
              </p>
              <button className="px-12 py-6 bg-primary-950 text-white font-bold rounded-full hover:bg-accent transition-all shadow-2xl shadow-primary-900/10 uppercase tracking-widest text-xs">
                 Book a Consultation
              </button>
           </div>
           <div className="lg:w-1/2">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative group">
                 <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2678&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Bespoke Process" />
                 <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent" />
                 <div className="absolute bottom-12 left-12 right-12 text-white">
                    <p className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Phase 01</p>
                    <h3 className="text-3xl font-serif font-bold italic">The Art of Measurement</h3>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-32">
           {[
             { icon: Ruler, title: 'Spatial Analysis', desc: 'We analyze your room\'s dimensions, lighting, and flow to ensure a perfect fit.' },
             { icon: Palette, title: 'Material Selection', desc: 'Choose from our exclusive library of over 500 premium fabrics and 20 wood finishes.' },
             { icon: PenTool, title: 'Master Crafting', desc: 'Your vision is brought to life by a single artisan from start to finish.' }
           ].map((item, idx) => (
             <div key={idx} className="text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-primary-100">
                   <item.icon className="w-8 h-8 text-accent" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-primary-950 mb-4">{item.title}</h4>
                <p className="text-primary-400 text-sm leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="bg-primary-50 rounded-[4rem] p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16">
           <div className="max-w-xl">
              <h3 className="text-4xl font-serif font-bold text-primary-950 mb-8">Bring your dream space to life.</h3>
              <p className="text-primary-500 mb-10 leading-relaxed">Our concierge team is ready to discuss your project. We offer in-home consultations across the UK and virtual sessions globally.</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/contact" className="px-10 py-5 bg-white border border-primary-200 text-primary-950 font-bold rounded-full hover:bg-primary-950 hover:text-white transition-all uppercase tracking-widest text-xs flex items-center justify-center">
                 Contact Concierge
              </Link>
              <Link to="/products" className="px-10 py-5 bg-accent text-white font-bold rounded-full hover:bg-white hover:text-primary-950 transition-all shadow-xl shadow-accent/20 uppercase tracking-widest text-xs flex items-center justify-center">
                 View Portfolio <ArrowRight className="w-4 h-4 ml-3" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Bespoke;

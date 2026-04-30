import { ShieldCheck, Award, Zap, Heart } from 'lucide-react';

const Warranty = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="max-w-3xl mx-auto text-center mb-24">
           <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block animate-fade-in">Quality Promise</span>
           <h1 className="text-5xl lg:text-7xl font-serif font-bold text-primary-950 mb-8">Lifetime <span className="italic text-shine">Assurance</span></h1>
           <p className="text-primary-500 text-lg leading-relaxed">Our furniture is built to last for generations. We stand behind every joint, stitch, and finish with our comprehensive warranty program.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
           {[
             { icon: ShieldCheck, title: 'Lifetime Structural', desc: 'Warranty on all solid wood frames and structural integrity for the lifetime of the original owner.' },
             { icon: Award, title: '5-Year Fabric', desc: 'Protection against manufacturing defects in upholstery, leather, and seam construction.' },
             { icon: Heart, title: 'Care Program', desc: 'Annual maintenance tips and professional cleaning discounts for all COMFORT members.' }
           ].map((item, idx) => (
             <div key={idx} className="p-12 bg-primary-50/50 rounded-[3rem] border border-primary-100 hover:border-accent transition-all duration-500">
                <item.icon className="w-12 h-12 text-accent mb-8" />
                <h3 className="text-2xl font-serif font-bold text-primary-950 mb-4">{item.title}</h3>
                <p className="text-primary-500 text-sm leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="max-w-5xl mx-auto bg-primary-950 text-white rounded-[4rem] overflow-hidden flex flex-col lg:flex-row">
           <div className="lg:w-1/2 p-12 lg:p-20">
              <h3 className="text-4xl font-serif font-bold mb-8">Claim Process</h3>
              <ul className="space-y-8">
                 <li className="flex gap-6">
                    <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <p className="text-primary-300 text-sm">Take clear photos of the issue and your original invoice.</p>
                 </li>
                 <li className="flex gap-6">
                    <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <p className="text-primary-300 text-sm">Email our concierge team at warranty@comfort.com.</p>
                 </li>
                 <li className="flex gap-6">
                    <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <p className="text-primary-300 text-sm">Our master craftsman will review and arrange a repair or replacement within 48 hours.</p>
                 </li>
              </ul>
           </div>
           <div className="lg:w-1/2 relative min-h-[400px]">
              <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=2628&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Craftsmanship" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-transparent to-transparent" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Warranty;

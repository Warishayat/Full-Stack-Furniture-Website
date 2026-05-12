import { ShieldCheck, Award, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Warranty = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Quality Assurance</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="max-w-3xl mx-auto text-center mb-24">
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Quality Promise</span>
           <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 mb-8 tracking-tighter">Lifetime <span className="italic text-gray-400">Assurance</span></h1>
           <p className="text-gray-600 text-lg leading-relaxed font-medium">Our furniture is built to last for generations. We stand behind every joint, stitch, and finish with our comprehensive warranty program.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-32">
           {[
             { icon: ShieldCheck, title: 'Lifetime Structural', desc: 'Warranty on all solid wood frames and structural integrity for the lifetime of the original owner.' },
             { icon: Award, title: '5-Year Fabric', desc: 'Protection against manufacturing defects in upholstery, leather, and seam construction.' },
             { icon: Heart, title: 'Care Program', desc: 'Annual maintenance tips and professional cleaning discounts for all EliteSeating members.' }
           ].map((item, idx) => (
             <div key={idx} className="p-12 bg-[#F2EDE7] rounded-sm border border-gray-100 group hover:border-[#D7282F] transition-all duration-500">
                <item.icon className="w-12 h-12 text-[#D7282F] mb-8" />
                <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="max-w-5xl mx-auto bg-gray-900 text-white rounded-sm overflow-hidden flex flex-col lg:flex-row shadow-2xl">
           <div className="lg:w-1/2 p-12 lg:p-20">
              <h3 className="text-4xl font-serif font-black mb-10 tracking-tighter italic">Claim Process</h3>
              <ul className="space-y-10">
                 <li className="flex gap-6">
                    <span className="w-10 h-10 rounded-full bg-[#D7282F] flex items-center justify-center text-xs font-black shrink-0">1</span>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">Take clear, high-resolution photos of the issue and your original authenticated invoice.</p>
                 </li>
                 <li className="flex gap-6">
                    <span className="w-10 h-10 rounded-full bg-[#D7282F] flex items-center justify-center text-xs font-black shrink-0">2</span>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">Email our dedicated concierge team at <span className="text-white underline underline-offset-4">eilteseatingltd@gmail.com</span>.</p>
                 </li>
                 <li className="flex gap-6">
                    <span className="w-10 h-10 rounded-full bg-[#D7282F] flex items-center justify-center text-xs font-black shrink-0">3</span>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">Our master craftsman will review your case and arrange a restoration or replacement within 48 hours.</p>
                 </li>
              </ul>
           </div>
           <div className="lg:w-1/2 relative min-h-[400px]">
              <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=2628&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="EliteSeating Craftsmanship" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Warranty;


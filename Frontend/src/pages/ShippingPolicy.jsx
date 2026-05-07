import { Truck, Globe, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Logistics Protocol</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="max-w-3xl mx-auto mb-20 text-center">
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">White-Glove Logistics</span>
           <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 mb-8 tracking-tighter">Shipping <span className="italic text-gray-400">& Delivery</span></h1>
           <p className="text-gray-600 text-lg leading-relaxed font-medium">We provide a world-class white-glove delivery service to ensure your masterpieces arrive in perfect condition, positioned exactly where you envisioned them.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
           <div className="space-y-8">
              <div className="flex gap-8 p-10 bg-[#F2EDE7] rounded-sm border border-gray-100">
                 <Truck className="w-10 h-10 text-[#D7282F] shrink-0" />
                 <div>
                    <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">White-Glove Service</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Our specialized team doesn't just deliver; they assemble and position your furniture in the room of your choice, removing all packaging materials for a seamless experience.</p>
                 </div>
              </div>
              <div className="flex gap-8 p-10 bg-[#F2EDE7] rounded-sm border border-gray-100">
                 <Globe className="w-10 h-10 text-[#D7282F] shrink-0" />
                 <div>
                    <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">UK Nationwide</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">We deliver across the entire UK mainland. Our specialized furniture couriers are trained to handle heavy, delicate pieces with the utmost care.</p>
                 </div>
              </div>
           </div>

           <div className="bg-gray-900 text-white p-12 lg:p-16 rounded-sm shadow-2xl relative overflow-hidden">
              <h3 className="text-4xl font-serif font-black mb-12 tracking-tight">Delivery Timelines</h3>
              <div className="space-y-12">
                 <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                       <p className="text-[#D7282F] font-black uppercase tracking-widest text-[10px] mb-2">London & South</p>
                       <p className="text-2xl font-serif italic">Metropolitan Delivery</p>
                    </div>
                    <p className="text-gray-400 font-bold">3-5 Days</p>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                       <p className="text-[#D7282F] font-black uppercase tracking-widest text-[10px] mb-2">UK Mainland</p>
                       <p className="text-2xl font-serif italic">Regional Logistics</p>
                    </div>
                    <p className="text-gray-400 font-bold">7-10 Days</p>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                       <p className="text-[#D7282F] font-black uppercase tracking-widest text-[10px] mb-2">Bespoke Orders</p>
                       <p className="text-2xl font-serif italic">Craft & Curation</p>
                    </div>
                    <p className="text-gray-400 font-bold">4-8 Weeks</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-gray-50 p-12 lg:p-20 rounded-sm text-center border border-gray-100">
           <ShieldCheck className="w-16 h-16 text-[#D7282F] mx-auto mb-10" />
           <h3 className="text-4xl font-serif font-black text-gray-900 mb-6 tracking-tighter">Fully Insured Transit</h3>
           <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">Every shipment is fully insured for its full replacement value. In the rare event of transit damage, we provide a priority replacement or repair service at no cost to you.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;


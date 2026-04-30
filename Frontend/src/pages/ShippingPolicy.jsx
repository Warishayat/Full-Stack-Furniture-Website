import { Truck, Globe, ShieldCheck, Clock } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="max-w-3xl mx-auto mb-24">
           <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block animate-fade-in">Logistics</span>
           <h1 className="text-5xl lg:text-7xl font-serif font-bold text-primary-950 mb-8">Shipping <span className="italic text-shine">& Delivery</span></h1>
           <p className="text-primary-500 text-lg leading-relaxed">We provide a world-class white-glove delivery service to ensure your masterpieces arrive in perfect condition, no matter where you are in the world.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
           <div className="space-y-8">
              <div className="flex gap-8 p-10 bg-primary-50/50 rounded-[2.5rem] border border-primary-100">
                 <Truck className="w-10 h-10 text-accent shrink-0" />
                 <div>
                    <h3 className="text-xl font-serif font-bold text-primary-950 mb-4">White-Glove Service</h3>
                    <p className="text-primary-500 text-sm leading-relaxed">Our specialized team doesn't just deliver; they assemble and position your furniture in the room of your choice, removing all packaging materials.</p>
                 </div>
              </div>
              <div className="flex gap-8 p-10 bg-primary-50/50 rounded-[2.5rem] border border-primary-100">
                 <Globe className="w-10 h-10 text-accent shrink-0" />
                 <div>
                    <h3 className="text-xl font-serif font-bold text-primary-950 mb-4">Global Shipping</h3>
                    <p className="text-primary-500 text-sm leading-relaxed">We ship to over 50 countries worldwide. International orders are handled with carbon-neutral logistics to minimize our environmental footprint.</p>
                 </div>
              </div>
           </div>

           <div className="bg-primary-950 text-white p-12 lg:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
              <h3 className="text-3xl font-serif font-bold mb-10 relative z-10">Delivery Timelines</h3>
              <div className="space-y-10 relative z-10">
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                       <p className="text-accent font-bold uppercase tracking-widest text-[10px] mb-2">United Kingdom</p>
                       <p className="text-xl">Standard Delivery</p>
                    </div>
                    <p className="text-primary-400 font-bold">5-7 Days</p>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                       <p className="text-accent font-bold uppercase tracking-widest text-[10px] mb-2">Europe</p>
                       <p className="text-xl">Express Freight</p>
                    </div>
                    <p className="text-primary-400 font-bold">10-14 Days</p>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                       <p className="text-accent font-bold uppercase tracking-widest text-[10px] mb-2">International</p>
                       <p className="text-xl">Global Logistics</p>
                    </div>
                    <p className="text-primary-400 font-bold">21-30 Days</p>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           </div>
        </div>

        <div className="bg-primary-50/30 p-12 lg:p-20 rounded-[4rem] text-center border border-primary-100">
           <ShieldCheck className="w-16 h-16 text-accent mx-auto mb-10" />
           <h3 className="text-3xl font-serif font-bold text-primary-950 mb-6">Fully Insured Transit</h3>
           <p className="text-primary-500 max-w-2xl mx-auto leading-relaxed">Every shipment is fully insured for its full replacement value. In the rare event of transit damage, we provide a priority replacement or repair service at no cost to you.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

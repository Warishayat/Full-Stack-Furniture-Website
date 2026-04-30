import { Search, Package, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

const OrderTracking = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="max-w-4xl mx-auto text-center mb-24">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary-50 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-black text-primary-950 uppercase tracking-[0.3em]">White-Glove Logistics</span>
           </div>
           <h1 className="text-5xl lg:text-8xl font-serif font-bold text-primary-950 mb-10 leading-tight">
              Tracking Your <br/><span className="italic text-shine">Masterpiece</span>
           </h1>
           <p className="text-primary-500 text-lg leading-relaxed max-w-2xl mx-auto">
              Our master craftsmen are meticulously preparing your selection. Every COMFORT piece undergoes a 50-point inspection before it leaves our London workshop.
           </p>
        </div>

        {/* Informational Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
           <div className="p-12 bg-primary-950 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-3xl font-serif font-bold mb-6 italic">The Crafting Phase</h3>
                 <p className="text-primary-300 leading-relaxed mb-10">
                    Your furniture is currently in our primary workshop. We use sustainable European hardwoods and hand-stitched Italian leathers to ensure a lifetime of comfort.
                 </p>
                 <div className="flex items-center gap-4 text-accent font-black uppercase tracking-widest text-[10px]">
                    <Clock className="w-5 h-5" />
                    <span>Est. Crafting: 14-21 Days</span>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
           </div>

           <div className="p-12 bg-primary-50 rounded-[3rem] border border-primary-100 group">
              <h3 className="text-3xl font-serif font-bold text-primary-950 mb-6 italic">Delivery Protocols</h3>
              <p className="text-primary-500 leading-relaxed mb-10">
                 Once your piece passes final inspection, our concierge team will contact you directly to schedule a delivery time that suits your lifestyle.
              </p>
              <div className="flex items-center gap-4 text-primary-950 font-black uppercase tracking-widest text-[10px]">
                 <Truck className="w-5 h-5 text-accent" />
                 <span>Priority UK White-Glove Service</span>
              </div>
           </div>
        </div>

        {/* Milestone Timeline */}
        <div className="max-w-5xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-primary-950 italic">The Journey to Your Door</h2>
           </div>
           
           <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-primary-100 hidden md:block" />
              
              <div className="space-y-16">
                 {[
                   { title: 'Curation Confirmed', desc: 'Your bespoke order has been authenticated and materials have been sourced.', status: 'Complete' },
                   { title: 'Hand-Crafting', desc: 'Our artisans are building your masterpiece to your exact specifications.', status: 'In Progress' },
                   { title: 'Quality Assurance', desc: 'A final 50-point inspection and deep polishing of every surface.', status: 'Pending' },
                   { title: 'White-Glove Delivery', desc: 'Assembly and positioning in your home by our professional team.', status: 'Pending' }
                 ].map((milestone, idx) => (
                   <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="md:w-1/2 text-center md:text-left px-8">
                         <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${milestone.status === 'Complete' ? 'text-green-500' : milestone.status === 'In Progress' ? 'text-accent' : 'text-primary-300'}`}>
                            {milestone.status}
                         </div>
                         <h4 className="text-2xl font-serif font-bold text-primary-950 mb-3">{milestone.title}</h4>
                         <p className="text-primary-500 text-sm leading-relaxed">{milestone.desc}</p>
                      </div>
                      
                      <div className="relative z-10 w-12 h-12 bg-white border border-primary-100 rounded-full flex items-center justify-center shadow-lg">
                         <div className={`w-3 h-3 rounded-full ${milestone.status === 'Complete' ? 'bg-green-500' : milestone.status === 'In Progress' ? 'bg-accent' : 'bg-primary-100'}`} />
                      </div>
                      
                      <div className="md:w-1/2" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="mt-32 p-12 bg-primary-50 rounded-[4rem] text-center border border-primary-100">
           <Package className="w-12 h-12 text-accent mx-auto mb-8" />
           <h3 className="text-2xl font-serif font-bold text-primary-950 mb-4 italic">Bespoke Concierge</h3>
           <p className="text-primary-500 max-w-xl mx-auto text-sm leading-relaxed mb-8">
              If you have specific questions about your order timeline, our specialists are available via direct concierge line for a personal update.
           </p>
           <p className="text-primary-950 font-black uppercase tracking-widest text-xs">+44 20 7946 0000</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

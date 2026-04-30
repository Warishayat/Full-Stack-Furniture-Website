import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, MapPin, Calendar, Clock, Sparkles, Truck, Loader2, AlertCircle } from 'lucide-react';
import API from '../services/api';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tid = searchParams.get('tid') || searchParams.get('id');
    if (tid) {
      setOrderId(tid);
      fetchOrder(tid);
    }
  }, [searchParams]);

  const fetchOrder = async (id) => {
    try {
      setLoading(true);
      setOrder(null);
      const { data } = await API.get(`/api/order/track/${id.trim()}`);
      setOrder(data.order);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    fetchOrder(orderId);
  };

  const getMilestones = (status) => {
    const s = status?.toLowerCase() || 'processing';
    return [
      { title: 'Curation Confirmed', desc: 'Your bespoke order has been authenticated.', status: 'Complete' },
      { title: 'Hand-Crafting', desc: 'Our artisans are building your masterpiece.', status: s === 'processing' ? 'In Progress' : 'Complete' },
      { title: 'Quality Assurance', desc: 'A final 50-point inspection of every surface.', status: s === 'shipped' ? 'In Progress' : s === 'delivered' ? 'Complete' : 'Pending' },
      { title: 'White-Glove Delivery', desc: 'Assembly and positioning in your home.', status: s === 'delivered' ? 'Complete' : s === 'shipped' ? 'In Progress' : 'Pending' }
    ];
  };

  return (
    <div className="bg-white min-h-screen pt-32 lg:pt-40 pb-20">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
           <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary-50 rounded-full mb-8">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-[9px] lg:text-[10px] font-black text-primary-950 uppercase tracking-[0.3em]">White-Glove Logistics</span>
           </div>
           <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-primary-950 mb-8 lg:mb-12 leading-[1.1] px-2">
              Track Your <br/><span className="italic text-shine">Masterpiece</span>
           </h1>
           
           <div className="max-w-xl mx-auto mb-10 px-2">
             <form onSubmit={handleTrack} className="relative group">
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Reference ID (TID)"
                  className="w-full pl-8 pr-20 lg:pr-28 py-5 lg:py-7 bg-primary-50 border border-primary-100 rounded-full focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-sm font-bold placeholder:text-primary-300 shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-950 text-white p-4 lg:p-5 rounded-full hover:bg-accent transition-all disabled:opacity-50 shadow-xl"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
             </form>
             <p className="mt-5 text-[9px] lg:text-[10px] font-black text-primary-400 uppercase tracking-widest leading-relaxed">
               Find your Reference ID (TID) in your <span className="text-accent italic">"My Orders"</span> dashboard
             </p>
           </div>
        </div>

        {order ? (
          <div className="animate-fade-in px-2">
            <div className="max-w-5xl mx-auto mb-16">
               <div className="p-8 lg:p-14 bg-primary-950 rounded-[2rem] lg:rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 text-center md:text-left">
                     <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-3">Status Update</p>
                     <h2 className="text-3xl lg:text-5xl font-serif font-bold italic capitalize">{order.orderStatus || 'Processing'}</h2>
                  </div>
                  <div className="relative z-10 flex flex-wrap justify-center gap-8 lg:gap-16 text-center md:text-left">
                     <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Authenticated</p>
                        <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                     </div>
                     <div className="hidden lg:block w-[1px] h-12 bg-white/10" />
                     <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Total Valuation</p>
                        <p className="font-bold text-lg text-accent">£{order.totalPrice?.toFixed(2)}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="max-w-4xl mx-auto mb-24">
               <div className="relative px-4">
                  <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-primary-100" />
                  
                  <div className="space-y-12 lg:space-y-20">
                     {getMilestones(order.orderStatus).map((milestone, idx) => (
                       <div key={idx} className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-8 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                          <div className="hidden lg:block lg:w-1/2 text-right px-12">
                             {idx % 2 === 0 && (
                               <>
                                 <div className={`text-[10px] font-black uppercase tracking-widest mb-3 ${milestone.status === 'Complete' ? 'text-green-500' : milestone.status === 'In Progress' ? 'text-accent' : 'text-primary-300'}`}>
                                    {milestone.status}
                                 </div>
                                 <h4 className="text-2xl font-serif font-bold text-primary-950 mb-3">{milestone.title}</h4>
                                 <p className="text-primary-400 text-sm leading-relaxed">{milestone.desc}</p>
                               </>
                             )}
                          </div>
                          
                          <div className="lg:w-1/2 lg:hidden pl-16">
                              <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${milestone.status === 'Complete' ? 'text-green-500' : milestone.status === 'In Progress' ? 'text-accent' : 'text-primary-300'}`}>
                                {milestone.status}
                              </div>
                              <h4 className="text-xl font-serif font-bold text-primary-950 mb-2">{milestone.title}</h4>
                              <p className="text-primary-400 text-xs leading-relaxed">{milestone.desc}</p>
                          </div>

                          <div className="absolute left-[26px] lg:relative lg:left-0 z-10 w-10 h-10 bg-white border-2 border-primary-50 rounded-full flex items-center justify-center shadow-lg">
                             <div className={`w-3 h-3 rounded-full animate-pulse ${milestone.status === 'Complete' ? 'bg-green-500 animate-none shadow-[0_0_15px_rgba(34,197,94,0.5)]' : milestone.status === 'In Progress' ? 'bg-accent shadow-[0_0_15px_rgba(180,83,9,0.5)]' : 'bg-primary-100 animate-none'}`} />
                          </div>
                          
                          <div className="hidden lg:block lg:w-1/2 text-left px-12">
                             {idx % 2 !== 0 && (
                               <>
                                 <div className={`text-[10px] font-black uppercase tracking-widest mb-3 ${milestone.status === 'Complete' ? 'text-green-500' : milestone.status === 'In Progress' ? 'text-accent' : 'text-primary-300'}`}>
                                    {milestone.status}
                                 </div>
                                 <h4 className="text-2xl font-serif font-bold text-primary-950 mb-3">{milestone.title}</h4>
                                 <p className="text-primary-400 text-sm leading-relaxed">{milestone.desc}</p>
                               </>
                             )}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ) : !loading && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24">
             <div className="p-8 lg:p-12 bg-primary-950 text-white rounded-[2.5rem] lg:rounded-[4rem] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                   <h3 className="text-2xl lg:text-3xl font-serif font-bold mb-5 italic">Crafting Phase</h3>
                   <p className="text-primary-400 leading-relaxed mb-10 text-xs lg:text-sm">
                      Your curation is currently with our master artisans. We use heritage techniques to ensure every stitch meets our signature standards.
                   </p>
                   <div className="flex items-center gap-4 text-accent font-black uppercase tracking-[0.2em] text-[9px] lg:text-[10px]">
                      <Clock className="w-5 h-5" />
                      <span>Timeline: 14-21 Business Days</span>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
             </div>

             <div className="p-8 lg:p-12 bg-primary-50 rounded-[2.5rem] lg:rounded-[4rem] border border-primary-100 group">
                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-primary-950 mb-5 italic">Delivery Protocol</h3>
                <p className="text-primary-500 leading-relaxed mb-10 text-xs lg:text-sm">
                   Upon final authentication, our concierge will coordinate a white-glove delivery experience tailored to your schedule.
                </p>
                <div className="flex items-center gap-4 text-primary-950 font-black uppercase tracking-[0.2em] text-[9px] lg:text-[10px]">
                   <Truck className="w-5 h-5 text-accent" />
                   <span>Priority White-Glove Logistics</span>
                </div>
             </div>
          </div>
        )}

        <div className="mt-20 lg:mt-32 p-8 lg:p-16 bg-primary-50 rounded-[2.5rem] lg:rounded-[5rem] text-center border border-primary-100 max-w-4xl mx-auto relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,83,9,0.03),transparent)]" />
           <div className="relative z-10">
             <Package className="w-10 h-10 text-accent mx-auto mb-8" />
             <h3 className="text-2xl font-serif font-bold text-primary-950 mb-4 italic">Bespoke Concierge</h3>
             <p className="text-primary-500 max-w-xl mx-auto text-xs lg:text-sm leading-relaxed mb-8">
                For detailed status inquiries or architectural consultations, our specialists are available via our dedicated private line.
             </p>
             <div className="w-16 h-[1px] bg-accent/20 mx-auto mb-8" />
             <p className="text-primary-950 font-black uppercase tracking-[0.4em] text-[10px]">07378957840</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

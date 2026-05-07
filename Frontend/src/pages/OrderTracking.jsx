import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
      const cleanId = id.trim().replace(/^#/, '');
      const { data } = await API.get(`/order/track/${cleanId}`);
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
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Order Logistics</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
           <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#F2EDE7] rounded-full mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[#D7282F]" />
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">White-Glove Logistics</span>
           </div>
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-gray-900 mb-8 leading-tight tracking-tighter">
              Track Your <br/><span className="italic text-gray-400">Masterpiece</span>
           </h1>
           
           <div className="max-w-xl mx-auto mb-10">
             <form onSubmit={handleTrack} className="relative group">
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Reference ID (TID)"
                  className="w-full pl-8 pr-28 py-6 bg-gray-50 border border-gray-100 rounded-sm focus:border-gray-400 outline-none transition-all text-sm font-bold placeholder:text-gray-300 shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-8 py-4 rounded-sm hover:bg-[#D7282F] transition-all disabled:opacity-50 font-bold text-xs uppercase tracking-widest"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Track'}
                </button>
             </form>
             <p className="mt-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               Your Reference ID can be found in your confirmation email
             </p>
           </div>
        </div>

        {order ? (
          <div className="animate-fade-in max-w-5xl mx-auto">
             <div className="p-10 lg:p-16 bg-gray-900 rounded-sm text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden mb-20">
                <div className="relative z-10 text-center md:text-left">
                   <p className="text-[10px] font-black text-[#D7282F] uppercase tracking-[0.4em] mb-3">Current Status</p>
                   <h2 className="text-4xl lg:text-5xl font-serif font-black italic capitalize">{order.orderStatus || 'Processing'}</h2>
                </div>
                <div className="relative z-10 flex flex-wrap justify-center gap-12 text-center md:text-left">
                   <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Authenticated</p>
                      <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div className="hidden lg:block w-[1px] h-12 bg-white/10" />
                   <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Total Valuation</p>
                      <p className="font-bold text-lg text-[#D7282F]">£{order.totalPrice?.toLocaleString()}</p>
                   </div>
                </div>
             </div>

             <div className="max-w-4xl mx-auto mb-32 relative">
                <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gray-100" />
                
                <div className="space-y-20">
                   {getMilestones(order.orderStatus).map((milestone, idx) => (
                     <div key={idx} className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-8 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="hidden lg:block lg:w-1/2 text-right px-12">
                           {idx % 2 === 0 && (
                             <>
                               <div className={`text-[10px] font-black uppercase tracking-widest mb-3 ${milestone.status === 'Complete' ? 'text-[#51823F]' : milestone.status === 'In Progress' ? 'text-[#D7282F]' : 'text-gray-300'}`}>
                                  {milestone.status}
                               </div>
                               <h4 className="text-2xl font-serif font-black text-gray-900 mb-3 tracking-tight">{milestone.title}</h4>
                               <p className="text-gray-500 text-sm leading-relaxed">{milestone.desc}</p>
                             </>
                           )}
                        </div>
                        
                        <div className="lg:w-1/2 lg:hidden pl-20">
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${milestone.status === 'Complete' ? 'text-[#51823F]' : milestone.status === 'In Progress' ? 'text-[#D7282F]' : 'text-gray-300'}`}>
                              {milestone.status}
                            </div>
                            <h4 className="text-xl font-serif font-black text-gray-900 mb-2 tracking-tight">{milestone.title}</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">{milestone.desc}</p>
                        </div>

                        <div className="absolute left-[28px] lg:relative lg:left-0 z-10 w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl">
                           <div className={`w-3 h-3 rounded-full ${milestone.status === 'Complete' ? 'bg-[#51823F]' : milestone.status === 'In Progress' ? 'bg-[#D7282F] animate-pulse' : 'bg-gray-100'}`} />
                        </div>
                        
                        <div className="hidden lg:block lg:w-1/2 text-left px-12">
                           {idx % 2 !== 0 && (
                             <>
                               <div className={`text-[10px] font-black uppercase tracking-widest mb-3 ${milestone.status === 'Complete' ? 'text-[#51823F]' : milestone.status === 'In Progress' ? 'text-[#D7282F]' : 'text-gray-300'}`}>
                                  {milestone.status}
                               </div>
                               <h4 className="text-2xl font-serif font-black text-gray-900 mb-3 tracking-tight">{milestone.title}</h4>
                               <p className="text-gray-500 text-sm leading-relaxed">{milestone.desc}</p>
                             </>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        ) : !loading && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
             <div className="p-10 bg-gray-900 text-white rounded-sm shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                   <h3 className="text-3xl font-serif font-black mb-5 italic tracking-tight">Crafting Phase</h3>
                   <p className="text-gray-400 leading-relaxed mb-10 text-sm">
                      Your curation is currently with our master artisans. We use heritage techniques to ensure every stitch meets our signature standards.
                   </p>
                   <div className="flex items-center gap-4 text-[#D7282F] font-black uppercase tracking-[0.2em] text-[10px]">
                      <Clock className="w-5 h-5" />
                      <span>Timeline: 14-21 Business Days</span>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-[#F2EDE7] rounded-sm group">
                <h3 className="text-3xl font-serif font-black text-gray-900 mb-5 italic tracking-tight">Delivery Protocol</h3>
                <p className="text-gray-600 leading-relaxed mb-10 text-sm">
                   Upon final authentication, our concierge will coordinate a white-glove delivery experience tailored to your schedule.
                </p>
                <div className="flex items-center gap-4 text-gray-900 font-black uppercase tracking-[0.2em] text-[10px]">
                   <Truck className="w-5 h-5 text-[#D7282F]" />
                   <span>Priority White-Glove Logistics</span>
                </div>
             </div>
          </div>
        )}

        <div className="mt-32 p-12 lg:p-20 bg-gray-50 rounded-sm text-center max-w-4xl mx-auto border border-gray-100">
           <Package className="w-12 h-12 text-[#D7282F] mx-auto mb-8" />
           <h3 className="text-3xl font-serif font-black text-gray-900 mb-4 italic tracking-tighter">Bespoke Concierge</h3>
           <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed mb-10 font-medium">
              For detailed status inquiries or architectural consultations, our specialists are available via our dedicated private line.
           </p>
           <div className="w-16 h-[2px] bg-[#D7282F]/20 mx-auto mb-10" />
           <p className="text-gray-900 font-black uppercase tracking-[0.5em] text-xs">07378957840</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;


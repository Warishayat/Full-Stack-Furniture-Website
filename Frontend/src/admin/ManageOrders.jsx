import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Search, Filter, Eye, ChevronRight, Hash, User, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/api/order/getAllOrders');
      setOrders(data.orders || data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/api/order/updateOrderStatus/${orderId}`, { orderStatus: newStatus });
      toast.success(`Transaction marked as ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div>
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-3 block">Global Logistics</span>
           <h1 className="text-4xl lg:text-6xl font-serif font-black text-gray-900 tracking-tighter">Logistics <span className="italic text-gray-400">Registry</span></h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
           <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-[#D7282F] transition-colors" />
              <input 
                type="text" 
                placeholder="Find Order or Patron..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-sm focus:border-gray-900 outline-none text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
              />
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:w-48 px-6 py-4 bg-white border border-gray-100 rounded-sm text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:border-gray-900 transition-all cursor-pointer shadow-sm appearance-none"
              >
                <option value="all">All States</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-32 text-center bg-[#F2EDE7]/30">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D7282F] rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Awaiting Ledger Synchronization...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-32 text-center bg-[#F2EDE7]/30">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">The registry is currently vacant.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.4em]">
                  <th className="p-8">Reference</th>
                  <th className="p-8">Placement Date</th>
                  <th className="p-8">Patronage</th>
                  <th className="p-8">Valuation</th>
                  <th className="p-8">Logistics State</th>
                  <th className="p-8 text-right">Workflow Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#F2EDE7]/20 transition-all group">
                    <td className="p-8">
                       <Link 
                         to={`/order/${order._id}`}
                         className="flex items-center gap-3 group/link"
                       >
                         <div className="w-10 h-10 bg-[#F2EDE7] rounded-sm flex items-center justify-center text-gray-900 group-hover/link:bg-[#D7282F] group-hover/link:text-white transition-all">
                            <Hash className="w-4 h-4" />
                         </div>
                         <span className="font-serif font-black text-gray-900 text-lg group-hover/link:text-[#D7282F] transition-colors underline decoration-[#D7282F]/20 underline-offset-8">
                            {order._id.slice(-8).toUpperCase()}
                         </span>
                       </Link>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center gap-3 text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-300" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                             {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                       </div>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                             {order.user?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-sm mb-0.5">{order.user?.name || 'Private Patron'}</div>
                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{order.user?.email}</div>
                          </div>
                       </div>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center gap-2 text-gray-900 font-black">
                          <CreditCard className="w-4 h-4 text-[#D7282F]" />
                          <span className="text-xl font-serif">£{order.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                       </div>
                    </td>
                    <td className="p-8">
                       <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(order.orderStatus)}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          {order.orderStatus || 'Processing'}
                       </span>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <select
                          className="px-6 py-3 bg-white border border-gray-100 rounded-sm text-[9px] font-black uppercase tracking-widest text-gray-900 outline-none focus:border-gray-900 transition-all cursor-pointer hover:border-gray-900 hover:bg-white appearance-none text-center min-w-[160px]"
                          value={order.orderStatus || 'processing'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="processing">Mark Processing</option>
                          <option value="shipped">Mark Shipped</option>
                          <option value="delivered">Mark Delivered</option>
                          <option value="cancelled">Mark Cancelled</option>
                        </select>
                        <Link 
                          to={`/order/${order._id}`}
                          className="p-3 bg-gray-900 text-white hover:bg-[#D7282F] transition-all border border-gray-100"
                          title="View Details"
                        >
                           <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;

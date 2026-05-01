import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/api/order/getAllOrders');
      setOrders(data.orders || data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
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
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Package className="w-4 h-4 text-primary-500" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
           <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-black mb-3 block">Transaction History</span>
           <h1 className="text-4xl font-serif font-bold text-primary-950">Manage Orders</h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-grow md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Find Order..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-primary-100 rounded-xl focus:ring-2 focus:ring-accent/50 outline-none text-xs font-bold transition-all shadow-sm"
              />
           </div>
           <button className="p-3 bg-white border border-primary-100 rounded-xl text-primary-950 hover:bg-primary-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary-950/5 border border-primary-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-primary-500 font-bold uppercase tracking-widest text-xs">Synchronizing Records...</div>
        ) : orders.length === 0 ? (
          <div className="p-20 text-center text-primary-500 font-bold uppercase tracking-widest text-xs">No transactions recorded yet.</div>
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-primary-950 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-5">Reference</th>
                  <th className="p-5">Timestamp</th>
                  <th className="p-5">Patron Details</th>
                  <th className="p-5">Value</th>
                  <th className="p-5">Current State</th>
                  <th className="p-5 text-right">Workflow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-primary-50 transition-colors">
                    <td className="p-5">
                       <Link 
                         to={`/order/${order._id}`}
                         className="font-serif font-bold text-primary-950 hover:text-accent transition-colors underline decoration-accent/30 underline-offset-4"
                       >
                         #{order._id.slice(-8).toUpperCase()}
                       </Link>
                    </td>
                    <td className="p-5 text-primary-950 text-xs font-black uppercase tracking-widest whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-5">
                      <div className="font-black text-primary-950 text-sm mb-1">{order.user?.name || 'Private Client'}</div>
                      <div className="text-[10px] text-primary-500 font-black uppercase tracking-widest">{order.user?.email}</div>
                    </td>
                    <td className="p-5 font-black text-primary-950 whitespace-nowrap">
                      £{order.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                            {getStatusIcon(order.orderStatus)}
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-primary-950">
                            {order.orderStatus || 'Processing'}
                         </span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        className="px-6 py-3 bg-primary-50 border border-primary-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary-950 outline-none focus:ring-2 focus:ring-accent/50 transition-all cursor-pointer hover:bg-white"
                        value={order.orderStatus || 'processing'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="processing">Mark Processing</option>
                        <option value="shipped">Mark Shipped</option>
                        <option value="delivered">Mark Delivered</option>
                        <option value="cancelled">Mark Cancelled</option>
                      </select>
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

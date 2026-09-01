import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Search, Filter, Eye, ChevronRight, Hash, User, CreditCard, Calendar, Trash2, Edit, X } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    shippingAddress: { fullName: '', phone: '', address: '', city: '', postalCode: '', country: '' },
    notes: '',
    orderStatus: 'processing',
    paymentStatus: 'pending'
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = '';
      if (dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let startDate, endDate;
        
        if (dateFilter === 'today') {
          startDate = new Date(today);
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
        } else if (dateFilter === 'yesterday') {
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 1);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
        } else if (dateFilter === 'this_week') {
          startDate = new Date(today);
          startDate.setDate(today.getDate() - today.getDay());
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
        } else if (dateFilter === 'this_month') {
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
        }
        
        if (startDate && endDate) {
          query = `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
        }
      }
      
      const { data } = await API.get(`/api/order/getAllOrders${query}`);
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
  }, [dateFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/api/order/updateOrderStatus/${orderId}`, { orderStatus: newStatus });
      toast.success(`Transaction marked as ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await API.delete(`/api/order/deleteOrder/${orderId}`);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setEditForm({
      shippingAddress: { ...order.shippingAddress },
      notes: order.notes || '',
      orderStatus: order.orderStatus || 'processing',
      paymentStatus: order.paymentStatus || 'pending'
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/order/updateOrderDetails/${editingOrder._id}`, editForm);
      toast.success('Order updated successfully');
      setIsEditModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
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
    <div className="animate-fade-in pb-20 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div>
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-3 block">Global Logistics</span>
           <h1 className="text-4xl lg:text-6xl font-serif font-medium text-gray-900 tracking-tighter">Logistics Registry</h1>
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
           
           <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="flex-1 sm:w-48 px-6 py-4 bg-white border border-gray-100 rounded-sm text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:border-gray-900 transition-all cursor-pointer shadow-sm appearance-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>

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
                  <tr 
                    key={order._id} 
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="hover:bg-[#F2EDE7]/20 transition-all group cursor-pointer"
                  >
                    <td className="p-8">
                       <Link 
                         to={`/order/${order._id}`}
                         className="flex items-center gap-3 group/link"
                       >
                         <div className="w-10 h-10 bg-[#F2EDE7] rounded-sm flex items-center justify-center text-gray-900 group-hover/link:bg-[#D7282F] group-hover/link:text-white transition-all">
                            <Hash className="w-4 h-4" />
                         </div>
                         <span className="font-serif font-medium text-gray-900 text-lg group-hover/link:text-[#D7282F] transition-colors underline decoration-[#D7282F]/20 underline-offset-8">
                            {order._id.slice(-8).toUpperCase()}
                         </span>
                       </Link>
                    </td>
                    <td className="p-8" onClick={(e) => e.stopPropagation()}>
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
                             {order.user?.name?.charAt(0) || order.shippingAddress?.fullName?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-sm mb-0.5">{order.user?.name || order.shippingAddress?.fullName || 'Private Patron'}</div>
                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{order.user?.email || order.shippingAddress?.email || 'N/A'}</div>
                          </div>
                       </div>
                    </td>
                    <td className="p-8">
                       <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-gray-900 font-black">
                            <CreditCard className="w-4 h-4 text-[#D7282F]" />
                            <span className="text-xl font-serif">£{order.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                         </div>
                         {order.assemblyService && (
                           <span className="inline-block mt-1 text-[8px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm w-max">
                             Assembly Included
                           </span>
                         )}
                       </div>
                    </td>
                    <td className="p-8">
                       <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(order.orderStatus)}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          {order.orderStatus || 'Processing'}
                       </span>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          className="px-4 py-3 bg-white border border-gray-100 rounded-sm text-[9px] font-black uppercase tracking-widest text-gray-900 outline-none focus:border-gray-900 transition-all cursor-pointer hover:border-gray-900 hover:bg-white appearance-none text-center min-w-[140px]"
                          value={order.orderStatus || 'processing'}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="processing">Mark Processing</option>
                          <option value="shipped">Mark Shipped</option>
                          <option value="delivered">Mark Delivered</option>
                          <option value="cancelled">Mark Cancelled</option>
                        </select>
                        
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(order); }}
                          className="p-3 bg-gray-100 text-gray-900 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 rounded-sm"
                          title="Edit Order"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order._id); }}
                          className="p-3 bg-gray-100 text-gray-900 hover:bg-rose-600 hover:text-white transition-all border border-gray-100 rounded-sm"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <Link 
                          to={`/order/${order._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-3 bg-gray-900 text-white hover:bg-[#D7282F] transition-all border border-gray-100 rounded-sm"
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

      {isEditModalOpen && editingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-serif text-gray-900">Edit Order {editingOrder._id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6 text-left">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-50 pb-2">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.shippingAddress.fullName}
                      onChange={(e) => setEditForm({...editForm, shippingAddress: {...editForm.shippingAddress, fullName: e.target.value}})}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                    <input 
                      type="text" 
                      value={editForm.shippingAddress.phone}
                      onChange={(e) => setEditForm({...editForm, shippingAddress: {...editForm.shippingAddress, phone: e.target.value}})}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-gray-900 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Address</label>
                    <input 
                      type="text" 
                      value={editForm.shippingAddress.address}
                      onChange={(e) => setEditForm({...editForm, shippingAddress: {...editForm.shippingAddress, address: e.target.value}})}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">City</label>
                    <input 
                      type="text" 
                      value={editForm.shippingAddress.city}
                      onChange={(e) => setEditForm({...editForm, shippingAddress: {...editForm.shippingAddress, city: e.target.value}})}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                    <input 
                      type="text" 
                      value={editForm.shippingAddress.postalCode}
                      onChange={(e) => setEditForm({...editForm, shippingAddress: {...editForm.shippingAddress, postalCode: e.target.value}})}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-gray-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-50 pb-2">Status & Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Order Status</label>
                    <select 
                      value={editForm.orderStatus}
                      onChange={(e) => setEditForm({...editForm, orderStatus: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-gray-900 outline-none"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Status</label>
                    <select 
                      value={editForm.paymentStatus}
                      onChange={(e) => setEditForm({...editForm, paymentStatus: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-gray-900 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Internal Notes</label>
                    <textarea 
                      value={editForm.notes}
                      onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                      rows="3"
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-gray-900 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-900 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gray-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#D7282F] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;

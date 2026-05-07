import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import API from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/order/getMyOrders');
        setOrders(data.orders || data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 'text-amber-600 bg-amber-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D7282F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Commissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <Link to="/account" className="hover:text-gray-900 transition-colors">Account</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Order History</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-24">
        <div className="mb-16">
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Past Acquisitions</span>
           <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 mb-4 tracking-tighter">My <span className="italic text-gray-400">Orders</span></h1>
           <p className="text-gray-600 text-lg font-medium leading-relaxed max-w-2xl">
              A detailed archive of your curated pieces and their logistics status.
           </p>
        </div>

        {orders.length === 0 ? (
          <div className="py-32 text-center bg-[#F2EDE7] rounded-sm border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-black text-gray-900 mb-2">No Acquisitions Yet</h3>
            <p className="text-gray-500 font-medium mb-10">Your collection is waiting for its first masterpiece.</p>
            <Link to="/products" className="px-10 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#D7282F] transition-all">
               Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => (
              <div key={order._id} className="group">
                {/* Order Header */}
                <div className="bg-[#F2EDE7] p-8 lg:p-10 border border-gray-100 flex flex-wrap gap-8 items-center justify-between rounded-t-sm">
                  <div className="flex gap-12">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Reference</p>
                      <Link to={`/order/${order._id}`} className="text-sm font-bold text-gray-900 hover:text-[#D7282F] transition-colors">
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date Placed</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
                      <p className="text-sm font-bold text-gray-900">£{order.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus || 'Processing'}
                    </span>
                    <Link 
                      to={`/track-order?tid=${order._id.slice(-8).toUpperCase()}`}
                      className="text-[10px] font-black uppercase tracking-widest text-[#D7282F] flex items-center gap-2 hover:underline"
                    >
                      Track Logistics <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8 lg:p-10 border-x border-b border-gray-100 bg-white">
                  <div className="space-y-8">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-24 h-24 bg-gray-50 overflow-hidden shrink-0">
                          <img 
                            src={item.image || item.product?.images?.[0] || 'https://placehold.co/100'} 
                            alt={item.title || item.product?.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h4 className="text-xl font-serif font-black text-gray-900 mb-1">{item.title || item.product?.title || 'Handcrafted Piece'}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Quantity: {item.quantity}</p>
                          <p className="text-sm font-bold text-[#D7282F]">£{(item.price || 0).toLocaleString()}</p>
                        </div>
                        <div className="text-right hidden md:block">
                          <p className="text-lg font-serif font-black text-gray-900 italic">
                            £{( (item.price || 0) * item.quantity ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;


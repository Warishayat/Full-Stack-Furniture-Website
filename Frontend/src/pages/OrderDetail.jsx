import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, ChevronLeft, Calendar, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/order/getOrderById/${id}`);
        const orderData = response.data.order || response.data;
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order detail:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return <Clock className="w-6 h-6 text-amber-500" />;
      case 'shipped': return <Truck className="w-6 h-6 text-blue-500" />;
      case 'delivered': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Package className="w-6 h-6 text-primary-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center max-w-lg border border-primary-100">
          <Package className="w-16 h-16 text-primary-200 mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-primary-950 mb-4">Order Not Found</h2>
          <p className="text-primary-500 mb-8">We couldn't locate the details for this transaction. It may have been archived or the reference is incorrect.</p>
          <Link to="/orders" className="inline-block px-10 py-4 bg-primary-950 text-white font-bold rounded-full hover:bg-accent transition-all">
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen pt-32 lg:pt-40 pb-24 lg:pb-32 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link 
              to={(user?.role === 'admin' || user?.isAdmin) ? "/admin/orders" : "/orders"} 
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-400 hover:text-accent transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              { (user?.role === 'admin' || user?.isAdmin) ? 'Back to Order Management' : 'Back to Order History'}
            </Link>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary-950">
              Order <span className="text-accent italic">#{order._id.slice(-8).toUpperCase()}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-primary-100 shadow-sm">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              {getStatusIcon(order.orderStatus)}
            </div>
            <div>
              <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Current Status</p>
              <p className="text-sm font-bold text-primary-950 capitalize">{order.orderStatus || 'Processing'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
          
          {/* Main Content: Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-primary-100 overflow-hidden">
              <div className="p-8 border-b border-primary-50 flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-primary-950">Curated Items</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">{order.items?.length || 0} Pieces</span>
              </div>
              <div className="p-8">
                <ul className="divide-y divide-primary-50">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="py-8 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-8">
                        <div className="w-24 h-32 bg-primary-50 rounded-2xl overflow-hidden border border-primary-100 group shrink-0">
                          <img 
                            src={item.image || item.product?.images?.[0] || 'https://placehold.co/200x300'} 
                            alt={item.title || item.product?.title || item.product?.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <h4 className="text-lg font-serif font-bold text-primary-950 truncate">{item.title || item.product?.title || item.product?.name || 'Handcrafted Piece'}</h4>
                          <p className="text-xs text-primary-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                          <p className="text-accent font-bold">£{(item.price || item.product?.price || 0).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-serif font-bold text-primary-950">
                            £{(item.price ? item.price * item.quantity : (item.product?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Timeline/History - Optional UI Polish */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-primary-100 p-8">
               <h3 className="text-xl font-serif font-bold text-primary-950 mb-8">Transaction Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-primary-400" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Date Placed</p>
                        <p className="font-bold text-primary-950">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        <p className="text-xs text-primary-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0">
                        <CreditCard className="w-6 h-6 text-primary-400" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Payment Method</p>
                        <p className="font-bold text-primary-950">Secure Card Payment</p>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Verified & Processed</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar: Customer & Summary */}
          <div className="space-y-8">
            {/* Customer Details */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-primary-100 p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-serif font-bold text-primary-950 mb-8 relative z-10">Patron Information</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-accent" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Name</p>
                      <p className="font-bold text-primary-950">{order.user?.name || 'Private Client'}</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary-400" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Delivery Address</p>
                      {order.customerDetails?.address ? (
                        <address className="not-italic font-bold text-primary-950 text-sm leading-relaxed">
                          {order.customerDetails.address.line1}<br />
                          {order.customerDetails.address.city}, {order.customerDetails.address.postalCode}<br />
                          {order.customerDetails.address.country}
                        </address>
                      ) : (
                        <p className="text-sm font-bold text-primary-400 italic">Digital Delivery / Pick-up</p>
                      )}
                   </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-primary-950 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden">
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
               <h3 className="text-xl font-serif font-bold mb-8 relative z-10">Financial Summary</h3>
               
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center text-primary-300">
                     <span className="text-xs uppercase tracking-widest font-black">Subtotal</span>
                     <span className="font-bold">£{order.totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-primary-300">
                     <span className="text-xs uppercase tracking-widest font-black">Shipping</span>
                     <span className="text-accent font-black uppercase tracking-widest text-[9px]">Complimentary</span>
                  </div>
                  <div className="h-px bg-white/10 my-6" />
                  <div className="flex justify-between items-end">
                     <span className="text-sm font-serif font-bold italic">Total Value</span>
                     <span className="text-4xl font-serif font-bold text-accent">£{order.totalPrice?.toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

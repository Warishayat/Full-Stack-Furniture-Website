import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import API from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/api/order/getMyOrders');
        setOrders(data.orders || data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-primary-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-primary-100 text-primary-800 border-primary-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen pt-32 lg:pt-32 pb-24 lg:pb-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <h1 className="text-3xl font-serif font-medium text-primary-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-primary-100">
            <Package className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-primary-900 mb-2">No orders found</h3>
            <p className="text-primary-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden">
                {/* Order Header */}
                <div className="bg-primary-50 p-6 border-b border-primary-100 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-500 mb-1">Order ID</p>
                    <Link to={`/order/${order._id}`} className="font-medium text-primary-950 hover:text-accent transition-colors underline decoration-accent/20 underline-offset-4">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-primary-500 mb-1">Date</p>
                    <p className="font-medium text-primary-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-500 mb-1">Total</p>
                    <p className="font-medium text-primary-900">£{order.totalPrice?.toFixed(2)}</p>
                  </div>
                  <div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                      <span className="mr-2">{getStatusIcon(order.orderStatus)}</span>
                      <span className="capitalize">{order.orderStatus || 'Processing'}</span>
                    </div>
                  </div>
                  <div>
                    <Link 
                      to={`/track-order?tid=${order._id.slice(-8).toUpperCase()}`}
                      className="px-4 py-2 bg-primary-950 text-white text-xs font-bold rounded-lg hover:bg-accent transition-all flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Track Order
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-medium text-primary-900 mb-4">Items</h4>
                   <ul className="divide-y divide-primary-100">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary-50 rounded-md overflow-hidden shrink-0">
                          <img 
                            src={item.product?.images?.[0] || 'https://placehold.co/100'} 
                            alt={item.product?.title || item.product?.name || 'Product'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-primary-900">{item.product?.title || item.product?.name || 'Unknown Product'}</h5>
                          <p className="text-sm text-primary-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary-900">
                            £{((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Shipping info (Optional based on backend) */}
                {order.shippingAddress && (
                  <div className="bg-secondary p-6 border-t border-primary-100">
                    <h4 className="font-medium text-primary-900 mb-2">Shipping Address</h4>
                    <address className="text-sm text-primary-600 not-italic">
                      {order.shippingAddress.line1}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </address>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

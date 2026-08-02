import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Success = () => {
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Immediate payment verification fallback
    const verifyAndClear = async () => {
      try {
        if (orderId) {
          const { data } = await API.post('/api/order/verifyPayment', { orderId });
          if (data && data.order && window.fbq && !window.purchaseTracked) {
            window.fbq('track', 'Purchase', {
              value: data.order.totalPrice,
              currency: 'GBP',
              content_ids: data.order.items.map(i => i.product),
              content_type: 'product'
            });
            window.purchaseTracked = true;
          }
        }
      } catch (err) {
        console.log('Payment verification fallback error:', err);
      } finally {
        setVerifying(false);
        await clearCart();
        // Clear local storage pending items if any
        localStorage.removeItem('guest_cart_items');
        localStorage.removeItem('pending_guest_order_id');
      }
    };

    verifyAndClear();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-24 px-6 lg:px-12 text-center pb-32">
      <div className="bg-[#F2EDE7]/20 p-10 md:p-16 rounded-sm border border-gray-100 max-w-2xl w-full">
        {verifying ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-10 h-10 border border-gray-200 border-t-[#D7282F] rounded-full animate-spin mb-6"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Verifying secure payment...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 bg-[#D7282F]/10 rounded-full flex items-center justify-center mb-8 border border-[#D7282F]/20">
              <CheckCircle className="w-8 h-8 text-[#D7282F]" />
            </div>
            
            <span className="text-[#D7282F] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
              Transaction Approved
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-6 tracking-tighter">
              Payment Successful
            </h1>
            
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed font-medium">
              Thank you for your order. We've received your payment and will start processing your bespoke order right away. You will receive an email confirmation shortly.
            </p>
            
            {orderId && (
              <div className="mb-10 p-4 border border-gray-100 bg-white">
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mb-1">
                  Order Reference
                </p>
                <p className="text-lg text-gray-900 font-serif font-medium tracking-widest">
                  {orderId.slice(-8).toUpperCase()}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              {user ? (
                <Link 
                  to="/orders" 
                  className="px-8 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#D7282F] transition-all shadow-md w-full sm:w-auto"
                >
                  View My Orders
                </Link>
              ) : (
                <Link 
                  to={orderId ? `/track-order?orderId=${orderId}` : '/track-order'} 
                  className="px-8 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#D7282F] transition-all shadow-md w-full sm:w-auto"
                >
                  Track My Order
                </Link>
              )}
              <Link 
                to="/products" 
                className="px-8 py-4 bg-white border border-gray-200 text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:border-gray-900 hover:bg-gray-50 transition-all w-full sm:w-auto"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;

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
          await API.post('/api/order/verifyPayment', { orderId });
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-secondary pt-24 lg:pt-36 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-primary-100 max-w-lg w-full">
        {verifying ? (
          <div className="flex flex-col items-center py-12">
            <Loader className="w-12 h-12 text-[#51823F] animate-spin mb-4" />
            <h2 className="text-xl font-bold font-serif text-slate-800">Verifying your secure payment...</h2>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-medium text-primary-900 mb-4">Payment Successful!</h1>
            <p className="text-primary-600 mb-8">
              Thank you for your order. We've received your payment and will start processing your order right away. You will receive an email confirmation shortly.
            </p>
            {orderId && (
              <p className="text-xs text-slate-400 font-bold uppercase mb-6 tracking-widest">
                Order Reference: <span className="text-slate-800 font-extrabold font-mono">{orderId.slice(-8).toUpperCase()}</span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link 
                  to="/orders" 
                  className="px-6 py-3 bg-[#51823F] hover:bg-[#457036] text-white rounded-md font-medium transition-colors text-sm font-semibold"
                >
                  View My Orders
                </Link>
              ) : (
                <Link 
                  to={orderId ? `/track-order?orderId=${orderId}` : '/track-order'} 
                  className="px-6 py-3 bg-[#51823F] hover:bg-[#457036] text-white rounded-md font-medium transition-colors text-sm font-semibold"
                >
                  Track My Order
                </Link>
              )}
              <Link 
                to="/products" 
                className="px-6 py-3 bg-primary-50 text-primary-900 rounded-md font-medium hover:bg-primary-100 transition-colors text-sm font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;

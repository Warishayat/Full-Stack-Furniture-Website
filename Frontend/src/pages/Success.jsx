import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Success = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart upon successful checkout
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-secondary pt-24 lg:pt-36 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-primary-100 max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-serif font-medium text-primary-900 mb-4">Payment Successful!</h1>
        <p className="text-primary-600 mb-8">
          Thank you for your order. We've received your payment and will start processing your order right away. You will receive an email confirmation shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/orders" 
            className="px-6 py-3 bg-primary-900 text-white rounded-md font-medium hover:bg-accent transition-colors"
          >
            View My Orders
          </Link>
          <Link 
            to="/products" 
            className="px-6 py-3 bg-primary-50 text-primary-900 rounded-md font-medium hover:bg-primary-100 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;

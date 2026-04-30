import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const Cancel = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-secondary py-12 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-primary-100 max-w-lg w-full">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-serif font-medium text-primary-900 mb-4">Payment Cancelled</h1>
        <p className="text-primary-600 mb-8">
          Your payment was cancelled and no charges were made. If you experienced an issue during checkout, please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/cart" 
            className="px-6 py-3 bg-primary-900 text-white rounded-md font-medium hover:bg-accent transition-colors"
          >
            Return to Cart
          </Link>
          <Link 
            to="/contact" 
            className="px-6 py-3 bg-primary-50 text-primary-900 rounded-md font-medium hover:bg-primary-100 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;

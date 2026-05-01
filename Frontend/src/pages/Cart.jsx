import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Cart = () => {
  const { cartItems, updateCart, removeFromCart, cartTotal, loading } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      const { data } = await API.post('/api/order/createCheckoutSession');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary flex items-start justify-center pt-24 lg:pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-lg text-center bg-white p-12 rounded-3xl shadow-xl border border-primary-100">
          <div className="w-24 h-24 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-8 text-accent">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary-950 mb-4">Start your journey</h2>
          <p className="text-primary-500 mb-10 leading-relaxed">Please sign in to view your selection and complete your luxury home curation.</p>
          <Link to="/login" className="inline-flex px-12 py-4 bg-primary-950 text-white font-bold rounded-full hover:bg-accent transition-all shadow-lg hover:shadow-accent/30">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-secondary flex items-start justify-center pt-24 lg:pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-lg text-center bg-white p-12 rounded-3xl shadow-xl border border-primary-100">
          <div className="w-24 h-24 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-8 text-accent">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary-950 mb-4">Your curation is empty</h2>
          <p className="text-primary-500 mb-10 leading-relaxed">Discover our timeless pieces and start building your dream living space today.</p>
          <Link to="/products" className="inline-flex px-12 py-4 bg-primary-950 text-white font-bold rounded-full hover:bg-accent transition-all shadow-lg hover:shadow-accent/30">
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen pt-32 lg:pt-40 pb-20 lg:pb-32 px-4 md:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary-950 mb-3">Your Selection</h1>
            <p className="text-primary-500 font-medium">Review your pieces before completing your order.</p>
          </div>
          <Link to="/products" className="group flex items-center text-sm font-bold uppercase tracking-widest text-primary-900 hover:text-accent transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
            Continue Browsing
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6 mt-10 lg:mt-0">
            <div className="bg-white rounded-3xl shadow-sm border border-primary-100/50 overflow-hidden">
              <div className="hidden md:grid md:grid-cols-12 gap-4 p-8 bg-primary-50/30 text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em]">
                <div className="md:col-span-6">Product Details</div>
                <div className="md:col-span-3 text-center">Quantity</div>
                <div className="md:col-span-2 text-right">Total</div>
                <div className="md:col-span-1"></div>
              </div>
              
              <ul className="divide-y divide-primary-50">
                {cartItems.filter(item => item.product).map((item) => (
                  <li key={item._id} className="p-8 hover:bg-primary-50/20 transition-colors">
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-center">
                      
                      {/* Product Info */}
                      <div className="md:col-span-6 flex items-center gap-6 w-full">
                        <Link to={`/product/${item.product?._id}`} className="w-28 h-28 shrink-0 bg-primary-100 rounded-2xl overflow-hidden shadow-inner">
                          <img 
                            src={item.product?.images?.[0] || 'https://placehold.co/150'} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>
                        <div className="space-y-1">
                          <Link to={`/product/${item.product?._id}`}>
                            <h3 className="text-lg font-serif font-bold text-primary-950 hover:text-accent transition-colors line-clamp-1">{item.product?.name}</h3>
                          </Link>
                          <p className="text-accent font-bold text-sm">£{item.product?.price?.toLocaleString()}</p>
                          <p className="text-primary-400 text-xs">SKU: CF-{item.product?._id?.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-3 flex justify-center w-full">
                        <div className="flex items-center bg-primary-50 rounded-full p-1 border border-primary-100">
                          <button 
                            onClick={() => updateCart(item._id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center text-primary-900 hover:bg-white hover:shadow-sm rounded-full transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-primary-950">{item.quantity}</span>
                          <button 
                            onClick={() => updateCart(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-primary-900 hover:bg-white hover:shadow-sm rounded-full transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price Total */}
                      <div className="md:col-span-2 text-right w-full">
                        <span className="text-lg font-bold text-primary-950">
                          £{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Remove */}
                      <div className="md:col-span-1 flex justify-end w-full">
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="w-10 h-10 flex items-center justify-center text-primary-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-primary-950 text-white rounded-[2rem] shadow-2xl p-10 sticky top-32 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              
              <h3 className="text-2xl font-serif font-bold mb-8 relative z-10">Order Summary</h3>
              
              <div className="space-y-6 mb-10 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-primary-300 font-medium">Subtotal</span>
                  <span className="font-bold">£{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-primary-300 font-medium shrink-0">Delivery</span>
                  <span className="text-accent font-bold uppercase tracking-widest text-[10px] text-right leading-tight">
                    {cartTotal > 2000 ? 'Complimentary' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-serif">Estimated Total</span>
                  <span className="text-3xl font-bold text-accent">£{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                <button 
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center px-8 py-5 bg-accent text-white font-bold rounded-full hover:bg-white hover:text-primary-950 transition-all shadow-xl shadow-accent/20"
                >
                  Complete Purchase
                  <ArrowRight className="w-5 h-5 ml-3" />
                </button>
                <p className="text-[10px] text-center text-primary-400 uppercase tracking-[0.2em] font-bold mt-4">
                  Secure Checkout Powered by Stripe
                </p>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-primary-100 flex flex-col items-center text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-950">Safe Delivery</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-primary-100 flex flex-col items-center text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-950">2 Year Warranty</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;

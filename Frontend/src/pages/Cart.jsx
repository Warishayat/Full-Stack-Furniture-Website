import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Cart = () => {
  const { cartItems, updateCart, removeFromCart, cartTotal, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary-100 border-t-accent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>
    );
  }



  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-12 text-center shadow-premium border border-primary-100 animate-fade-in-up">
          <div className="w-24 h-24 mx-auto bg-secondary rounded-full flex items-center justify-center mb-10 text-accent ring-8 ring-secondary/50">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-primary-950 mb-6">Your Curation is Empty</h2>
          <p className="text-primary-600 mb-12 text-lg leading-relaxed">
            Discover our timeless pieces and start building your dream sanctuary today.
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center px-10 py-5 bg-primary-950 text-white font-bold rounded-full hover:bg-accent transition-all duration-300 shadow-xl hover:shadow-accent/30 group"
          >
            Explore Collections
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen pt-32 lg:pt-44 pb-24 px-4 md:px-8 xl:px-16">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-fade-in">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
              <span>Home</span>
              <span className="w-1 h-1 rounded-full bg-accent/30"></span>
              <span className="text-primary-400">Shopping Cart</span>
            </nav>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-primary-950 leading-tight mb-4">
              Your <span className="italic text-accent">Selection</span>
            </h1>
            <p className="text-primary-500 text-lg font-medium">
              Review and finalize your curated pieces for a refined living space.
            </p>
          </div>
          <Link to="/products" className="group flex items-center text-xs font-black uppercase tracking-[0.3em] text-primary-900 hover:text-accent transition-all duration-300 pb-2 border-b-2 border-transparent hover:border-accent">
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
            Continue Browsing
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Cart Items List */}
          <div className="lg:w-2/3 space-y-8 animate-fade-in-up delay-100">
            <div className="space-y-6">
              {cartItems.filter(item => item.product).map((item, idx) => (
                <div 
                  key={item._id} 
                  className="group bg-white rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-premium border border-primary-100/50 transition-all duration-500 flex flex-col md:flex-row gap-8 items-center"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Product Image */}
                  <Link 
                    to={`/product/${item.product}`} 
                    className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-primary-50 relative shrink-0 shadow-inner"
                  >
                    <img 
                      src={item.image || 'https://placehold.co/400x400?text=Premium+Furniture'} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/5 transition-colors duration-500" />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow flex flex-col md:flex-row justify-between w-full gap-8">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Link to={`/product/${item.product}`}>
                          <h3 className="text-2xl font-serif font-bold text-primary-950 hover:text-accent transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">
                            Variant: <span className="text-primary-950">{item.variant || 'Standard'}</span>
                          </span>
                          {item.material && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">
                              Material: <span className="text-primary-950">{item.material}</span>
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">
                            Color: <span className="text-primary-950">{item.color || 'Default'}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center bg-secondary rounded-full p-1.5 border border-primary-100 shadow-inner">
                          <button 
                            onClick={() => updateCart(item._id, Math.max(1, item.quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center text-primary-900 hover:bg-white hover:text-accent rounded-full transition-all duration-300 shadow-sm"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-lg text-primary-950">{item.quantity}</span>
                          <button 
                            onClick={() => updateCart(item._id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-primary-900 hover:bg-white hover:text-accent rounded-full transition-all duration-300 shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="md:text-right flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-2">
                      <p className="text-primary-400 text-xs font-medium uppercase tracking-widest">Price per unit</p>
                      <p className="text-primary-950 text-xl font-bold">£{Number(item.price).toLocaleString()}</p>
                      <div className="h-px w-12 bg-primary-100 my-2 hidden md:block" />
                      <p className="text-accent text-3xl font-bold">
                        £{(Number(item.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-primary-50">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-accent shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary-950 mb-1">White Glove Delivery</h4>
                  <p className="text-xs text-primary-500 leading-relaxed">Professional assembly and packaging removal included.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-primary-50">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-accent shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary-950 mb-1">Lifetime Assurance</h4>
                  <p className="text-xs text-primary-500 leading-relaxed">Every piece is backed by our comprehensive warranty.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-primary-50">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-accent shrink-0">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary-950 mb-1">Simple Returns</h4>
                  <p className="text-xs text-primary-500 leading-relaxed">Enjoy peace of mind with our 30-day return policy.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3 animate-fade-in-up delay-300">
            <div className="bg-primary-950 text-white rounded-[2.5rem] shadow-2xl p-10 lg:p-12 sticky top-32 overflow-hidden border border-white/5">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px]" />
              
              <h3 className="text-3xl font-serif font-bold mb-10 relative z-10 border-b border-white/10 pb-6">
                Order <span className="italic text-accent">Summary</span>
              </h3>
              
              <div className="space-y-6 mb-12 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-primary-300 font-medium tracking-wide">Subtotal</span>
                  <span className="text-xl font-bold">£{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-primary-300 font-medium tracking-wide">Delivery</span>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-accent text-white">
                      Complimentary
                    </span>
                    <p className="text-[9px] text-primary-400 mt-2 tracking-wider">Free Delivery on all orders</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-300 font-medium tracking-wide">Vat (0%)</span>
                  <span className="font-bold text-primary-200">£0.00</span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full my-8" />
                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm text-primary-400 font-bold uppercase tracking-widest block mb-1">Total Amount</span>
                    <span className="text-4xl lg:text-5xl font-bold text-white leading-none tracking-tighter">
                      £{cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <button 
                  onClick={handleCheckout}
                  className="w-full group relative overflow-hidden flex items-center justify-center px-8 py-6 bg-accent text-white font-black uppercase tracking-[0.3em] text-xs rounded-full hover:bg-white hover:text-primary-950 transition-all duration-500 shadow-2xl shadow-accent/20"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Secure Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
                
                <div className="flex items-center justify-center gap-4 py-4 opacity-60">
                   <CreditCard className="w-5 h-5" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Encryption</span>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[10px] text-primary-300 leading-relaxed italic text-center">
                    "Our commitment to quality ensures that every piece in your selection is crafted to last generations."
                  </p>
                </div>
              </div>
            </div>
            
            {/* Promo / Info */}
            <div className="mt-8 p-8 bg-white rounded-[2rem] border border-primary-100 flex items-center justify-between group cursor-pointer hover:border-accent transition-colors duration-300">
               <div>
                  <h4 className="text-sm font-bold text-primary-950 uppercase tracking-widest mb-1">Have a concierge code?</h4>
                  <p className="text-xs text-primary-500">Apply your exclusive membership reward.</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary-950 group-hover:bg-accent group-hover:text-white transition-all">
                  <Plus className="w-5 h-5" />
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;


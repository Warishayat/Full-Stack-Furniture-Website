import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MapPin, Phone, Mail, Sparkles, ShieldCheck, Send } from 'lucide-react';
import { useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setIsSubmitting(true);
      const { data } = await API.post('/newsletter/subscribe', { email });
      toast.success(data.message);
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="bg-white text-gray-700 pt-20 pb-10 border-t border-gray-100">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Social Icons Bar */}
        <div className="flex justify-center gap-6 mb-12">
          {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
            <a key={idx} href="#" className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Icon size={18} className="text-gray-600" />
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-t border-gray-100 pt-12">
          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/help" className="hover:underline">Help Centre</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/track-order" className="hover:underline">Track My Order</Link></li>
              <li><Link to="/login" className="hover:underline">My Account</Link></li>
              <li className="pt-4 flex flex-col gap-2">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Speak to an advisor:</span>
                 <a href="tel:07378957840" className="text-lg font-bold text-gray-900 hover:text-[#D7282F] transition-colors">07378957840</a>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">About us</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:underline">Our Story</Link></li>
              <li><Link to="/shipping-policy" className="hover:underline">Delivery & Logistics</Link></li>
              <li><Link to="/warranty" className="hover:underline">Warranty & Quality</Link></li>
              <li><Link to="/privacy-policy" className="hover:underline">Privacy Protocol</Link></li>
            </ul>
          </div>

          {/* Inspiration */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Inspiration</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/inspiration" className="hover:underline">Design Inspiration</Link></li>
              <li><Link to="/inspiration" className="hover:underline">Customer Homes</Link></li>
            </ul>
          </div>

          {/* Trustpilot Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-500 text-2xl font-bold">★</span>
              <span className="text-xl font-bold">Trustpilot</span>
            </div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-6 h-6 flex items-center justify-center ${i < 4 ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <span className="text-white text-xs">★</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold mb-8">TrustScore 4.6 | 30,069 reviews</p>
            
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Payment options:</p>
            <div className="flex flex-wrap gap-2">
              {['VISA', 'MASTERCARD', 'PAYPAL'].map((p) => (
                <div key={p} className="px-3 py-1 border border-gray-200 rounded text-[10px] font-bold text-gray-400">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-y border-gray-100 py-16 mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center lg:text-left">
               <h3 className="text-3xl font-serif font-black text-gray-900 mb-4 tracking-tighter">Join the <span className="italic text-[#D7282F]">Inner Circle</span></h3>
               <p className="text-gray-500 font-medium">Subscribe to receive early access to new curations and bespoke design insights.</p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-lg relative group">
               <input 
                 type="email" 
                 required
                 placeholder="Enter your email address" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-100 px-8 py-6 outline-none focus:bg-white focus:border-gray-900 transition-all font-medium pr-20"
               />
               <button 
                 disabled={isSubmitting}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-4 bg-gray-900 text-white hover:bg-[#D7282F] transition-all disabled:opacity-50"
               >
                 {isSubmitting ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
               </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter text-black">EliteSeating</span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 border-l border-gray-200 pl-2">Ltd.</span>
            </Link>
            <p className="text-[10px] text-gray-400 leading-relaxed max-w-2xl">
              © 2026 EliteSeating Ltd. All Rights Reserved. | Company no. 05349107 | Vat no. GB867099668
              <br />
              EliteSeating Ltd. is authorised and regulated by the Financial Conduct Authority, register number 719600 and act as a credit broker and not a lender.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-600">
            <Link to="/privacy-policy" className="hover:underline">Privacy policy</Link>
            <Link to="/shipping-policy" className="hover:underline">Shipping policy</Link>
            <Link to="/warranty" className="hover:underline">Warranty policy</Link>
            <Link to="/about" className="hover:underline">Our Story</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

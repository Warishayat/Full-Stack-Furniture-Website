import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MapPin, Phone, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-950 text-white pt-24 pb-12 overflow-hidden relative border-t border-white/5">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-20">
          
          {/* Brand Identity */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-accent rotate-45 flex items-center justify-center group-hover:rotate-[225deg] transition-all duration-1000 shadow-lg shadow-accent/20">
                 <Sparkles className="w-5 h-5 text-white -rotate-45 group-hover:-rotate-[225deg] transition-all duration-1000" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-white tracking-[0.1em]">
                EliteSeating<span className="text-accent">.</span>
              </h1>
            </Link>
            <p className="text-primary-400 text-sm leading-relaxed max-w-xs text-left">
              Defining the future of luxury living through timeless craftsmanship and sustainable design. Join EliteSeating to create masterpieces for every home.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-500 border border-white/10"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-accent">Curations</h3>
            <ul className="space-y-4">
              {[
                { name: 'Living Room', link: '/products' },
                { name: 'Dining Space', link: '/products' },
                { name: 'Bedroom Suite', link: '/products' },
                { name: 'Bespoke Design', link: '/bespoke' },
                { name: 'About Our UK Story', link: '/about' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="text-primary-300 hover:text-white text-sm transition-all flex items-center group">
                    <span className="w-0 h-[1px] bg-accent mr-0 group-hover:w-4 group-hover:mr-3 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-accent">Service</h3>
            <ul className="space-y-4">
              {[
                { name: 'Order Tracking', link: '/track-order' },
                { name: 'Shipping Policy', link: '/shipping-policy' },
                { name: 'Warranty Claims', link: '/warranty' },
                { name: 'Privacy Policy', link: '/privacy-policy' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="text-primary-300 hover:text-white text-sm transition-all flex items-center group">
                    <span className="w-0 h-[1px] bg-accent mr-0 group-hover:w-4 group-hover:mr-3 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-10 text-left">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-accent">Contact Us</h3>
              <ul className="space-y-4 text-sm text-primary-300">
                <li className="flex items-start gap-4">
                  <MapPin size={18} className="text-accent shrink-0" />
                  <span>Units A4 Rockfield St,<br/> Blackburn, England, United Kingdom, BB2 3RG</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone size={18} className="text-accent shrink-0" />
                  <span>07378957840</span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail size={18} className="text-accent shrink-0" />
                  <span>eilteseatingltd@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-primary-500 text-[10px] uppercase tracking-widest font-bold">
            © 2026 ELITESEATING. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
             <Link to="/about" className="text-[10px] text-primary-500 hover:text-white font-bold uppercase tracking-widest">About Us</Link>
             <Link to="/privacy-policy" className="text-[10px] text-primary-500 hover:text-white font-bold uppercase tracking-widest">Privacy Policy</Link>
             <Link to="/shipping-policy" className="text-[10px] text-primary-500 hover:text-white font-bold uppercase tracking-widest">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

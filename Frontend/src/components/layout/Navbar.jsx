import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, Menu, X, Search, ChevronDown, LayoutGrid, LogOut, Package, Sparkles, ShoppingBag, Heart, Activity, ArrowRight } from 'lucide-react';
import API from '../../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 15, mins: 42, secs: 47 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchVisible(false);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let endtime = localStorage.getItem('saleEndTime_28days');
    if (!endtime) {
      endtime = new Date().getTime() + (28 * 24 * 60 * 60 * 1000) + (15 * 60 * 60 * 1000) + (42 * 60 * 1000) + (47 * 1000);
      localStorage.setItem('saleEndTime_28days', endtime);
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endtime - now;

      if (distance < 0) {
        const newEndtime = new Date().getTime() + (28 * 24 * 60 * 60 * 1000) + (15 * 60 * 60 * 1000);
        localStorage.setItem('saleEndTime_28days', newEndtime);
        endtime = newEndtime;
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await API.get('/category/getallCategories');
        const cats = data.categories || data || [];
        
        // Group subcategories under parents
        const parents = cats.filter(c => !c.parent);
        const structured = parents.map(p => ({
          ...p,
          children: cats.filter(c => (c.parent?._id === p._id) || (c.parent === p._id))
        })).filter(p => p.image || p.children.length > 0);
        
        const excludedCategories = ['dinning sets', 'tables', 'chairs'];
        const filteredCategories = structured.filter(cat => !excludedCategories.includes(cat.name.toLowerCase()));
        
        setCategories(filteredCategories);
      } catch (err) { console.error(err); }
    };
    fetchCats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchVisible(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-100 flex flex-col">
        {/* Promotional Banner */}
        <div className="bg-[#D7282F] text-white text-center py-2 px-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-red-700 transition-colors">
          <div className="text-xs md:text-sm font-medium tracking-wide">
            Midsummer Sale - Up to 50% off - ends in
          </div>
          <div className="text-[10px] md:text-xs font-bold tracking-wider flex items-center gap-1">
            {timeLeft.days} days {timeLeft.hours} hrs {timeLeft.mins} mins {timeLeft.secs} secs <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Top Row: Logo, Search, Icons */}
        <div className="w-full px-4 lg:px-12 py-4 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold tracking-tighter text-black">ComfortSitting</span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-gray-400 border-l border-gray-200 pl-2">Ltd.</span>
            </div>
          </Link>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-6 pl-12 text-sm focus:outline-none focus:border-gray-400 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 ml-auto">
            <button type="button" onClick={() => setIsSearchVisible(!isSearchVisible)} className="md:hidden p-1 sm:p-2 text-gray-600">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            {user?.role === 'admin' && (
              <Link to="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#D7282F] transition-all">
                <Activity className="w-4 h-4 text-[#D7282F]" /> Admin Suite
              </Link>
            )}
            
            <Link to={user ? "/account" : "/login"} className="hidden lg:block p-1 sm:p-2 text-gray-800 hover:text-red-600 transition-colors">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            
            <Link to="/wishlist" className="hidden sm:block p-1 sm:p-2 text-gray-800 hover:text-red-600 transition-colors">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            
            <Link to="/cart" className="relative p-1 sm:p-2 text-gray-800 hover:text-red-600 transition-colors">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:top-0 sm:right-0 bg-black text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 sm:p-2 text-gray-900">
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="hidden lg:block border-t border-gray-50 bg-[#F2EDE7]/10">
          <div className="w-full px-4 md:px-12">
            <nav className="flex items-center justify-between py-4 whitespace-nowrap overflow-x-auto no-scrollbar">
              <Link to="/products?category=sofas" className="text-[10px] font-black uppercase tracking-[0.1em] xl:tracking-[0.2em] text-gray-700 hover:text-black hover:underline underline-offset-4 transition-all">Sofas</Link>
              <Link to="/products?category=sofa-cum-bed" className="text-[10px] font-black uppercase tracking-[0.1em] xl:tracking-[0.2em] text-gray-700 hover:text-black hover:underline underline-offset-4 transition-all">Sofa Cum Bed</Link>
              <Link to="/products?category=beds" className="text-[10px] font-black uppercase tracking-[0.1em] xl:tracking-[0.2em] text-gray-700 hover:text-black hover:underline underline-offset-4 transition-all">Beds</Link>
              <Link to="/products?category=recliner" className="text-[10px] font-black uppercase tracking-[0.1em] xl:tracking-[0.2em] text-gray-700 hover:text-black hover:underline underline-offset-4 transition-all">Recliner</Link>
              <Link to="/track-order" className="text-[10px] font-black uppercase tracking-[0.1em] xl:tracking-[0.2em] text-gray-700 hover:text-black hover:underline underline-offset-4 transition-all">Track Order</Link>
              <Link to="/about" className="text-[10px] font-black uppercase tracking-[0.1em] xl:tracking-[0.2em] text-gray-700 hover:text-black hover:underline underline-offset-4 transition-all">About Us</Link>
              <Link to="/contact" className="text-[10px] font-black uppercase tracking-[0.1em] xl:tracking-[0.2em] text-gray-700 hover:text-black hover:underline underline-offset-4 transition-all">Contact Us</Link>
            </nav>
          </div>
        </div>

        {/* Search Overlay (Mobile) */}
        {isSearchVisible && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-72 bg-white flex flex-col p-10 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
               <span className="font-bold tracking-tighter text-xl text-slate-900">ComfortSitting Ltd.</span>
               <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-900"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex flex-col gap-6">
              <Link to="/products?sale=true" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-[#D7282F]">Flash Sale</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 pb-2 border-b border-gray-100">All Products</Link>
              
              {/* Dynamic Categories for Mobile */}
              <div className="flex flex-col gap-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categories</p>
                {categories.map(cat => (
                  <div key={cat._id} className="flex flex-col">
                    <div className="flex items-center justify-between text-base font-medium text-gray-800">
                      <Link 
                        to={`/products?category=${cat._id}`} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="hover:text-[#D7282F] transition-colors"
                      >
                        {cat.name}
                      </Link>
                      {cat.children?.length > 0 && (
                        <button type="button" 
                          onClick={() => setExpandedMobileCat(expandedMobileCat === cat._id ? null : cat._id)}
                          className="p-1 focus:outline-none"
                        >
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedMobileCat === cat._id ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    {cat.children?.length > 0 && expandedMobileCat === cat._id && (
                      <div className="flex flex-col pl-4 gap-3 mt-3 border-l border-gray-100">
                        {cat.children.map(child => (
                          <Link 
                            key={child._id}
                            to={`/products?category=${child._id}`} 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-bold text-gray-500 hover:text-[#D7282F] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="w-full h-[1px] bg-gray-100 my-2" />
              <Link to={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-[#D7282F] transition-all">
                <User className="w-5 h-5 text-gray-500" />
                <span>{user ? "My Account" : "Sign In / Register"}</span>
              </Link>
              <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700">Track Order</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700">Our Heritage</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700">Concierge</Link>
              
              <div className="pt-6 border-t border-gray-100">
                {!user ? (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-3 bg-black text-white text-center rounded-lg font-bold text-sm">Sign In</Link>
                ) : (
                  <div className="flex flex-col gap-4">
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-3 bg-[#D7282F] text-white text-center rounded-lg font-bold text-sm">Admin Suite</Link>
                    )}
                    <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-3 bg-black text-white text-center rounded-lg font-bold text-sm">My Dashboard</Link>
                    <button type="button" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-bold text-left text-sm mt-2">Sign Out</button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

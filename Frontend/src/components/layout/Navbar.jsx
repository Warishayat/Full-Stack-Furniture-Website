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
        
        setCategories(structured);
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
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-100">
        {/* Top Row: Logo, Search, Icons */}
        <div className="container mx-auto px-4 lg:px-12 py-4 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold tracking-tighter text-black">EliteSeating</span>
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
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => setIsSearchVisible(!isSearchVisible)} className="md:hidden p-2 text-gray-600">
              <Search className="w-6 h-6" />
            </button>
            
            {user?.role === 'admin' && (
              <Link to="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#D7282F] transition-all">
                <Activity className="w-4 h-4 text-[#D7282F]" /> Admin Suite
              </Link>
            )}
            
            <Link to={user ? "/account" : "/login"} className="hidden lg:block p-2 text-gray-800 hover:text-red-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>
            
            <Link to="/wishlist" className="hidden sm:block p-2 text-gray-800 hover:text-red-600 transition-colors">
              <Heart className="w-6 h-6" />
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-800 hover:text-red-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="hidden lg:block border-t border-gray-50 bg-[#F2EDE7]/10">
          <div className="container mx-auto px-12">
            <nav className="flex items-center justify-center gap-10">
              {categories.slice(0, 8).map(cat => (
                <div 
                  key={cat._id} 
                  className="relative group py-4"
                  onMouseEnter={() => setActiveDropdown(cat._id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link 
                    to={`/products?category=${cat._id}`} 
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${activeDropdown === cat._id ? 'text-[#D7282F]' : 'text-gray-700'}`}
                  >
                    {cat.name}
                    {cat.children?.length > 0 && <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === cat._id ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Dropdown Menu */}
                  {cat.children?.length > 0 && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-2xl rounded-xl p-6 border border-gray-50 transition-all duration-300 ${activeDropdown === cat._id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                      <div className="grid gap-4">
                        <Link 
                          to={`/products?category=${cat._id}`}
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-2"
                        >
                          View All {cat.name}
                        </Link>
                        {cat.children.map(child => (
                          <Link 
                            key={child._id}
                            to={`/products?category=${child._id}`}
                            className="flex items-center justify-between group/item"
                          >
                            <span className="text-xs font-bold text-gray-700 group-hover/item:text-[#D7282F] transition-colors">{child.name}</span>
                            <ArrowRight className="w-3 h-3 text-gray-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="w-[1px] h-3 bg-gray-200 mx-2" />
              <Link to="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">Our Heritage</Link>
              <Link to="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">Concierge</Link>
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
               <span className="font-bold tracking-tighter text-xl text-slate-900">EliteSeating Ltd.</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-900"><X className="w-6 h-6" /></button>
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
                        <button 
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
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-bold text-left text-sm mt-2">Sign Out</button>
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

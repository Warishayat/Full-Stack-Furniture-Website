import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, Menu, X, Search, Sparkles, ChevronRight, LayoutGrid, Heart, ArrowRight } from 'lucide-react';
import API from '../../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchRef = useRef(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/category/getallCategories');
        setCategories(data.categories || data || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchVisible(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header 
        ref={searchRef}
        onMouseLeave={() => setIsSearchVisible(false)}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 bg-primary-950 ${
          isScrolled 
            ? 'py-3 border-b border-white/5 shadow-2xl shadow-black' 
            : 'py-5 border-b border-white/5'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            
            {/* Left: Logo & Brand */}
            <div className="flex-shrink-0 flex items-center gap-8">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-accent rotate-45 flex items-center justify-center transition-all duration-700 group-hover:rotate-[225deg]">
                    <Sparkles className="w-5 h-5 text-white -rotate-45 group-hover:-rotate-[225deg] transition-all duration-700" />
                  </div>
                  <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                </div>
                <h1 className="text-2xl font-serif font-black text-white tracking-tighter italic">
                  Elite<span className="text-accent not-italic">Seating</span>
                </h1>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-8 ml-8 border-l border-white/10 pl-8">
                {['Collections', 'Story', 'Track Order'].map((item) => (
                  <Link 
                    key={item}
                    to={item === 'Collections' ? '/products' : item === 'Story' ? '/about' : '/track-order'}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-6">
              
              {/* Search Toggle */}
              <button 
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="p-2.5 text-white/70 hover:text-accent transition-all hover:bg-white/5 rounded-full"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart - Hidden for Admins or on Admin Dashboard */}
              {!user?.isAdmin && !location.pathname.toLowerCase().startsWith('/admin') && (
                <Link to="/cart" className="relative p-2.5 text-white/70 hover:text-accent transition-all hover:bg-white/5 rounded-full group">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth/Profile */}
              <div className="">
                {user ? (
                  <div className="relative group">
                    <button className="p-2.5 text-white/70 hover:text-accent transition-all hover:bg-white/5 rounded-full">
                      <User className="w-5 h-5" />
                    </button>
                    {/* Desktop Dropdown - Hidden on Mobile */}
                    <div className="hidden sm:block absolute right-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[110]">
                      <div className="bg-primary-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6">
                        <div className="mb-4 pb-4 border-b border-white/5">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                           {user.isAdmin && (
                             <Link to="/admin" className="flex items-center gap-3 p-3 text-[10px] font-black text-white/60 hover:text-accent rounded-xl transition-all uppercase tracking-widest">
                               <LayoutGrid className="w-4 h-4" /> Dashboard
                             </Link>
                           )}
                           {!user.isAdmin && (
                             <Link to="/orders" className="flex items-center gap-3 p-3 text-[10px] font-black text-white/60 hover:text-accent rounded-xl transition-all uppercase tracking-widest">
                               <ShoppingCart className="w-4 h-4" /> Orders
                             </Link>
                           )}
                           <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-[10px] font-black text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all uppercase tracking-widest mt-2">
                             Logout
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="hidden sm:inline-block px-6 py-2.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all">
                    Login
                  </Link>
                )}
              </div>

              {/* Hamburger */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-accent text-white rounded-full hover:scale-105 transition-transform"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <div className={`absolute top-full left-0 right-0 bg-primary-950/95 backdrop-blur-3xl border-t border-white/5 transition-all duration-500 overflow-hidden ${isSearchVisible ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="container mx-auto px-6 py-6 lg:py-10">
            <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
              <input
                type="text"
                placeholder="Search masterpieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full flex-1 bg-transparent border-b-2 border-white/10 pb-4 text-xl lg:text-4xl font-serif text-white focus:border-accent outline-none transition-all placeholder:text-white/5"
                autoFocus={isSearchVisible}
              />
              <button type="submit" className="w-full sm:w-auto px-10 py-4 lg:py-5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all">
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu (Emerald Style) */}
      <div className={`fixed inset-0 z-[200] bg-primary-950 transition-all duration-700 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.15),transparent)]"></div>
        <div className="relative z-10 h-full flex flex-col p-8 lg:p-20 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-16">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent rotate-45 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white -rotate-45" />
              </div>
              <span className="text-2xl font-serif font-black text-white italic">EliteSeating</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-white/5 text-white rounded-full">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-12">Discovery</p>
              <nav className="flex flex-col gap-6">
                {['Home', 'Collections', 'Track Order', 'Our Story'].map((item, i) => {
                  if (user?.isAdmin && item === 'Track Order') return null;
                  return (
                    <Link 
                      key={item}
                      to={item === 'Home' ? '/' : item === 'Collections' ? '/products' : item === 'Track Order' ? '/track-order' : '/about'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center gap-6 text-3xl lg:text-5xl font-serif font-black text-white/20 hover:text-white transition-all duration-500"
                    >
                      <span className="text-sm font-sans text-accent opacity-0 group-hover:opacity-100 transition-all">0{i+1}</span>
                      {item}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-20">
              <div>
                <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-12">Account</p>
                <div className="flex flex-col gap-6">
                  {user ? (
                    <>
                      <div className="mb-4">
                        <p className="text-xl font-serif font-bold text-white">{user.name}</p>
                        <p className="text-xs text-white/40">{user.email}</p>
                      </div>
                      {user.isAdmin && (
                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif font-black text-white/40 hover:text-white transition-all">
                          Dashboard
                        </Link>
                      )}
                      {!user.isAdmin && (
                        <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif font-black text-white/40 hover:text-white transition-all">
                          My Orders
                        </Link>
                      )}
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-2xl font-serif font-black text-rose-500 hover:text-rose-400 text-left transition-all">
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-serif font-black text-white hover:text-accent transition-all">
                      Login / Join
                    </Link>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-12">Categories</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/products?category=${cat._id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:bg-accent transition-all group"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <LayoutGrid className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:translate-x-2 transition-all" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-white">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-20 border-t border-white/5 flex flex-wrap gap-12">
            <div>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-2">Inquiry</p>
              <p className="text-lg font-bold text-white">07378957840</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-2">Concierge</p>
              <p className="text-lg font-bold text-white">eilteseatingltd@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, Menu, X, Search, Sparkles, ChevronRight, LayoutGrid, LogOut, Package, Clock } from 'lucide-react';
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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Headroom & Scrolled Logic
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 50);

          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsHeaderVisible(false); // Hide on scroll down
          } else if (currentScrollY <= lastScrollY || currentScrollY <= 100) {
            setIsHeaderVisible(true); // Show on scroll up
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleClickOutside = (event) => {
      const searchToggle = document.getElementById('search-toggle');
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          searchToggle && !searchToggle.contains(event.target)) {
        setIsSearchVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lastScrollY]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

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

  const navLinks = [
    { name: 'Collections', path: '/products' },
    { name: 'Our Story', path: '/about' },
    { name: 'Track Order', path: '/track-order' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-primary-950 py-2 lg:py-2.5 border-b border-white/5 shadow-2xl' 
            : 'bg-primary-950 py-3 lg:py-4 border-b border-white/5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center group h-10 lg:h-12 ml-4 lg:ml-0">
              <img src="/logo.png" alt="EliteSeating Logo" className="h-full w-auto object-contain scale-[2.8] transform-gpu drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-accent transition-all relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions Section */}
            <div className="flex items-center gap-1 lg:gap-4">
              {/* Search Toggle (Desktop) */}
              <button 
                id="search-toggle"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="hidden lg:flex p-2.5 text-white/70 hover:text-accent transition-all hover:bg-white/5 rounded-full"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Only: Search & Cart */}
              <div className="flex lg:hidden items-center gap-1 mr-2">
                <button 
                  onClick={() => setIsSearchVisible(!isSearchVisible)}
                  className="p-2 text-white/70 hover:text-accent"
                >
                  <Search className="w-5 h-5" />
                </button>
                <Link to="/cart" className="p-2 text-white/70 hover:text-accent relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-accent text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-primary-950">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Cart (Desktop) */}
              <div className="hidden lg:block">
                <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center text-white/70 hover:text-accent transition-all hover:bg-white/5 rounded-full group">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-accent text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-primary-950">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Profile (Desktop) */}
              <div className="hidden lg:block">
                {user ? (
                  <div className="relative group">
                    <button className="p-2.5 text-white/70 hover:text-accent transition-all hover:bg-white/5 rounded-full border border-white/10">
                      <User className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 w-72 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[110]">
                      <div className="bg-primary-950 border border-white/10 rounded-[2rem] shadow-2xl shadow-primary-950/50 overflow-hidden p-6 backdrop-blur-xl">
                        <div className="mb-6 pb-6 border-b border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">Authenticated As</p>
                          <p className="text-sm font-bold text-white truncate mb-1">{user.name}</p>
                          <p className="text-[10px] text-white/50 truncate font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                          <Link to={(user.role === 'admin' || user.isAdmin) ? "/admin" : "/orders"} className="flex items-center gap-3 p-3.5 text-[10px] font-black text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest group/item">
                            <LayoutGrid className="w-4 h-4 text-accent group-hover/item:scale-110 transition-transform" /> 
                            <span>Dashboard</span>
                          </Link>
                          <button onClick={logout} className="w-full flex items-center gap-3 p-3.5 text-[10px] font-black text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all uppercase tracking-widest mt-2">
                            <LogOut className="w-4 h-4" /> 
                            <span>Logout System</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="px-6 py-2.5 bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-primary-950 transition-all shadow-lg shadow-accent/10">
                    Join Elite
                  </Link>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-3 bg-white/5 text-white rounded-2xl border border-white/10 hover:bg-accent transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <div 
          ref={searchRef}
          className={`absolute top-full left-0 right-0 bg-primary-950 border-t border-white/10 transition-all duration-500 overflow-hidden ${isSearchVisible ? 'max-h-[220px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'}`}
        >
          <div className="container mx-auto px-6 py-10 lg:py-14">
            <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-full flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-accent" />
                <input
                  type="text"
                  placeholder="What masterpiece are you seeking?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 pl-16 pr-6 py-5 rounded-[2rem] text-lg lg:text-2xl font-serif text-white focus:border-accent focus:bg-black/60 outline-none transition-all placeholder:text-white/20 shadow-inner"
                  autoFocus={isSearchVisible}
                />
              </div>
              <button type="submit" className="w-full md:w-auto px-12 h-16 bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all shadow-lg shadow-accent/20">
                Discover
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Premium Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[1000] lg:hidden transition-all duration-700 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-primary-950/98 backdrop-blur-3xl" onClick={() => setIsMobileMenuOpen(false)} />
        
        <div className={`absolute inset-y-0 right-0 w-full max-w-sm bg-primary-950 flex flex-col p-8 transition-transform duration-700 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center h-12">
              <img src="/logo.png" alt="EliteSeating Logo" className="h-full w-auto object-contain scale-[2.5] transform-gpu" />
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-accent transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>

          <nav className="flex flex-col space-y-2 mb-12">
            {navLinks.map((item, idx) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between py-6 border-b border-white/5 group transition-all duration-500 ${
                  isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className="text-3xl font-serif font-medium text-white/90 group-hover:text-accent transition-all">{item.name}</span>
                <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-accent transition-all" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-4 mb-8">
              {user ? (
                <>
                  <Link 
                    to={(user.role === 'admin' || user.isAdmin) ? "/admin" : "/orders"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[2.5rem] border border-white/10"
                  >
                    <User className="w-6 h-6 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Account</span>
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[2.5rem] border border-white/10"
                  >
                    <LogOut className="w-6 h-6 text-red-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="col-span-2 flex items-center justify-center gap-4 py-6 bg-accent rounded-[2.5rem] text-white"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-[0.2em]">Join Elite Seating</span>
                </Link>
              )}
            </div>
            
            <div className="flex flex-col gap-4 text-center">
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">United Kingdom • BB2 3RG</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

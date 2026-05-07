import { User, Package, ShieldCheck, LogOut, ChevronRight, ShoppingBag, RotateCcw, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const menuItems = [
    { icon: Package, title: "My Orders", desc: "View and track your bespoke orders", link: "/orders" },
    { icon: RotateCcw, title: "Returns Policy", desc: "Review our 14-day return protocols", link: "/returns-policy" },
    { icon: ShoppingBag, title: "Curated Collection", desc: "Continue exploring our latest designs", link: "/products" },
    { icon: ShieldCheck, title: "Privacy Protocol", desc: "How we protect your data integrity", link: "/privacy-policy" }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">My Account</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar / Profile Summary */}
          <div className="lg:w-1/3">
            <div className="p-10 bg-[#F2EDE7] rounded-sm border border-gray-100">
               <div className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl font-serif font-black mb-6">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
               </div>
               <h2 className="text-3xl font-serif font-black text-gray-900 tracking-tighter mb-2">
                  Welcome, <span className="italic text-[#D7282F]">{user.name?.split(' ')[0]}</span>
               </h2>
               <p className="text-gray-500 text-sm font-medium mb-8">{user.email}</p>
               
               <button 
                 onClick={handleLogout}
                 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#D7282F] transition-colors"
               >
                 <LogOut className="w-4 h-4" /> Terminate Session
               </button>
            </div>

            <div className="mt-12 p-10 border border-gray-100 rounded-sm">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 block">Elite Member Since</h4>
               <p className="text-2xl font-serif font-black text-gray-900 italic">
                  {new Date(user.createdAt || Date.now()).getFullYear()}
               </p>
            </div>
          </div>

          <div className="lg:w-2/3">
            {user.role === 'admin' && (
              <div className="mb-12 p-10 bg-gray-900 text-white rounded-sm border border-gray-800">
                 <div className="flex items-center gap-4 mb-4">
                    <Activity className="w-6 h-6 text-[#D7282F]" />
                    <h3 className="text-2xl font-serif font-black italic tracking-tight">Administrative Access</h3>
                 </div>
                 <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                    You are logged in with administrative privileges. Access the management suite to curate products, categories, and logistics.
                 </p>
                 <Link to="/admin" className="inline-flex px-10 py-4 bg-white text-gray-900 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#D7282F] hover:text-white transition-all">
                    Enter Admin Suite
                 </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {menuItems.map((item, idx) => (
                 <Link 
                   key={idx} 
                   to={item.link}
                   className="p-10 border border-gray-100 rounded-sm hover:border-[#D7282F] transition-all group flex flex-col h-full"
                 >
                    <item.icon className="w-8 h-8 text-[#D7282F] mb-8" />
                    <h3 className="text-2xl font-serif font-black text-gray-900 mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">{item.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-[#D7282F] transition-colors">
                       Manage <ChevronRight className="w-3 h-3" />
                    </div>
                 </Link>
               ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 p-10 bg-gray-900 text-white rounded-sm flex items-center justify-between gap-10">
               <div>
                  <h3 className="text-2xl font-serif font-black italic mb-2 tracking-tight">Need assistance?</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">Our concierge team is available 24/7 for our elite members.</p>
               </div>
               <Link to="/contact" className="px-10 py-4 bg-[#D7282F] text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-gray-900 transition-all whitespace-nowrap">
                  Contact Specialist
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Activity, ChevronRight, TrendingUp, Mail, Users } from 'lucide-react';
import API from '../services/api';

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    messages: 0,
    subscribers: 0
  });
  const [ordersResData, setOrdersResData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes, messagesRes, subscribersRes] = await Promise.all([
          API.get('/product/getAllProducts'),
          API.get('/category/getallCategories'),
          API.get('/api/order/getAllOrders'),
          API.get('/support/all'),
          API.get('/newsletter/all')
        ]);

        let oData = [];
        if (ordersRes.data && Array.isArray(ordersRes.data.orders)) {
          oData = ordersRes.data.orders;
        } else if (Array.isArray(ordersRes.data)) {
          oData = ordersRes.data;
        }
        
        setOrdersResData(oData);
        setStats({
          products: productsRes.data.products?.length || productsRes.data?.length || 0,
          categories: categoriesRes.data.categories?.length || categoriesRes.data?.length || 0,
          orders: oData.length,
          messages: messagesRes.data.messages?.length || 0,
          subscribers: subscribersRes.data.subscribers?.length || 0
        });
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      }
    };
    
    if (location.pathname === '/admin') {
      fetchStats();
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'Console', path: '/admin', icon: LayoutDashboard },
    { name: 'Inventory', path: '/admin/products', icon: Package },
    { name: 'Departments', path: '/admin/categories', icon: Tags },
    { name: 'Logistics', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Inquiries', path: '/admin/messages', icon: Mail },
    { name: 'Subscribers', path: '/admin/subscribers', icon: Users },
  ];

  return (
    <div className="bg-white min-h-screen pt-32 lg:pt-40 pb-20 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Elite Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-[#F2EDE7] p-10 lg:sticky lg:top-40 border border-gray-100 rounded-sm">
              <div className="mb-12">
                 <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-2 block">Executive Suite</span>
                 <h2 className="text-3xl font-serif font-black text-gray-900 tracking-tighter">Command <span className="italic text-gray-400">Center</span></h2>
              </div>
              
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                        isActive 
                          ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                          : 'text-gray-500 border-transparent hover:bg-white hover:text-gray-900 hover:border-gray-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-4 ${isActive ? 'text-[#D7282F]' : ''}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-12 pt-12 border-t border-gray-200">
                 <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-[#D7282F] hover:underline flex items-center gap-2">
                    Back to Storefront <ChevronRight className="w-3 h-3" />
                 </Link>
              </div>
            </div>
          </div>

          {/* Admin Content Area */}
          <div className="flex-1 min-w-0">
            {location.pathname === '/admin' ? (
              <div className="animate-fade-in">
                <div className="mb-16">
                   <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Real-time Performance</span>
                   <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 tracking-tighter mb-4">Enterprise <span className="italic text-gray-400">Overview</span></h1>
                   <p className="text-gray-600 text-lg font-medium leading-relaxed max-w-2xl">
                      Orchestrating excellence across your bespoke furniture empire.
                   </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                  {[
                    { label: 'Curated Pieces', val: stats.products, icon: Package, color: 'bg-gray-900' },
                    { label: 'Active Depts', val: stats.categories, icon: Tags, color: 'bg-gray-900' },
                    { label: 'Total Commissions', val: stats.orders, icon: ShoppingCart, color: 'bg-gray-900' },
                    { label: 'Patron Inquiries', val: stats.messages, icon: Mail, color: 'bg-gray-900' },
                    { label: 'Elite Circle', val: stats.subscribers, icon: Users, color: 'bg-gray-900' },
                    { label: 'Net Revenue', val: `£${ordersResData.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: 'bg-[#D7282F]' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#F2EDE7] p-10 border border-gray-100 group hover:border-[#D7282F] transition-all duration-500">
                      <div className={`w-12 h-12 ${stat.color} text-white rounded-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                        <p className="text-4xl font-serif font-black text-gray-900">{stat.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hero Section */}
                <div className="bg-gray-900 p-12 lg:p-20 text-white relative overflow-hidden mb-16">
                   <div className="relative z-10 max-w-2xl">
                      <h3 className="text-4xl lg:text-5xl font-serif font-black italic mb-8 tracking-tight leading-tight text-white">System Integrity: <span className="text-[#D7282F]">Optimal</span></h3>
                      <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10">Global logistics and inventory synchronization are operating within peak parameters. Continue curating excellence.</p>
                      <div className="flex gap-6">
                         <Link to="/admin/products" className="px-10 py-4 bg-white text-gray-900 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#D7282F] hover:text-white transition-all">New Orchestration</Link>
                         <Link to="/admin/orders" className="px-10 py-4 border border-white text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-gray-900 transition-all">Audit Logistics</Link>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-96 h-96 bg-[#D7282F]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                </div>

                {/* Recent Orders Section */}
                <div className="border border-gray-100 p-10 lg:p-16">
                   <div className="flex items-center justify-between mb-12">
                      <h3 className="text-3xl font-serif font-black text-gray-900 tracking-tight">Recent <span className="italic text-gray-400">Acquisitions</span></h3>
                      <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D7282F] hover:underline">Full Registry</Link>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                               <th className="pb-6">Reference</th>
                               <th className="pb-6">Patron</th>
                               <th className="pb-6">Valuation</th>
                               <th className="pb-6">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50">
                            {ordersResData.slice(0, 5).map((order) => (
                               <tr key={order._id} className="group hover:bg-[#F2EDE7]/30 transition-all">
                                  <td className="py-8">
                                     <Link 
                                       to={`/order/${order._id}`} 
                                       className="font-bold text-gray-900 hover:text-[#D7282F] transition-all"
                                     >
                                        #{order._id.slice(-8).toUpperCase()}
                                     </Link>
                                  </td>
                                  <td className="py-8">
                                     <div className="text-sm font-bold text-gray-900">{order.user?.name || 'Private Patron'}</div>
                                     <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{order.user?.email}</div>
                                  </td>
                                  <td className="py-8 text-sm font-bold text-gray-900">£{order.totalPrice?.toLocaleString()}</td>
                                  <td className="py-8">
                                     <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-gray-900 text-white rounded-full">
                                        {order.orderStatus || 'Processing'}
                                      </span>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

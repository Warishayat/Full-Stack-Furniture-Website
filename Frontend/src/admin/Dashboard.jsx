import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Activity } from 'lucide-react';
import API from '../services/api';

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          API.get('/product/getAllProducts'),
          API.get('/category/getallCategories'),
          API.get('/api/order/getAllOrders') 
        ]);

        setStats({
          products: productsRes.data.products?.length || productsRes.data?.length || 0,
          categories: categoriesRes.data.categories?.length || categoriesRes.data?.length || 0,
          orders: ordersRes.data.orders?.length || ordersRes.data?.length || 0,
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
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-32 lg:pt-40 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Admin Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary-950/10 p-8 sticky top-32 border border-primary-100">
              <div className="flex items-center gap-4 mb-10 px-2">
                 <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <Activity className="w-5 h-5" />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-widest text-primary-950">Management</h2>
              </div>
              
              <nav className="space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-6 py-5 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-500 ${
                        isActive 
                          ? 'bg-primary-950 text-white shadow-2xl shadow-primary-950/30 translate-x-1' 
                          : 'text-primary-500 hover:bg-primary-50 hover:text-primary-950'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-4 shrink-0 ${isActive ? 'text-accent' : ''}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Admin Content Area */}
          <div className="flex-1">
            {location.pathname === '/admin' ? (
              <div className="animate-fade-in-up">
                <div className="mb-16">
                   <span className="text-accent uppercase tracking-[0.4em] text-[11px] font-black mb-4 block">System Status</span>
                   <h1 className="text-5xl font-serif font-bold text-primary-950">Dashboard Overview</h1>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
                  <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-primary-950/5 border border-primary-100 group hover:border-accent transition-all duration-500">
                    <div className="w-16 h-16 bg-primary-950 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-all duration-500 shadow-sm">
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[11px] text-primary-950 font-black uppercase tracking-widest mb-2">Catalog Items</p>
                      <p className="text-4xl font-serif font-bold text-primary-950">{stats.products}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-primary-950/5 border border-primary-100 group hover:border-accent transition-all duration-500">
                    <div className="w-16 h-16 bg-primary-950 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-all duration-500 shadow-sm">
                      <Tags className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[11px] text-primary-950 font-black uppercase tracking-widest mb-2">Departments</p>
                      <p className="text-4xl font-serif font-bold text-primary-950">{stats.categories}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-primary-950/5 border border-primary-100 group hover:border-accent transition-all duration-500">
                    <div className="w-16 h-16 bg-primary-950 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-all duration-500 shadow-sm">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[11px] text-primary-950 font-black uppercase tracking-widest mb-2">Total Sales</p>
                      <p className="text-4xl font-serif font-bold text-primary-950">{stats.orders}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Stats / Quick Actions */}
                <div className="bg-primary-950 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl">
                   <div className="relative z-10">
                      <h3 className="text-3xl font-serif font-bold italic mb-6">Welcome back, Admin</h3>
                      <p className="text-primary-300 max-w-lg leading-relaxed">Your store is currently performing at peak efficiency. All systems are operational and secure.</p>
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
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

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTop from './components/utils/ScrollToTop';

// Lazy load user pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Auth = lazy(() => import('./pages/Auth'));
const About = lazy(() => import('./pages/About'));
const Success = lazy(() => import('./pages/Success'));
const Cancel = lazy(() => import('./pages/Cancel'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const Warranty = lazy(() => import('./pages/Warranty'));
const Bespoke = lazy(() => import('./pages/Bespoke'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Contact = lazy(() => import('./pages/Contact'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Inspiration = lazy(() => import('./pages/Inspiration'));
const ReturnsPolicy = lazy(() => import('./pages/ReturnsPolicy'));
const Account = lazy(() => import('./pages/Account'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./admin/Dashboard'));
const ManageProducts = lazy(() => import('./admin/ManageProducts'));
const ManageCategories = lazy(() => import('./admin/ManageCategories'));
const AdminOrders = lazy(() => import('./admin/ManageOrders'));
const ManageMessages = lazy(() => import('./admin/ManageMessages'));
const ManageSubscribers = lazy(() => import('./admin/ManageSubscribers'));

// Luxury branded loading animation
const LuxuryLoader = () => (
  <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4 animate-pulse">
      <div className="w-12 h-12 border border-gray-200 border-t-[#D7282F] rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">E&S COLLECTION</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Suspense fallback={<LuxuryLoader />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/bespoke" element={<Bespoke />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="/returns-policy" element={<ReturnsPolicy />} />
            
            {/* User Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<Account />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/orders" element={<MyOrders />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />}>
                {/* Note: The default index route for /admin is handled inside AdminDashboard itself via location checking */}
                <Route path="products" element={<ManageProducts />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="messages" element={<ManageMessages />} />
                <Route path="subscribers" element={<ManageSubscribers />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

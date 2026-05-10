import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import About from './pages/About';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import ShippingPolicy from './pages/ShippingPolicy';
import Warranty from './pages/Warranty';
import Bespoke from './pages/Bespoke';
import PrivacyPolicy from './pages/PrivacyPolicy';
import OrderDetail from './pages/OrderDetail';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import Inspiration from './pages/Inspiration';
import ReturnsPolicy from './pages/ReturnsPolicy';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';



import AdminDashboard from './admin/Dashboard';
import ManageProducts from './admin/ManageProducts';
import ManageCategories from './admin/ManageCategories';
import AdminOrders from './admin/ManageOrders';
import ManageMessages from './admin/ManageMessages';
import ManageSubscribers from './admin/ManageSubscribers';
import ScrollToTop from './components/utils/ScrollToTop';

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
    </>
  );
}

export default App;

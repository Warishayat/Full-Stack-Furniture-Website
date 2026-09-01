import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

import CookieConsent from './CookieConsent';

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary font-sans text-primary-900">
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="flex-grow">
        <Outlet />
      </main>
      <div className="print:hidden">
        <Footer />
        <CookieConsent />
      </div>
    </div>
  );
};

export default AppLayout;

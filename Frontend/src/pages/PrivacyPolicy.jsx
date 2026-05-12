import { Shield, Eye, Lock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Privacy Protocol</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-20">
             <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Legal Integrity</span>
             <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 mb-8 tracking-tighter">Privacy <span className="italic text-gray-400">Protocol</span></h1>
             <p className="text-gray-600 text-lg leading-relaxed font-medium">At EliteSeating Ltd., your privacy is as important to us as your comfort. We are committed to protecting your personal data with the highest security standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
             <div className="p-10 bg-[#F2EDE7] rounded-sm border border-gray-100">
                <Lock className="w-8 h-8 text-[#D7282F] mb-6" />
                <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">Encryption</h3>
                <p className="text-gray-600 text-sm leading-relaxed">All payment and personal data is protected with 256-bit SSL industrial-grade encryption.</p>
             </div>
             <div className="p-10 bg-[#F2EDE7] rounded-sm border border-gray-100">
                <Eye className="w-8 h-8 text-[#D7282F] mb-6" />
                <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">Transparency</h3>
                <p className="text-gray-600 text-sm leading-relaxed">We never sell your data. We only use it to provide you with a tailored, premium experience.</p>
             </div>
          </div>

          <div className="space-y-12 text-gray-900">
             <div>
                <h2 className="text-3xl font-serif font-black mb-6 tracking-tight">Data Collection</h2>
                <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                   When you visit our site or make a purchase, we collect necessary information such as your name, delivery address, and contact details. This is used strictly for order fulfillment and enhancing your browsing experience.
                </p>
             </div>

             <div>
                <h2 className="text-3xl font-serif font-black mb-6 tracking-tight">Your Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                   Under the UK GDPR, you have the right to access, correct, or delete your personal data at any time. If you wish to exercise these rights, please contact our Data Protection Officer at eilteseatingltd@gmail.com.
                </p>
             </div>

             <div>
                <h2 className="text-3xl font-serif font-black mb-6 tracking-tight">Cookies</h2>
                <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                   We use cookies to remember your preferences and provide a seamless login experience. You can manage your cookie settings through your browser at any time.
                </p>
             </div>

             <div className="mt-24 p-12 bg-gray-900 text-white rounded-sm border border-gray-800 flex items-center justify-between gap-10">
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <RefreshCw className="w-6 h-6 text-[#D7282F]" />
                      <h3 className="text-2xl font-serif font-black italic tracking-tight">Last Updated</h3>
                   </div>
                   <p className="text-gray-400 text-sm font-medium">This policy was last reviewed and updated on May 3, 2026.</p>
                </div>
                <Shield className="w-16 h-16 text-white/5" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


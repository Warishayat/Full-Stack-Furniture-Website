import { Shield, Eye, Lock, RefreshCw } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-20">
             <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block animate-fade-in">Legal Integrity</span>
             <h1 className="text-5xl lg:text-7xl font-serif font-bold text-primary-950 mb-8">Privacy <span className="italic text-shine">Protocol</span></h1>
             <p className="text-primary-500 text-lg leading-relaxed">At COMFORT, your privacy is as important to us as your comfort. We are committed to protecting your personal data with the highest security standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
             <div className="p-8 bg-primary-50/50 rounded-3xl border border-primary-100">
                <Lock className="w-8 h-8 text-accent mb-6" />
                <h3 className="text-xl font-serif font-bold text-primary-950 mb-4">Encryption</h3>
                <p className="text-primary-500 text-sm">All payment and personal data is protected with 256-bit SSL encryption.</p>
             </div>
             <div className="p-8 bg-primary-50/50 rounded-3xl border border-primary-100">
                <Eye className="w-8 h-8 text-accent mb-6" />
                <h3 className="text-xl font-serif font-bold text-primary-950 mb-4">Transparency</h3>
                <p className="text-primary-500 text-sm">We never sell your data. We only use it to provide you with a tailored experience.</p>
             </div>
          </div>

          <div className="prose prose-lg max-w-none text-primary-900">
             <h2 className="text-3xl font-serif font-bold mb-8">Data Collection</h2>
             <p className="text-primary-500 mb-10 leading-relaxed">
                When you visit our site or make a purchase, we collect necessary information such as your name, delivery address, and contact details. This is used strictly for order fulfillment and enhancing your browsing experience.
             </p>

             <h2 className="text-3xl font-serif font-bold mb-8">Your Rights</h2>
             <p className="text-primary-500 mb-10 leading-relaxed">
                Under the UK GDPR, you have the right to access, correct, or delete your personal data at any time. If you wish to exercise these rights, please contact our Data Protection Officer at privacy@comfort.com.
             </p>

             <h2 className="text-3xl font-serif font-bold mb-8">Cookies</h2>
             <p className="text-primary-500 mb-10 leading-relaxed">
                We use cookies to remember your preferences and provide a seamless login experience. You can manage your cookie settings through your browser at any time.
             </p>

             <div className="mt-20 p-10 bg-primary-950 text-white rounded-[3rem] border border-white/10">
                <div className="flex items-center gap-6 mb-6">
                   <RefreshCw className="w-8 h-8 text-accent animate-spin-slow" />
                   <h3 className="text-xl font-serif font-bold italic">Last Updated</h3>
                </div>
                <p className="text-primary-400 text-sm">This policy was last reviewed and updated on April 26, 2026. Any major changes will be communicated via our newsletter.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

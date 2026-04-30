import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-8 right-8 md:left-auto md:max-w-md z-[300] animate-fade-in-up">
      <div className="bg-primary-950/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl shadow-primary-950/40">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-serif font-bold text-xl mb-2">Cookie Privacy</h4>
            <p className="text-primary-200 text-xs leading-relaxed font-medium">
              We use refined cookies to ensure you have the most exceptional experience on our platform. By continuing, you agree to our elite privacy standards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleAccept}
            className="flex-1 py-4 bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-primary-950 transition-all shadow-lg"
          >
            Accept Elite Cookies
          </button>
          <button
            onClick={handleDecline}
            className="px-6 py-4 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/5 hover:text-white transition-all"
          >
            Decline
          </button>
        </div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;

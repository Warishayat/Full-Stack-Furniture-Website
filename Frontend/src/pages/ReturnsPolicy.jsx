import { RotateCcw, Truck, ShieldCheck, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnsPolicy = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Returns Protocol</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-20">
             <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Satisfaction Guarantee</span>
             <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 mb-8 tracking-tighter">Returns <span className="italic text-gray-400">& Refunds</span></h1>
             <p className="text-gray-600 text-lg leading-relaxed font-medium">At EliteSeating Ltd., we want you to be completely enamored with your new furniture. If it's not the perfect fit, our 14-day hassle-free return policy ensures your peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
             <div className="p-10 bg-[#F2EDE7] rounded-sm border border-gray-100">
                <Clock className="w-8 h-8 text-[#D7282F] mb-6" />
                <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">14-Day Window</h3>
                <p className="text-gray-600 text-sm leading-relaxed">You have 14 calendar days from the date of delivery to notify us of your intent to return your items.</p>
             </div>
             <div className="p-10 bg-[#F2EDE7] rounded-sm border border-gray-100">
                <Truck className="w-8 h-8 text-[#D7282F] mb-6" />
                <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">Concierge Collection</h3>
                <p className="text-gray-600 text-sm leading-relaxed">We arrange a specialized collection service to ensure your furniture is transported back to us safely and professionally.</p>
             </div>
          </div>

          <div className="space-y-12 text-gray-900">
             <div>
                <h2 className="text-3xl font-serif font-black mb-6 tracking-tight">How to Initiate a Return</h2>
                <div className="space-y-6">
                   <div className="flex gap-6 items-start">
                      <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black shrink-0">1</span>
                      <p className="text-gray-600 font-medium">Contact our concierge team at <span className="text-gray-900 font-bold">returns@eliteseating.com</span> with your order number and reason for return.</p>
                   </div>
                   <div className="flex gap-6 items-start">
                      <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black shrink-0">2</span>
                      <p className="text-gray-600 font-medium">Our team will review your request and schedule a professional collection within 3-5 business days.</p>
                   </div>
                   <div className="flex gap-6 items-start">
                      <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black shrink-0">3</span>
                      <p className="text-gray-600 font-medium">Once the item is received and inspected at our workshop, your refund will be processed to the original payment method.</p>
                   </div>
                </div>
             </div>

             <div>
                <h2 className="text-3xl font-serif font-black mb-6 tracking-tight">Conditions for Return</h2>
                <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                   To be eligible for a full refund, items must be in their original, showroom condition. Bespoke or highly customized orders may be subject to different terms, which will be discussed during your consultation.
                </p>
             </div>

             <div className="mt-24 p-12 bg-gray-900 text-white rounded-sm border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-xl">
                   <div className="flex items-center gap-4 mb-4">
                      <MessageCircle className="w-6 h-6 text-[#D7282F]" />
                      <h3 className="text-2xl font-serif font-black italic tracking-tight">Need help?</h3>
                   </div>
                   <p className="text-gray-400 text-sm font-medium leading-relaxed">Our support specialists are here to guide you through every step of the return process. Contact us at 07378957840.</p>
                </div>
                <Link to="/contact" className="px-10 py-4 bg-[#D7282F] text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-gray-900 transition-all whitespace-nowrap">
                   Contact Support
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;

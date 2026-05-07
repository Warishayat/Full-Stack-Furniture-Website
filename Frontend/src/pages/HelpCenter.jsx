import { Link } from 'react-router-dom';
import { Search, ChevronRight, Truck, Package, RotateCcw, CreditCard, ShieldCheck, User, MessageCircle, ArrowRight } from 'lucide-react';

const HelpCenter = () => {
  const categories = [
    { icon: Truck, title: "Delivery & Logistics", desc: "Shipping times, white-glove service, and tracking.", link: "/shipping-policy" },
    { icon: RotateCcw, title: "Returns & Exchanges", desc: "Our 30-day return policy and process.", link: "/warranty" },
    { icon: CreditCard, title: "Payment & Finance", desc: "Secure payments and 0% APR options.", link: "/about" },
    { icon: ShieldCheck, title: "Warranty & Quality", desc: "Our lifetime structural guarantee.", link: "/warranty" },
    { icon: User, title: "My Account", desc: "Managing your orders and profile.", link: "/login" },
    { icon: Package, title: "Care & Assembly", desc: "Maintenance tips and assembly guides.", link: "/about" }
  ];

  const faqs = [
    { q: "What is White-Glove delivery?", a: "Our signature service where specialists assemble and position your furniture in the room of your choice, then remove all packaging." },
    { q: "Do you offer international shipping?", a: "Yes, we ship to over 50 countries worldwide using specialized carbon-neutral logistics." },
    { q: "How do I care for my velvet sofa?", a: "We recommend regular light vacuuming and using a professional velvet brush to maintain the pile." },
    { q: "What does the lifetime warranty cover?", a: "It covers the structural integrity of all solid wood frames for the lifetime of the original owner." }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Customer Help Centre</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="max-w-4xl mb-16">
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Support Concierge</span>
           <h1 className="text-5xl lg:text-8xl font-serif font-black text-gray-900 mb-12 tracking-tighter leading-tight">
              How can we <br/><span className="italic text-gray-400">guide</span> you?
           </h1>
           
           <div className="relative group max-w-2xl">
              <input 
                type="text" 
                placeholder="Search for topics, policies, or guides..." 
                className="w-full bg-gray-50 border border-gray-100 py-6 px-8 outline-none focus:border-gray-900 font-medium text-lg transition-all"
              />
              <Search className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-hover:text-gray-900 transition-colors" />
           </div>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
           {categories.map((cat, i) => (
             <Link key={i} to={cat.link} className="p-10 bg-[#F2EDE7] border border-gray-100 hover:border-[#D7282F] transition-all group">
                <cat.icon className="w-10 h-10 text-[#D7282F] mb-8" />
                <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">{cat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">{cat.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-[#D7282F] transition-colors">
                   View details <ChevronRight className="w-3 h-3" />
                </div>
             </Link>
           ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-32">
           <h2 className="text-4xl font-serif font-black text-gray-900 mb-16 tracking-tighter text-center italic">Frequent Inquiries</h2>
           <div className="space-y-12">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-10">
                   <h4 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">{faq.q}</h4>
                   <p className="text-gray-600 leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gray-900 text-white p-12 lg:p-24 rounded-sm text-center relative overflow-hidden">
           <div className="relative z-10">
              <MessageCircle className="w-12 h-12 text-[#D7282F] mx-auto mb-8" />
              <h2 className="text-4xl lg:text-6xl font-serif font-black mb-8 tracking-tighter italic">Still need assistance?</h2>
              <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                 Our dedicated concierge team is available for real-time support and consultations.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                 <Link to="/contact" className="px-12 py-5 bg-[#D7282F] text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-gray-900 transition-all">
                    Contact Specialist
                 </Link>
                 <a href="tel:07378957840" className="text-lg font-bold text-white hover:text-[#D7282F] transition-colors">
                    07378957840
                 </a>
              </div>
           </div>
           <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#D7282F]/10 rounded-full blur-[100px]" />
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

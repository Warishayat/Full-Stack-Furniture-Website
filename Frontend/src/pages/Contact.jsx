import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Bespoke Consultation',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data } = await API.post('/support/submit', formData);
      toast.success(data.message);
      setFormData({ name: '', email: '', subject: 'Bespoke Consultation', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Contact Concierge</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Contact Info */}
          <div className="lg:w-1/3">
            <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Concierge Service</span>
            <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 mb-8 tracking-tighter leading-tight">
              How can we <br/><span className="italic text-gray-400">assist</span> you?
            </h1>
            <p className="text-gray-600 mb-12 font-medium leading-relaxed">
              Our specialists are available for architectural consultations, bespoke orders, and logistics inquiries.
            </p>

            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#F2EDE7] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#D7282F]" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Line</h4>
                  <p className="text-lg font-bold text-gray-900">07378957840</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#F2EDE7] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#D7282F]" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Inquiry</h4>
                  <p className="text-lg font-bold text-gray-900">concierge@eliteseating.com</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#F2EDE7] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#D7282F]" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Headquarters</h4>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
                    EliteSeating Ltd.<br/>
                    123 Luxury Avenue, Mayfair<br/>
                    London, W1K 4RE
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:w-2/3 bg-gray-50 p-8 lg:p-16 rounded-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-6 py-4 outline-none focus:border-gray-900 transition-all font-medium" 
                  placeholder="Enter your name" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-6 py-4 outline-none focus:border-gray-900 transition-all font-medium" 
                  placeholder="Enter your email" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-6 py-4 outline-none focus:border-gray-900 transition-all font-medium appearance-none"
                >
                  <option>Bespoke Consultation</option>
                  <option>Order Status Inquiry</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</label>
                <textarea 
                  rows="6" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-6 py-4 outline-none focus:border-gray-900 transition-all font-medium resize-none" 
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <div className="md:col-span-2 pt-4">
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white font-black py-6 rounded-sm hover:bg-[#D7282F] transition-all text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Message'} <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-32 border-t border-gray-100 pt-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-serif font-black text-gray-900 italic">Common Questions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <Link to="/track-order" className="group">
              <div className="w-16 h-16 bg-[#F2EDE7] mx-auto mb-6 flex items-center justify-center group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-2">Delivery Times</h4>
              <p className="text-gray-500 text-xs font-medium">Learn about our white-glove timelines.</p>
            </Link>
            <Link to="/warranty" className="group">
              <div className="w-16 h-16 bg-[#F2EDE7] mx-auto mb-6 flex items-center justify-center group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-2">Warranty Claims</h4>
              <p className="text-gray-500 text-xs font-medium">Our lifetime quality guarantee details.</p>
            </Link>
            <Link to="/help" className="group">
              <div className="w-16 h-16 bg-[#F2EDE7] mx-auto mb-6 flex items-center justify-center group-hover:bg-[#D7282F] group-hover:text-white transition-all">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-2">Help Center</h4>
              <p className="text-gray-500 text-xs font-medium">Browse our full support library.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import { ShieldCheck } from 'lucide-react';
export default Contact;

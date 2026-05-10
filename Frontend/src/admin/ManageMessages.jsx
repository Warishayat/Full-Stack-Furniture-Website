import { useState, useEffect } from 'react';
import { Mail, Phone, Trash2, CheckCircle, MessageSquare, Clock, Search, ShieldAlert, Filter, Eye } from 'lucide-react';
import API from '../services/api';
import { toast } from 'react-toastify';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/support/all');
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Could not load support messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await API.put(`/support/status/${id}`, { status });
      if (data.success) {
        toast.success(`Message marked as ${status}`);
        setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this message forever?')) return;
    try {
      const { data } = await API.delete(`/support/delete/${id}`);
      if (data.success) {
        toast.success('Message permanently archived.');
        setMessages(messages.filter(m => m._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      toast.error('Failed to delete message.');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-4 block">Concierge Desk</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-black text-gray-900 tracking-tighter">Patron <span className="italic text-gray-400">Inquiries</span></h1>
        </div>
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="pl-11 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-sm text-xs font-bold uppercase tracking-wider outline-none focus:bg-white focus:border-gray-900 transition-all w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative flex items-center">
            <Filter className="absolute left-4 w-4 h-4 text-gray-400" />
            <select
              className="pl-11 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-sm text-xs font-bold uppercase tracking-wider outline-none focus:bg-white focus:border-gray-900 transition-all appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="new">New Inquiries</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 h-20 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-[#F2EDE7]/35 py-24 rounded-sm border border-gray-50 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No Inquiries Found</h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-black">Archive is currently pristine.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
          
          {/* Messages Table/List */}
          <div className="xl:col-span-2 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F2EDE7]/50 border-b border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    <th className="py-5 px-6">Sender</th>
                    <th className="py-5 px-6">Subject</th>
                    <th className="py-5 px-6">Status</th>
                    <th className="py-5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMessages.map((msg) => (
                    <tr 
                      key={msg._id} 
                      className={`group hover:bg-[#F2EDE7]/20 transition-all cursor-pointer ${selectedMessage?._id === msg._id ? 'bg-[#F2EDE7]/30' : ''}`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <td className="py-6 px-6">
                        <div className="font-bold text-gray-900 leading-tight">{msg.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{msg.email}</div>
                        {msg.phone && (
                          <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-[#D7282F]" />
                            {msg.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-6 px-6">
                        <div className="text-xs font-bold text-gray-700 truncate max-w-xs">{msg.subject}</div>
                        <div className="text-[9px] text-gray-400 flex items-center gap-1.5 mt-1 font-bold uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-sm ${
                          msg.status === 'new' 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : msg.status === 'read'
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100">
                          <button 
                            onClick={() => setSelectedMessage(msg)}
                            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-sm transition-all"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(msg._id)}
                            className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-sm transition-all"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Message Detail Inspector Panel */}
          <div className="bg-[#F2EDE7]/40 p-8 border border-gray-100 sticky top-40 rounded-sm">
            {selectedMessage ? (
              <div className="animate-fade-in space-y-8">
                <div className="border-b border-gray-200 pb-6 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[#D7282F] uppercase tracking-[0.3em] text-[8px] font-black mb-1 block">Inquiry Inspector</span>
                    <h4 className="text-xl font-serif font-bold text-gray-900 tracking-tight">{selectedMessage.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedMessage.email}</p>
                    {selectedMessage.phone && (
                      <p className="text-[10px] font-bold text-gray-700 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3 text-[#D7282F]" />
                        {selectedMessage.phone}
                      </p>
                    )}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-sm ${
                    selectedMessage.status === 'new' 
                      ? 'bg-red-50 text-red-600 border border-red-100' 
                      : selectedMessage.status === 'read'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'bg-green-50 text-green-600 border border-green-100'
                  }`}>
                    {selectedMessage.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Topic Subject</span>
                  <div className="text-xs font-bold text-gray-900 bg-white p-3 border border-gray-100 rounded-sm">
                    {selectedMessage.subject}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Message Content</span>
                  <div className="text-xs font-medium text-gray-700 bg-white p-4 border border-gray-100 rounded-sm leading-relaxed whitespace-pre-line min-h-[120px]">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Update Conversation Status</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'read')}
                      className={`py-3 text-[9px] font-black uppercase tracking-widest rounded-sm border transition-all ${
                        selectedMessage.status === 'read' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                      }`}
                    >
                      Mark Read
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                      className={`py-3 text-[9px] font-black uppercase tracking-widest rounded-sm border transition-all ${
                        selectedMessage.status === 'replied' 
                          ? 'bg-green-600 text-white border-green-600 shadow-md' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                      }`}
                    >
                      Mark Replied
                    </button>
                  </div>
                  <button 
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="w-full py-3 bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 text-red-600 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all mt-2"
                  >
                    Archive Thread
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <Eye className="w-10 h-10 mx-auto mb-4 opacity-35" />
                <p className="text-xs font-bold uppercase tracking-widest">Select an inquiry to view fully and update status.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ManageMessages;

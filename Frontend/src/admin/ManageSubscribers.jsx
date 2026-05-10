import { useState, useEffect } from 'react';
import { Mail, Trash2, Clock, Search, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import { toast } from 'react-toastify';

const ManageSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/newsletter/all');
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      toast.error('Could not load subscriber circle.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber? they will stop receiving updates.')) return;
    try {
      const { data } = await API.delete(`/newsletter/delete/${id}`);
      if (data.success) {
        toast.success('Subscriber removed from list.');
        setSubscribers(subscribers.filter(s => s._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete subscriber.');
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-4 block">Communication Suite</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-black text-gray-900 tracking-tighter">Inner <span className="italic text-gray-400">Circle</span></h1>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search email address..."
            className="pl-11 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-sm text-xs font-bold uppercase tracking-wider outline-none focus:bg-white focus:border-gray-900 transition-all w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 h-20 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="bg-[#F2EDE7]/35 py-24 rounded-sm border border-gray-50 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No Subscribers Listed</h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-black">Inner circle is currently waiting for patrons.</p>
        </div>
      ) : (
        <div className="border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F2EDE7]/50 border-b border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-500">
                  <th className="py-5 px-6">Subscriber Email</th>
                  <th className="py-5 px-6">Affiliation Date</th>
                  <th className="py-5 px-6">Status</th>
                  <th className="py-5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub._id} className="group hover:bg-[#F2EDE7]/20 transition-all">
                    <td className="py-6 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F2EDE7] rounded-full flex items-center justify-center text-[#D7282F]">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{sub.email}</span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="text-xs font-medium text-gray-700 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(sub.subscribedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-sm bg-green-50 text-green-600 border border-green-100 flex items-center gap-1 w-max">
                        <ShieldCheck className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(sub._id)}
                        className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-sm transition-all inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"
                        title="Remove Subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscribers;

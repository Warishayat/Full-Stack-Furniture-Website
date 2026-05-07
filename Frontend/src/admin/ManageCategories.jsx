import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Image as ImageIcon, X, FolderTree, ChevronRight, Hash } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/category/getallCategories');
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', name);
      if (parent) formData.append('parent', parent);
      if (image) formData.append('image', image);

      await API.post('/category/createCategory', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Category Orchestrated');
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setParent('');
    setImage(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this department?')) {
      try {
        await API.delete(`/category/deleteCategory/${id}`);
        toast.success('Department Removed');
        fetchCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  // Filter only parent categories for the dropdown
  const parentCategories = categories.filter(cat => !cat.parent);

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-2 block">Organizational Architecture</span>
           <h1 className="text-4xl lg:text-6xl font-serif font-black text-gray-900 tracking-tighter">Departmental <span className="italic text-gray-400">Registry</span></h1>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center px-10 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-[#D7282F] transition-all active:scale-95 shadow-xl"
        >
          <Plus className="w-4 h-4 mr-3" /> New Department
        </button>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-32 text-center bg-[#F2EDE7]/30">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D7282F] rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Archive...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-32 text-center bg-[#F2EDE7]/30">
            <FolderTree className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No collections found. Begin your first orchestration.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-8 w-40">Identity</th>
                  <th className="p-8">Department Name</th>
                  <th className="p-8">Hierarchy</th>
                  <th className="p-8 text-right">Orchestration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-[#F2EDE7]/20 transition-all group">
                    <td className="p-8">
                      <div className="w-20 h-24 bg-gray-50 border border-gray-100 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                             <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="font-serif font-black text-gray-900 text-2xl tracking-tight">{cat.name}</div>
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Slug: {cat.slug}</div>
                    </td>
                    <td className="p-8">
                       {cat.parent ? (
                         <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full w-fit text-[9px] font-black uppercase tracking-widest border border-gray-900 shadow-sm">
                            <ChevronRight className="w-3 h-3 text-[#D7282F]" /> {cat.parent.name || 'Sub-Department'}
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-full w-fit text-[9px] font-black uppercase tracking-widest border border-gray-200 italic">
                            <Hash className="w-3 h-3" /> Root Collection
                         </div>
                       )}
                    </td>
                    <td className="p-8 text-right">
                      <button 
                        onClick={() => handleDelete(cat._id)}
                        className="p-4 text-[#D7282F] bg-white hover:bg-[#D7282F] hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg border border-gray-100 animate-fade-in-up">
            <div className="flex justify-between items-center p-10 border-b border-gray-50">
              <div>
                <h2 className="text-3xl font-serif font-black text-gray-900 tracking-tight">New Orchestration</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Define a new departmental entity.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department Name*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-gray-900 outline-none transition-all font-bold"
                  placeholder="e.g. Master Bedrooms"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parent Hierarchy (Optional)</label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-gray-900 outline-none transition-all font-bold cursor-pointer"
                >
                  <option value="">Root Level Department</option>
                  {parentCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <p className="text-[9px] text-gray-400 mt-2 font-medium">Leave blank to create a primary collection.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cover Visual</label>
                <div 
                  className="border-2 border-dashed border-gray-100 rounded-sm p-6 text-center cursor-pointer hover:border-gray-900 hover:bg-[#F2EDE7]/30 transition-all group"
                  onClick={() => fileInputRef.current.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-xl">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-white text-[10px] font-black uppercase tracking-widest bg-gray-900 px-4 py-2">Change Visual</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-200 group-hover:text-gray-900 transition-colors">
                      <ImageIcon className="w-12 h-12 mb-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Select Narrative Image</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-50">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-gray-900 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-sm hover:bg-[#D7282F] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                >
                  {isSubmitting ? 'Synchronizing Archive...' : 'Finalize Orchestration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;

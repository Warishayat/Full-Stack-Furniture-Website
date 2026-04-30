import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Image as ImageIcon, X, FolderTree } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
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

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

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
    if (!name || !image) {
      toast.error('Name and Image are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image);

      await API.post('/category/createCategory', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Category created successfully');
      setIsModalOpen(false);
      setName('');
      setImage(null);
      setImagePreview(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await API.delete(`/category/deleteCategory/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-black mb-3 block">Organizational Structure</span>
           <h1 className="text-2xl lg:text-3xl font-serif font-bold text-primary-950 uppercase tracking-widest">Manage Categories</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-6 py-3 bg-primary-950 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-accent transition-all shadow-xl shadow-primary-950/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Category
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary-950/5 border border-primary-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-primary-500 font-bold uppercase tracking-widest text-xs">Awaiting Data...</div>
        ) : categories.length === 0 ? (
          <div className="p-20 text-center text-primary-500 font-bold uppercase tracking-widest text-xs">No collections found. Define your first department.</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-primary-950 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-8 w-40">Visual</th>
                  <th className="p-8">Department Name</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-primary-50/20 transition-colors">
                    <td className="p-8">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary-100 border border-primary-200">
                        <img 
                          src={cat.image || 'https://placehold.co/100'} 
                          alt={cat.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-8 font-serif font-bold text-primary-950 text-xl italic">{cat.name}</td>
                    <td className="p-8 text-right">
                      <button 
                        onClick={() => handleDelete(cat._id)}
                        className="p-4 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-100 shadow-sm"
                        title="Delete Category"
                      >
                        <Trash2 className="w-5 h-5" />
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-2xl overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/20 animate-fade-in-up my-auto">
            <div className="flex justify-between items-center p-8 border-b border-primary-50">
              <h2 className="text-2xl font-serif font-bold text-primary-950 italic flex items-center gap-4">
                 <FolderTree className="w-6 h-6 text-accent" /> New Department
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-primary-50 text-primary-400 hover:text-primary-950 rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="mb-8">
                <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Collection Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-white border border-primary-200 rounded-3xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all placeholder:text-primary-300"
                  placeholder="e.g. Living Room Suite"
                />
              </div>

              <div className="mb-10">
                <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Cover Imagery</label>
                <div 
                  className="border-2 border-dashed border-primary-200 rounded-[2rem] p-6 text-center cursor-pointer hover:bg-primary-50 transition-all group"
                  onClick={() => fileInputRef.current.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-primary-100 shadow-lg">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-primary-950 group-hover:text-accent transition-colors">
                      <ImageIcon className="w-12 h-12 mb-4 opacity-50 group-hover:opacity-100" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Select Visual</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-primary-50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-primary-950 font-black uppercase tracking-widest text-[10px] hover:text-accent transition-all">
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-5 bg-primary-950 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-accent transition-all shadow-2xl shadow-primary-950/20 disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></span> Saving...</>
                  ) : (
                    'Authenticate Collection'
                  )}
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

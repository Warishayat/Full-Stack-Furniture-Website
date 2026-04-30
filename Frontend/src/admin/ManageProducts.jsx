import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Edit, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    oldprice: '',
    category: '',
    stock: '10',
    colors: [],
    specifications: {
      general: { material: '', finish: '' },
      dimensions: { length: '', width: '', height: '' },
      care: { instructions: '' },
      assembly: { required: false }
    },
  });
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // URLs for preview
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let productsData = [];
      let categoriesData = [];

      try {
        const prodRes = await API.get('/product/getAllProducts');
        productsData = prodRes.data.products || prodRes.data || [];
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error fetching products:', err);
        }
      }

      try {
        const catRes = await API.get('/category/getallCategories');
        categoriesData = catRes.data.categories || catRes.data || [];
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error fetching categories:', err);
          toast.error('Failed to load categories');
        }
      }

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      price: '', 
      oldprice: '', 
      category: '', 
      stock: '10',
      colors: [],
      specifications: {
        general: { material: '', finish: '' },
        dimensions: { length: '', width: '', height: '' },
        care: { instructions: '' },
        assembly: { required: false }
      }
    });
    setImages([]);
    setImagePreviews([]);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (product) => {
    setFormData({
      title: product.title || product.name || '',
      description: product.description || '',
      price: product.price || '',
      oldprice: product.oldprice || '',
      category: product.category?._id || product.category || '',
      stock: product.stock !== undefined ? product.stock.toString() : '0',
      colors: Array.isArray(product.colors) ? product.colors : [],
      specifications: {
        general: product.specifications?.general || { material: '', finish: '' },
        dimensions: product.specifications?.dimensions || { length: '', width: '', height: '' },
        care: product.specifications?.care || { instructions: '' },
        assembly: product.specifications?.assembly || { required: false }
      }
    });
    setImagePreviews(product.images || []);
    setImages([]); 
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // JS Validation instead of HTML "required"
    if (!editingId && (!formData.title || !formData.price || !formData.category)) {
      toast.error('Title, Price, and Category are required for new products');
      return;
    }

    if (formData.oldprice && Number(formData.oldprice) <= Number(formData.price)) {
      toast.error('Old Price must be greater than current Price');
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      if (formData.oldprice) submitData.append('oldprice', formData.oldprice);
      submitData.append('category', formData.category);
      submitData.append('stock', formData.stock);

      // Handle Colors
      submitData.append('colors', JSON.stringify(formData.colors));
      
      // Handle Specifications
      submitData.append('specifications', JSON.stringify(formData.specifications));

      if (images.length > 0) {
        images.forEach(img => submitData.append('images', img));
      }

      if (editingId) {
        await API.put(`/product/updateProduct/${editingId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully');
      } else {
        if (images.length === 0) {
          toast.error('At least one image is required for new products');
          setIsSubmitting(false);
          return;
        }
        await API.post('/product/createProduct', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created successfully');
      }

      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/product/deleteProduct/${id}`);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-primary-950 uppercase tracking-widest">Manage Products</h1>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center px-6 py-3 bg-primary-950 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-accent transition-all shadow-xl shadow-primary-950/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary-950/5 border border-primary-100 overflow-hidden w-full">
        {loading ? (
          <div className="p-20 text-center text-primary-500 font-bold uppercase tracking-widest text-xs">Awaiting Data...</div>
        ) : products.length === 0 ? (
          <div className="p-20 text-center text-primary-500 font-bold uppercase tracking-widest text-xs">No pieces found. Create your first masterpiece.</div>
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-primary-950 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-6 w-32">Curation</th>
                  <th className="p-6">Title</th>
                  <th className="p-6">Collection</th>
                  <th className="p-6">Investment</th>
                  <th className="p-6">Availability</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-primary-50 transition-colors">
                    <td className="p-6">
                      <Link to={`/product/${product._id}`} className="block w-16 h-20 rounded-xl overflow-hidden bg-primary-100 border border-primary-200 hover:scale-105 transition-transform">
                        <img 
                          src={product.images?.[0] || 'https://placehold.co/100'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </td>
                    <td className="p-6 font-black text-primary-950 text-sm">
                      <Link to={`/product/${product._id}`} className="line-clamp-1 hover:text-accent transition-colors">{product.title || product.name}</Link>
                    </td>
                    <td className="p-6 text-primary-950 text-xs font-black uppercase tracking-widest">
                      {product.category?.name || product.category || 'N/A'}
                    </td>
                    <td className="p-6 font-black text-primary-950">
                      £{product.price?.toLocaleString() || '0'}
                    </td>
                    <td className="p-6">
                       <span className={`inline-block whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                          {product.stock ?? 0} In Stock
                       </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="p-3 text-primary-950 hover:bg-primary-950 hover:text-white rounded-xl transition-all border border-primary-100 shadow-sm"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-3 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-100 shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 bg-primary-950/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl mt-32 mb-20 border border-white/20 animate-fade-in-up scrollbar-hide">
            <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-primary-50 bg-primary-50/30 z-10">
              <h2 className="text-2xl font-serif font-bold text-primary-950">
                {editingId ? 'Refine Masterpiece' : 'New Creation'}
              </h2>
              <button onClick={resetForm} className="p-3 bg-white text-primary-400 hover:text-primary-950 rounded-full transition-all shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Product Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-primary-200 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all placeholder:text-primary-300"
                      placeholder="Enter title..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Price (£)</label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-white border border-primary-200 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all placeholder:text-primary-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Old Price (£)</label>
                      <input
                        type="number"
                        name="oldprice"
                        min="0"
                        step="0.01"
                        value={formData.oldprice}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-white border border-primary-200 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all placeholder:text-primary-300"
                        placeholder="Was..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-white border border-primary-200 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all placeholder:text-primary-300"
                        placeholder="Quantity"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-white border border-primary-200 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select Department</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Available Finishes (Colors)</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(formData.colors || []).map((color, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 group">
                          <span className="text-xs font-bold text-primary-950">{color}</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              const newColors = [...formData.colors];
                              newColors.splice(idx, 1);
                              setFormData({ ...formData, colors: newColors });
                            }}
                            className="text-primary-300 hover:text-rose-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mb-6">
                      <input
                        type="text"
                        id="colorInput"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !formData.colors.includes(val)) {
                              setFormData({ ...formData, colors: [...formData.colors, val] });
                              e.target.value = '';
                            }
                          }
                        }}
                        className="flex-1 px-6 py-4 bg-white border border-primary-200 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all placeholder:text-primary-300 text-xs"
                        placeholder="Type color and press Enter..."
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('colorInput');
                          const val = input.value.trim();
                          if (val && !formData.colors.includes(val)) {
                            setFormData({ ...formData, colors: [...formData.colors, val] });
                            input.value = '';
                          }
                        }}
                        className="px-6 bg-primary-100 text-primary-950 rounded-2xl font-black uppercase text-[10px] hover:bg-accent hover:text-white transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Technical Specifications</label>
                    <div className="space-y-6 bg-primary-50 p-6 rounded-[2rem] border border-primary-100 mb-6">
                      
                      {/* General */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black text-accent uppercase tracking-widest border-b border-accent/10 pb-2">General Details</p>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Material"
                            value={formData.specifications?.general?.material || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              specifications: { ...formData.specifications, general: { ...formData.specifications.general, material: e.target.value } }
                            })}
                            className="px-4 py-3 bg-white border border-primary-200 rounded-xl text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Finish"
                            value={formData.specifications?.general?.finish || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              specifications: { ...formData.specifications, general: { ...formData.specifications.general, finish: e.target.value } }
                            })}
                            className="px-4 py-3 bg-white border border-primary-200 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* Dimensions */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black text-accent uppercase tracking-widest border-b border-accent/10 pb-2">Dimensions</p>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            placeholder="L"
                            value={formData.specifications?.dimensions?.length || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              specifications: { ...formData.specifications, dimensions: { ...formData.specifications.dimensions, length: e.target.value } }
                            })}
                            className="px-4 py-3 bg-white border border-primary-200 rounded-xl text-xs font-bold"
                          />
                          <input
                            type="number"
                            placeholder="W"
                            value={formData.specifications?.dimensions?.width || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              specifications: { ...formData.specifications, dimensions: { ...formData.specifications.dimensions, width: e.target.value } }
                            })}
                            className="px-4 py-3 bg-white border border-primary-200 rounded-xl text-xs font-bold"
                          />
                          <input
                            type="number"
                            placeholder="H"
                            value={formData.specifications?.dimensions?.height || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              specifications: { ...formData.specifications, dimensions: { ...formData.specifications.dimensions, height: e.target.value } }
                            })}
                            className="px-4 py-3 bg-white border border-primary-200 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* Care & Assembly */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black text-accent uppercase tracking-widest border-b border-accent/10 pb-2">Care & Assembly</p>
                        <textarea
                          placeholder="Care Instructions"
                          value={formData.specifications?.care?.instructions || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, care: { ...formData.specifications.care, instructions: e.target.value } }
                          })}
                          className="w-full px-4 py-3 bg-white border border-primary-200 rounded-xl text-xs font-bold resize-none"
                          rows="2"
                        ></textarea>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white border border-primary-200 rounded-xl">
                          <label className="text-[10px] font-black text-primary-950 uppercase tracking-widest">Assembly Required?</label>
                          <input
                            type="checkbox"
                            checked={formData.specifications?.assembly?.required || false}
                            onChange={(e) => setFormData({
                              ...formData,
                              specifications: { ...formData.specifications, assembly: { ...formData.specifications.assembly, required: e.target.checked } }
                            })}
                            className="w-4 h-4 accent-accent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-primary-200 rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none text-primary-950 font-bold transition-all resize-none placeholder:text-primary-300"
                      placeholder="Describe this piece..."
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-primary-950 uppercase tracking-widest mb-3">Gallery</label>
                  <div 
                    className="border-2 border-dashed border-primary-200 rounded-[2rem] p-10 text-center cursor-pointer hover:bg-primary-50 transition-all mb-6 group"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="flex flex-col items-center justify-center text-primary-950 group-hover:text-accent transition-colors">
                      <ImageIcon className="w-12 h-12 mb-4 opacity-50 group-hover:opacity-100" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Update Imagery (Pass 3 Images)</span>
                      <p className="text-[8px] text-primary-400 mt-2 uppercase tracking-widest font-bold">Standardize your listing with exactly 3 views</p>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple className="hidden" />
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-primary-100 shadow-sm">
                          <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <div className="absolute top-0 left-0 right-0 bg-primary-950/80 text-white text-[8px] font-black uppercase tracking-widest text-center py-2">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-10 border-t border-primary-50">
                <button type="button" onClick={resetForm} className="px-8 py-4 text-primary-400 font-black uppercase tracking-widest text-[10px] hover:text-primary-950 transition-all">
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-5 bg-primary-950 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-accent transition-all shadow-2xl shadow-primary-950/20 disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></span> Processing...</>
                  ) : (
                    editingId ? 'Apply Refinements' : 'Curate Piece'
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

export default ManageProducts;

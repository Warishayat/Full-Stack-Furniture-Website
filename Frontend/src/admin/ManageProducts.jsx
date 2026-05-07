import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Edit, Image as ImageIcon, X, ChevronDown, ChevronUp, Layers, Box, Palette, UploadCloud, Info, Check, ArrowRight, Save, Ruler, Truck, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [activeTab, setActiveTab] = useState('basic'); 


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    variants: [
      {
        name: 'Standard',
        materials: [
          {
            name: 'Fabric',
            colors: [
              { name: 'Default', price: '', oldPrice: '', stock: 0, sku: '', imageIndexes: [] }
            ]
          }
        ]
      }
    ],
    specifications: {
      general: { material: '', finish: '', warranty: '' },
      dimensions: { length: '', width: '', height: '', unit: 'cm' },
      packaging: { boxWeight: '', packagingDetails: '' },
      care: { instructions: '' },
      assembly: { required: false, details: '' },
      delivery: { time: '', charges: '' },
      returns: { policy: '', link: '' }
    },
  });

  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // URLs for preview
  const [sizeChart, setSizeChart] = useState(null);
  const [sizeChartPreview, setSizeChartPreview] = useState(null);
  
  const fileInputRef = useRef(null);
  const sizeChartRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        API.get('/product/getAllProducts'),
        API.get('/category/getallCategories')
      ]);

      setProducts(prodRes.data.products || prodRes.data || []);
      setCategories(catRes.data.categories || catRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Failed to synchronize with server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    // Update imageIndexes in all colors
    const updatedVariants = formData.variants.map(v => ({
      ...v,
      materials: v.materials.map(m => ({
        ...m,
        colors: m.colors.map(c => ({
          ...c,
          imageIndexes: c.imageIndexes
            .filter(i => i !== index)
            .map(i => i > index ? i - 1 : i)
        }))
      }))
    }));
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const handleSizeChartChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSizeChart(file);
      setSizeChartPreview(URL.createObjectURL(file));
    }
  };

  // Dynamic Form Handlers
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', materials: [{ name: '', colors: [{ name: '', price: '', oldPrice: '', stock: 0, sku: '', imageIndexes: [] }] }] }]
    }));
  };

  const removeVariant = (vIndex) => {
    const newVariants = [...formData.variants];
    newVariants.splice(vIndex, 1);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addMaterial = (vIndex) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex].materials.push({ name: '', colors: [{ name: '', price: '', oldPrice: '', stock: 0, sku: '', imageIndexes: [] }] });
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const removeMaterial = (vIndex, mIndex) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex].materials.splice(mIndex, 1);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addColor = (vIndex, mIndex) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex].materials[mIndex].colors.push({ name: '', price: '', oldPrice: '', stock: 0, sku: '', imageIndexes: [] });
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const removeColor = (vIndex, mIndex, cIndex) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex].materials[mIndex].colors.splice(cIndex, 1);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const updateColorImageIndex = (vIndex, mIndex, cIndex, imgIndex) => {
    const newVariants = [...formData.variants];
    const currentIndexes = newVariants[vIndex].materials[mIndex].colors[cIndex].imageIndexes;
    
    if (currentIndexes.includes(imgIndex)) {
      newVariants[vIndex].materials[mIndex].colors[cIndex].imageIndexes = currentIndexes.filter(i => i !== imgIndex);
    } else {
      newVariants[vIndex].materials[mIndex].colors[cIndex].imageIndexes = [...currentIndexes, imgIndex];
    }
    
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      variants: [{ name: 'Standard', materials: [{ name: 'Fabric', colors: [{ name: 'Default', price: '', oldPrice: '', stock: 0, sku: '', imageIndexes: [] }] }] }],
      specifications: {
        general: { material: '', finish: '', warranty: '' },
        dimensions: { length: '', width: '', height: '', unit: 'cm' },
        packaging: { boxWeight: '', packagingDetails: '' },
        care: { instructions: '' },
        assembly: { required: false, details: '' },
        delivery: { time: '', charges: '' },
        returns: { policy: '', link: '' }
      },
    });
    setImages([]);
    setImagePreviews([]);
    setSizeChart(null);
    setSizeChartPreview(null);
    setEditingId(null);
    setActiveTab('basic');
    setIsModalOpen(false);
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    
    const defaultSpecs = {
      general: { material: '', finish: '', warranty: '' },
      dimensions: { length: '', width: '', height: '', unit: 'cm' },
      packaging: { boxWeight: '', packagingDetails: '' },
      care: { instructions: '' },
      assembly: { required: false, details: '' },
      delivery: { time: '', charges: '' },
      returns: { policy: '', link: '' }
    };

    setFormData({
      title: product.title || '',
      description: product.description || '',
      category: product.category?._id || product.category || '',
      variants: product.variants?.length ? product.variants.map(v => ({
        ...v,
        materials: v.materials.map(m => ({
          ...m,
          colors: m.colors.map(c => ({
            ...c,
            imageIndexes: [] 
          }))
        }))
      })) : [{ name: 'Standard', materials: [{ name: 'Fabric', colors: [{ name: 'Default', price: '', oldPrice: '', stock: 0, sku: '', imageIndexes: [] }] }] }],
      specifications: {
        ...defaultSpecs,
        ...product.specifications,
        general: { ...defaultSpecs.general, ...product.specifications?.general },
        dimensions: { ...defaultSpecs.dimensions, ...product.specifications?.dimensions },
        packaging: { ...defaultSpecs.packaging, ...product.specifications?.packaging },
        care: { ...defaultSpecs.care, ...product.specifications?.care },
        assembly: { ...defaultSpecs.assembly, ...product.specifications?.assembly },
        delivery: { ...defaultSpecs.delivery, ...product.specifications?.delivery },
      },
    });

    setImagePreviews(product.images || []);
    setImages([]); 
    setSizeChartPreview(product.specifications?.dimensions?.sizeChart || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.variants.length) {
      toast.error('Title, Category and at least one Variant are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      
      submitData.append('variants', JSON.stringify(formData.variants));
      submitData.append('specifications', JSON.stringify(formData.specifications));

      if (images.length > 0) {
        images.forEach(img => submitData.append('images', img));
      }

      if (sizeChart) {
        submitData.append('sizeChart', sizeChart);
      }

      if (editingId) {
        await API.put(`/product/updateProduct/${editingId}`, submitData);
        toast.success('Collection Updated');
      } else {
        if (images.length === 0) {
          toast.error('Gallery images are required for new curation');
          setIsSubmitting(false);
          return;
        }
        await API.post('/product/createProduct', submitData);
        toast.success('New Piece Curated');
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Submit Error Details:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
      }
      toast.error(error.response?.data?.message || error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this piece from the collection?')) {
      try {
        await API.delete(`/product/deleteProduct/${id}`);
        toast.success('Piece Removed');
        fetchData();
      } catch (error) {
        toast.error('Failed to remove piece');
      }
    }
  };

  return (
    <div className="pb-20 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
           <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-2 block">Archive Management</span>
           <h1 className="text-4xl lg:text-6xl font-serif font-black text-gray-900 tracking-tighter">Inventory <span className="italic text-gray-400">Registry</span></h1>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center px-10 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-[#D7282F] transition-all active:scale-95 shadow-xl"
        >
          <Plus className="w-4 h-4 mr-3" /> Curate New Piece
        </button>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-32 text-center bg-[#F2EDE7]/30">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D7282F] rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Archive...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-32 text-center bg-[#F2EDE7]/30">
            <Layers className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Registry Empty. Begin your first curation.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-8 w-40">Reference</th>
                  <th className="p-8">Design Identity</th>
                  <th className="p-8 text-center">Collection</th>
                  <th className="p-8">Starting From</th>
                  <th className="p-8">Stock Integrity</th>
                  <th className="p-8 text-right">Orchestration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => {
                  const displayPrice = product.variants?.[0]?.materials?.[0]?.colors?.[0]?.price || 0;
                  const totalStock = product.variants?.reduce((acc, v) => 
                    acc + v.materials?.reduce((mAcc, m) => 
                      mAcc + m.colors?.reduce((cAcc, c) => cAcc + (c.stock || 0), 0)
                    , 0)
                  , 0) || 0;

                  return (
                    <tr key={product._id} className="hover:bg-[#F2EDE7]/20 transition-all group">
                      <td className="p-8">
                        <div className="w-24 h-32 bg-gray-50 border border-gray-100 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                          <img 
                            src={product.images?.[0] || 'https://placehold.co/200'} 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="font-serif font-black text-gray-900 text-2xl mb-1 tracking-tight">{product.title}</div>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          {product.variants?.length || 0} DIMENSIONS | {product.variants?.[0]?.materials?.length || 0} FINISHES
                        </div>
                      </td>
                      <td className="p-8 text-center">
                         <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                            {product.category?.name || 'Curated Collection'}
                         </span>
                      </td>
                      <td className="p-8">
                        <div className="font-serif font-black text-xl text-gray-900">£{displayPrice.toLocaleString()}</div>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${totalStock > 10 ? 'bg-green-500' : totalStock > 0 ? 'bg-[#D7282F]' : 'bg-gray-300'}`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                               {totalStock} in inventory
                            </span>
                         </div>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="p-4 text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-all border border-gray-100"
                            title="Edit Piece"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="p-4 text-[#D7282F] bg-white hover:bg-[#D7282F] hover:text-white transition-all border border-gray-100"
                            title="Remove Piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL - Step-by-Step Wizard */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-gray-50">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {editingId ? 'Refine Masterpiece' : 'New Collection Piece'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">Guided workflow for product orchestration.</p>
              </div>
              <button onClick={resetForm} className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stepper */}
            <div className="flex border-b border-gray-50 bg-white px-8">
              {[
                { id: 'basic', label: 'Identity', icon: Info, color: 'text-indigo-600', border: 'border-indigo-600' },
                { id: 'gallery', label: 'Media', icon: ImageIcon, color: 'text-purple-600', border: 'border-purple-600' },
                { id: 'variants', label: 'Architecture', icon: Layers, color: 'text-blue-600', border: 'border-blue-600' },
                { id: 'specs', label: 'Logistics', icon: Ruler, color: 'text-emerald-600', border: 'border-emerald-600' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-3 py-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${
                    activeTab === tab.id ? `${tab.border} ${tab.color} bg-slate-50/50` : 'border-transparent text-slate-300 hover:text-slate-500'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? '' : 'opacity-40'}`} />
                  {tab.label}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 bg-gray-50/30">
              
              {/* STEP 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-10 max-w-4xl mx-auto">
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Piece Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-lg font-bold text-slate-900"
                          placeholder="Elite Seating Masterpiece"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category Collection</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all text-lg font-bold cursor-pointer"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Narrative Description</label>
                      <textarea
                        name="description"
                        rows="6"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all text-base font-medium resize-none"
                        placeholder="Describe the architectural soul of this piece..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end pt-6">
                    <button type="button" onClick={() => setActiveTab('gallery')} className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center gap-3 active:scale-95">
                      Next: Asset Curation <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MEDIA */}
              {activeTab === 'gallery' && (
                <div className="space-y-10 max-w-4xl mx-auto">
                  <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="border-4 border-dashed border-slate-100 rounded-[3rem] p-20 hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-10 h-10 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">Upload Product Assets</p>
                      <p className="text-sm text-gray-400 mt-2">Drag and drop or click to browse</p>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="mt-12 space-y-6 text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Collection Assets ({imagePreviews.length})</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                          {imagePreviews.map((url, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
                              <img src={url} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setActiveTab('basic')} className="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Back</button>
                    <button type="button" onClick={() => setActiveTab('variants')} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3">
                      Proceed to Variants <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: VARIANTS */}
              {activeTab === 'variants' && (
                <div className="space-y-10 max-w-5xl mx-auto">
                  {formData.variants.map((variant, vIdx) => (
                    <div key={vIdx} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="bg-gray-900 p-6 flex justify-between items-center">
                        <div className="flex items-center gap-6 flex-1">
                           <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold">{vIdx + 1}</div>
                           <input
                             type="text"
                             value={variant.name}
                             onChange={(e) => {
                               const newVariants = [...formData.variants];
                               newVariants[vIdx].name = e.target.value;
                               setFormData({ ...formData, variants: newVariants });
                             }}
                             className="bg-transparent border-none text-white text-xl font-bold placeholder:text-gray-600 outline-none w-full"
                             placeholder="Dimension (e.g. 3 Seater)"
                           />
                        </div>
                        <button type="button" onClick={() => removeVariant(vIdx)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="p-10 space-y-10">
                        {variant.materials.map((material, mIdx) => (
                          <div key={mIdx} className="bg-white p-8 rounded-[2.5rem] border-2 border-indigo-50/50 shadow-xl shadow-indigo-500/5 space-y-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 blur-2xl" />
                             <div className="flex items-center justify-between border-b border-slate-100 pb-6 relative z-10">
                                <div className="flex-1">
                                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Material Composition</label>
                                   <input
                                     type="text"
                                     value={material.name}
                                     onChange={(e) => {
                                       const newVariants = [...formData.variants];
                                       newVariants[vIdx].materials[mIdx].name = e.target.value;
                                       setFormData({ ...formData, variants: newVariants });
                                     }}
                                     className="bg-transparent border-none text-2xl font-bold text-gray-900 outline-none w-full placeholder:text-gray-300"
                                     placeholder="e.g. Luxury Chenille"
                                   />
                                </div>
                                <button type="button" onClick={() => removeMaterial(vIdx, mIdx)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all">
                                   <Trash2 className="w-5 h-5" />
                                </button>
                             </div>

                             <div className="grid grid-cols-1 gap-6 relative z-10">
                                {material.colors.map((color, cIdx) => (
                                  <div key={cIdx} className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 shadow-inner relative group/color hover:bg-white transition-all">
                                    <button type="button" onClick={() => removeColor(vIdx, mIdx, cIdx)} className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-all">
                                      <X className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Finish Name</label>
                                        <input
                                          type="text"
                                          value={color.name}
                                          onChange={(e) => {
                                            const newVariants = [...formData.variants];
                                            newVariants[vIdx].materials[mIdx].colors[cIdx].name = e.target.value;
                                            setFormData({ ...formData, variants: newVariants });
                                          }}
                                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none"
                                          placeholder="Slate Grey"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (£)</label>
                                        <input
                                          type="number"
                                          value={color.price}
                                          onChange={(e) => {
                                            const newVariants = [...formData.variants];
                                            newVariants[vIdx].materials[mIdx].colors[cIdx].price = e.target.value;
                                            setFormData({ ...formData, variants: newVariants });
                                          }}
                                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none"
                                          placeholder="1200"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</label>
                                        <input
                                          type="number"
                                          value={color.stock}
                                          onChange={(e) => {
                                            const newVariants = [...formData.variants];
                                            newVariants[vIdx].materials[mIdx].colors[cIdx].stock = e.target.value;
                                            setFormData({ ...formData, variants: newVariants });
                                          }}
                                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none"
                                          placeholder="5"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</label>
                                        <input
                                          type="text"
                                          value={color.sku}
                                          onChange={(e) => {
                                            const newVariants = [...formData.variants];
                                            newVariants[vIdx].materials[mIdx].colors[cIdx].sku = e.target.value;
                                            setFormData({ ...formData, variants: newVariants });
                                          }}
                                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none"
                                          placeholder="SOFA-SLT-3S"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-gray-50">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Link Visual Assets:</p>
                                      <div className="flex flex-wrap gap-3">
                                        {imagePreviews.map((url, imgIdx) => (
                                          <button
                                            key={imgIdx}
                                            type="button"
                                            onClick={() => updateColorImageIndex(vIdx, mIdx, cIdx, imgIdx)}
                                            className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                                              color.imageIndexes.includes(imgIdx) 
                                                ? 'border-blue-600 ring-4 ring-blue-50' 
                                                : 'border-transparent opacity-30 grayscale'
                                            }`}
                                          >
                                            <img src={url} className="w-full h-full object-cover" />
                                            {color.imageIndexes.includes(imgIdx) && (
                                              <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                                                <Check className="w-6 h-6 text-white stroke-[4]" />
                                              </div>
                                            )}
                                          </button>
                                        ))}
                                        {imagePreviews.length === 0 && <p className="text-[10px] text-gray-400 italic">Upload images in Step 2 first.</p>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button type="button" onClick={() => addColor(vIdx, mIdx)} className="w-full py-5 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-white transition-all">
                                  + Add Finish/Color
                                </button>
                             </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addMaterial(vIdx)} className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
                          + Add Material Collection
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button type="button" onClick={addVariant} className="w-full py-16 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300 hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/50 transition-all group">
                     <Plus className="w-12 h-12 mb-4 group-hover:scale-125 transition-transform" />
                     <span className="font-black text-xs uppercase tracking-widest">Define New Size Variant</span>
                  </button>

                  <div className="flex justify-between pt-10">
                    <button type="button" onClick={() => setActiveTab('gallery')} className="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Back</button>
                    <button type="button" onClick={() => setActiveTab('specs')} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3">
                      Proceed to Specs <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SPECS */}
              {activeTab === 'specs' && (
                <div className="space-y-10 max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Dimensions */}
                    <div className="bg-white p-8 rounded-[3rem] border-2 border-emerald-50 shadow-2xl shadow-emerald-500/5 space-y-6">
                      <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg">
                        <Ruler className="w-6 h-6 text-emerald-600" /> Architectural Metrics
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Width (cm)</label>
                          <input type="number" value={formData.specifications.dimensions.width} onChange={e => setFormData({...formData, specifications: {...formData.specifications, dimensions: {...formData.specifications.dimensions, width: e.target.value}}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Height (cm)</label>
                          <input type="number" value={formData.specifications.dimensions.height} onChange={e => setFormData({...formData, specifications: {...formData.specifications, dimensions: {...formData.specifications.dimensions, height: e.target.value}}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold" />
                        </div>
                      </div>
                      <div 
                        onClick={() => sizeChartRef.current.click()}
                        className="w-full aspect-video border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all overflow-hidden relative"
                      >
                         {sizeChartPreview ? (
                           <img src={sizeChartPreview} className="w-full h-full object-contain" />
                         ) : (
                           <div className="text-center">
                             <UploadCloud className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                             <p className="text-[10px] font-black uppercase text-gray-300">Upload Size Guide Drawing</p>
                           </div>
                         )}
                         <input type="file" ref={sizeChartRef} onChange={handleSizeChartChange} className="hidden" />
                      </div>
                    </div>

                    {/* Quality & Lead Time */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                      <h3 className="font-bold text-gray-900 flex items-center gap-3">
                        <Truck className="w-5 h-5 text-blue-600" /> Logistics & Quality
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Delivery Lead Time</label>
                          <input type="text" value={formData.specifications.delivery.time} onChange={e => setFormData({...formData, specifications: {...formData.specifications, delivery: {...formData.specifications.delivery, time: e.target.value}}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold" placeholder="e.g. 4-8 Weeks" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Primary Material</label>
                          <input type="text" value={formData.specifications.general.material} onChange={e => setFormData({...formData, specifications: {...formData.specifications, general: {...formData.specifications.general, material: e.target.value}}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold" placeholder="e.g. Italian Leather" />
                        </div>
                        <div className="flex items-center gap-3 py-2">
                           <input type="checkbox" checked={formData.specifications.assembly.required} onChange={e => setFormData({...formData, specifications: {...formData.specifications, assembly: {...formData.specifications.assembly, required: e.target.checked}}})} className="w-5 h-5 rounded accent-blue-600" id="assembly" />
                           <label htmlFor="assembly" className="text-sm font-bold text-gray-700">Professional Assembly Required</label>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Returns Policy</label>
                          <textarea value={formData.specifications.returns.policy} onChange={e => setFormData({...formData, specifications: {...formData.specifications, returns: {...formData.specifications.returns, policy: e.target.value}}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs resize-none" placeholder="e.g. 14-day hassle-free returns..." rows="2" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Care Instructions</label>
                          <textarea value={formData.specifications.care.instructions} onChange={e => setFormData({...formData, specifications: {...formData.specifications, care: {...formData.specifications.care, instructions: e.target.value}}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs resize-none" placeholder="e.g. Use specialized leather cleaner..." rows="2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-indigo-600/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="flex items-center gap-8 relative z-10">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/30 shadow-2xl">
                        <Save className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black tracking-tight">Finalize Collection</h4>
                        <p className="text-indigo-100 text-sm font-medium opacity-80 uppercase tracking-widest">Architectural piece ready for launch.</p>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Synchronizing...' : (editingId ? 'Update Masterpiece' : 'Publish to Collection')}
                    </button>
                  </div>

                  <div className="flex justify-start">
                    <button type="button" onClick={() => setActiveTab('variants')} className="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Back</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

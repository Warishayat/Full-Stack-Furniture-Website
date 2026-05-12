import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingCart, Filter, X, ChevronRight, ChevronDown, Palette, Box, Layers, RefreshCcw, SlidersHorizontal, ArrowRight, Star } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const material = searchParams.get('material');
  const color = searchParams.get('color');
  const searchQuery = searchParams.get('query');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ materials: [], colors: [], variants: [] });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const getCategoryIdBySlugOrId = (slugOrId, catsList) => {
    if (!slugOrId) return '';
    if (/^[0-9a-fA-F]{24}$/.test(slugOrId)) {
      return slugOrId;
    }
    
    const flatCats = [];
    catsList.forEach(c => {
      flatCats.push(c);
      if (c.children && c.children.length > 0) {
        flatCats.push(...c.children);
      }
    });

    // Try exact slug match
    let found = flatCats.find(c => (c.slug || '').toLowerCase() === slugOrId.toLowerCase());
    if (found) return found._id;

    // Try singular/plural match
    const searchSlugSingular = slugOrId.toLowerCase().endsWith('s') ? slugOrId.toLowerCase().slice(0, -1) : slugOrId.toLowerCase();
    const searchSlugPlural = slugOrId.toLowerCase() + 's';
    
    found = flatCats.find(c => {
      const cSlug = (c.slug || '').toLowerCase();
      const cName = (c.name || '').toLowerCase();
      return cSlug === searchSlugSingular || 
             cSlug === searchSlugPlural || 
             cName === searchSlugSingular || 
             cName === searchSlugPlural ||
             cName === slugOrId.toLowerCase() ||
             cSlug.includes(searchSlugSingular) ||
             searchSlugSingular.includes(cSlug);
    });

    return found ? found._id : slugOrId;
  };

  const [activeFilters, setActiveFilters] = useState({
    category: categoryId || '',
    material: material || '',
    color: color || '',
    variant: searchParams.get('variant') || ''
  });

  useEffect(() => {
    const resolvedCategory = getCategoryIdBySlugOrId(categoryId, categories);
    setActiveFilters({
      category: resolvedCategory || '',
      material: material || '',
      color: color || '',
      variant: searchParams.get('variant') || ''
    });
  }, [categoryId, material, color, searchParams, categories]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data } = await API.get('/filter/filters', { 
          params: { category: activeFilters.category } 
        });
        setFilterOptions(data || { materials: [], colors: [], variants: [] });
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, [activeFilters.category]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await API.get('/category/getallCategories');
        const allCats = catRes.data.categories || catRes.data || [];
        
        // Structure categories for sidebar
        const structured = allCats.filter(c => !c.parent).map(p => ({
          ...p,
          children: allCats.filter(c => (c.parent?._id === p._id) || (c.parent === p._id))
        })).filter(p => p.image || p.children.length > 0);
        
        setCategories(structured);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let endpoint = '/product/getAllProducts';
        let params = {};

        if (searchQuery) {
          endpoint = '/product/search';
          params.query = searchQuery;
        } else if (activeFilters.category || activeFilters.material || activeFilters.color || activeFilters.variant) {
          endpoint = '/filter/products';
          if (activeFilters.category) params.category = activeFilters.category;
          if (activeFilters.material) params.material = activeFilters.material;
          if (activeFilters.color) params.color = activeFilters.color;
          if (activeFilters.variant) params.variant = activeFilters.variant;
        }

        const { data } = await API.get(endpoint, { params });
        const items = data.products || (Array.isArray(data) ? data : []);
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilters, searchQuery]);

  const updateFilter = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    const newParams = {};
    if (newFilters.category) newParams.category = newFilters.category;
    if (newFilters.material) newParams.material = newFilters.material;
    if (newFilters.color) newParams.color = newFilters.color;
    if (newFilters.variant) newParams.variant = newFilters.variant;
    if (searchQuery) newParams.query = searchQuery;
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(searchQuery ? { query: searchQuery } : {});
  };

  return (
    <div className="bg-white min-h-screen pt-32 lg:pt-40 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Collection</span>
        </nav>
        
        {/* Header Section */}
        <div className="mb-20 flex flex-col md:flex-row items-end justify-between gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
               <span className="text-blue-600 uppercase tracking-[0.4em] text-[10px] font-black">Elite Seating Gallery</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-serif font-black text-gray-900 mb-6 tracking-tighter">
              {searchQuery ? `Search: ${searchQuery}` : activeFilters.category ? categories.find(c => c._id === activeFilters.category)?.name || 'Collection' : 'The Full Collection'}
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
              Timeless pieces designed with architectural precision and handcrafted for the modern home.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="lg:hidden flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
             >
               <SlidersHorizontal className="w-4 h-4" /> Refine
             </button>
             <div className="hidden md:block">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Discovering {products.length} Items</span>
             </div>
          </div>
        </div>

        {/* Sub-Collection Links (Only when a parent category is selected) */}
        {activeFilters.category && categories.find(c => c._id === activeFilters.category)?.children?.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
              <button 
                onClick={() => updateFilter('category', activeFilters.category)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeFilters.category === categories.find(c => c._id === activeFilters.category)?._id ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
              >
                All {categories.find(c => c._id === activeFilters.category)?.name}
              </button>
              {categories.find(c => c._id === activeFilters.category).children.map(child => (
                <button 
                  key={child._id}
                  onClick={() => updateFilter('category', child._id)}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeFilters.category === child._id ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-40 space-y-8 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" /> Filter Curation
                </h2>
                {(activeFilters.category || activeFilters.material || activeFilters.color || activeFilters.variant) && (
                  <button 
                    onClick={clearFilters}
                    className="text-[9px] font-black uppercase tracking-widest text-[#D7282F] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Collections Drill-Down */}
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Collections</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => updateFilter('category', '')}
                    className={`flex items-center justify-between w-full text-left text-xs font-bold uppercase tracking-widest py-1 transition-all ${!activeFilters.category ? 'text-[#D7282F]' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <span>All Collections</span>
                    <ChevronRight className="w-3 h-3 opacity-30" />
                  </button>
                  {categories.map((cat) => {
                    const isSelected = activeFilters.category === cat._id;
                    return (
                      <div key={cat._id} className="space-y-1.5">
                        <button 
                          onClick={() => updateFilter('category', cat._id)}
                          className={`flex items-center justify-between w-full text-left text-xs font-bold uppercase tracking-widest py-1 transition-all ${isSelected ? 'text-[#D7282F]' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          <span>{cat.name}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-[#D7282F]' : 'opacity-30'}`} />
                        </button>
                        
                        {isSelected && cat.children?.length > 0 && (
                          <div className="pl-3 space-y-1.5 border-l border-gray-200 py-1 ml-1 animate-fade-in">
                            {cat.children.map((child) => {
                              const isChildSelected = activeFilters.category === child._id;
                              return (
                                <button 
                                  key={child._id}
                                  onClick={() => updateFilter('category', child._id)}
                                  className={`block w-full text-left text-[11px] font-bold transition-all ${isChildSelected ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-700'}`}
                                >
                                  • {child.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Availability</h3>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 border-gray-300 rounded-lg accent-[#D7282F]" defaultChecked />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-widest">In Stock Only</span>
                  </div>
                  <span className="text-xs font-black text-gray-400">{products.length}</span>
                </label>
              </div>

              {/* Size Variants */}
              {filterOptions.variants?.length > 0 && (
                <div className="border-b border-gray-100 pb-6 animate-fade-in">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    {activeFilters.category ? `${categories.find(c => c._id === activeFilters.category)?.name || 'Product'} Size` : 'Sizing Dimension'}
                  </h3>
                  <div className="space-y-3">
                    {filterOptions.variants.map((variant) => (
                      <label key={variant} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 border-gray-300 rounded-lg accent-[#D7282F]" 
                          checked={activeFilters.variant === variant}
                          onChange={() => updateFilter('variant', activeFilters.variant === variant ? '' : variant)}
                        />
                        <span className={`text-xs font-bold transition-colors uppercase tracking-widest ${activeFilters.variant === variant ? 'text-[#D7282F]' : 'text-gray-600 group-hover:text-gray-900'}`}>{variant}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {filterOptions.materials?.length > 0 && (
                <div className="border-b border-gray-100 pb-6 animate-fade-in">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Material Curation</h3>
                  <div className="space-y-3">
                    {filterOptions.materials.map((mat) => (
                      <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 border-gray-300 rounded-lg accent-[#D7282F]" 
                          checked={activeFilters.material === mat}
                          onChange={() => updateFilter('material', activeFilters.material === mat ? '' : mat)}
                        />
                        <span className={`text-xs font-bold transition-colors uppercase tracking-widest ${activeFilters.material === mat ? 'text-[#D7282F]' : 'text-gray-600 group-hover:text-gray-900'}`}>{mat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Colours */}
              {filterOptions.colors?.length > 0 && (
                <div className="pb-2 animate-fade-in">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Fabric Color Palette</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {filterOptions.colors.map((col) => {
                      const isSelected = activeFilters.color === col;
                      return (
                        <button 
                          key={col} 
                          className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all text-left group ${isSelected ? 'bg-white border-[#D7282F] shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                          onClick={() => updateFilter('color', activeFilters.color === col ? '' : col)}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300/50 flex-shrink-0 shadow-inner" 
                            style={{ backgroundColor: col.toLowerCase() }} 
                          />
                          <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isSelected ? 'text-[#D7282F]' : 'text-gray-500 group-hover:text-gray-900'}`}>
                            {col}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-10 md:gap-y-16">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="space-y-4 animate-pulse">
                    <div className="aspect-[4/5] bg-slate-100 rounded-sm" />
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-4 bg-slate-100 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-10 md:gap-y-16 animate-fade-in">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 py-32 rounded-sm text-center border border-gray-100">
                <RefreshCcw className="w-12 h-12 text-gray-300 mx-auto mb-8" />
                <h3 className="text-3xl font-serif text-gray-900 mb-4 tracking-tight">No Items Found</h3>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">We couldn't find any pieces matching your current refinement.</p>
                <button 
                  onClick={clearFilters}
                  className="px-12 py-4 bg-[#51823F] text-white font-bold rounded-sm uppercase tracking-widest text-[10px] hover:bg-[#457036] transition-all shadow-xl active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[1000] lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white p-8 flex flex-col shadow-2xl animate-fade-in-right">
             <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
               <h3 className="text-lg font-black uppercase tracking-widest text-gray-900">Refine</h3>
               <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full"><X className="w-5 h-5" /></button>
             </div>

             <div className="flex-1 overflow-y-auto space-y-10 pr-2">
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Collections</p>
                  <div className="flex flex-col gap-4">
                    {categories.map(cat => (
                      <button key={cat._id} onClick={() => { updateFilter('category', cat._id); setIsSidebarOpen(false); }} className={`text-left font-bold ${activeFilters.category === cat._id ? 'text-blue-600' : 'text-gray-500'}`}>{cat.name}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Materials</p>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.materials.map(mat => (
                      <button key={mat} onClick={() => { updateFilter('material', mat); setIsSidebarOpen(false); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${activeFilters.material === mat ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-100 text-gray-500'}`}>{mat}</button>
                    ))}
                  </div>
                </div>
             </div>

             <div className="mt-auto pt-8 flex gap-4">
                <button onClick={clearFilters} className="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest">Reset</button>
                <button onClick={() => setIsSidebarOpen(false)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Apply</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

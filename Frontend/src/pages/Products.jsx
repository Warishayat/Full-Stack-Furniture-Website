import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('query');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryId || 'all');

  useEffect(() => {
    if (categoryId) {
      setActiveCategory(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/category/getallCategories');
        setCategories(data.categories || data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let fetchedProducts = [];
        
        if (searchQuery) {
          const { data } = await API.get(`/product/search?query=${encodeURIComponent(searchQuery)}`);
          fetchedProducts = data.products || [];
        } else {
          const { data } = await API.get('/product/getAllProducts');
          fetchedProducts = data.products || data || [];
        }

        // Filter by category (still client-side if needed, but backend search might not handle it)
        if (activeCategory !== 'all') {
          fetchedProducts = fetchedProducts.filter(p => 
            p.category === activeCategory || 
            p.category?._id === activeCategory ||
            p.category?.name?.toLowerCase() === activeCategory.toLowerCase()
          );
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-primary-50/50 min-h-screen pt-24 lg:pt-32 pb-24 lg:pb-32">
      <div className="container mx-auto px-4 lg:px-12">
        
        {/* Header */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block animate-fade-in">Discover Your Style</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-950 mb-6 leading-tight animate-fade-in-up">
            {searchQuery ? `Searching: "${searchQuery}"` : 'The Signature Collection'}
          </h1>
          <div className="w-24 h-[1px] bg-accent/40 mx-auto rounded-full animate-fade-in"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-primary-900/5 border border-primary-50 sticky top-32">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-black text-primary-950 mb-10 flex items-center">
                <span className="w-8 h-[1px] bg-rose-500 mr-4"></span>
                Filter by Collection
              </h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchParams({});
                    }}
                    className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-500 ${activeCategory === 'all' ? 'bg-primary-950 text-white shadow-2xl shadow-primary-900/20 translate-x-2' : 'text-primary-600 hover:bg-primary-50'}`}
                  >
                    All Masterpieces
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat._id}>
                    <button 
                      onClick={() => {
                        setActiveCategory(cat._id);
                        setSearchParams({ category: cat._id });
                      }}
                      className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-500 ${activeCategory === cat._id ? 'bg-primary-950 text-white shadow-2xl shadow-primary-900/20 translate-x-2' : 'text-primary-600 hover:bg-primary-50'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-10 border-t border-primary-100">
                 <p className="text-[11px] text-primary-600 font-black uppercase tracking-widest leading-relaxed">
                   Each piece is handcrafted <br/> and authenticated for <br/> <span className="text-primary-950">COMFORT Furniture.</span>
                 </p>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-[2rem] h-[30rem] shadow-sm border border-primary-50"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 animate-fade-in-up">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[3rem] shadow-xl shadow-primary-900/5 border border-primary-50 text-center animate-fade-in max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-200">
                   <ShoppingCart className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-primary-950 mb-4">No matching pieces</h3>
                <p className="text-primary-500 leading-relaxed mb-10">
                  We couldn't find any masterpieces matching your current criteria. Perhaps a different collection would suit your space?
                </p>
                <button 
                  onClick={() => setActiveCategory('all')}
                  className="px-12 py-5 bg-primary-950 text-white font-bold rounded-full hover:bg-accent transition-all shadow-xl shadow-primary-900/20 uppercase tracking-widest text-xs"
                >
                  Explore All Pieces
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  ExternalLink,
  ShoppingBag,
  Star as StarIcon,
  Tag,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../dataService';

const ProductsList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
     setLoading(true);
     const [productsData, categoriesData] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories()
     ]);
     setProducts(productsData);
     setCategories(categoriesData);
     setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
     if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
        const { error } = await dataService.deleteProduct(id);
        if (error) {
           alert('Error deleting product: ' + error.message);
        } else {
           fetchData();
        }
     }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-emerald-500 bg-emerald-50';
      case 'Out of Stock': return 'text-red-500 bg-red-50';
      case 'Low Stock': return 'text-amber-500 bg-amber-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock': return <CheckCircle2 size={12} />;
      case 'Out of Stock': return <XCircle size={12} />;
      case 'Low Stock': return <AlertCircle size={12} />;
      default: return null;
    }
  };

  const filteredProducts = products.filter(p => {
     const name = p.name || '';
     const sku = p.sku || '';
     const category = p.category || '';
     const term = searchTerm.toLowerCase();
     
     const matchesSearch = name.toLowerCase().includes(term) || sku.toLowerCase().includes(term);
     const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
     
     return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">All Products</h1>
              <p className="text-slate-500 text-sm font-medium">Manage your store's inventory and product details.</p>
           </div>
           
           <button 
             onClick={() => navigate('/admin/products/add')}
             className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
           >
              <Plus size={16} /> 
              Add New Product
           </button>
        </header>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search products by name or SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 ring-primary/10 transition-all font-medium" 
              />
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 text-slate-400 px-4 py-3 rounded-xl">
                 <Filter size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Filter by:</span>
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 md:flex-none bg-slate-50 border-none text-slate-900 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest focus:ring-2 ring-primary/10 cursor-pointer"
              >
                 <option value="All">All Categories</option>
                 {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                 ))}
              </select>
           </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-slate-100">
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-200">
                         <Loader2 size={32} className="mx-auto animate-spin mb-3 text-primary" />
                         <p className="text-[10px] font-black uppercase tracking-widest leading-none">Catalog Syncing...</p>
                      </td>
                    </tr>
                 ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-300">
                         <div className="flex flex-col items-center gap-2">
                           <Package size={40} className="text-slate-100 mb-2" />
                           <p className="text-[10px] font-black uppercase tracking-widest">No products found in this selection.</p>
                         </div>
                      </td>
                    </tr>
                 ) : filteredProducts.map((product, i) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{product.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SKU: {product.sku || 'N/A'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-lg">{product.category}</span>
                       </td>
                       <td className="px-6 py-4">
                          <span className="text-sm font-black text-slate-900">{product.price}</span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                             <span className="text-sm font-bold text-slate-700">{product.stock} Units</span>
                             <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${product.stock > 20 ? 'bg-emerald-500' : product.stock > 10 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                  style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                                ></div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(product.status)}`}>
                             {getStatusIcon(product.status)}
                             {product.status}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => setPreviewProduct(product)}
                               className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" 
                               title="Preview Product"
                             >
                                <Eye size={18} />
                             </button>
                             <button 
                               onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                               className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" 
                               title="Quick Edit"
                             >
                                <Edit2 size={18} />
                             </button>
                             <button 
                               onClick={() => handleDelete(product.id, product.name)}
                               className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                               title="Delete Product"
                             >
                                <Trash2 size={18} />
                             </button>
                          </div>
                       </td>
                    </motion.tr>
                 ))}
              </tbody>
           </table>

           {/* Stats Footer */}
           <div className="p-6 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Database Record Count: <span className="text-slate-900">{filteredProducts.length} Items</span></p>
              <div className="flex gap-2">
                 <button className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-50 rounded-lg disabled:opacity-50 uppercase tracking-widest">Prev</button>
                 <button className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg shadow-lg shadow-primary/20 uppercase tracking-widest">Next</button>
              </div>
           </div>
        </div>

        {/* Product Preview Modal */}
        <AnimatePresence>
           {previewProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setPreviewProduct(null)}
                   className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                 ></motion.div>
                 
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
                   className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                 >
                    <button 
                      onClick={() => setPreviewProduct(null)}
                      className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:bg-primary hover:text-white transition-all"
                    >
                       <X size={20} />
                    </button>

                    {/* Left: Product Image */}
                    <div className="md:w-1/2 bg-slate-50 relative group overflow-hidden">
                       <img src={previewProduct.img} alt={previewProduct.name} className="w-full h-full object-cover" />
                       <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">New Arrival</span>
                          {previewProduct.is_recommended && <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">Featured</span>}
                       </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                       <div className="flex items-center gap-2 mb-4">
                          <Tag size={12} className="text-primary" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{previewProduct.category}</span>
                       </div>
                       
                       <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading mb-4 leading-none">
                          {previewProduct.name}
                       </h2>

                       <div className="flex items-center gap-3 mb-8">
                          <span className="text-2xl font-black text-slate-900">{previewProduct.price}</span>
                          {previewProduct.oldPrice && <span className="text-sm font-bold text-slate-300 line-through italic">{previewProduct.oldPrice}</span>}
                       </div>

                       <div className="space-y-6 mb-10">
                          <p className="text-slate-500 text-sm leading-relaxed font-medium">
                             {previewProduct.description || "This premium handcrafted item brings together traditional aesthetics with modern comfort. Perfectly curated for your lifestyle, each piece tell a story of quality and dedication."}
                          </p>

                          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Status</p>
                                <div className="flex items-center gap-2">
                                   <div className={`w-2 h-2 rounded-full ${previewProduct.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                   <span className="text-xs font-black text-slate-900">{previewProduct.stock} Units Available</span>
                                </div>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SKU Number</p>
                                <span className="text-xs font-bold text-slate-600">{previewProduct.sku || 'N/A-1002'}</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex gap-4">
                          <button 
                            onClick={() => {
                               navigate(`/admin/products/edit/${previewProduct.id}`);
                               setPreviewProduct(null);
                            }}
                            className="flex-1 bg-slate-900 text-white rounded-2xl py-4 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                          >
                             <Edit2 size={14} /> Edit Catalog
                          </button>
                          <button 
                            onClick={() => window.open('/', '_blank')}
                            className="w-14 h-14 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-lg rounded-2xl flex items-center justify-center transition-all"
                          >
                             <ExternalLink size={20} />
                          </button>
                       </div>
                       
                       <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Marketplace ID: {previewProduct.id}</p>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>
    </div>
  );
};

export default ProductsList;

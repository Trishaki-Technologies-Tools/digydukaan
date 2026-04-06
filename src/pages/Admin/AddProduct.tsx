import { 
  ArrowLeft, 
  Upload, 
  Save, 
  DollarSign, 
  Package, 
  Tags, 
  FileText,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { dataService } from '../../dataService';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    old_price: '',
    stock: '',
    sku: '',
    category_id: '',
    status: 'In Stock',
    img: '',
    is_recommended: false,
    badge: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
       const cats = await dataService.getCategories();
       setCategories(cats);
       
       if (id) {
          setLoading(true);
          const product = await dataService.getProductById(id);
          if (product) {
             setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price ? product.price.toString() : '',
                old_price: product.old_price ? product.old_price.toString() : '',
                stock: product.stock ? product.stock.toString() : '0',
                sku: product.sku || '',
                category_id: product.category_id || '',
                status: product.status || 'In Stock',
                img: product.img || '',
                is_recommended: !!product.is_recommended,
                badge: product.badge || ''
             });
          }
          setLoading(false);
       }
    };
    fetchInitialData();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const { data, error } = await dataService.uploadImage(file);
      setUploading(false);

      if (error) {
         alert('Upload Error: ' + (typeof error === 'string' ? error : error.message));
      } else if (data) {
         setFormData({ ...formData, img: data });
      }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
       alert('Please fill in Name, Price and Category.');
       return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      old_price: formData.old_price ? parseFloat(formData.old_price) : null,
      stock: parseInt(formData.stock) || 0
    };

    const { error } = await dataService.addProduct(payload);

    if (error) {
        const errorMsg = typeof error === 'string' ? error : (error as any).message || 'Unknown error';
        alert('Error saving product: ' + errorMsg);
    } else {
       alert(id ? 'Product updated successfully!' : 'Product saved successfully!');
       navigate('/admin/products');
    }
  };

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
           <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Product Data...</p>
           </div>
        </div>
     );
  }

  return (
    <div className="p-8 md:p-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-500 hover:text-primary hover:shadow-lg transition-all active:scale-95"
              >
                 <ArrowLeft size={20} />
              </button>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Store</span>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Products</span>
                 </div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-1">
                    {id ? 'Edit Product' : 'Add New Product'}
                 </h1>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin/products')}
                className="px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
              >
                 Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 translate-y-[-2px] hover:translate-y-[-4px]"
              >
                 <Save size={16} /> 
                 {id ? 'Update Product' : 'Save Product'}
              </button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Column */}
           <div className="lg:col-span-2 space-y-8">
              {/* Product Info */}
              <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
                    <h2 className="flex items-center gap-3 font-black text-slate-900 uppercase tracking-tight text-lg leading-none">
                       <FileText size={20} className="text-primary" /> Basic Details
                    </h2>
                    <HelpCircle size={14} className="text-slate-200" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">Product Title</label>
                         <input 
                           type="text" 
                           placeholder="e.g. Premium Silk Collection Saree"
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 ring-primary/10 transition-all"
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">Select Category</label>
                         <div className="relative">
                            <select 
                              value={formData.category_id}
                              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                              className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/10 transition-all appearance-none cursor-pointer text-slate-900"
                            >
                               <option value="" disabled>Choose a category...</option>
                               {categories.map(cat => (
                                 <option key={cat.id} value={cat.id}>{cat.name}</option>
                               ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                               <Tags size={14} />
                            </div>
                         </div>
                      </div>
                   </div>

                 <div className="space-y-2">
                    <label className="text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">Product Description</label>
                    <textarea 
                      placeholder="Describe the product features, materials, and benefits..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 ring-primary/10 transition-all resize-none"
                    ></textarea>
                 </div>
              </section>

              {/* Pricing & Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 flex flex-col">
                    <h2 className="flex items-center gap-3 font-black text-slate-900 uppercase tracking-tight text-lg leading-none mb-4 border-b border-slate-50 pb-4">
                       <DollarSign size={20} className="text-primary" /> Pricing
                    </h2>
                    <div className="space-y-2">
                       <label className="text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">Selling Price</label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                          <input 
                            type="number" 
                            placeholder="0.00" 
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-6 text-sm font-black focus:ring-2 ring-primary/10 transition-all" 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">Compare-at Price</label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                          <input 
                            type="number" 
                            placeholder="0.00" 
                            value={formData.old_price}
                            onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-6 text-sm font-medium text-slate-400 focus:ring-2 ring-primary/10 transition-all" 
                          />
                       </div>
                    </div>
                 </section>

                 <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 flex flex-col">
                    <h2 className="flex items-center gap-3 font-black text-slate-900 uppercase tracking-tight text-lg leading-none mb-4 border-b border-slate-50 pb-4">
                       <Package size={20} className="text-primary" /> Inventory
                    </h2>
                    <div className="space-y-2">
                       <label className="text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">Stock Quantity</label>
                       <input 
                         type="number" 
                         placeholder="e.g. 100" 
                         value={formData.stock}
                         onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                         className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/10 transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">SKU Number</label>
                       <input 
                         type="text" 
                         placeholder="e.g. DK-1001-BL" 
                         value={formData.sku}
                         onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                         className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium text-slate-600 focus:ring-2 ring-primary/10 transition-all uppercase" 
                       />
                    </div>
                 </section>
              </div>

              {/* Advanced Images */}
              <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                 <h2 className="flex items-center justify-between font-black text-slate-900 uppercase tracking-tight text-lg leading-none mb-4 border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-3">
                       <Upload size={20} className="text-primary" /> Product Media
                    </div>
                    {uploading && <Loader2 className="animate-spin text-primary" size={16} />}
                 </h2>
                 <div className="border-2 border-dashed border-slate-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-50/50 hover:border-primary/20 transition-all relative">
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:scale-110 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                       {uploading ? <Loader2 size={32} className="animate-spin text-primary" /> : <Upload size={32} />}
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">{formData.img ? 'Image Uploaded!' : 'Click to upload image'}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">PNG, JPG or WebP up to 5MB</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-8 px-6 py-3 bg-white border border-slate-100 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 hover:text-primary hover:shadow-lg transition-all"
                    >
                       Browse Files
                    </button>
                    <div className="mt-4 w-full">
                       <input 
                         type="text" 
                         placeholder="Or paste an image URL directly..." 
                         value={formData.img}
                         onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                         className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-medium focus:ring-2 ring-primary/10 transition-all text-center"
                       />
                    </div>
                 </div>
              </section>
           </div>

           {/* Sidebar Column */}
           <div className="space-y-8">
              {/* Status Section */}
              <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                 <h3 className="text-slate-900 font-black uppercase text-sm tracking-tight border-b border-slate-50 pb-4">Visibility & Badging</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <span className="text-xs font-bold text-secondary">Active Status</span>
                          <p className="text-[9px] text-slate-400 font-medium font-heading">Make product live</p>
                       </div>
                       <select 
                         value={formData.status}
                         onChange={(e) => setFormData({...formData, status: e.target.value})}
                         className="bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest rounded-lg px-3 py-2 outline-none focus:ring-2 ring-primary/5"
                       >
                          <option value="Active">Active</option>
                          <option value="In Stock">In Stock</option>
                          <option value="Draft">Draft</option>
                       </select>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <span className="text-xs font-bold text-amber-500">Highly Recommended</span>
                             <p className="text-[9px] text-slate-400 font-medium font-heading">Star featured layout</p>
                          </div>
                          <div 
                            onClick={() => setFormData({ 
                               ...formData, 
                               badge: formData.badge === 'Highly Recommended' ? '' : 'Highly Recommended' 
                            })}
                            className={`w-10 h-5 rounded-full cursor-pointer p-1 relative shadow-inner transition-colors ${formData.badge === 'Highly Recommended' ? 'bg-amber-400' : 'bg-slate-200'}`}
                          >
                             <div className={`w-3 h-3 bg-white rounded-full shadow-md transition-all ${formData.badge === 'Highly Recommended' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                       </div>

                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <span className="text-xs font-bold text-primary">Best Seller</span>
                             <p className="text-[9px] text-slate-400 font-medium font-heading">Popularity section</p>
                          </div>
                          <div 
                            onClick={() => setFormData({ 
                               ...formData, 
                               badge: formData.badge === 'Best Seller' ? '' : 'Best Seller' 
                            })}
                            className={`w-10 h-5 rounded-full cursor-pointer p-1 relative shadow-inner transition-colors ${formData.badge === 'Best Seller' ? 'bg-primary' : 'bg-slate-200'}`}
                          >
                             <div className={`w-3 h-3 bg-white rounded-full shadow-md transition-all ${formData.badge === 'Best Seller' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Advanced Labels */}
              <section className="bg-black p-8 rounded-[2rem] text-white shadow-2xl space-y-6 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
                 <h3 className="flex items-center gap-2 border-b border-white/5 pb-4 font-black uppercase text-xs tracking-[0.2em] text-white/40 relative z-10">
                    <Tags size={14} /> Custom Labels
                 </h3>
                 <div className="space-y-6 relative z-10">
                      <div className="space-y-2">
                         <label className="text-white/40 text-[10px] font-black uppercase tracking-widest">Active Badge (UI)</label>
                         <input 
                           type="text"
                           placeholder="e.g. New Arrival, Sale"
                           value={formData.badge}
                           onChange={(e) => setFormData({...formData, badge: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold focus:ring-2 ring-primary/20 outline-none text-white"
                         />
                      </div>
                 </div>
              </section>

              {/* Preview Link */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">View Preview</p>
                 <div className="aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center border border-slate-100 overflow-hidden relative group">
                    {formData.img ? (
                      <img src={formData.img} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                         <FileText size={40} className="text-slate-200" />
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Media</span>
                      </div>
                    )}
                 </div>
                 <button className="w-full flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest border border-primary/10 py-4 rounded-xl hover:bg-primary/5 transition-all">
                    Show Live Preview <ExternalLink size={12} />
                 </button>
              </div>
           </div>
        </div>
    </div>
  );
};

export default AddProduct;

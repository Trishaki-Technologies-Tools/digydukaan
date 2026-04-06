import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Save, 
  AlertTriangle,
  Boxes,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { dataService } from '../../dataService';

const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  const fetchStock = async () => {
     setLoading(true);
     const data = await dataService.getProducts();
     setProducts(data);
     // Initialize adjustments with 0 for each product
     const initialAdjustments: Record<string, number> = {};
     data.forEach((p: any) => { initialAdjustments[p.id] = 0; });
     setAdjustments(initialAdjustments);
     setLoading(false);
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleAdjustValue = (id: string, delta: number) => {
     setAdjustments(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + delta
     }));
  };

  const handleInputChange = (id: string, value: string) => {
     const num = parseInt(value) || 0;
     setAdjustments(prev => ({
        ...prev,
        [id]: num
     }));
  };

  const handleBulkUpdate = async () => {
     const productsToUpdate = products.filter(p => adjustments[p.id] !== 0);
     if (productsToUpdate.length === 0) {
        alert("No changes to update.");
        return;
     }

     setSaving(true);
     try {
        for (const p of productsToUpdate) {
           const newStock = Math.max(0, p.stock + adjustments[p.id]);
           await dataService.updateProduct(p.id, { stock: newStock });
        }
        alert("Inventory updated successfully!");
        await fetchStock();
     } catch (err) {
        alert("Error updating inventory.");
     } finally {
        setSaving(false);
     }
  };

  const resetAdjustments = () => {
     const reset: Record<string, number> = {};
     products.forEach(p => { reset[p.id] = 0; });
     setAdjustments(reset);
  };

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const sku = p.sku || '';
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || sku.toLowerCase().includes(term);
  });

  const lowStockCount = products.filter(p => p.stock < 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((acc, p) => acc + ((p.rawPrice || 0) * (p.stock || 0)), 0);

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">Inventory Tracking</h1>
              <p className="text-slate-500 text-sm font-medium">Monitor stock levels and manage replenishment alerts in real-time.</p>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={resetAdjustments}
                className="flex items-center justify-center gap-2 bg-white text-slate-600 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-95"
              >
                 <RotateCcw size={16} /> 
                 Reset Edits
              </button>
              <button 
                onClick={handleBulkUpdate}
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
              >
                 {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                 {saving ? 'Updating...' : 'Bulk Update'}
              </button>
           </div>
        </header>

        {/* Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4 text-emerald-500">
                 <Boxes size={24} />
                 <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Optimal</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Stock Value</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">₹{totalValue.toLocaleString()}</h3>
           </div>
           
           <div className="bg-amber-500 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <AlertTriangle size={24} />
                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-md text-white">Action Needed</span>
              </div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Low Stock SKUs</p>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase font-heading relative z-10">{lowStockCount} Items</h3>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10 text-primary">
                 <TrendingDown size={24} />
                 <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">Critical</span>
              </div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Out of Stock Items</p>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase font-heading relative z-10">{outOfStockCount} Items</h3>
           </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-12">
           <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search by SKU or Name..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 ring-primary/10 transition-all font-medium" 
                 />
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary"></div> {Object.values(adjustments).filter(v => v !== 0).length} Unsaved Changes
                 </div>
              </div>
           </div>

           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-slate-50">
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Information</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjustment</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Quick Adjust</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                   <tr>
                     <td colSpan={4} className="px-6 py-20 text-center">
                        <Loader2 size={32} className="mx-auto text-primary animate-spin mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Warehouse Data...</p>
                     </td>
                   </tr>
                 ) : filteredProducts.map((item, i) => {
                    const adjValue = adjustments[item.id] || 0;
                    const finalValue = Math.max(0, item.stock + adjValue);
                    
                    return (
                       <motion.tr 
                         key={item.id}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                       >
                          <td className="px-6 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                                   <img src={item.img || "https://api.dicebear.com/7.x/shapes/svg?seed=" + item.id} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-900 leading-tight mb-0.5">{item.name}</p>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.sku || "N/A"}</span>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                   <span className={`text-base font-black ${adjValue !== 0 ? 'text-primary' : 'text-slate-900'}`}>{finalValue}</span>
                                   {adjValue !== 0 && <span className="text-[10px] font-bold text-slate-400 line-through">({item.stock})</span>}
                                </div>
                                <div className={`w-16 h-1 rounded-full ${finalValue > 10 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                   <div className={`h-full rounded-full ${finalValue > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(finalValue * 3, 100)}%` }}></div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               adjValue > 0 ? 'text-emerald-500 bg-emerald-50' : 
                               adjValue < 0 ? 'text-red-500 bg-red-50' : 
                               'text-slate-400 bg-slate-100/50'
                             }`}>
                                {adjValue > 0 && '+'}
                                {adjValue === 0 ? 'No Change' : `${adjValue} Units`}
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex items-center justify-end gap-3">
                                <div className="flex items-center border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:ring-4 ring-primary/5 transition-all">
                                   <button 
                                     onClick={() => handleAdjustValue(item.id, -1)}
                                     className="px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border-r border-slate-100"
                                   >
                                      <ArrowDown size={14} />
                                   </button>
                                   <input 
                                     type="text"
                                     value={adjValue > 0 ? `+${adjValue}` : adjValue}
                                     onChange={(e) => handleInputChange(item.id, e.target.value.replace('+', ''))}
                                     className="w-16 h-full text-center text-xs font-black text-slate-900 border-none bg-transparent focus:ring-0"
                                   />
                                   <button 
                                     onClick={() => handleAdjustValue(item.id, 1)}
                                     className="px-4 py-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all border-l border-slate-100"
                                   >
                                      <ArrowUp size={14} />
                                   </button>
                                </div>
                                {adjValue !== 0 && (
                                   <button 
                                     onClick={() => handleAdjustValue(item.id, -adjValue)}
                                     className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                                   >
                                      <RotateCcw size={16} />
                                   </button>
                                )}
                             </div>
                          </td>
                       </motion.tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
    </div>
  );
};

export default Inventory;

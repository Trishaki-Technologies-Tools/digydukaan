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
     const initialAdj: Record<string, number> = {};
     data.forEach((p: any) => initialAdj[p.id] = 0);
     setAdjustments(initialAdj);
     setLoading(false);
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleAdjust = (id: string, amount: number) => {
    setAdjustments(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + amount
    }));
  };

  const handleSetAdjust = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    setAdjustments(prev => ({
      ...prev,
      [id]: num
    }));
  };

  const handleSaveAll = async () => {
    const modified = Object.entries(adjustments).filter(([_, val]) => val !== 0);
    if (modified.length === 0) return;

    setSaving(true);
    try {
       for (const [id, adj] of modified) {
          const product = products.find(p => p.id === id);
          if (product) {
             const newStock = Math.max(0, (product.stock || 0) + adj);
             await dataService.updateProductStock(id, newStock);
          }
       }
       alert("Inventory synced successfully!");
       fetchStock();
    } catch (err) {
       console.error(err);
       alert("Error syncing inventory");
    } finally {
       setSaving(false);
    }
  };

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const stats = {
    total: products.length,
    low: products.filter((p: any) => (p.stock || 0) < 10).length,
    out: products.filter((p: any) => (p.stock || 0) === 0).length,
    value: products.reduce((acc: number, p: any) => acc + ((p.stock || 0) * (p.price || 0)), 0)
  };

  return (
    <div className="p-8 md:p-12 pb-32">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">Inventory</h1>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Stock Intelligence</p>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={fetchStock}
               className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm"
             >
                <RotateCcw size={20} />
             </button>
             <button 
               onClick={handleSaveAll}
               disabled={saving || Object.values(adjustments).every(v => v === 0)}
               className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-primary transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
             >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
             </button>
          </div>
       </div>

       {/* STATS STRIP */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Items', val: stats.total, icon: Boxes, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Low Stock', val: stats.low, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Out of Stock', val: stats.out, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Asset Value', val: `₹${stats.value.toLocaleString()}`, icon: TrendingDown, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map((s, i) => (
             <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                   <s.icon size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">{s.val}</p>
             </div>
          ))}
       </div>

       <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
             type="text"
             placeholder="Audit search products..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-white border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
          />
       </div>

       {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Stock...</p>
          </div>
       ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full">
                <thead>
                   <tr className="bg-slate-50/50">
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</th>
                      <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjustment</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Final</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filtered.map((item: any) => (
                      <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shadow-inner">
                                  <img src={item.img} alt="" className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{item.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               (item.stock || 0) < 10 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                               {item.stock || 0} PCS
                            </span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-3">
                               <button 
                                 onClick={() => handleAdjust(item.id, -1)}
                                 className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                               >
                                  <ArrowDown size={14} />
                               </button>
                               <input 
                                 type="text" 
                                 value={adjustments[item.id] > 0 ? `+${adjustments[item.id]}` : adjustments[item.id]}
                                 onChange={(e) => handleSetAdjust(item.id, e.target.value)}
                                 className="w-16 bg-slate-50 border-0 rounded-lg py-2 text-center text-xs font-black focus:ring-2 ring-primary/20 outline-none"
                               />
                               <button 
                                 onClick={() => handleAdjust(item.id, 1)}
                                 className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                               >
                                  <ArrowUp size={14} />
                               </button>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <p className="text-sm font-black text-slate-900">
                               {Math.max(0, (item.stock || 0) + (adjustments[item.id] || 0))}
                            </p>
                         </td>
                      </motion.tr>
                   ))}
                </tbody>
             </table>
          </div>
       )}
    </div>
  );
};

export default Inventory;

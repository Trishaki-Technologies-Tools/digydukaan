/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  LayoutGrid, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PackageCheck,
  X
} from 'lucide-react';
import { dataService } from '../../dataService';

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [seeding, setSeeding] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', img: '', icon: 'ShoppingBag' });

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    const data = await dataService.getCollections();
    setCategories(data);
    setLoading(false);
  };

  const handleSeedCatalog = async () => {
    if (window.confirm("Seed 60 Premium Products? This will reset your current inventory!")) {
        setSeeding(true);
        await dataService.forceSeedProducts();
        setSeeding(false);
        alert("60 Premium Products Seeded Successfully!");
        fetchCats();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this category? Products linked to it might become uncategorized.")) {
        await dataService.deleteCategory(id);
        fetchCats();
    }
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCat(cat);
    setFormData({ id: cat.id, name: cat.name, img: cat.img, icon: cat.icon || 'ShoppingBag' });
    setIsModalOpen(true);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    await dataService.saveCategory(formData);
    setIsModalOpen(false);
    fetchCats();
  };

  const filteredCats = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 min-h-screen bg-slate-50/50">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">Categories</h1>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{categories.length} Collections Managed</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
           <button 
             onClick={handleSeedCatalog}
             disabled={seeding}
             className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
           >
              <PackageCheck size={16} /> 
              {seeding ? "Syncing..." : "Seed Layout & Catalog"}
           </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
             Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-[2rem] h-48 border border-slate-100 animate-pulse" />
             ))
          ) : filteredCats.map((cat, i) => (
            <motion.div 
              key={cat.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-slate-200/40 transition-all"
            >
               <div className="h-32 bg-slate-100 relative overflow-hidden">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button 
                       onClick={() => handleOpenEdit(cat)} 
                       className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                     >
                        <Edit2 size={16} />
                     </button>
                     <button 
                       onClick={() => handleDelete(cat.id)}
                       className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
               <div className="p-6">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{cat.name}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{cat.id}</p>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
           >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Edit Collection</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                    <input 
                      value={formData.img}
                      onChange={(e) => setFormData({...formData, img: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                 </div>
                 <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all">Save Changes</button>
              </form>
           </motion.div>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border border-dashed border-slate-200">
         <button 
           onClick={() => {
              setEditingCat(null);
              setFormData({ id: `custom-${Date.now()}`, name: '', img: '', icon: 'ShoppingBag' });
              setIsModalOpen(true);
           }}
           className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95"
         >
            Create New Category
         </button>
      </div>
    </div>
  );
};

export default Categories;

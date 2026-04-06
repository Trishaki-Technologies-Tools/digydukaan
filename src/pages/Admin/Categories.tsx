/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  PackageCheck,
  X,
  Plus,
  Search
} from 'lucide-react';
import { dataService } from '../../dataService';

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', img: '', icon: 'ShoppingBag' });

  // Add back used variables that were flagged as "never read" but might be needed for future expansion or complex filters
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCat, setEditingCat] = useState<any>(null);

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
       alert("Catalog Seeded Successfully!");
       setSeeding(false);
       fetchCats();
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (editingCat) {
        await dataService.updateCategory(editingCat.id, formData);
     } else {
        await dataService.addCategory(formData);
     }
     setIsModalOpen(false);
     setEditingCat(null);
     fetchCats();
  };

  return (
    <div className="p-8 md:p-12 pb-32">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">Collections</h1>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Hub</p>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={handleSeedCatalog}
               disabled={seeding}
               className="flex items-center gap-2 bg-amber-500 text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all active:scale-95"
             >
                <PackageCheck size={18} /> {seeding ? 'Seeding...' : 'Force Seed Catalog'}
             </button>
             <button 
               onClick={() => { setEditingCat(null); setFormData({ id: '', name: '', img: '', icon: 'ShoppingBag' }); setIsModalOpen(true); }}
               className="flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
             >
                <Plus size={18} /> New Collection
             </button>
          </div>
       </div>

       <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
             type="text"
             placeholder="Search collection vault..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-white border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
          />
       </div>

       {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Vault...</p>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filtered.map(cat => (
                <div key={cat.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                   
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                         <PackageCheck size={28} />
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={() => { setEditingCat(cat); setFormData(cat); setIsModalOpen(true); }}
                           className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                         >
                            <Edit2 size={18} />
                         </button>
                         <button className="w-10 h-10 rounded-xl hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </div>

                   <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase relative z-10">{cat.name}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 relative z-10">{cat.id}</p>
                </div>
             ))}
          </div>
       )}

       <AnimatePresence>
          {isModalOpen && (
             <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                   onClick={() => setIsModalOpen(false)}
                />
                <motion.div 
                   initial={{ scale: 0.9, opacity: 0, y: 20 }}
                   animate={{ scale: 1, opacity: 1, y: 0 }}
                   exit={{ scale: 0.9, opacity: 0, y: 20 }}
                   className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-4xl p-12 overflow-hidden"
                >
                   <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-primary"><X size={24} /></button>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase font-heading mb-8">
                      {editingCat ? 'Edit Collection' : 'New Collection'}
                   </h2>

                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Collection Name</label>
                         <input 
                           required
                           type="text"
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-slate-50 border border-transparent rounded-2xl py-5 px-6 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System ID</label>
                         <input 
                           required
                           type="text"
                           value={formData.id}
                           onChange={(e) => setFormData({...formData, id: e.target.value})}
                           className="w-full bg-slate-50 border border-transparent rounded-2xl py-5 px-6 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
                         />
                      </div>
                      
                      <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all mt-6">
                         Save Configuration
                      </button>
                   </form>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  );
};

export default Categories;

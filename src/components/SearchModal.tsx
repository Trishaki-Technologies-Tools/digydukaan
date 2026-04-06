import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingBag, ArrowRight, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../dataService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      // Warm up the search cache
      const data = await dataService.getProducts();
      setAllProducts(data);
    };
    if (isOpen) fetchAll();
  }, [isOpen]);

  const filtered = allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const handleResultClick = (id: string) => {
    onClose();
    navigate(`/product/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center pt-24 px-4 md:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-secondary/70 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            className="relative w-full max-w-[700px] bg-white rounded-[3rem] shadow-3xl overflow-hidden flex flex-col"
          >
             {/* Search Input Area */}
             <div className="p-8 border-b border-slate-50 flex items-center gap-6">
                <div className="flex-1 flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 group focus-within:ring-4 ring-primary/5 transition-all">
                   <Search size={24} className="text-secondary/20 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="text"
                     placeholder="Search for Flagships, Fashion or Jewelry..."
                     autoFocus
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     className="bg-transparent border-none outline-none text-lg font-bold text-secondary w-full placeholder:text-secondary/10"
                   />
                </div>
                <button 
                  onClick={onClose}
                  className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-secondary/40 hover:text-primary hover:shadow-lg transition-all active:scale-95"
                >
                   <X size={24} />
                </button>
             </div>

             {/* Results Pane */}
             <div className="p-8 pb-10 min-h-[300px] max-h-[60vh] overflow-y-auto custom-scrollbar">
                {query ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Results Found ({filtered.length})</h3>
                       {filtered.length > 0 && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary underline cursor-pointer">View All</span>
                       )}
                    </div>
                    {filtered.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => handleResultClick(p.id)}
                            className="flex gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100"
                          >
                             <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                             </div>
                             <div className="flex flex-col justify-center">
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">{p.category}</p>
                                <h4 className="text-sm font-bold text-secondary leading-none mb-2">{p.name}</h4>
                                <p className="text-xs font-black text-secondary/40">₹{p.price.toLocaleString()}</p>
                             </div>
                             <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={18} className="text-primary" />
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                         <ShoppingBag size={48} className="mb-4" />
                         <p className="text-sm font-bold uppercase tracking-widest leading-loose">The vault is silent... <br/> No matches found.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-10">
                     <div>
                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-6">
                           <TrendingUp size={14} className="text-primary" /> Global Trending Search
                        </h3>
                        <div className="flex flex-wrap gap-3">
                           {['Mobiles', 'Luxury Watch', 'Fashion Jacket', 'Diamond Ring', 'OLED TV'].map(tag => (
                             <button 
                               key={tag}
                               onClick={() => setQuery(tag)}
                               className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary/60 hover:bg-primary hover:text-white hover:border-primary transition-all"
                             >
                               {tag}
                             </button>
                           ))}
                        </div>
                     </div>
                     
                     <div className="bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-200">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                              <ShoppingBag size={20} />
                           </div>
                           <div>
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-secondary leading-none mb-1">New Collection Alert</h4>
                              <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest">55 items synchronized from the master catalog.</p>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </div>
             
             <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
             `}} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;

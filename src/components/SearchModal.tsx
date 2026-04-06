import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, ShoppingBag, Heart, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../dataService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!query) {
        setProducts([]);
        return;
      }
      const data = await dataService.getProducts();
      const filtered = data.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    };
    const timer = setTimeout(fetch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-start justify-center p-4 pt-20 md:pt-40">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-secondary/80 backdrop-blur-2xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-4xl border border-white/20"
      >
        <div className="p-10 md:p-14">
          <div className="relative mb-14">
             <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-secondary/20" size={32} />
             <input 
               autoFocus
               type="text" 
               placeholder="Discover your next premium masterpiece..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] py-10 pl-24 pr-12 text-3xl font-black text-secondary placeholder:text-slate-200 focus:bg-white focus:border-primary/20 focus:ring-[1.5rem] ring-primary/5 transition-all outline-none font-heading tracking-tighter"
             />
             <button 
                onClick={onClose}
                className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-primary transition-all active:scale-90"
             >
                <X size={24} />
             </button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto pr-6 custom-scrollbar">
             {query ? (
                <div className="space-y-12">
                   {products.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {products.map(product => (
                            <Link 
                               key={product.id} 
                               to={`/product/${product.id}`} 
                               onClick={onClose}
                               className="group flex gap-8 p-6 rounded-[2.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                            >
                               <div className="w-32 h-44 bg-slate-100 rounded-[1.8rem] overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                                  <img src={product.img} className="w-full h-full object-cover" />
                               </div>
                               <div className="flex flex-col justify-center gap-4">
                                  <div>
                                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{product.category}</p>
                                     <h4 className="text-xl font-black text-secondary tracking-tighter uppercase leading-none">{product.name}</h4>
                                  </div>
                                  <p className="text-2xl font-black text-secondary font-heading">₹{Number(product.price).toLocaleString()}</p>
                                  <div className="flex items-center gap-2 text-[9px] font-black text-secondary/30 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                     View Detail <ArrowRight size={14} />
                                  </div>
                                </div>
                            </Link>
                         ))}
                      </div>
                   ) : (
                      <div className="py-20 text-center space-y-6">
                         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto animate-pulse">
                            <Search size={48} />
                         </div>
                         <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">No results for "{query}"</h3>
                         <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest">Try adjusting your signal to find what you're looking for.</p>
                      </div>
                   )}
                </div>
             ) : (
                <div className="text-center py-20">
                   <div className="flex items-center justify-center gap-12 text-secondary/20">
                      <div className="flex flex-col items-center gap-4">
                         <ShoppingBag size={48} />
                         <span className="text-[9px] font-black uppercase tracking-[0.4em]">Shop Full</span>
                      </div>
                      <div className="h-12 w-px bg-slate-100" />
                      <div className="flex flex-col items-center gap-4">
                         <Heart size={48} />
                         <span className="text-[9px] font-black uppercase tracking-[0.4em]">Favorites</span>
                      </div>
                      <div className="h-12 w-px bg-slate-100" />
                      <div className="flex flex-col items-center gap-4">
                         <ChevronRight size={48} />
                         <span className="text-[9px] font-black uppercase tracking-[0.4em]">Explore Vault</span>
                      </div>
                   </div>
                </div>
             )}
          </div>
          <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F5F9; border-radius: 10px; }`}} />
        </div>
      </motion.div>
    </div>
  );
};

export default SearchModal;

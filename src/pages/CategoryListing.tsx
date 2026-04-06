import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, ChevronRight, Loader2, CheckCircle2, SlidersHorizontal, Square, CheckSquare } from 'lucide-react';
import { dataService } from '../dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import CategoryScroll from '../components/CategoryScroll';
import Footer from '../components/Footer';

const CategoryListing = () => {
    const { id: urlCategoryId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState(200000);
    const [sortBy, setSortBy] = useState('Newest');
    
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const cats = await dataService.getCategories();
            setCategories(cats);
            const data = await dataService.getProducts();
            const sanitized = (data || []).map((p: any) => ({
                ...p,
                price: Number(p.price) || 0
            })).filter((p: any) => p.name && p.img);
            setProducts(sanitized);
            if (urlCategoryId && urlCategoryId !== 'all' && urlCategoryId !== 'universal') {
               setSelectedCategories([urlCategoryId]);
            } else {
               setSelectedCategories([]);
            }
            setLoading(false);
            window.scrollTo(0, 0);
        };
        fetchData();
    }, [urlCategoryId]);

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev => 
           prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const finalProducts = useMemo(() => {
        let list = [...products];
        if (selectedCategories.length > 0) list = list.filter(p => selectedCategories.includes(p.category_id));
        list = list.filter(p => p.price <= priceRange);
        if (sortBy === 'PriceLow') list.sort((a, b) => a.price - b.price);
        if (sortBy === 'PriceHigh') list.sort((a, b) => b.price - a.price);
        if (sortBy === 'Newest') list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        if (sortBy === 'Popular') list = list.filter(p => !!p.badge);
        return list;
    }, [products, selectedCategories, priceRange, sortBy]);

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <TopBar />
            <Navbar />
            <CategoryScroll />

            <div className="container py-12 px-4 md:px-0">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    <aside className="hidden lg:block w-72 sticky top-40 h-[calc(100vh-180px)] self-start">
                         <div className="bg-white h-full p-8 rounded-[2.8rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-xs mb-8 shrink-0">
                                <span className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-primary border border-slate-100 shadow-sm">
                                   <SlidersHorizontal size={14} />
                                </span>
                                Master Filters
                            </div>
                            <div className="overflow-y-auto pr-2 space-y-10 custom-scrollbar flex-1 pb-4">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-secondary/40">
                                        <span>Max Budget</span>
                                        <span className="text-secondary font-black text-xl leading-none">₹{priceRange.toLocaleString()}</span>
                                    </div>
                                    <div className="relative pt-2">
                                        <input 
                                            type="range" min="500" max="200000" step="500" value={priceRange}
                                            onChange={(e) => setPriceRange(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-50 rounded-full appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-secondary/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Collections</h4>
                                    <div className="space-y-3">
                                        <div 
                                            onClick={() => setSelectedCategories([])}
                                            className={cn("flex items-center gap-3 group cursor-pointer transition-all", selectedCategories.length === 0 ? "text-primary" : "text-secondary/60 hover:text-secondary")}
                                        >
                                            {selectedCategories.length === 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Universal View</span>
                                        </div>
                                        {categories.map(cat => (
                                            <div 
                                                key={cat.id} onClick={() => toggleCategory(cat.id)}
                                                className={cn("flex items-center gap-3 group cursor-pointer transition-all", selectedCategories.includes(cat.id) ? "text-primary font-black" : "text-secondary/60 hover:text-secondary")}
                                            >
                                                {selectedCategories.includes(cat.id) ? <CheckSquare size={16} className="text-primary fill-primary/10" /> : <Square size={16} className="text-slate-200" />}
                                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{cat.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-secondary/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Sort By</h4>
                                    <div className="space-y-2">
                                        {[{ val: 'Newest', lab: 'What\'s New?' }, { val: 'PriceLow', lab: 'Price: Low to High' }, { val: 'PriceHigh', lab: 'Price: High to Low' }, { val: 'Popular', lab: 'Most Popular' }].map(s => (
                                            <div key={s.val} onClick={() => setSortBy(s.val)} className="flex items-center gap-3 cursor-pointer group py-1.5">
                                                <div className={cn("w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center", sortBy === s.val ? "border-primary bg-primary" : "border-slate-100 bg-white group-hover:border-primary")}>
                                                   {sortBy === s.val && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-all", sortBy === s.val ? "text-secondary" : "text-secondary/50 group-hover:text-secondary")}>{s.lab}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F5F9; border-radius: 10px; }`}} />
                         </div>
                    </aside>

                    <main className="flex-1 space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                   <Link to="/" className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-primary transition-colors">Home</Link>
                                   <ChevronRight size={10} className="text-slate-200" />
                                   <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Master Catalog</span>
                                </div>
                                <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase font-heading leading-none">
                                   {selectedCategories.length > 0 ? 'Mixed' : 'Everyone\'s'} <span className="text-primary italic">Vault</span>
                                </h2>
                                <div className="flex items-center gap-4 mt-2">
                                   <p className="text-[11px] font-bold text-secondary/40 uppercase tracking-[0.2em]">{finalProducts.length} Premium Results</p>
                                   {selectedCategories.length > 0 && <button onClick={() => setSelectedCategories([])} className="text-[9px] font-black uppercase tracking-widest text-primary border border-primary/10 px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors">Clear Filters</button>}
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                                <Loader2 className="animate-spin text-primary" size={40} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Filtering Vault...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                                <AnimatePresence mode="popLayout">
                                    {finalProducts.map((product, idx) => (
                                        <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, delay: idx * 0.02 }} className="group flex flex-col gap-5">
                                            <div className={cn("aspect-[3/4] bg-white rounded-[1.8rem] md:rounded-[2.8rem] border border-gray-100 overflow-hidden relative shadow-sm group-hover:shadow-3xl transition-all duration-700", product.badge === 'Highly Recommended' ? "bg-amber-50/20 border-amber-50" : "")}>
                                                <Link to={`/product/${product.id}`} className="block h-full w-full">
                                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                </Link>
                                                {product.badge && <div className={cn("absolute top-4 left-4 md:top-8 md:left-8 text-[7px] md:text-[9px] font-black uppercase tracking-widest px-3 md:px-5 py-1.5 md:py-2.5 rounded-full border shadow-2xl backdrop-blur-md z-10", product.badge === 'Highly Recommended' ? "bg-amber-400 text-amber-950 border-white/20" : "bg-slate-900/90 text-white border-white/10")}>{product.badge}</div>}
                                                <div className="absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-8 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 scale-95 group-hover:scale-100 z-10">
                                                    <button onClick={() => addToCart(product)} className="w-full bg-slate-900 text-white py-3 md:py-5 rounded-[1rem] md:rounded-[1.5rem] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all active:scale-95">Quick Add</button>
                                                </div>
                                            </div>
                                            <div className="space-y-3 px-3">
                                                <div className="flex justify-between items-start gap-4">
                                                   <h3 className="text-sm font-black text-secondary uppercase tracking-tight leading-tight group-hover:text-primary transition-colors truncate">{product.name}</h3>
                                                   <button 
                                                        onClick={() => toggleWishlist(product)}
                                                        className={cn("transition-all duration-300 transform active:scale-150 shrink-0", isInWishlist(product.id) ? "text-rose-500" : "text-slate-200 hover:text-rose-400")}
                                                    >
                                                      <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={2.5} />
                                                   </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                   <p className="text-xl font-black text-secondary font-heading leading-none">₹{Number(product.price).toLocaleString()}</p>
                                                   {product.old_price && <span className="text-[10px] font-bold text-slate-300 line-through">₹{Number(product.old_price).toLocaleString()}</span>}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {finalProducts.length === 0 && <div className="col-span-full py-32 flex flex-col items-center justify-center text-center"><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 animate-bounce"><ShoppingBag size={48} /></div><h3 className="text-2xl font-black text-secondary uppercase tracking-tight mb-2">Nothing found</h3></div>}
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default CategoryListing;

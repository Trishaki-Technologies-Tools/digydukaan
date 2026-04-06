import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, ChevronRight, Loader2, SlidersHorizontal, Square, CheckSquare } from 'lucide-react';
import { dataService } from '../dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import CategoryScroll from '../components/CategoryScroll';
import Footer from '../components/Footer';

const CategoryListing = () => {
    const { id: urlCategoryId } = useParams<{ id: string }>();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange] = useState<[number, number]>([0, 100000]);
    const [sortBy, setSortBy] = useState('Featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const [pData, cData] = await Promise.all([
                dataService.getProducts(),
                dataService.getCollections()
            ]);
            setProducts(pData);
            setCategories(cData);
            setLoading(false);
        };
        fetch();
    }, []);

    useEffect(() => {
       if (urlCategoryId && urlCategoryId !== 'all') {
          setSelectedCategories([urlCategoryId]);
       }
    }, [urlCategoryId]);

    const filteredAndSorted = useMemo(() => {
        let result = [...products];

        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category_id));
        }

        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'Newest') result.sort((a, b) => (b.id > a.id ? 1 : -1));

        return result;
    }, [products, selectedCategories, priceRange, sortBy]);

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    if (loading) {
       return (
          <div className="min-h-screen bg-white">
             <TopBar />
             <Navbar />
             <div className="container py-40 flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Synchronizing Collections...</p>
             </div>
          </div>
       );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <TopBar />
            <Navbar />
            <div className="pt-2">
               <CategoryScroll />
            </div>

            <div className="container py-12 px-4 md:px-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 px-2">
                    <div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-secondary/40 uppercase tracking-[0.3em] mb-4">
                            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            <ChevronRight size={10} />
                            <span className="text-secondary italic">Collections</span>
                        </div>
                        <h1 className="text-6xl font-black text-secondary tracking-tighter uppercase font-heading leading-none">
                            Shop <span className="text-primary italic">Gallery</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white border border-slate-100 px-8 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all shadow-sm active:scale-95"
                        >
                            <SlidersHorizontal size={14} /> Refine Signal
                        </button>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 md:flex-none bg-white border border-slate-100 px-8 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest focus:border-primary outline-none shadow-sm cursor-pointer"
                        >
                            <option>Featured</option>
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* FILTERS */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div 
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="lg:col-span-3 space-y-12 overflow-hidden"
                            >
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] border-l-4 border-primary pl-4">Collections</h3>
                                    <div className="space-y-3 pl-1">
                                        {categories.map(cat => (
                                            <button 
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                className="flex items-center gap-3 w-full group"
                                            >
                                                {selectedCategories.includes(cat.id) ? (
                                                    <CheckSquare size={18} className="text-primary" />
                                                ) : (
                                                    <Square size={18} className="text-slate-200 group-hover:text-primary transition-colors" />
                                                )}
                                                <span className={cn("text-[11px] font-bold uppercase tracking-wider transition-colors", selectedCategories.includes(cat.id) ? "text-secondary" : "text-slate-400 group-hover:text-secondary")}>
                                                    {cat.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* PRODUCT GRID - Optimized 2 Column on Mobile */}
                    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10", isFilterOpen ? "lg:col-span-9" : "lg:col-span-12 md:grid-cols-4")}>
                        {filteredAndSorted.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group flex flex-col gap-4"
                            >
                                <div className="aspect-[3/4] rounded-[2.2rem] border border-gray-100 overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-700 bg-white">
                                    <Link to={`/product/${product.id}`} className="block h-full w-full">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    </Link>

                                    {product.badge && (
                                        <div className="absolute top-4 left-4 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 text-white shadow-xl backdrop-blur-md z-10">
                                            {product.badge}
                                        </div>
                                    )}

                                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10 hidden md:block">
                                        <button 
                                            onClick={() => addToCart(product)}
                                            className="w-full bg-slate-900 text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all active:scale-95"
                                        >
                                            Quick Add
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5 px-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-[11px] md:text-sm font-black text-secondary uppercase tracking-tight leading-tight group-hover:text-primary transition-colors truncate">
                                            {product.name}
                                        </h3>
                                        <button 
                                            onClick={() => toggleWishlist(product)}
                                            className={cn(
                                                "transition-all duration-300 transform active:scale-150 shrink-0",
                                                isInWishlist(product.id) ? "text-rose-500" : "text-slate-200 hover:text-rose-400"
                                            )}>
                                            <Heart 
                                                size={16} 
                                                fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                                                strokeWidth={2.5} 
                                            />
                                        </button>
                                    </div>
                                    <p className="text-sm md:text-lg font-black text-secondary font-heading leading-none">₹{Number(product.price).toLocaleString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {filteredAndSorted.length === 0 && (
                    <div className="py-24 text-center">
                        <ShoppingBag size={48} className="mx-auto text-slate-100 mb-6" />
                        <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">No signature items found</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Try adjusting your signal to discover new pieces.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default CategoryListing;

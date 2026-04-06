import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { dataService } from '../dataService';

const CategorySelector = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await dataService.getCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const getCollectionTag = (idx: number) => {
        const tags = ["Viral", "Trending", "Special", "New", "Premium", "Top"];
        return tags[idx % tags.length];
    }

    return (
        <section className="py-20 md:py-24 bg-[#FDFDFD]">
            <div className="container px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2">
                    <div className="space-y-3 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-px bg-primary" />
                            <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em]">Handpicked Collections</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-secondary tracking-tighter uppercase leading-none font-heading">
                           Curated Collections
                        </h2>
                        <p className="text-[10px] md:text-[11px] font-medium text-secondary/40 uppercase tracking-widest max-w-md">
                           Curated styles from the best of Indian craftsmanship.
                        </p>
                    </div>
                    
                    <button onClick={() => navigate('/category/all')} className="hidden md:flex items-center gap-3 group">
                        <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] group-hover:text-primary transition-colors">See All</span>
                        <div className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                            <ArrowRight size={14} />
                        </div>
                    </button>
                </div>

                {/* Compact Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {categories.slice(0, 8).map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => navigate(`/category/${cat.id}`)}
                            className="group relative h-[250px] md:h-[320px] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-slate-100"
                        >
                            {/* Background Image with Overlay */}
                            <img 
                                src={cat.img || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000"} 
                                alt={cat.name} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/10 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                            
                            {/* Tag */}
                            <div className="absolute top-5 left-5">
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                                    <Star size={8} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-[7px] font-black text-white uppercase tracking-widest">{getCollectionTag(i)}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="absolute inset-x-6 bottom-6 space-y-2">
                                <div className="space-y-0.5">
                                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter leading-none font-heading">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[8px] md:text-[9px] font-bold text-white/50 uppercase tracking-widest">
                                        Explore Items
                                    </p>
                                </div>

                                <div className="pt-2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                                        <ArrowRight size={10} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Button */}
                <div className="mt-10 md:hidden flex justify-center">
                    <button onClick={() => navigate('/category/all')} className="w-full bg-secondary text-white py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-secondary/10">
                        See All Collections
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CategorySelector;

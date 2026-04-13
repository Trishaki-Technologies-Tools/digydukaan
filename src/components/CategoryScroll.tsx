import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../dataService';
import { getIconByName } from '../lib/iconMapper';
import { motion } from 'framer-motion';

const CategoryScroll = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
       try {
         const products = await dataService.getProducts();
         const uniqueCats = Array.from(new Set(products.map((p: any) => p.category))).filter(Boolean);
         
         const cats = uniqueCats
           .filter((name: any) => name.toLowerCase() !== 'home')
           .map((name: any, i) => ({
             id: name.toLowerCase(),
             name: name,
             icon: name
           }));

         setCategories([{ id: 'all', name: 'For You', icon: 'Sparkles' }, ...cats]);
       } catch (e) {
         console.error("Failed to fetch categories", e);
       }
    };
    fetchCats();
  }, []);

  const getCatColors = (idx: number) => {
    const colors = [
      'bg-amber-50 text-amber-500 border-amber-100',
      'bg-indigo-50 text-indigo-500 border-indigo-100',
      'bg-emerald-50 text-emerald-500 border-emerald-100',
      'bg-rose-50 text-rose-500 border-rose-100',
      'bg-sky-50 text-sky-500 border-sky-100',
      'bg-violet-50 text-violet-500 border-violet-100'
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 overflow-x-auto no-scrollbar scroll-smooth sticky top-16 md:top-20 z-40 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.02)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-2.5 gap-6 min-w-max md:min-w-0 md:justify-between">
          {categories.slice(0, 12).map((cat, i) => {
            const IconComp = getIconByName(cat.icon || 'ShoppingBag');
            const colorClass = getCatColors(i);
            
            return (
              <motion.button
                key={`${cat.id}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="flex flex-col items-center gap-1 group cursor-pointer transition-all active:scale-95"
              >
                <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-100 ${colorClass.split(' ')[0]} bg-opacity-25`}>
                   <IconComp size={16} strokeWidth={2.5} className={`md:w-4.5 md:h-4.5 ${colorClass.split(' ')[1]}`} />
                </div>
                <span className="text-[7.5px] md:text-[8px] font-black text-secondary/40 group-hover:text-primary transition-colors whitespace-nowrap uppercase tracking-widest leading-none">
                  {cat.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryScroll;

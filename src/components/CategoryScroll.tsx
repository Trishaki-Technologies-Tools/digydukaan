import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../dataService';
import { getIconByName } from '../lib/iconMapper';

const CategoryScroll = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  // Hardcoded Fallback - These will ALWAYS show if DB is empty
  const FALLBACK_CATEGORIES = [
    { id: 'all', name: 'For You', icon: 'Sparkles', color: 'bg-blue-50 text-blue-500' },
    { id: 'fashion', name: 'Fashion', icon: 'Shirt', color: 'bg-orange-50 text-orange-500' },
    { id: 'mobiles', name: 'Mobiles', icon: 'Smartphone', color: 'bg-green-50 text-green-500' },
    { id: 'beauty', name: 'Beauty', icon: 'HeartPulse', color: 'bg-purple-50 text-purple-500' },
    { id: 'electronics', name: 'Electronics', icon: 'Laptop', color: 'bg-indigo-50 text-indigo-500' },
    { id: 'home', name: 'Home', icon: 'Home', color: 'bg-red-50 text-red-500' },
    { id: 'jewelry', name: 'Jewelry', icon: 'Gem', iconColor: 'text-yellow-500', color: 'bg-yellow-50' },
    { id: 'kids', name: 'Kids', icon: 'Baby', color: 'bg-pink-50 text-pink-500' },
    { id: 'furniture', name: 'Furniture', icon: 'Armchair', color: 'bg-blue-50 text-blue-400' },
    { id: 'offers', name: 'Top Offers', icon: 'ShoppingBag', color: 'bg-emerald-50 text-emerald-500' },
    { id: 'dresses', name: 'Dresses', icon: 'Palette', color: 'bg-indigo-50 text-indigo-500' },
    { id: 'watch', name: 'Watch', icon: 'Watch', color: 'bg-orange-50 text-orange-500' }
  ];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await dataService.getCategories();
        if (data && data.length > 0) {
          // If DB has data, use it but prepend "For You"
          const allCats = [{ id: 'all', name: 'For You', icon: 'Sparkles', color: 'bg-blue-50 text-blue-500' }, ...data];
          setCategories(allCats);
        } else {
          // If DB is empty, use the hardcoded fallback
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (e) {
        // Full fail? Use fallback
        setCategories(FALLBACK_CATEGORIES);
      }
    };
    fetchCats();
  }, []);

  const getCatColor = (idx: number) => {
    const colors = [
      'bg-orange-50 text-orange-500', 
      'bg-green-50 text-green-500', 
      'bg-purple-50 text-purple-500', 
      'bg-indigo-50 text-indigo-500', 
      'bg-red-50 text-red-500',
      'bg-yellow-50 text-yellow-500',
      'bg-blue-50 text-blue-400'
    ];
    return colors[idx % colors.length];
  }

  return (
    <div className="w-full bg-white border-b border-gray-100 overflow-x-auto no-scrollbar scroll-smooth sticky top-16 md:top-20 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4 gap-6 md:gap-4 min-w-max md:min-w-0">
          {categories.slice(0, 15).map((cat, i) => {
            const IconComp = getIconByName(cat.icon || 'ShoppingBag');
            return (
              <button
                key={`${cat.id}-${i}`}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer min-w-[70px] md:flex-1"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:scale-105 ${cat.color || getCatColor(i)}`}>
                  <IconComp size={18} className={`md:w-6 md:h-6 ${cat.iconColor || ''}`} />
                </div>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-500 group-hover:text-primary transition-colors whitespace-nowrap uppercase tracking-tighter">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryScroll;

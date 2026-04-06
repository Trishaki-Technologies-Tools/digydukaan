import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ChevronRight, TrendingUp } from 'lucide-react';
import { dataService } from '../dataService';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, subtitle }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let data = [];
      if (title.includes('Highly Recommended')) {
        data = await dataService.getHighlyRecommended();
      } else if (title.includes('Best Selling')) {
        data = await dataService.getBestSelling();
      } else {
        data = await dataService.getRecommendedProducts();
      }
      setProducts(data);
      setLoading(false);
    };
    fetch();
  }, [title]);

  if (loading) {
    return (
      <section className="py-20 bg-white overflow-hidden">
        <div className="container px-4">
           <div className="h-10 w-64 bg-slate-50 rounded-xl animate-pulse mb-8" />
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] bg-slate-50 rounded-[2.5rem] animate-pulse" />
              ))}
           </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="container px-4 md:px-0">
        <div className="flex items-end justify-between mb-12 px-2">
          <div className="space-y-2">
            {title.includes('Best Selling') && (
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                <TrendingUp size={14} /> Market Favorites
              </div>
            )}
            {title.includes('Highly Recommended') && (
              <div className="flex items-center gap-2 text-amber-500 font-black uppercase tracking-[0.3em] text-[10px]">
                <Star size={14} /> Premium Choice
              </div>
            )}
            <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase font-heading leading-tight">
              {title.split(' ')[0]} <span className="text-primary italic">{title.split(' ').slice(1).join(' ')}</span>
            </h2>
            {subtitle && (
               <p className="text-[11px] font-bold text-secondary/30 uppercase tracking-[0.2em]">{subtitle}</p>
            )}
          </div>
          <Link to="/category/all" className="hidden md:flex items-center gap-2 text-secondary/40 hover:text-primary font-bold text-xs uppercase tracking-widest transition-all group">
            View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group flex flex-col gap-6"
            >
              <div className={cn(
                "aspect-[3/4] rounded-[2.5rem] border overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-700",
                product.badge === 'Highly Recommended' ? "bg-amber-50/10 border-amber-50" : "bg-white border-gray-100"
              )}>
                <Link to={`/product/${product.id}`} className="block h-full w-full">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                </Link>

                {/* Status Badges */}
                {product.badge && (
                   <div className={cn(
                     "absolute top-6 left-6 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border shadow-xl backdrop-blur-md z-10",
                     product.badge === 'Highly Recommended' ? "bg-amber-400 text-amber-950 border-white/20" : "bg-slate-900/90 text-white border-white/10"
                   )}>
                      {product.badge}
                   </div>
                )}

                <div className="absolute inset-x-6 bottom-6 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 z-10">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all active:scale-95"
                  >
                    Quick Add
                  </button>
                </div>
              </div>

              <div className="space-y-2 px-2">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-sm font-black text-secondary uppercase tracking-tight leading-tight group-hover:text-primary transition-colors truncate">
                    {product.name}
                  </h3>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      "transition-all duration-300 transform active:scale-150 shrink-0",
                      isInWishlist(product.id) ? "text-rose-500 animate-pulse" : "text-slate-200 hover:text-rose-400"
                   )}>
                    <Heart 
                      size={18} 
                      fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                      strokeWidth={2.5} 
                    />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                   <p className="text-lg font-black text-secondary font-heading leading-none">₹{Number(product.price).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default ProductSection;

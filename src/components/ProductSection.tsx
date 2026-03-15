import { motion } from 'framer-motion';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

const products = [
  { name: "Smart Phone 12", price: "₹79,999", oldPrice: "₹89,999", rating: 4.8, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop", badge: "HOT" },
  { name: "Maxosi Microwave Oven", price: "₹12,499", oldPrice: "₹15,999", rating: 4.9, img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=2070&auto=format&fit=crop" },
  { name: "Omex Blender", price: "₹4,199", oldPrice: "₹5,499", rating: 4.7, img: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1964&auto=format&fit=crop" },
  { name: "LF 7 Pro Console", price: "₹42,999", oldPrice: "₹49,999", rating: 4.9, img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop", badge: "NEW" },
  { name: "Xonix CC Camera", price: "₹8,599", oldPrice: "₹10,999", rating: 4.6, img: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop" },
  { name: "Mango Router", price: "₹2,499", oldPrice: "₹3,999", rating: 4.5, img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop" },
  { name: "Oke Water Purifier", price: "₹15,999", oldPrice: "₹18,499", rating: 4.7, img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1932&auto=format&fit=crop" },
  { name: "Macbook Pro 16", price: "₹1,84,900", oldPrice: "₹1,99,900", rating: 4.9, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop", badge: "SALE" }
];

const ProductSection = ({ title, subtitle }: { title: string, subtitle: string }) => {
  return (
    <section className="py-12 md:py-24 bg-white px-4 md:px-0">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">{title}</h2>
            <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">{subtitle}</p>
          </div>
          <button className="bg-slate-50 border border-slate-200 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-12">
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="aspect-[3/4] rounded-[2rem] bg-slate-50 border border-slate-100/50 overflow-hidden relative mb-5 md:mb-6">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {product.badge && (
                  <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-slate-900 text-white text-[8px] md:text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    {product.badge}
                  </div>
                )}

                {/* Actions - Always partially visible on mobile? Or keep hover? 
                    Actually, let's make them always visible on touch devices if we could, 
                    but standard way is to show them on click or just keep the clean look.
                    We will keep hover but make them slightly larger for touch. */}
                <div className="absolute top-4 md:top-6 right-4 md:right-6 flex flex-col gap-3 lg:translate-x-12 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100 transition-all duration-500">
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-blue-500 hover:shadow-xl shadow-md transition-all">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-blue-500 hover:shadow-xl shadow-md transition-all">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute inset-x-4 md:inset-x-6 bottom-4 md:bottom-6 lg:translate-y-20 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500">
                  <button className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-2xl shadow-blue-500/40">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="px-2 md:px-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={cn("h-3 w-3", s <= 4 ? "fill-orange-400 text-orange-400" : "text-slate-200")} />
                    ))}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase">({product.rating})</span>
                </div>
                <h3 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-base md:text-lg font-black text-slate-900">{product.price}</span>
                  <span className="text-xs md:text-sm font-bold text-slate-300 line-through italic">{product.oldPrice}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;

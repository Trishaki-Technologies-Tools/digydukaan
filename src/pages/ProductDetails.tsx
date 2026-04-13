import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Heart, Truck, RotateCcw, ChevronRight, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { dataService } from '../dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { cn } from '../lib/utils';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await dataService.getProductById(id);
      setProduct(data);
      setLoading(false);
      window.scrollTo(0, 0);

      // Track History (Recently Viewed)
      if (data) {
        const history = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
        const filtered = history.filter((p: any) => p.id !== data.id);
        const newHistory = [data, ...filtered].slice(0, 10);
        localStorage.setItem('recently_viewed', JSON.stringify(newHistory));
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
     return (
        <div className="min-h-screen bg-white">
           <TopBar />
           <Navbar />
           <div className="container py-24 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
           <Footer />
        </div>
     );
  }

  if (!product) {
     return (
        <div className="min-h-screen bg-white text-center py-20 uppercase font-black">
           Product Not Found
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <TopBar />
      <Navbar />

      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
             <button className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                <X size={32} />
             </button>
             <motion.img 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               src={product.img} 
               className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
             />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container py-6">
         <div className="flex items-center gap-2 text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="hover:text-primary cursor-pointer uppercase transition-colors">{product.category_id || 'Shop'}</span>
            <ChevronRight size={12} />
            <span className="text-secondary truncate max-w-[150px] md:max-w-none">{product.name}</span>
         </div>
      </div>

      <section className="container pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               onClick={() => setIsZoomed(true)}
               className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-secondary/5 relative shadow-sm hover:shadow-xl transition-all cursor-zoom-in group"
             >
                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                
                {product.badge && (
                  <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-primary/20 z-10">
                    {product.badge}
                  </div>
                )}

                <button 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                  className={cn(
                    "absolute top-6 right-6 w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-xl active:scale-125 z-10",
                    isInWishlist(product.id) ? "bg-rose-500 text-white" : "bg-white/80 text-secondary/40 hover:text-rose-500"
                  )}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={2} />
                </button>
             </motion.div>

             <div className="grid grid-cols-4 gap-3 px-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square rounded-xl bg-white border border-secondary/5 overflow-hidden cursor-pointer hover:border-primary transition-all opacity-60 hover:opacity-100">
                     <img src={product.img} className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-7 space-y-8 py-2">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 bg-amber-400/10 text-amber-600 px-3 py-1.5 rounded-full border border-amber-400/10">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black">{product.rating || '4.9'}</span>
                   </div>
                   <span className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">2.4k Global Recommendations</span>
                   <div className="h-3 w-px bg-slate-100 mx-0.5" />
                   <div className="flex items-center gap-2 text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full border border-green-100">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">In Stock</span>
                   </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-secondary tracking-tight uppercase leading-tight font-heading">
                   {product.name}
                </h1>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">SKU: {product.sku || 'DK-MASTER-X'}</span>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex items-baseline gap-4 border-b border-slate-50 pb-6">
                   <span className="text-3xl font-black text-secondary leading-none">₹{Number(product.price).toLocaleString()}</span>
                   {product.old_price && (
                      <span className="text-xl font-bold text-secondary/20 line-through italic leading-none">₹{Number(product.old_price).toLocaleString()}</span>
                   )}
                   <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100">Limited Offer</span>
                </div>
                <p className="text-[9px] font-bold text-secondary/30 uppercase tracking-wider px-1">Tax included. Shipping calculated at checkout.</p>
             </div>

             <div className="space-y-6 pt-4">
                <div className="flex items-center gap-6">
                   <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Quantity</span>
                   <div className="flex items-center bg-slate-50 rounded-xl p-1.5 border border-secondary/5">
                      <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 flex items-center justify-center text-secondary hover:bg-white rounded-lg transition-all active:scale-90"
                      >
                         <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-black text-xl text-secondary">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="w-10 h-10 flex items-center justify-center text-secondary hover:bg-white rounded-lg transition-all active:scale-90"
                      >
                         <Plus size={14} />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <button 
                     onClick={() => addToCart({ ...product, quantity })}
                     className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-secondary/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-black group"
                   >
                      <ShoppingBag size={18} className="group-hover:-rotate-12 transition-transform" /> Add to Bag
                   </button>
                   <button 
                     onClick={handleBuyNow}
                     className="w-full bg-primary text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all group overflow-hidden relative"
                   >
                      <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <ShoppingCart size={18} /> Buy Now
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                   <div className="text-primary bg-primary/5 w-8 h-8 flex items-center justify-center rounded-lg"><Truck size={16} /></div>
                   <div>
                      <p className="text-[9px] font-black text-secondary uppercase tracking-widest leading-none mb-1">Shipping</p>
                      <p className="text-[8px] font-bold text-secondary/30 uppercase tracking-widest leading-none">3-5 Days</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                   <div className="text-secondary bg-slate-50 w-8 h-8 flex items-center justify-center rounded-lg"><RotateCcw size={16} /></div>
                   <div>
                      <p className="text-[9px] font-black text-secondary uppercase tracking-widest leading-none mb-1">Returns</p>
                      <p className="text-[8px] font-bold text-secondary/30 uppercase tracking-widest leading-none">7 Day Policy</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4 pt-4">
                <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] border-l-3 border-primary pl-3">Description</h3>
                <p className="text-[11px] font-medium text-secondary/50 leading-relaxed uppercase tracking-widest">
                   {product.description || "The exclusive product collection helps to drive innovation and shape the way we live, work and interact with our environment. Experience the premium quality craftsmanship and superior materials used in every piece."}
                </p>
             </div>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 py-32 border-t border-slate-100">
         <div className="container">
            <ProductSection 
               title="Elite Recommendations" 
            />
         </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;

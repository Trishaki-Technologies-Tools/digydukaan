import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Share2, ShieldCheck, Truck, RotateCcw, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { dataService } from '../dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await dataService.getProductById(id);
      setProduct(data);
      setLoading(false);
      window.scrollTo(0, 0);
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

      <div className="container py-6">
         <div className="flex items-center gap-2 text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="hover:text-primary cursor-pointer uppercase transition-colors">{product.category_id || 'Shop'}</span>
            <ChevronRight size={12} />
            <span className="text-secondary truncate max-w-[150px] md:max-w-none">{product.name}</span>
         </div>
      </div>

      <section className="container pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          <div className="lg:col-span-7 space-y-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="aspect-[4/5] rounded-[2.8rem] overflow-hidden bg-slate-50 border border-secondary/5 relative shadow-xl"
             >
                <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                
                {product.badge && (
                  <div className="absolute top-8 left-8 bg-primary text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-2xl shadow-primary/30 z-10">
                    {product.badge}
                  </div>
                )}

                <button 
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "absolute top-8 right-8 w-14 h-14 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-150 z-10",
                    isInWishlist(product.id) ? "bg-rose-500 text-white" : "bg-white/80 text-secondary/40 hover:text-rose-500"
                  )}
                >
                  <Heart size={22} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>
             </motion.div>

             <div className="grid grid-cols-4 gap-4 px-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square rounded-2xl bg-slate-50 border border-secondary/5 overflow-hidden cursor-pointer hover:border-primary transition-all opacity-80 hover:opacity-100 hover:-translate-y-1">
                     <img src={product.img} className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-5 space-y-12 py-4">
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 bg-amber-400/10 text-amber-600 px-4 py-2 rounded-full border border-amber-400/10">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-black">{product.rating || '4.9'}</span>
                   </div>
                   <span className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">2.4k Global Recommendations</span>
                   <div className="h-4 w-px bg-slate-100 mx-1" />
                   <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-full border border-green-100">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">In Stock</span>
                   </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter uppercase leading-[0.8] font-heading">
                   {product.name}
                </h1>
                <div className="flex items-center gap-3">
                   <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Master Item Code: {product.sku || 'DK-MASTER-X'}</span>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-baseline gap-6 border-b border-slate-50 pb-8">
                   <span className="text-5xl font-black text-secondary leading-none">₹{Number(product.price).toLocaleString()}</span>
                   {product.old_price && (
                      <span className="text-2xl font-bold text-secondary/20 line-through italic leading-none">₹{Number(product.old_price).toLocaleString()}</span>
                   )}
                   <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-emerald-100">Limited Offer</span>
                </div>
                <p className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.1em] px-1">Price varies by region. Shipping calculated at checkout.</p>
             </div>

             <div className="space-y-8 pt-8">
                <div className="flex items-center gap-8">
                   <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Select Quantity</span>
                   <div className="flex items-center bg-slate-50 rounded-2xl p-2 border border-secondary/5 shadow-inner">
                      <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="w-12 h-12 flex items-center justify-center text-secondary hover:bg-white rounded-xl transition-all hover:shadow-lg active:scale-90"
                      >
                         <Minus size={16} />
                      </button>
                      <span className="w-16 text-center font-black text-2xl text-secondary">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="w-12 h-12 flex items-center justify-center text-secondary hover:bg-white rounded-xl transition-all hover:shadow-lg active:scale-90"
                      >
                         <Plus size={16} />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button 
                     onClick={() => addToCart({ ...product, quantity })}
                     className="w-full bg-secondary text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl shadow-secondary/20 flex items-center justify-center gap-4 active:scale-[0.98] transition-all hover:bg-black group"
                   >
                      <ShoppingBag size={20} className="group-hover:-rotate-12 transition-transform" /> Add to Order Bag
                   </button>
                   <button className="w-full bg-primary text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl shadow-primary/30 flex items-center justify-center gap-4 active:scale-[0.98] transition-all group overflow-hidden relative">
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <ShoppingCart size={20} /> Secure Checkout
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-50">
                <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer">
                   <div className="text-primary bg-primary/5 w-10 h-10 flex items-center justify-center rounded-xl"><Truck size={20} /></div>
                   <div>
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest leading-none mb-1">Fast Logistics</p>
                      <p className="text-[9px] font-bold text-secondary/30 uppercase tracking-widest leading-none">3-5 Business Days</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer">
                   <div className="text-secondary bg-slate-50 w-10 h-10 flex items-center justify-center rounded-xl"><RotateCcw size={20} /></div>
                   <div>
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest leading-none mb-1">Vault Shield</p>
                      <p className="text-[9px] font-bold text-secondary/30 uppercase tracking-widest leading-none">7 Day No-Risk Retraction</p>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.4em] border-l-4 border-primary pl-4">Product Philosophy</h3>
                <p className="text-xs font-black text-secondary/40 leading-[2] uppercase tracking-widest">
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default ProductDetails;

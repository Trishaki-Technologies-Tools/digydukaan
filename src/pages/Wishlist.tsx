import { ChevronLeft, Heart, X, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />

      <main className="container max-w-lg mx-auto px-6 pt-8">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-secondary active:scale-90 transition-all">
              <ChevronLeft size={20} />
           </button>
           <h1 className="text-xl font-black uppercase tracking-tight text-secondary">Saved Treasures</h1>
        </div>

        {wishlist.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6">
                 <Heart size={40} />
              </div>
              <p className="text-[11px] font-black text-secondary uppercase tracking-[0.2em] mb-2">Your vault is empty</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-8">Start saving products you love!</p>
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary/20 active:scale-95 transition-all"
              >
                 Explore Collections
              </button>
           </div>
        ) : (
           <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                 {wishlist.map((p) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={p.id}
                      className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 relative group"
                    >
                       {/* Remove Button */}
                       <button 
                         onClick={() => toggleWishlist(p)}
                         className="absolute -top-1 -right-1 w-8 h-8 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-rose-500 z-10 active:scale-90"
                       >
                          <X size={14} />
                       </button>

                       <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden border border-slate-100/50 shrink-0" onClick={() => navigate(`/product/${p.id}`)}>
                          <img src={p.img} className="w-full h-full object-cover" />
                       </div>

                       <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-secondary uppercase truncate mb-1">{p.name}</p>
                          <p className="text-[11px] font-black text-primary mb-3">₹{Number(p.price).toLocaleString()}</p>
                          
                          <button 
                            onClick={() => handleAddToCart(p)}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all w-fit"
                          >
                             <ShoppingCart size={12} /> Move to Bag
                          </button>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;

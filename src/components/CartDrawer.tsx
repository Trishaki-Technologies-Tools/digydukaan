import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
       localStorage.setItem('redirect_after_login', '/checkout');
       setIsAuthOpen(true);
    } else {
       onClose();
       navigate('/checkout');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[101] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                     <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-secondary uppercase tracking-tighter leading-none mb-1">My Bag</h2>
                    <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">{totalItems} Total Selections</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-secondary/40 hover:text-primary transition-all active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                     <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 border-2 border-dashed border-slate-100 animate-pulse">
                        <ShoppingBag size={40} />
                     </div>
                     <h3 className="text-xl font-black text-secondary uppercase tracking-tighter mb-2">Cart is empty</h3>
                     <p className="text-xs font-bold text-secondary/30 uppercase tracking-widest leading-loose max-w-[200px]">Your dream items are waiting to be added.</p>
                     <button 
                       onClick={onClose}
                       className="mt-8 bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-primary hover:border-primary transition-all active:scale-95"
                     >
                       Explore Shop
                     </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-6 group relative">
                      <div className="w-24 h-32 rounded-[1.5rem] bg-slate-50 overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm relative group-hover:shadow-lg transition-all">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-primary uppercase tracking-widest">{item.category || 'Product'}</p>
                                <h4 className="text-sm font-black text-secondary uppercase tracking-tight leading-tight max-w-[120px]">{item.name}</h4>
                             </div>
                             <button 
                               onClick={() => removeFromCart(item.id)}
                               className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-secondary hover:bg-white hover:shadow-sm rounded-lg transition-all"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-10 text-center text-xs font-black text-secondary">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-secondary hover:bg-white hover:shadow-sm rounded-lg transition-all"
                              >
                                <Plus size={12} />
                              </button>
                           </div>
                           <p className="text-lg font-black text-secondary font-heading leading-none">₹{(item.rawPrice * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {items.length > 0 && (
                <div className="p-8 bg-slate-50 border-t border-gray-100 space-y-8 shrink-0">
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-secondary/40 px-2">
                        <span>Bag Subtotal</span>
                        <span className="text-secondary tracking-normal">₹{totalPrice.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-secondary/40 px-2">
                        <span>Courier / Shipping</span>
                        <span className="text-green-600">Free Tracking</span>
                     </div>
                     <div className="flex justify-between text-2xl font-black uppercase tracking-tighter text-secondary pt-6 border-t border-slate-200 px-2 leading-none">
                        <span>Total Payable</span>
                        <span className="font-heading">₹{totalPrice.toLocaleString()}</span>
                     </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-secondary text-white py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl shadow-secondary/30 flex items-center justify-center gap-4 active:scale-[0.98] transition-all group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    {user ? 'Proceed to Secure Checkout' : 'Login to Complete Order'}
                    {user ? <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> : <LogIn size={18} className="group-hover:rotate-12 transition-transform" />}
                  </button>
                  
                  <div className="flex items-center gap-3 justify-center">
                     <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SSL Secure 256-bit Encryption</p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* INTERNAL LOGIN POPUP: Triggers if Guest tries to Checkout */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <style dangerouslySetInnerHTML={{ __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
      `}} />
    </>
  );
};

export default CartDrawer;

import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, MapPin, X, Menu, LogOut, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { dataService } from '../dataService';

const Navbar = () => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { totalItems, totalPrice } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    // 1. Check Custom MSG91 Session
    const localUser = localStorage.getItem('digydukaan_user');
    if (localUser) {
       setUser(JSON.parse(localUser));
    }

    // 2. Check Supabase Session (Legacy/Admin)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!localUser) setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!localStorage.getItem('digydukaan_user')) {
         setUser(session?.user ?? null);
      }
    });

    dataService.getProducts().then(data => setAllProducts(data));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const navigateToResult = (p: any) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/product/${p.id}`);
  };

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="container flex h-16 md:h-20 items-center gap-4 md:gap-8 px-4">
          
          {/* LOGO & LOCATION (Left Hub) */}
          <div className="flex items-center gap-4 md:gap-8 shrink-0">
             <Link to="/" className="flex flex-col -gap-1">
                <span className="text-xl md:text-2xl font-black tracking-tighter text-secondary font-heading leading-none">
                  Digy<span className="text-primary italic">Dukaan</span>
                </span>
                <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-primary/80 leading-none">
                  Sovereign Store Hub
                </span>
             </Link>

             <div className="hidden lg:flex items-center gap-3 px-4 py-2 border-l border-slate-100 group cursor-pointer transition-all">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col leading-none">
                   <span className="text-[9px] font-black text-secondary/30 uppercase tracking-widest mb-1">Deliver to</span>
                   <span className="text-[11px] font-black text-secondary uppercase tracking-tight">Belgaum 590001</span>
                </div>
             </div>
          </div>

          {/* DYNAMIC WIDE SEARCH (Central Hub) */}
          <div ref={searchRef} className="flex-1 max-w-[600px] relative hidden md:block">
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all">
                 <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search premium collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowResults(true)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-14 pr-6 text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none text-secondary shadow-inner"
              />
            </div>

            {/* LIVE INLINE RESULTS */}
            <AnimatePresence>
               {showResults && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white shadow-2xl rounded-[1.5rem] border border-slate-100 overflow-hidden z-[101]"
                  >
                     <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {searchResults.length > 0 ? (
                           searchResults.map((p) => (
                              <div 
                                key={p.id}
                                onClick={() => navigateToResult(p)}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all group"
                              >
                                 <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                    <img src={p.img} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-[11px] font-black text-secondary uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{p.name}</p>
                                    <p className="text-[9px] text-slate-300 uppercase font-bold tracking-widest">{p.category}</p>
                                 </div>
                                 <p className="text-[11px] font-black text-secondary">₹{Number(p.price).toLocaleString()}</p>
                              </div>
                           ))
                        ) : (
                           <div className="p-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest italic">No match in vault.</div>
                        )}
                     </div>
                     <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                        <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest">Global Discovery Engine Activted</p>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* ACCOUNT & CART (Right Hub) */}
          <div className="flex items-center gap-2 md:gap-5 shrink-0 ml-auto">
            {/* Account Tab */}
            <div className="relative group">
              <button 
                onClick={() => user ? null : setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-3 px-3 py-2 border border-transparent hover:border-slate-100 hover:bg-slate-50 rounded-xl transition-all"
              >
                 {user ? (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[10px] shadow-lg shadow-primary/20 uppercase">
                       {user.full_name?.[0] || user.phone?.[0] || 'M'}
                    </div>
                 ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-secondary/40">
                       <User size={18} />
                    </div>
                 )}
                 <div className="hidden lg:flex flex-col items-start leading-none">
                    <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-1">Hello, {user?.full_name || 'Member'}</p>
                    <p className="text-[11px] font-black text-secondary uppercase tracking-tighter">{user?.phone || 'Account Hub'}</p>
                 </div>
              </button>

              {user && (
                 <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-secondary/60 hover:text-primary hover:bg-slate-50 transition-all uppercase tracking-widest">
                       <ShoppingBag size={14} /> My Orders
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-50 transition-all uppercase tracking-widest border-t border-slate-50 mt-1">
                       <LogOut size={14} /> Sign Out
                    </button>
                 </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link 
              to="/orders" 
              className="relative hidden md:flex w-10 h-10 items-center justify-center text-secondary/20 hover:text-rose-500 transition-all group"
            >
              <Heart size={20} fill={wishlistCount > 0 ? "currentColor" : "none"} className={wishlistCount > 0 ? "text-rose-500 animate-pulse" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[8px] font-black text-white shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Unit */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-3 bg-secondary text-white px-5 py-2.5 rounded-2xl transition-all shadow-xl shadow-secondary/20 active:scale-95 group overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
               <div className="relative">
                  <ShoppingBag size={18} />
                  <span className="absolute -top-2 -right-2 flex h-4.5 w-4.5 min-w-[18px] h-[18px] items-center justify-center rounded-full bg-primary text-[9px] font-black text-white shadow-lg border-2 border-secondary">
                    {totalItems}
                  </span>
               </div>
               <span className="hidden md:block text-[10px] font-black uppercase tracking-widest border-l border-white/20 pl-3">₹{totalPrice.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE TRIGGER */}
      <div className="md:hidden bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-3">
         <button className="text-secondary" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
         </button>
         <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Drawer (Restored Clean Style) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[201] lg:hidden p-8 pt-12">
               <div className="flex justify-between items-center mb-12">
                  <div className="flex flex-col">
                     <span className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Digy<span className="text-primary italic">Dukaan</span></span>
                     <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1">Sovereign Store</span>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="text-slate-300"><X size={24} /></button>
               </div>
               <div className="flex flex-col gap-6">
                  {['Mobiles', 'Fashion', 'Electronics', 'Star Deals'].map((val) => (
                     <Link key={val} to={`/category/${val.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-secondary tracking-tighter uppercase hover:text-primary transition-all">{val}</Link>
                  ))}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F5F9; border-radius: 10px; }`}} />
    </>
  );
};

export default Navbar;

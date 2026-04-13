import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, MapPin, X, Menu, LogOut, Heart, ChevronRight, LayoutGrid, Home as HomeIcon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../dataService';
import { getIconByName } from '../lib/iconMapper';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<{name: string, icon: string}[]>([]);
  
  const { user, logout } = useAuth();
  const { totalItems, totalPrice } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    dataService.getProducts().then(data => {
      setAllProducts(data);
      const uniqueCats = Array.from(new Set(data.map((p: any) => p.category))).filter(Boolean);
      const formattedCats = [
        { name: 'All', icon: 'Sparkles' },
        ...uniqueCats
          .filter((cat: any) => cat.toLowerCase() !== 'home')
          .map(cat => ({ 
            name: cat as string, 
            icon: cat as string
          }))
      ];
      setDynamicCategories(formattedCats);
    });
  }, []);

  const ExplorerIcon = (iconName: string, isSelected: boolean) => {
    const IconComp = getIconByName(iconName);
    return <IconComp size={isSelected ? 22 : 18} />;
  };


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
    await logout();
  };

  const navigateToResult = (p: any) => {
    setSearchQuery('');
    setShowResults(false);
    setIsMenuOpen(false);
    navigate(`/product/${p.id}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="container flex h-20 md:h-24 items-center gap-4 md:gap-8 px-4">
          
          {/* LOGO & LOCATION (Left Hub) */}
          <div className="flex items-center gap-4 md:gap-8 shrink-0">
             <Link to="/" className="flex items-center group">
                <img 
                  src="/images/image.png" 
                  alt="DigyDukaan Logo" 
                  className="h-14 md:h-20 w-auto object-contain transition-transform group-hover:scale-105" 
                />
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

          {/* DYNAMIC WIDE SEARCH (Central Hub - Restored) */}
          <div ref={searchRef} className="flex-1 max-w-[600px] relative hidden lg:block">
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
                className="w-full bg-white border border-slate-100 rounded-full py-3 pl-14 pr-6 text-sm font-bold placeholder:text-slate-300 focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none text-secondary shadow-sm group-hover:shadow-md"
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
                        <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest">Global Discovery Engine Activated</p>
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

      {/* MOBILE HEADER SEARCH */}
      <div className="md:hidden bg-white px-4 py-3 border-b border-slate-100 flex flex-col gap-2 relative z-[90] sticky top-0 md:static">
         <div className="flex items-center gap-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  ref={mobileSearchRef}
                  type="text" 
                  placeholder="Search products..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowResults(true)}
                />
            </div>
         </div>

         {/* MOBILE SEARCH RESULTS */}
         <AnimatePresence>
            {showResults && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 10 }}
                 className="absolute top-full left-4 right-4 mt-2 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden z-[1001]"
               >
                  <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
                     {searchResults.map((p) => (
                        <div key={p.id} onClick={() => navigateToResult(p)} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                           <img src={p.img} className="w-8 h-8 rounded shrink-0 object-cover" />
                           <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-black uppercase truncate">{p.name}</p>
                              <p className="text-[8px] text-slate-400 font-bold uppercase">{p.category}</p>
                           </div>
                           <p className="text-[9px] font-black">₹{Number(p.price).toLocaleString()}</p>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* MOBILE CATEGORY EXPLORER (SPLIT DESIGN) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-secondary/60 backdrop-blur-md z-[200]" />
            <motion.div 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed top-0 left-0 bottom-0 w-full bg-white z-[201] flex flex-col pt-safe shadow-2xl"
            >
               {/* Categories Header */}
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm">
                  <div className="flex flex-col">
                     <p className="text-sm font-black text-secondary uppercase tracking-[0.2em] leading-none mb-1">Product Explorer</p>
                     <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Select Category for Detail</p>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-secondary border border-slate-100">
                     <X size={20} />
                  </button>
               </div>

               {/* Split Content Layer */}
               <div className="flex-1 flex overflow-hidden bg-slate-50">
                  {/* LEFT: Category Column */}
                  <div className="w-[100px] bg-slate-100 border-r border-slate-200 overflow-y-auto py-4 flex flex-col no-scrollbar">
                     {dynamicCategories.map((cat) => (
                        <button 
                          key={cat.name}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`flex flex-col items-center justify-center gap-2 py-6 px-1 transition-all relative ${selectedCategory === cat.name ? 'bg-white text-primary border-b border-slate-100' : 'text-secondary/40'}`}
                        >
                           {selectedCategory === cat.name && (
                             <motion.div layoutId="cat-active-line" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
                           )}
                           <div className={`transition-all duration-300 ${selectedCategory === cat.name ? 'scale-125' : 'opacity-40'}`}>
                             {ExplorerIcon(cat.icon, selectedCategory === cat.name)}
                           </div>
                           <span className={`text-[8px] font-black uppercase tracking-tight text-center leading-tight max-w-[80px] truncate`}>{cat.name}</span>
                        </button>
                     ))}
                  </div>

                  {/* RIGHT: Product Preview Layer */}
                  <div className="flex-1 bg-white overflow-y-auto p-4 custom-scrollbar">
                     <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-end mb-2">
                           <div>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Discovery Vault</p>
                              <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.1em]">{selectedCategory}</h3>
                           </div>
                           <button onClick={() => { setIsMenuOpen(false); navigate(`/category/${selectedCategory.toLowerCase()}`); }} className="text-[9px] font-black text-primary uppercase tracking-widest group">View All <ChevronRight size={10} className="inline mb-0.5 group-hover:translate-x-1 transition-transform" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pb-24">
                           {allProducts
                            .filter(p => selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase())
                            .slice(0, 10)
                            .map((p) => (
                              <button 
                                key={p.id} 
                                onClick={() => navigateToResult(p)}
                                className="flex flex-col gap-2 p-2 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all text-left bg-slate-50/20 group"
                              >
                                 <div className="aspect-square bg-slate-100/50 rounded-xl overflow-hidden border border-slate-50 relative">
                                    <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                 </div>
                                 <div className="px-1 pb-1">
                                    <p className="text-[9px] font-black text-secondary uppercase truncate leading-none mb-1 group-hover:text-primary transition-colors">{p.name}</p>
                                    <p className="text-[10px] font-black text-primary">₹{Number(p.price).toLocaleString()}</p>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FOOTER MOBILE NAVIGATION (FIXED) */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 pt-4 pb-safe shadow-[0_-15px_40px_rgba(0,0,0,0.06)]">
         <div className="flex items-center justify-between max-w-md mx-auto">
            {/* HOME */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1.5 group">
               <div className={`${isActive('/') ? 'text-primary scale-110' : 'text-secondary/30'} group-hover:text-primary transition-all duration-300 group-active:scale-90`}>
                  <HomeIcon size={22} fill={isActive('/') ? "currentColor" : "none"} strokeWidth={isActive('/') ? 3 : 2} />
               </div>
               <span className={`text-[9px] font-black uppercase tracking-[0.1em] leading-none transition-colors group-hover:text-primary ${isActive('/') ? 'text-primary' : 'text-secondary/30'}`}>Home</span>
               {isActive('/') && <motion.div layoutId="footer-dot" className="w-1 h-1 bg-primary rounded-full mt-0.5" />}
            </Link>

            {/* CATEGORIES */}
            <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-1.5 group">
               <div className={`${isMenuOpen ? 'text-primary scale-110' : 'text-secondary/30'} group-hover:text-primary transition-all duration-300 group-active:scale-90`}>
                  <LayoutGrid size={22} fill={isMenuOpen ? "currentColor" : "none"} strokeWidth={isMenuOpen ? 3 : 2} />
               </div>
               <span className={`text-[9px] font-black uppercase tracking-[0.1em] leading-none transition-colors group-hover:text-primary ${isMenuOpen ? 'text-primary' : 'text-secondary/30'}`}>Categories</span>
               {isMenuOpen && <motion.div layoutId="footer-dot" className="w-1 h-1 bg-primary rounded-full mt-0.5" />}
            </button>

            {/* ACCOUNT */}
            <button 
              onClick={() => user ? navigate('/account') : setIsAuthModalOpen(true)} 
              className="flex flex-col items-center gap-1.5 group"
            >
               <div className={`${isActive('/account') ? 'text-primary scale-110' : 'text-secondary/30'} group-hover:text-primary transition-all duration-300 group-active:scale-90 flex items-center justify-center`}>
                  {user ? (
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] uppercase shadow-lg group-hover:shadow-primary/30 transition-all ${isActive('/account') ? 'bg-primary text-white shadow-primary/30 border-2 border-white' : 'bg-secondary text-white shadow-secondary/20'}`}>
                        {user.full_name?.[0] || 'M'}
                     </div>
                  ) : <User size={22} strokeWidth={isActive('/account') ? 3 : 2} className="group-hover:text-primary" />}
               </div>
               <span className={`text-[9px] font-black uppercase tracking-[0.1em] leading-none transition-colors group-hover:text-primary ${isActive('/account') ? 'text-primary' : 'text-secondary/30'}`}>Account</span>
               {isActive('/account') && <motion.div layoutId="footer-dot" className="w-1 h-1 bg-primary rounded-full mt-0.5" />}
            </button>

            {/* CART */}
            <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1.5 group relative">
               <div className={`${isCartOpen ? 'text-primary scale-110' : 'text-secondary/30'} group-hover:text-primary transition-all duration-300 group-active:scale-90`}>
                  <ShoppingBag size={22} strokeWidth={isCartOpen ? 3 : 2} />
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="absolute -top-1 -right-1 flex h-4.5 w-4.5 min-w-[18px] h-[18px] items-center justify-center rounded-full bg-primary text-[8px] font-black text-white shadow-xl border-2 border-white"
                    >
                      {totalItems}
                    </motion.span>
                  )}
               </div>
               <span className={`text-[9px] font-black uppercase tracking-[0.1em] leading-none transition-colors group-hover:text-primary ${isCartOpen ? 'text-primary' : 'text-secondary/30'}`}>Cart</span>
            </button>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F5F9; border-radius: 10px; } .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .pt-safe { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }`}} />
    </>
  );
};

export default Navbar;

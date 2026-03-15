import { useState } from 'react';
import { ShoppingBag, Search, User, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Shop", href: "#" },
    { name: "Products", href: "#" },
    { name: "Pages", href: "#" },
    { name: "Contact", href: "#" }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-slate-900 border-b border-white/5">
        <div className="container flex h-16 md:h-20 items-center justify-between px-4">
          <div className="flex items-center gap-4 lg:gap-12">
            <button 
              className="lg:hidden text-white/60 hover:text-white"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <a href="/" className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
              Digy<span className="text-blue-500">Dukaan</span>
            </a>
            
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button className="hidden sm:block text-white/60 hover:text-white transition-colors p-2">
              <Search className="h-5 w-5" />
            </button>
            <button className="hidden sm:block text-white/60 hover:text-white transition-colors p-2">
              <User className="h-5 w-5" />
            </button>
            <button className="relative hidden sm:block text-white/60 hover:text-white transition-colors p-2">
              <Heart className="h-5 w-5" />
            </button>
            <button className="relative flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-xl transition-all">
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              <div className="hidden md:flex flex-col items-start leading-none">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">My Bag</span>
                  <span className="text-[10px] font-black text-white tracking-widest uppercase">₹12,499</span>
              </div>
              <span className="md:absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-blue-600 text-[9px] md:text-[10px] font-bold text-white shadow-lg">
                3
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-slate-900 z-[101] lg:hidden p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-black text-white uppercase italic">
                   Digy<span className="text-blue-500">Dukaan</span>
                </span>
                <button onClick={() => setIsMenuOpen(false)} className="text-white/60">
                   <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link, idx) => (
                  <motion.a 
                    key={link.name} 
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-2xl font-black text-white uppercase tracking-tighter italic border-l-4 border-transparent hover:border-blue-500 pl-4 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
                 <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest">
                    Account
                 </button>
                 <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest">
                    Wishlist (12)
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

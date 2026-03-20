import { Home as HomeIcon, Search, ShoppingBag, User } from 'lucide-react';

const MobileNav = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <a 
          href="/"
          onClick={scrollToTop}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="p-1 rounded-full text-secondary/60 group-hover:text-primary transition-colors">
            <HomeIcon className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-tighter group-hover:text-primary leading-none transition-colors">Home</span>
        </a>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-1 rounded-full text-secondary/60 group-hover:text-primary transition-colors">
            <Search className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-tighter group-hover:text-primary leading-none transition-colors">Menu</span>
        </button>

        <button className="flex flex-col items-center gap-1 group relative">
          <div className="p-1 rounded-full text-secondary/60 group-hover:text-primary transition-colors">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white shadow-sm border border-white">
              1
            </span>
          </div>
          <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-tighter group-hover:text-primary leading-none transition-colors">Bag</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-1 rounded-full text-secondary/60 group-hover:text-primary transition-colors">
            <User className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-tighter group-hover:text-primary leading-none transition-colors">Me</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;

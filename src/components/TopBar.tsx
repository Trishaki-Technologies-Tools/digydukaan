
const TopBar = () => {
  return (
    <div className="bg-slate-900 py-2.5 px-4 hidden lg:block border-b border-white/5">
      <div className="container flex justify-between items-center text-[10px] uppercase tracking-[0.1em] font-bold text-slate-400">
        <div className="flex gap-6">
          <span>Free delivery for orders over ₹2599</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:text-white transition-colors">Track your order</a>
          <a href="#" className="hover:text-white transition-colors">Find a Store</a>
          <div className="flex items-center gap-1 border-l border-white/10 pl-6 h-3">
             <span>IND / ₹ - EN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

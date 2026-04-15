
const TopBar = () => {
  return (
    <div className="bg-secondary py-2.5 px-4 hidden lg:block border-b border-white/5">
      <div className="container flex justify-between items-center text-[10px] uppercase tracking-[0.1em] font-bold text-white/70">
        <div className="flex gap-6">
          <span>Free delivery for orders over ₹2599</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:text-white transition-colors">Track your order</a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

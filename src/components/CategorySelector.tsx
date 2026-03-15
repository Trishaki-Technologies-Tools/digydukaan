
const categories = [
  { name: "Home Appliances", items: "12 Items", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop" },
  { name: "PC & Laptop", items: "8 Items", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop" },
  { name: "Kitchen Appliances", items: "15 Items", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" },
  { name: "Phone & Tablet", items: "10 Items", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop" },
  { name: "Accessories", items: "24 Items", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop" }
];

const CategorySelector = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container text-center">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          Choose your Category
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-16 font-medium">
          Smartphones provide quick access to notifications, calls, messages, and apps right at your wrist, reducing the need to constantly check your phone.
        </p>

        <div className="flex flex-wrap justify-center gap-16">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-slate-50 rounded-full flex items-center justify-center p-2 border-2 border-transparent group-hover:border-blue-500/20 group-hover:bg-white group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 py-1 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{cat.items}</span>
                </div>
              </div>
              <h3 className="mt-6 text-sm font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySelector;

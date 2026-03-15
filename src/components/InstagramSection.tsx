
const InstagramSection = () => {
  const images = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop"
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Instagram Shop</h2>
          <p className="text-slate-400 font-medium">Follow us on @DigyDukaan</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img, i) => (
            <div key={i} className="aspect-square rounded-[2rem] overflow-hidden group cursor-pointer relative">
              <img src={img} alt="Insta" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white text-[10px] font-black uppercase tracking-widest bg-blue-600 px-4 py-2 rounded-full shadow-xl">Shop Post</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;

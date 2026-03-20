
const categories = [
  { name: "Dresses", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop" },
  { name: "Tops & Blouses", img: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1974&auto=format&fit=crop" },
  { name: "T-Shirts", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1960&auto=format&fit=crop" },
  { name: "Co-ords", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop" },
  { name: "Activewear", img: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=2070&auto=format&fit=crop" },
  { name: "Lingerie", img: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1974&auto=format&fit=crop" },
  { name: "Beauty", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1987&auto=format&fit=crop" },
  { name: "PC & Laptop", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop" },
  { name: "Kitchen", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" },
  { name: "Phones", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop" },
  { name: "Smart Home", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop" }
];

const CategorySelector = () => {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary uppercase tracking-tighter mb-4 font-heading">
          HOT CATEGORIES
        </h2>
        <p className="text-muted max-w-lg mx-auto mb-8 md:mb-16 font-medium text-xs md:text-base">
          Explore our wide range of categories, from premium fashion to high-performance electronics.
        </p>

        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-x-3 md:gap-x-10 lg:gap-x-12 gap-y-6 md:gap-y-16">
          {categories.slice(0, 12).map((cat, i) => (
            <div key={i} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-full max-w-[180px] aspect-[4/5] bg-white rounded-t-[50%] flex items-center justify-center p-1 border border-secondary/5 group-hover:border-primary/20 group-hover:bg-white group-hover:shadow-lg transition-all duration-500 overflow-hidden shadow-sm">
                <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-cover rounded-t-[50%] transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="mt-4 text-[9px] md:text-sm lg:text-base font-bold text-secondary uppercase tracking-widest group-hover:text-primary transition-colors font-heading text-center">
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

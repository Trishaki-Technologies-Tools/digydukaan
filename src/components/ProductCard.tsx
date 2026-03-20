
import { ShoppingBag, Star } from 'lucide-react';

interface ProductProps {
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

const ProductCard = ({ name, category, price, image, rating }: ProductProps) => {
  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all">
      <div className="aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{category}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
            <span className="text-[11px] font-bold text-secondary">{rating}</span>
          </div>
        </div>
        
        <h3 className="text-sm font-bold text-secondary line-clamp-1 mb-2 font-heading">{name}</h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-secondary">₹{price.toLocaleString()}</span>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md active:scale-95">
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

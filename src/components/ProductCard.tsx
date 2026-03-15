
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
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{category}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-semibold text-slate-600">{rating}</span>
          </div>
        </div>
        
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 mb-2">{name}</h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-slate-900">₹{price.toLocaleString()}</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-blue-600 transition-colors">
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  RefreshCcw, 
  XCircle, 
  Heart,
  ChevronRight,
  CreditCard,
  Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { dataService } from '../dataService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getColors = () => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'processing': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'shipped': return 'text-purple-500 bg-purple-50 border-purple-100';
      case 'delivered': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'returned': return 'text-slate-500 bg-slate-50 border-slate-100';
      case 'cancelled': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };
  return (
    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest leading-none ${getColors()}`}>
       {status || "Unknown"}
    </div>
  );
};

const MyOrders = () => {
    const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const navigate = useNavigate();
    
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchUserAndOrders = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsGuest(true);
                setActiveTab('wishlist');
                setLoading(false);
                return;
            }
            const userEmail = session.user.email;
            if (userEmail) {
                const data = await dataService.getOrdersByEmail?.(userEmail) || [];
                setOrders(data);
            }
            setLoading(false);
        };
        fetchUserAndOrders();
    }, []);

    const getStatusStep = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'pending') return 1;
        if (s === 'processing') return 2;
        if (s === 'shipped') return 3;
        if (s === 'delivered') return 4;
        return 1;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50">
                <Navbar />
                <div className="container py-40 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Securely fetching your vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />

            <div className="container py-12 md:py-20 px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 max-w-6xl mx-auto">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            {activeTab === 'orders' ? <Package size={14} /> : <Heart size={14} />} 
                            {activeTab === 'orders' ? 'Transactions' : 'Favorites'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter uppercase font-heading leading-tight">
                            Personal <span className="text-primary italic">Vault</span>
                        </h1>
                    </div>

                    <div className="flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
                        <button 
                          onClick={() => !isGuest && setActiveTab('orders')}
                          className={cn(
                            "px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'orders' ? "bg-white text-secondary shadow-lg" : "text-secondary/30 hover:text-secondary",
                            isGuest && "opacity-50 cursor-not-allowed"
                          )}
                        >
                            Orders {orders.length > 0 && `(${orders.length})`}
                        </button>
                        <button 
                          onClick={() => setActiveTab('wishlist')}
                          className={cn(
                            "px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'wishlist' ? "bg-white text-rose-500 shadow-lg" : "text-secondary/30 hover:text-rose-400"
                          )}
                        >
                            Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'orders' ? (
                    <motion.div 
                        key="orders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12 max-w-6xl mx-auto"
                    >
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-[3.5rem] p-24 border border-secondary/5 text-center shadow-3xl shadow-slate-200/40">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-8 animate-bounce-slow">
                                    <ShoppingBag size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-secondary tracking-tighter uppercase mb-4 font-heading">No Orders Detected</h2>
                                <p className="text-xs font-bold text-secondary/40 uppercase tracking-[0.2em] max-w-sm mx-auto mb-12 leading-relaxed">Your transaction log is empty. Visit our collections to find your signature style.</p>
                                <Link to="/" className="bg-slate-900 text-white px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all inline-block uppercase">Return to Store</Link>
                            </div>
                        ) : (
                            orders.map((order, idx) => (
                                <div key={order.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group">
                                    <div className="p-10 pb-6 flex flex-wrap items-center justify-between gap-8 border-b border-slate-50">
                                        <div className="flex flex-wrap items-center gap-10">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Identifier</p>
                                                <p className="text-sm font-black text-secondary tracking-tighter">#{order.id.slice(0, 10).toUpperCase()}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Placed On</p>
                                                <p className="text-sm font-bold text-secondary">{new Date(order.created_at).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Total Amount</p>
                                                <p className="text-sm font-black text-primary">₹{Number(order.amount).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 p-10">
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 gap-4">
                                                {order.items?.map((item: any, i: number) => (
                                                    <div key={i} className="flex gap-6 p-4 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white transition-all">
                                                        <div className="w-20 h-24 rounded-2xl overflow-hidden border border-slate-100"><img src={item.img} className="w-full h-full object-cover" /></div>
                                                        <div className="flex-1 space-y-1 py-1">
                                                            <h4 className="text-sm font-black text-secondary tracking-tight uppercase leading-none">{item.name}</h4>
                                                            <p className="text-[9px] font-bold text-secondary/30 uppercase tracking-widest">{item.category}</p>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <span className="text-[9px] font-black text-secondary bg-white px-2 py-1 rounded-md">QTY: {item.quantity}</span>
                                                                <span className="text-sm font-black text-secondary">₹{Number(item.price).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-10">
                                            <div className="relative px-2">
                                                <div className="flex justify-between items-center relative mb-12">
                                                    <div className="absolute top-5 left-10 right-10 h-[2px] bg-slate-100" />
                                                    <div className="absolute top-5 left-10 h-[2px] bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.2)]" style={{ width: `${Math.max(0, Math.min(100, (getStatusStep(order.status) - 1) / 3 * 100))}%` }} />
                                                    {[{ icon: Clock, lab: 'Placed' }, { icon: RefreshCcw, lab: 'Packed' }, { icon: Truck, lab: 'Shipped' }, { icon: CheckCircle2, lab: 'Arrived' }].map((s, si) => (
                                                        <div key={si} className="relative z-10 flex flex-col items-center gap-4">
                                                            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm", getStatusStep(order.status) >= si + 1 ? "bg-primary text-white" : "bg-white text-slate-200 border border-slate-100")}><s.icon size={16} /></div>
                                                            <span className={cn("text-[9px] font-black uppercase tracking-widest", getStatusStep(order.status) >= si + 1 ? "text-secondary" : "text-slate-300")}>{s.lab}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-6">
                                                <div className="flex gap-5"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 shadow-sm"><MapPin size={18} /></div><div className="space-y-1"><p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Delivery Coordinates</p><p className="text-[10px] font-bold text-secondary uppercase max-w-xs">{order.address || "HSR Layout, Bangalore - Local Dispatch"}</p></div></div>
                                                <div className="flex gap-5"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 shadow-sm"><CreditCard size={18} /></div><div className="space-y-1"><p className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Settlement Platform</p><p className="text-[10px] font-bold text-secondary uppercase">{order.payment_method || "Digital Payment Gateway"}</p></div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                        key="wishlist"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-6xl mx-auto"
                    >
                        {wishlist.length === 0 ? (
                            <div className="bg-white rounded-[3.5rem] p-24 border border-secondary/5 text-center shadow-3xl shadow-slate-200/40">
                                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-200 mx-auto mb-8 animate-pulse">
                                    <Heart size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-secondary tracking-tighter uppercase mb-4 font-heading">Wishlist is Empty</h2>
                                <p className="text-xs font-bold text-secondary/40 uppercase tracking-[0.2em] max-w-sm mx-auto mb-12 leading-relaxed">You haven't saved any treasures to your vault yet. Start exploring our elite collections.</p>
                                <Link to="/category/all" className="bg-rose-500 text-white px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-rose-200 inline-block uppercase">Add Favorites</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
                                {wishlist.map((product) => (
                                    <div key={product.id} className="group flex flex-col gap-6 relative">
                                        <div className="aspect-[3/4] bg-white rounded-[3rem] border border-slate-100 overflow-hidden relative shadow-sm group-hover:shadow-3xl transition-all duration-700">
                                            <Link to={`/product/${product.id}`} className="block h-full w-full">
                                                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                            </Link>
                                            <button 
                                                onClick={() => toggleWishlist(product)}
                                                className="absolute top-8 right-8 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 shadow-xl z-20 hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Heart size={20} fill="currentColor" />
                                            </button>
                                            <div className="absolute inset-x-8 bottom-8 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 z-10">
                                                <button 
                                                    onClick={() => addToCart(product)}
                                                    className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-primary flex items-center justify-center gap-3 transition-all"
                                                >
                                                    <Plus size={16} /> Add to Bag
                                                </button>
                                            </div>
                                        </div>
                                        <div className="px-4 space-y-2">
                                            <h3 className="text-sm font-black text-secondary uppercase tracking-tight truncate">{product.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xl font-black text-secondary font-heading">₹{product.price.toLocaleString()}</p>
                                                <Link to={`/product/${product.id}`} className="text-[9px] font-black text-secondary/30 uppercase tracking-widest hover:text-primary transition-colors">Details <ChevronRight size={10} className="inline ml-1" /></Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
};

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default MyOrders;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, ShieldCheck, MapPin, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../dataService';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    address: '',
    paymentMode: 'cod'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate('/');
    }
  }, [items, success, navigate]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const orderData = {
      customer_name: formData.name,
      customer_email: user?.email || '',
      customer_phone: formData.phone,
      total_amount: totalPrice,
      status: 'pending',
      items: items.map(i => ({ 
        id: i.id, 
        name: i.name, 
        quantity: i.quantity, 
        price: i.rawPrice,
        img: i.img,
        category: i.category
      })),
      address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      payment_method: formData.paymentMode
    };

    // Replace with real Supabase call
    const { error } = await dataService.saveOrder?.(orderData) || { error: null };
    
    setLoading(false);
    if (error) {
       alert(error.message || "Failed to place order");
    } else {
       setSuccess(true);
       clearCart();
       window.scrollTo(0, 0);
    }
  };

  if (success) {
     return (
       <div className="min-h-screen bg-white">
          <TopBar />
          <Navbar />
          <div className="container py-32 flex flex-col items-center justify-center text-center">
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-200"
             >
                <CheckCircle2 size={48} />
             </motion.div>
             <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase mb-4 font-heading">Order Placed Successfully!</h2>
             <p className="text-sm font-bold text-secondary/40 uppercase tracking-widest max-w-sm mb-12">Thank you for shopping with DigyDukaan. We've received your order and will start processing it shortly.</p>
             <Link 
               to="/"
               className="bg-secondary text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-secondary/20"
             >
                Continue Shopping
             </Link>
          </div>
          <Footer />
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <TopBar />
      <Navbar />

      <div className="container py-12">
        <div className="flex items-center gap-4 mb-12">
           <Link to="/" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-secondary/40 hover:text-primary transition-all">
              <ArrowLeft size={18} />
           </Link>
           <div>
              <h1 className="text-2xl font-black text-secondary uppercase tracking-tighter font-heading leading-tight">Checkout</h1>
              <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Complete your purchase</p>
           </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Shipping Details */}
          <div className="lg:col-span-8 space-y-8">
             <section className="bg-white rounded-[2rem] p-8 md:p-12 border border-secondary/5 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <MapPin size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-secondary uppercase tracking-tighter">Shipping Address</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-5 px-6 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-5 px-6 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
                      />
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Building / House Number / Area</label>
                      <input 
                        required
                        type="text" 
                        placeholder="House no, Street name, Near Landmark"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-5 px-6 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Pincode</label>
                      <input 
                        required
                        type="text" 
                        placeholder="6-digit ZIP code"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-5 px-6 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">City</label>
                         <input 
                           required
                           type="text" 
                           placeholder="e.g. Bangalore"
                           value={formData.city}
                           onChange={(e) => setFormData({...formData, city: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-5 px-4 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">State</label>
                         <input 
                           required
                           type="text" 
                           placeholder="e.g. Karnataka"
                           value={formData.state}
                           onChange={(e) => setFormData({...formData, state: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-5 px-4 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 ring-primary/5 transition-all outline-none"
                         />
                      </div>
                   </div>
                </div>
             </section>

             <section className="bg-white rounded-[2rem] p-8 md:p-12 border border-secondary/5 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <CreditCard size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-secondary uppercase tracking-tighter">Payment Mode</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div 
                     onClick={() => setFormData({...formData, paymentMode: 'cod'})}
                     className={cn(
                       "relative p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3",
                       formData.paymentMode === 'cod' ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                     )}
                   >
                       <div className="flex justify-between items-center">
                          <CheckCircle2 size={24} className={formData.paymentMode === 'cod' ? "text-primary opacity-100" : "text-slate-200 opacity-0"} />
                          <div className={cn("w-6 h-6 border-2 rounded-full", formData.paymentMode === 'cod' ? "bg-primary border-primary" : "border-slate-200")} />
                       </div>
                       <h4 className="font-black text-secondary uppercase tracking-widest text-xs">Cash on Delivery</h4>
                       <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest">Pay when items arrive</p>
                   </div>
                   
                   <div 
                     onClick={() => setFormData({...formData, paymentMode: 'online'})}
                     className={cn(
                       "relative p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3 opacity-50",
                       formData.paymentMode === 'online' ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50"
                     )}
                   >
                       <div className="flex justify-between items-center">
                          <CreditCard size={24} className="text-slate-300" />
                          <div className="w-6 h-6 border-2 rounded-full border-slate-200" />
                       </div>
                       <h4 className="font-black text-secondary uppercase tracking-widest text-xs">Online Payment</h4>
                       <p className="text-[9px] font-black text-primary uppercase tracking-widest">Opening Soon</p>
                   </div>
                </div>
             </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-secondary text-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-secondary/30 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                
                <h3 className="text-lg font-black uppercase tracking-tighter mb-8 relative z-10 font-heading">Order Summary</h3>
                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 relative z-10">
                   {items.map(item => (
                      <div key={item.id} className="flex gap-4">
                         <div className="w-16 h-20 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={item.img} className="w-full h-full object-cover opacity-80" />
                         </div>
                         <div className="flex-1 flex flex-col justify-center">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[120px]">{item.name}</h4>
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Qty: {item.quantity}</p>
                            <p className="text-xs font-black">₹{(item.rawPrice * item.quantity).toLocaleString()}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10 relative z-10">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span>Delivery Fee</span>
                      <span className="text-green-400">FREE</span>
                   </div>
                   <div className="flex justify-between text-2xl font-black uppercase tracking-tighter pt-4">
                      <span>Total</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 mt-10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                   {loading ? <Loader2 className="animate-spin" size={18} /> : (
                      <>Place Order <CheckCircle2 size={18} /></>
                   )}
                </button>

                <div className="flex items-center justify-center gap-3 mt-6 text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                   <ShieldCheck size={14} /> Secure Checkout Protected
                </div>
             </div>

             <div className="p-6 bg-slate-50 rounded-[2rem] border border-secondary/5">
                <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Truck size={14} className="text-primary" /> Delivery Information
                </h4>
                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest leading-relaxed">
                   Average delivery time for your area: **3 to 5 business days**. We will send a confirmation SMS to your number once shipped.
                </p>
             </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;

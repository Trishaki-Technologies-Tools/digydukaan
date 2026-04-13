import { useState, useEffect } from 'react';
import { Heart, Ticket, Headset, History, ChevronRight, LogOut, Settings, Package, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    setHistory(savedHistory);
  }, []);

  if (!user) {
    // This page should ideally be protected or redirect to home with auth modal open
    window.location.href = '/';
    return null;
  }

  const accountCards = [
    { id: 'orders', title: 'My Orders', icon: <Package className="text-blue-500" />, desc: 'Track & View History', path: '/orders' },
    { id: 'wishlist', title: 'Wishlist', icon: <Heart className="text-rose-500" />, desc: 'Saved for later', path: '/wishlist' },
    { id: 'coupons', title: 'Coupons', icon: <Ticket className="text-amber-500" />, desc: 'Available Rewards', path: '#' },
    { id: 'help', title: 'Support', icon: <Headset className="text-emerald-500" />, desc: 'Help & Contact', path: '#' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />

      <main className="container max-w-lg mx-auto px-6 pt-8">
        {/* User Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-secondary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-secondary/20 mb-10"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[80px] rounded-full translate-x-10 -translate-y-10"></div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-4xl font-black uppercase mb-6 shadow-2xl">
               {user.full_name?.[0] || 'M'}
            </div>
            <div className="space-y-2">
               <div className="flex items-center justify-center gap-2">
                  <h1 className="text-2xl font-black uppercase tracking-tight">{user.full_name || 'Premium Member'}</h1>
                  <ShieldCheck size={20} className="text-primary" />
               </div>
               <p className="text-sm font-bold text-white/40 tracking-[0.3em] uppercase">{user.phone}</p>
            </div>

            <div className="flex gap-3 mt-8">
               <div className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Status</span>
                  <span className="text-[10px] font-black uppercase text-primary">Verified</span>
               </div>
               <div className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Tier</span>
                  <span className="text-[10px] font-black uppercase text-amber-400">Gold</span>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {accountCards.map((card, idx) => (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={card.id}
              onClick={() => navigate(card.path)}
              className="flex flex-col items-center p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 transition-all active:scale-95 text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                {card.icon}
              </div>
              <p className="text-[11px] font-black text-secondary uppercase tracking-widest mb-1">{card.title}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter leading-tight opacity-60">{card.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Recently Viewed */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6 px-2">
             <div className="flex flex-col">
                <h2 className="text-[11px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Vault History</h2>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Recently Viewed Products</p>
             </div>
             <button 
                onClick={() => { localStorage.removeItem('recently_viewed'); setHistory([]); }}
                className="text-[9px] font-black text-primary uppercase underline underline-offset-4 tracking-widest"
             >
                Clear
             </button>
          </div>
          
          {history.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar snap-x">
               {history.map((p) => (
                  <button 
                    key={p.id} 
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="min-w-[160px] text-left snap-start bg-slate-50/30 rounded-[2rem] p-4 border border-slate-100/50 group"
                  >
                     <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-4 border border-slate-100/50 flex items-center justify-center relative">
                        <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-secondary/10 opacity-0 group-active:opacity-100 transition-opacity" />
                     </div>
                     <div className="px-1">
                        <p className="text-[9px] font-black text-secondary uppercase truncate leading-none mb-1">{p.name}</p>
                        <p className="text-[10px] font-black text-primary">₹{Number(p.price).toLocaleString()}</p>
                     </div>
                  </button>
               ))}
            </div>
          ) : (
            <div className="p-10 bg-slate-50 rounded-[2rem] border border-slate-100/50 text-center">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                  <History size={20} className="text-slate-200" />
               </div>
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No history recorded in vault.</p>
            </div>
          )}
        </section>

        {/* Settings & Logout */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
           <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all border-b border-slate-50 group">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-secondary transition-colors">
                    <Settings size={18} />
                 </div>
                 <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Account Settings</span>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
           </button>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-between p-6 hover:bg-rose-50 transition-all group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-300 flex items-center justify-center group-hover:text-rose-500 transition-colors">
                    <LogOut size={18} />
                 </div>
                 <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Logout Session</span>
              </div>
              <ChevronRight size={14} className="text-rose-200" />
           </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;

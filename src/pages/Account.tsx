import { useState, useEffect } from 'react';
import { 
  Heart, 
  Ticket, 
  Headset, 
  History, 
  ChevronRight, 
  LogOut, 
  Settings, 
  Package, 
  ShieldCheck,
  User as UserIcon,
  Mail,
  Smartphone,
  MapPin,
  Map,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { dataService } from '../dataService';

const Account = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const { user, logout, setUser } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('hub'); // hub, details
  const [profile, setProfile] = useState<any>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAddr, setNewAddr] = useState({
     address: '',
     city: '',
     state: '',
     pincode: ''
  });

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [user]);

  const refreshProfile = async () => {
    if (user?.phone) {
       const data = await dataService.getProfile(user.phone);
       setProfile(data);
       if (data) {
          setFullName(data.full_name || data.customer_name || '');
          setEmail(data.customer_email || data.email || '');
       }
    }
  };

  const handleSaveProfile = async () => {
     if (!user?.phone) return;
     
     setLoading(true);
     const updates: any = {
        full_name: fullName
     };
     
     // Only try to update email if we're sure about the column or using the one that's likely there
     // Based on Customers dashboard, it might be customer_email
     if (email) {
        updates.customer_email = email;
     }
     
     const { data, error } = await dataService.updateProfile(user.phone, updates);
     
     if (error) {
        console.error("Update error:", error);
        alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
     } else if (data && data[0]) {
        setProfile(data[0]);
        // Sync with Auth Context - Ensure we update the context with the new data
        setUser(data[0]);
        alert("Profile updated successfully!");
     }
     setLoading(false);
  };

  const handleRemoveAddress = async () => {
     if (!window.confirm("Remove this address from your vault?")) return;
     if (user?.phone) {
        setLoading(true);
        await dataService.updateProfile(user.phone, {
           address: null,
           city: null,
           state: null,
           pincode: null
        });
        await refreshProfile();
        setLoading(false);
     }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
     e.preventDefault();
     if (user?.phone) {
        setLoading(true);
        await dataService.updateProfile(user.phone, {
           address: newAddr.address,
           city: newAddr.city,
           state: newAddr.state,
           pincode: newAddr.pincode
        });
        await refreshProfile();
        setIsAddingAddress(false);
        setNewAddr({ address: '', city: '', state: '', pincode: '' });
        setLoading(false);
     }
  };

  if (!user) {
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

  const currentProfile = profile || user;

  return (
    <div className="min-h-screen bg-slate-50/30 pb-32">
      <Navbar />

      <main className="container max-w-2xl mx-auto px-4 md:px-6 pt-8">
        {/* Navigation Tabs (Desktop only) */}
        <div className="hidden md:flex items-center gap-8 mb-10 border-b border-slate-100">
           <button 
             onClick={() => setActiveTab('hub')}
             className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'hub' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           >
              Account Hub
              {activeTab === 'hub' && <motion.div layoutId="accTab" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full" />}
           </button>
           <button 
             onClick={() => setActiveTab('details')}
             className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'details' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           >
              Profile Details
              {activeTab === 'details' && <motion.div layoutId="accTab" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full" />}
           </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'hub' ? (
            <motion.div 
              key="hub"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              {/* User Profile Header */}
              <div className="relative overflow-hidden bg-secondary rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-secondary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full translate-x-20 -translate-y-20"></div>
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="w-28 h-28 rounded-[2.2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-5xl font-black uppercase shadow-2xl shrink-0">
                    {currentProfile.full_name?.[0] || 'M'}
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                        <h1 className="text-3xl font-black uppercase tracking-tighter">{currentProfile.full_name || 'Premium Member'}</h1>
                        <ShieldCheck size={24} className="text-primary" />
                      </div>
                      <p className="text-xs font-bold text-white/40 tracking-[0.4em] uppercase">{currentProfile.full_name ? 'Secured Profile' : currentProfile.phone}</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                       <div className="px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Member Since</span>
                          <span className="text-[11px] font-black text-white/80 uppercase">Apr 2026</span>
                       </div>
                       <div className="px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Total Orders</span>
                          <span className="text-[11px] font-black text-white/80 uppercase">04</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {accountCards.map((card, idx) => (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={card.id}
                    onClick={() => navigate(card.path)}
                    className="flex flex-col items-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 text-center group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 transition-all group-hover:scale-110">
                      {card.icon}
                    </div>
                    <p className="text-[11px] font-black text-secondary uppercase tracking-widest mb-1">{card.title}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter leading-tight opacity-60">{card.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Recently Viewed */}
              <section>
                <div className="flex justify-between items-end mb-8 px-2">
                   <div className="flex flex-col">
                      <h2 className="text-[12px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Vault Collection</h2>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Your Browsing History</p>
                   </div>
                   <button 
                      onClick={() => { localStorage.removeItem('recently_viewed'); setHistory([]); }}
                      className="text-[10px] font-black text-primary uppercase underline underline-offset-4 tracking-widest hover:text-primary/70 transition-colors"
                   >
                      Purge History
                   </button>
                </div>
                
                {history.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     {history.slice(0, 6).map((p) => (
                        <button 
                          key={p.id} 
                          onClick={() => navigate(`/product/${p.id}`)}
                          className="text-left bg-white rounded-[2.2rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                        >
                           <div className="aspect-square bg-slate-50/50 rounded-2xl overflow-hidden mb-4 flex items-center justify-center relative" style={{ background: '#F8F9FA' }}>
                              <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <div className="px-1">
                              <p className="text-[10px] font-black text-secondary uppercase truncate leading-none mb-1.5">{p.name}</p>
                              <p className="text-[11px] font-black text-primary tracking-tight">₹{Number(p.price).toLocaleString()}</p>
                           </div>
                        </button>
                     ))}
                  </div>
                ) : (
                  <div className="p-16 bg-white rounded-[2.5rem] border border-slate-50 text-center shadow-inner">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <History size={24} className="text-slate-200" />
                     </div>
                     <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Your discovery history is empty.</p>
                  </div>
                )}
              </section>

              {/* Mobile View Profile Details Button */}
              <div className="md:hidden">
                 <button 
                   onClick={() => setActiveTab('details')}
                   className="w-full flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <UserIcon size={20} />
                       </div>
                       <div className="text-left">
                          <p className="text-xs font-black text-secondary uppercase tracking-widest">Personal Details</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Manage Profile & Addresses</p>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                 </button>
              </div>

              {/* Settings & Logout */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all border-b border-slate-50 group">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-secondary transition-colors">
                          <Settings size={18} />
                       </div>
                       <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Security Settings</span>
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
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               {/* Profile Info Card */}
               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                     <div className="text-left">
                        <h3 className="text-[13px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Personal Profile</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Primary Account Identity</p>
                     </div>
                     <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm">
                        <UserIcon size={22} />
                     </div>
                  </div>
                  <div className="p-8 md:p-12 space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Full Name</label>
                           <div className="flex items-center gap-5 px-7 py-5 bg-white border-2 border-slate-100 rounded-[1.5rem] shadow-sm focus-within:border-primary/40 focus-within:shadow-xl focus-within:shadow-primary/5 transition-all group">
                              <UserIcon size={20} className="text-slate-300 group-focus-within:text-primary transition-colors" />
                              <input 
                                 type="text" 
                                 value={fullName}
                                 onChange={(e) => setFullName(e.target.value)}
                                 placeholder="Enter your name"
                                 className="bg-transparent border-none text-[15px] font-bold text-secondary focus:outline-none w-full placeholder:text-slate-300"
                              />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Mobile Identity</label>
                           <div className="flex items-center gap-5 px-7 py-5 bg-slate-50/80 border-2 border-slate-100/50 rounded-[1.5rem] relative group">
                              <Smartphone size={20} className="text-slate-300" />
                              <input 
                                 type="text" 
                                 value={currentProfile.phone} 
                                 readOnly 
                                 className="bg-transparent border-none text-[15px] font-bold text-slate-400 focus:outline-none w-full cursor-not-allowed"
                              />
                              <div className="absolute top-1/2 -translate-y-1/2 right-6 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                 Verified
                              </div>
                           </div>
                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <ShieldCheck size={12} className="text-emerald-400" /> Secure Gateway Connection
                           </p>
                        </div>
                     </div>

                     <div className="space-y-4 text-left">
                        <label className="text-[11px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Email Connection (Optional)</label>
                        <div className="flex items-center gap-5 px-7 py-5 bg-white border-2 border-slate-100 rounded-[1.5rem] shadow-sm focus-within:border-primary/40 focus-within:shadow-xl focus-within:shadow-primary/5 transition-all group">
                           <Mail size={20} className="text-slate-300 group-focus-within:text-primary transition-colors" />
                           <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Add email for reports & invoices" 
                              className="bg-transparent border-none text-[15px] font-bold text-secondary focus:outline-none w-full placeholder:text-slate-300"
                           />
                        </div>
                     </div>

                     <button 
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-primary text-white w-full py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Profile Changes'}
                     </button>
                  </div>
               </div>

               {/* Addresses Card */}
               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                     <div className="text-left">
                        <h3 className="text-[12px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Stored Addresses</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Saved Shipping Locations</p>
                     </div>
                     {!isAddingAddress && (
                        <button 
                           onClick={() => setIsAddingAddress(true)}
                           className="flex items-center gap-2 bg-slate-50 text-secondary px-6 py-3 rounded-xl border border-slate-100 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all group"
                        >
                           <Plus size={14} className="text-primary group-hover:scale-125 transition-transform" /> Add New
                        </button>
                     )}
                  </div>
                  
                  <div className="p-8">
                     <AnimatePresence mode="wait">
                        {isAddingAddress ? (
                           <motion.form 
                              key="add-form"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              onSubmit={handleAddAddress}
                              className="space-y-6 mb-4 text-left"
                           >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <input 
                                    required
                                    placeholder="House No, Street Area"
                                    value={newAddr.address}
                                    onChange={e => setNewAddr({...newAddr, address: e.target.value})}
                                    className="md:col-span-2 w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-xl py-4 px-5 text-xs font-bold outline-none transition-all"
                                 />
                                 <input 
                                    required
                                    placeholder="City"
                                    value={newAddr.city}
                                    onChange={e => setNewAddr({...newAddr, city: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-xl py-4 px-5 text-xs font-bold outline-none transition-all"
                                 />
                                 <input 
                                    required
                                    placeholder="Pincode"
                                    value={newAddr.pincode}
                                    onChange={e => setNewAddr({...newAddr, pincode: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-xl py-4 px-5 text-xs font-bold outline-none transition-all"
                                 />
                              </div>
                              <div className="flex gap-4">
                                 <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-secondary text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                 >
                                    {loading ? <Loader2 className="animate-spin" size={14} /> : <><CheckCircle2 size={14} /> Confirm Address</>}
                                 </button>
                                 <button 
                                    type="button"
                                    onClick={() => setIsAddingAddress(false)}
                                    className="px-6 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center"
                                 >
                                    <X size={20} />
                                 </button>
                              </div>
                           </motion.form>
                        ) : currentProfile.address ? (
                           <motion.div 
                              key="address-card"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="bg-slate-50/50 rounded-[2.2rem] p-8 border border-slate-100 relative group text-left"
                           >
                              <div className="absolute top-8 right-8 flex items-center gap-3">
                                 <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-200/50">
                                    Primary
                                 </div>
                                 <button 
                                    onClick={handleRemoveAddress}
                                    disabled={loading}
                                    className="p-2.5 bg-rose-50 text-rose-300 hover:text-rose-500 hover:bg-rose-100 rounded-xl transition-all border border-rose-100/50"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                              <div className="flex items-start gap-6 mb-8">
                                 <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary shrink-0 border border-slate-100">
                                    <MapPin size={24} />
                                 </div>
                                 <div className="pt-1 pr-24">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                       <Map size={12} /> {currentProfile.city || 'Profile Location'}
                                    </p>
                                    <h4 className="text-base font-black text-secondary uppercase tracking-tight leading-tight">
                                       {currentProfile.address},<br />
                                       {currentProfile.city}, {currentProfile.state} - {currentProfile.pincode}
                                    </h4>
                                 </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-8 border-t border-slate-100 pt-7">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                       <Smartphone size={14} />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{currentProfile.phone}</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-400">
                                       <ShieldCheck size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Forwarding</span>
                                 </div>
                              </div>
                           </motion.div>
                        ) : (
                           <motion.button 
                              key="empty-state"
                              onClick={() => setIsAddingAddress(true)}
                              className="w-full py-20 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-5 group hover:bg-slate-50 transition-all text-center"
                           >
                              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm border border-slate-50">
                                 <MapPin size={32} />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Shipping Vault Empty</p>
                                 <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Tap to establish delivery protocol</p>
                              </div>
                           </motion.button>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} />
    </div>
  );
};

export default Account;

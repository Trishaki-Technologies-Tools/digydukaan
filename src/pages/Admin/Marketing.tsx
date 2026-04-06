import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Ticket, 
  Gift, 
  Image as ImageIcon, 
  Search, 
  TrendingUp, 
  ChevronRight,
  Trash2,
  Edit2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../../dataService';

const Marketing = () => {
  const navigate = useNavigate();
  const { type = 'Coupons' } = useParams();
  const currentTab = type.charAt(0).toUpperCase() + type.slice(1);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Coupons', 'Offers', 'Banners'];

  useEffect(() => {
    if (currentTab === 'Banners') {
       const fetchBanners = async () => {
          setLoading(true);
          const data = await dataService.getBanners();
          setBanners(data);
          setLoading(false);
       };
       fetchBanners();
    } else {
       setLoading(false);
    }
  }, [currentTab]);

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Promotions</span>
                 <ChevronRight size={10} className="text-slate-300" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Marketing Suite</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">Marketing</h1>
           </div>
           
           <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
              <Plus size={16} /> 
              Create {currentTab.slice(0, -1)}
           </button>
        </header>

        {/* Tab Selection */}
        <div className="flex items-center gap-8 mb-10 border-b border-slate-200">
           {tabs.map((tab) => (
             <button
                key={tab}
                onClick={() => navigate(`/admin/marketing/${tab.toLowerCase()}`)}
                className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all relative ${
                  currentTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                }`}
             >
                {tab}
                {currentTab === tab && (
                  <motion.div layoutId="marketTab" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full" />
                )}
             </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
           <motion.div
             key={currentTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
           >
              {currentTab === 'Coupons' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                       <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Coupon ROI Tracking</p>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Syncing...</h3>
                       </div>
                    </div>
                    <div className="p-20 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                       <Ticket size={40} className="mx-auto text-slate-100 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No active coupons in database</p>
                    </div>
                </div>
              )}

              {currentTab === 'Offers' && (
                <div className="p-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <Gift size={40} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronized offers will appear here</p>
                </div>
              )}

              {currentTab === 'Banners' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {loading ? (
                     <div className="col-span-full py-20 text-center">
                        <ImageIcon size={40} className="mx-auto text-slate-100 animate-pulse mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Retrieving Visual Assets...</p>
                     </div>
                   ) : banners.map(banner => (
                     <div key={banner.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
                        <div className="h-48 overflow-hidden relative bg-slate-50">
                           <img src={banner.img} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                           <div className="absolute top-4 right-4 flex gap-2">
                              <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-all"><Edit2 size={16} /></button>
                              <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all"><Trash2 size={16} /></button>
                           </div>
                        </div>
                        <div className="p-8 flex items-center justify-between">
                           <div>
                              <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase">{banner.title}</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Placement: Active Promo Row</p>
                           </div>
                           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                              <ImageIcon size={20} />
                           </div>
                        </div>
                     </div>
                   ))}
                   {!loading && (
                     <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center hover:bg-slate-50 cursor-pointer transition-all">
                        <Plus size={32} className="text-slate-200 mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Add New Marketing Banner</p>
                     </div>
                   )}
                </div>
              )}
           </motion.div>
        </AnimatePresence>
    </div>
  );
};

export default Marketing;

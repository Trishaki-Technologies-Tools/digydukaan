import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Search, 
  MoreVertical, 
  Plus, 
  Star, 
  ChevronRight,
  ShieldCheck,
  Ban,
  MessageSquare,
  TrendingUp,
  Briefcase,
  Mail,
  MapPin
} from 'lucide-react';
import { dataService } from '../../dataService';

const Vendors = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
       setLoading(true);
       const data = await dataService.getVendors();
       setVendors(Array.isArray(data) ? data : []);
       setLoading(false);
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(vendor => {
     const name = vendor.name || '';
     const email = vendor.email || '';
     const term = searchTerm.toLowerCase();
     return name.toLowerCase().includes(term) || email.toLowerCase().includes(term);
  });

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Marketplace</span>
                 <ChevronRight size={10} className="text-slate-300" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Vendor Partners</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">Vendors</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="flex items-center justify-center gap-2 bg-white text-slate-600 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-95">
                 <Briefcase size={16} /> 
                 Vendor Agreements
              </button>
              <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                 <Plus size={16} /> 
                 Onboard Vendor
              </button>
           </div>
        </header>

        {/* Vendor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                    <Store size={22} />
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md tracking-widest">Growth +2</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Active Vendors</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">{vendors.length} Partners</h3>
           </div>
           
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <TrendingUp size={22} />
                 </div>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Avg. Monthly Commission</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">₹1,44,200</h3>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                    <ShieldCheck size={22} />
                 </div>
              </div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Pending Applications</p>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase font-heading relative z-10">07 Pending</h3>
           </div>
        </div>

        {/* Vendor Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
           <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96 group">
                 < Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by Store Name or Email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold transition-all focus:ring-4 focus:ring-primary/5" 
                 />
              </div>
              <button className="text-[10px] font-black text-slate-400 bg-slate-50 px-6 py-4 rounded-2xl hover:text-slate-900 transition-all uppercase tracking-widest shadow-sm">Merchant Tier Filters</button>
           </div>

           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50/30 border-b border-slate-50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rating</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                   <tr>
                     <td colSpan={5} className="px-8 py-20 text-center text-slate-200">
                        <Store size={40} className="mx-auto animate-pulse mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Authenticating Marketplace Data...</p>
                     </td>
                   </tr>
                 ) : filteredVendors.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-8 py-20 text-center text-slate-300">
                        <p className="text-[10px] font-black uppercase tracking-widest">No vendors found matching your search.</p>
                     </td>
                   </tr>
                 ) : filteredVendors.map((vendor, i) => (
                   <motion.tr 
                     key={vendor.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                   >
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                               <Store size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 tracking-tighter mb-0.5">{vendor.name}</p>
                               <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                  <MapPin size={10} /> <span className="text-[10px] font-bold uppercase tracking-widest">{vendor.location || 'Remote'}</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-900 leading-none flex items-center gap-2">
                               <Mail size={12} className="text-slate-300" /> {vendor.email}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Since {new Date(vendor.created_at).getFullYear()}</p>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex items-center justify-center gap-1 text-amber-500">
                            <Star size={12} fill="currentColor" />
                            <span className="text-sm font-black">{vendor.rating || '4.5'}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           vendor.status === 'Active' ? 'text-emerald-500 bg-emerald-50' : 
                           vendor.status === 'Pending' ? 'text-amber-500 bg-amber-50' : 
                           'text-red-500 bg-red-50'
                         }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                               vendor.status === 'Active' ? 'bg-emerald-500' : 
                               vendor.status === 'Pending' ? 'bg-amber-500' : 
                               'bg-red-500'
                            }`}></div>
                            {vendor.status}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-end gap-2 text-slate-400 transition-all">
                            <button className="p-3 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="Message Vendor">
                               <MessageSquare size={16} />
                            </button>
                            <button className="p-3 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Suspend Vendor">
                               <Ban size={16} />
                            </button>
                            <button className="p-3 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                               <MoreVertical size={16} />
                            </button>
                         </div>
                      </td>
                   </motion.tr>
                 ))}
              </tbody>
           </table>
        </div>
    </div>
  );
};

export default Vendors;

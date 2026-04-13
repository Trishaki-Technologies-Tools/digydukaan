import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Filter,
  Download,
  Users,
  Activity,
  Star,
  Ban
} from 'lucide-react';
import { dataService } from '../../dataService';

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
       setLoading(true);
       const data = await dataService.getCustomers();
       setCustomers(data);
       setLoading(false);
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
     const name = customer.customer_name || 'Guest';
     return name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Management</span>
                 <ChevronRight size={10} className="text-slate-300" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Customers</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">Customer Base</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="flex items-center justify-center gap-2 bg-white text-slate-600 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-95">
                 <Download size={16} /> 
                 Export CSV
              </button>
              <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                 <UserPlus size={16} /> 
                 Add New
              </button>
           </div>
        </header>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Users size={22} />
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md tracking-widest">+12% Growth</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Registered Customers</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">{customers.length}</h3>
           </div>
           
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Activity size={22} />
                 </div>
                 <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-md tracking-widest">Live Now</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Customers (Today)</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">{Math.round(customers.length * 0.1)}</h3>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-lg border border-primary/20">
                    <Star size={22} />
                 </div>
              </div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Avg. Customer lifetime Value</p>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase font-heading relative z-10">₹14,250</h3>
           </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
           <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by name, email or mobile..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold transition-all focus:ring-4 focus:ring-primary/5" 
                 />
              </div>
              <button className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 text-slate-500 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-all">
                 <Filter size={14} /> Advanced Filter
              </button>
           </div>

           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50/30 border-b border-slate-50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Location</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                   <tr>
                     <td colSpan={4} className="px-8 py-20 text-center text-slate-200">
                        <Users size={40} className="mx-auto animate-pulse mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Syncing Profiles From Database...</p>
                     </td>
                   </tr>
                 ) : filteredCustomers.map((customer, i) => (
                   <motion.tr 
                     key={customer.id || customer.customer_email || i}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                   >
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.customer_name}`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 tracking-tighter mb-0.5">{customer.customer_name || 'Anonymous User'}</p>
                               <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                  <Activity size={10} className="text-primary" /> <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Regular Buyer</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                               <Mail size={12} /> <span className="text-[11px] font-bold tracking-tight">{customer.customer_email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors font-bold opacity-30 group-hover:opacity-100">
                               <Phone size={12} /> <span className="text-[11px]">Primary Contact Shared</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex items-center justify-center gap-2 text-slate-400">
                            <MapPin size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Global Order</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-end gap-2">
                            <button className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl border border-slate-50 transition-all">
                               <Mail size={16} />
                            </button>
                            <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-50 transition-all" title="Block Customer">
                               <Ban size={16} />
                            </button>
                            <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-50 transition-all">
                               <MoreVertical size={16} />
                            </button>
                         </div>
                      </td>
                   </motion.tr>
                 ))}
              </tbody>
           </table>

           {!loading && filteredCustomers.length === 0 && (
             <div className="p-20 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                   <Users size={40} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No customers found</h3>
                <p className="text-sm text-slate-400 font-medium mt-2">Try adjusting your filters or search term.</p>
             </div>
           )}
        </div>
    </div>
  );
};

export default Customers;

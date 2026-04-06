import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Download, 
  ShieldCheck, 
  Wallet, 
  ChevronRight,
  MoreVertical,
  Banknote,
  RefreshCcw,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { dataService } from '../../dataService';

const Payments = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTxns = async () => {
       setLoading(true);
       const data = await dataService.getOrders();
       setTransactions(data);
       setLoading(false);
    };
    fetchTxns();
  }, []);

  const totalRevenue = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
  const pendingSettlements = transactions.filter(t => t.status === 'Pending').reduce((acc, t) => acc + Number(t.amount), 0);

  const filteredTransactions = transactions.filter(t => {
     return (t.id && t.id.toLowerCase().includes(searchTerm.toLowerCase())) || (t.customer_name && t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Finance</span>
                 <ChevronRight size={10} className="text-slate-300" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Payments & Settlements</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">Payments</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="flex items-center justify-center gap-2 bg-white text-slate-600 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-95">
                 <Download size={16} /> 
                 Payout History
              </button>
              <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                 <Zap size={16} /> 
                 Instant Payout
              </button>
           </div>
        </header>

        {/* Settlement Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <Wallet size={22} />
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md tracking-widest">Available</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue Collected</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">₹{totalRevenue.toLocaleString()}</h3>
           </div>
           
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <Banknote size={22} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md tracking-widest">In Pipeline</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending Settlements</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">₹{pendingSettlements.toLocaleString()}</h3>
           </div>

           <div className="bg-emerald-500 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                    <ShieldCheck size={22} />
                 </div>
              </div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Verification Status</p>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase font-heading relative z-10">Merchant Verified</h3>
           </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
           <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by Transaction ID or Customer..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold transition-all focus:ring-4 focus:ring-primary/5" 
                 />
              </div>
              <div className="flex items-center gap-2">
                 <button className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-3 rounded-xl hover:text-slate-900 transition-all uppercase tracking-widest">Settlement Settings</button>
              </div>
           </div>

           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50/30 border-b border-slate-50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Info</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Ref</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                   <tr>
                     <td colSpan={6} className="px-8 py-20 text-center">
                        <ShoppingBag size={40} className="mx-auto text-slate-100 animate-pulse mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Auditing Payment Gateways...</p>
                     </td>
                   </tr>
                 ) : filteredTransactions.map((txn, i) => (
                   <motion.tr 
                     key={txn.id}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                   >
                      <td className="px-8 py-6">
                         <div>
                            <p className="text-sm font-black text-slate-900 tracking-tighter mb-0.5">{txn.id.slice(0, 10).toUpperCase()}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(txn.created_at).toLocaleDateString()}</p>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-xs font-bold text-primary hover:underline cursor-pointer">{txn.customer_name}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-slate-300" />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{txn.payment_method || 'Online'}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <p className="text-sm font-black text-slate-900">₹{Number(txn.amount).toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           txn.status === 'Success' || txn.status === 'Delivered' ? 'text-emerald-500 bg-emerald-50' : 
                           txn.status === 'Pending' ? 'text-amber-500 bg-amber-50' : 
                           'text-red-500 bg-red-50'
                         }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                               txn.status === 'Success' || txn.status === 'Delivered' ? 'bg-emerald-500' : 
                               txn.status === 'Pending' ? 'bg-amber-500' : 
                               'bg-red-500'
                            }`}></div>
                            {txn.status}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-end gap-2">
                            <button className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl border border-slate-100 transition-all" title="Refund Transaction">
                               <RefreshCcw size={16} />
                            </button>
                            <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-100 transition-all">
                               <MoreVertical size={16} />
                            </button>
                         </div>
                      </td>
                   </motion.tr>
                 ))}
              </tbody>
           </table>

           <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
                    <ShieldCheck size={14} />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">All transactions are secured via Supabase SSL protocols</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-6 py-3 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl transition-all">Process All Settlements</button>
              </div>
           </div>
        </div>
    </div>
  );
};

export default Payments;

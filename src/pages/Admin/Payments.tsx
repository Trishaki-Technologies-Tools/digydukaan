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

  const parseAmount = (val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
       const cleaned = val.replace(/[^\d.]/g, '');
       return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  const totalRevenue = transactions.reduce((acc, t) => acc + parseAmount(t.total_amount || t.amount), 0);
  const pendingSettlements = transactions.filter(t => t.status?.toLowerCase() === 'pending').reduce((acc, t) => acc + parseAmount(t.total_amount || t.amount), 0);

  const filteredTransactions = transactions.filter(t => {
      const id = t.id || '';
      const name = t.customer_name || '';
      return id.toLowerCase().includes(searchTerm.toLowerCase()) || name.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
           <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative w-full md:w-[450px] group">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by Transaction ID or Customer..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4.5 pl-14 pr-5 text-xs font-bold transition-all focus:ring-4 focus:ring-primary/5 placeholder:text-slate-300" 
                 />
              </div>
              <div className="flex items-center gap-4">
                 <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 bg-slate-50 px-6 py-4 rounded-xl transition-all uppercase tracking-widest border border-slate-100">Settlement Settings</button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-50">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Reference ID</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[20%]">Customer Info</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Method</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-[15%]">Amount</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Status</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-[20%]">Management</th>
                    </tr>
                 </thead>
                 <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-24 text-center">
                           <ShoppingBag size={48} className="mx-auto text-slate-200 animate-pulse mb-6 opacity-40" />
                           <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Synchronizing Settlement Ledgers...</p>
                        </td>
                      </tr>
                    ) : filteredTransactions.map((txn, i) => (
                      <motion.tr 
                        key={txn.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="group border-b border-slate-50 hover:bg-slate-50/30 transition-all"
                      >
                         <td className="px-8 py-7">
                            <div className="space-y-1">
                               <p className="text-xs font-black text-slate-900 tracking-tight leading-none">#{txn.id?.slice(0, 8).toUpperCase()}</p>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{txn.created_at ? new Date(txn.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending'}</p>
                            </div>
                         </td>
                         <td className="px-8 py-7">
                            <div className="space-y-1">
                               <p className="text-xs font-black text-slate-900 truncate">{txn.customer_name || 'Guest User'}</p>
                               <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Verified Account</p>
                            </div>
                         </td>
                         <td className="px-8 py-7">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                  <CreditCard size={14} />
                               </div>
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{txn.payment_method || 'Online'}</span>
                            </div>
                         </td>
                         <td className="px-8 py-7 text-center">
                            <p className="text-sm font-black text-slate-900 tracking-tighter">₹{parseAmount(txn.total_amount || txn.amount).toLocaleString()}</p>
                         </td>
                         <td className="px-8 py-7">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                              txn.status === 'Success' || txn.status === 'Delivered' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                              txn.status === 'Pending' || txn.status?.toLowerCase() === 'pending' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                              'text-rose-600 bg-rose-50 border-rose-100'
                            }`}>
                               <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                  txn.status === 'Success' || txn.status === 'Delivered' ? 'bg-emerald-500' : 
                                  txn.status === 'Pending' || txn.status?.toLowerCase() === 'pending' ? 'bg-amber-500' : 
                                  'bg-rose-500'
                               }`}></div>
                               {txn.status || 'Processing'}
                            </span>
                         </td>
                         <td className="px-8 py-7">
                            <div className="flex items-center justify-end gap-3">
                               <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:border-primary/20 rounded-xl border border-slate-100 transition-all font-bold text-[9px] uppercase tracking-widest">
                                  <RefreshCcw size={12} /> Refund
                               </button>
                               <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-100 transition-all">
                                  <MoreVertical size={16} />
                               </button>
                            </div>
                         </td>
                      </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/10 gap-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck size={18} />
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Gateway Integrity Secured</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">End-to-End Encryption Active (SSL/TLS 1.3)</p>
                 </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto">
                 <button className="flex-1 md:flex-none px-10 py-4.5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                    Reconcile & Settle All
                 </button>
              </div>
           </div>
        </div>
    </div>
  );
};

export default Payments;

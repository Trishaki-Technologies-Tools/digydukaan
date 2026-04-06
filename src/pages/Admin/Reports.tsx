import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  PieChart,
  Target,
  FileText,
  Download,
  Activity
} from 'lucide-react';
import { dataService } from '../../dataService';

const Reports = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
           setLoading(true);
           const data = await dataService.getOrders();
           setOrders(data);
           setLoading(false);
        };
        fetchReports();
    }, []);

    const netRevenue = orders.reduce((acc, o) => acc + Number(o.amount), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? (netRevenue / totalOrders) : 0;
    
    const mainStats = [
        { title: "Net Revenue", value: `₹${netRevenue.toLocaleString()}`, change: "+14.2%", icon: DollarSign, color: "bg-emerald-500" },
        { title: "Total Orders", value: totalOrders.toString(), change: "+8.4%", icon: ShoppingCart, color: "bg-blue-500" },
        { title: "Conv. Rate", value: "3.2%", change: "-0.5%", icon: Target, shadowColor: "bg-amber-500" },
        { title: "Avg. Order", value: `₹${Math.round(avgOrderValue).toLocaleString()}`, change: "+4.1%", icon: TrendingUp, color: "bg-purple-500" },
    ];

    const reports = [
        { name: "Sales Performance Summary", date: "Mar 2026", type: "Financial", size: "1.2 MB" },
        { name: "Customer Acquisition Report", date: "Feb 2026", type: "Marketing", size: "840 KB" },
        { name: "Inventory Valuation Report", date: "Mar 2026", type: "Inventory", size: "2.4 MB" },
        { name: "GST & Tax Summary", date: "Q1 2026", type: "Taxation", size: "1.1 MB" },
    ];

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Analytics</span>
                 <ChevronRight size={10} className="text-slate-300" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Reports & Insights</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">Reports Center</h1>
           </div>
           
           <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-xl">Today</button>
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Weekly</button>
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Monthly</button>
              <button className="p-2 text-slate-300 hover:text-primary transition-all"><Calendar size={16} /></button>
           </div>
        </header>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {loading ? (
             [1, 2, 3, 4].map(i => (
               <div key={i} className="bg-white p-6 h-32 rounded-[2rem] border border-slate-100 shadow-sm animate-pulse flex flex-col justify-center">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl mb-3"></div>
                  <div className="w-2/3 h-4 bg-slate-50 rounded italic"></div>
               </div>
             ))
           ) : mainStats.map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all"
             >
                <div className="flex items-center justify-between mb-4">
                   <div className={`w-12 h-12 ${stat.color || stat.shadowColor} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon size={20} />
                   </div>
                   <span className={`text-[10px] font-black px-2 py-1 rounded-md ${stat.change.startsWith('+') ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                      {stat.change}
                   </span>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{stat.value}</h3>
                   {stat.change.startsWith('+') ? <ArrowUpRight size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
                </div>
             </motion.div>
           ))}
        </div>

        {/* Charts & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <BarChart3 size={18} className="text-primary" /> Sales Performance Line
                   </h3>
                   <button className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-primary/20 hover:border-primary pb-0.5 transition-all">Download Data</button>
                </div>
                <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-200 mb-4 animate-pulse">
                      <Activity size={32} />
                   </div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Live Analytics Rendering...</p>
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] rounded-full"></div>
               <h3 className="font-black text-white uppercase tracking-tight flex items-center gap-2 relative z-10 mb-8 border-b border-white/5 pb-4">
                  <PieChart size={18} className="text-primary" /> Revenue Capture
               </h3>
               <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/60">
                        <span>Digital Payments</span>
                        <span className="text-white">65%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-primary" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/60">
                        <span>Direct Settlements</span>
                        <span className="text-white">35%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} className="h-full bg-emerald-500" />
                     </div>
                  </div>
               </div>
               <div className="mt-12 text-[10px] font-black uppercase text-white/20 tracking-widest italic">
                  Data synchronized with Supabase
               </div>
            </div>
        </div>

        {/* Actionable Documents List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <header className="px-8 py-6 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                 <FileText size={18} className="text-primary" /> Downloadable Reports
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline cursor-pointer">Export All Data</p>
           </header>
           <div className="divide-y divide-slate-50">
              {reports.map((report, i) => (
                <div key={i} className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                         <FileText size={18} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-900 leading-none mb-1">{report.name}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type: {report.type} • {report.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{report.size}</span>
                      <button className="flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                         <Download size={12} /> Download
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
    </div>
  );
};

export default Reports;

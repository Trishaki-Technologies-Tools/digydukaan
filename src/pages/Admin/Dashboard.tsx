import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
       if (!import.meta.env.VITE_SUPABASE_URL) return;

       const [
         { count: pCount },
         { count: oCount },
         { count: cCount },
         { data: oData }
       ] = await Promise.all([
         supabase.from('products').select('*', { count: 'exact', head: true }),
         supabase.from('orders').select('*', { count: 'exact', head: true }),
         supabase.from('profiles').select('*', { count: 'exact', head: true }), 
         supabase.from('orders').select('*')
       ]);

       const totalRev = oData?.reduce((acc, curr) => acc + Number(curr.total_amount || curr.amount || 0), 0) || 0;

       setCounts({
         products: pCount || 0,
         orders: oCount || 0,
         customers: cCount || 0,
         revenue: totalRev
       });
    };
    fetchStats();
  }, []);

  const stats = [
    { title: "Total Revenue", value: `₹${counts.revenue.toLocaleString()}`, change: "+12.5%", icon: DollarSign, color: "bg-emerald-500" },
    { title: "Active Orders", value: counts.orders.toString(), change: "+8.2%", icon: ShoppingCart, color: "bg-blue-500" },
    { title: "Total Products", value: counts.products.toString(), change: "+2.4%", icon: Package, color: "bg-purple-500" },
    { title: "New Customers", value: counts.customers.toString(), change: "+15.3%", icon: Users, color: "bg-amber-500" },
  ];

  return (
    <div className="p-8 md:p-12">
      <header className="flex items-center justify-between mb-12">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">Dashboard</h1>
              <p className="text-slate-500 text-sm font-medium">Welcome back, Admin. Here's what's happening today.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <p className="text-sm font-bold text-slate-900">Ningaraj</p>
                 <p className="text-[10px] uppercase font-bold text-primary tracking-widest">Store Manager</p>
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ningaraj" alt="Avatar" />
              </div>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {stats.map((stat, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
             >
                <div className="flex items-center justify-between mb-4">
                   <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon size={22} />
                   </div>
                   <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
             </motion.div>
           ))}
        </div>

        {/* Chart Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" /> Sales Overview
                 </h3>
                 <select className="bg-slate-50 border-none rounded-lg text-xs font-bold p-2 focus:ring-2 ring-primary/20">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                 </select>
              </div>
              <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                 <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Chart Visualization Loading...</p>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all"></div>
              <h3 className="font-bold text-lg mb-6 relative z-10">Inventory Alerts</h3>
              <div className="space-y-4 relative z-10">
                 {[1, 2, 3].map((_, i) => (
                   <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                         <Package size={16} className="text-amber-500" />
                      </div>
                      <div>
                         <p className="text-xs font-bold">Premium Silk Saree</p>
                         <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Only 4 left</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 bg-white text-slate-900 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                 Restock All
              </button>
           </div>
        </div>
    </div>
  );
};

export default AdminDashboard;

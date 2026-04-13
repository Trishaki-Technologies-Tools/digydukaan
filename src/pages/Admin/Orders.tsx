/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Undo2, 
  Eye, 
  Printer, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  Truck,
  Package,
  XCircle,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Mail,
  Smartphone,
  MapPin,
  Calendar,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../dataService';

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getColors = () => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'processing': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'shipped': return 'text-purple-500 bg-purple-50 border-purple-100';
      case 'delivered': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'returned': return 'text-slate-500 bg-slate-50 border-slate-100';
      case 'cancelled': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getIcon = () => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={12} />;
      case 'processing': return <RefreshCcw size={12} className="animate-spin-slow" />;
      case 'shipped': return <Truck size={12} />;
      case 'delivered': return <CheckCircle2 size={12} />;
      case 'returned': return <Undo2 size={12} />;
      case 'cancelled': return <XCircle size={12} />;
      default: return <AlertCircle size={12} />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest leading-none ${getColors()}`}>
       {getIcon()}
       {status || "Unknown"}
    </div>
  );
};

const Orders = () => {
  const { status, id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const currentTab = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All';
  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  const fetchOrders = async () => {
    setLoading(true);
    const data = await dataService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    const { error } = await dataService.updateOrderStatus(orderId, newStatus);
    if (!error) {
       setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
    setUpdating(null);
  };

  // If we have an ID, we show the details view
  if (id) {
    const order = orders.find(o => o.id === id);
    
    if (loading) return (
      <div className="p-20 text-center flex flex-col items-center justify-center">
        <Package size={40} className="animate-pulse text-slate-200" />
        <p className="text-[10px] font-black uppercase tracking-widest mt-4 text-slate-400">Loading order manifest...</p>
      </div>
    );

    if (!order) return (
      <div className="p-20 text-center flex flex-col items-center justify-center">
        <XCircle size={40} className="text-red-100" />
        <h2 className="text-xl font-black mt-4">Order Not Found</h2>
        <button onClick={() => navigate('/admin/orders')} className="mt-4 text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>
    );

    return (
      <div className="p-8 md:p-12 min-h-screen bg-slate-50/50">
        <button onClick={() => navigate('/admin/orders')} className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-[0.2em] mb-8">
           <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:border-slate-200 transition-all">
             <ArrowLeft size={14} />
           </div>
           Return to List
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             {/* Order Header Card */}
             <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-black tracking-tighter">ORDER #{order.id.slice(0, 8).toUpperCase()}</h1>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                        <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                        <Package size={12} /> {order.items?.length || 0} ITEMS
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">
                      <Printer size={16} /> Print Receipt
                    </button>
                  </div>
               </div>

               {/* Items List */}
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Package Contents</h3>
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-2 group-hover:border-primary/20 transition-all">
                           <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-all">{item.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-900 text-sm">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}

                  <div className="pt-8 border-t border-slate-50 space-y-4">
                     <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                       <span>Subtotal</span>
                       <span>₹{Number(order.total_amount || order.amount || 0).toLocaleString()}</span>
                     </div>
                     <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                       <span>Delivery Charges</span>
                       <span className="text-emerald-500">FREE</span>
                     </div>
                     <div className="flex items-center justify-between text-slate-900 text-lg font-black border-t border-slate-100 pt-4">
                       <h3 className="uppercase tracking-tighter">Total Due</h3>
                       <div className="flex items-center gap-2">
                         <span className="text-primary"><IndianRupee size={20} /></span>
                         <span>{Number(order.total_amount || order.amount || 0).toLocaleString()}</span>
                       </div>
                     </div>
                  </div>
               </div>
             </div>

             {/* Timeline / Fulfillment Summary */}
             <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Fulfillment Progress</h3>
               <div className="flex flex-col md:flex-row items-center gap-4">
                  {[
                    { label: 'Pending', status: 'Pending', icon: Clock },
                    { label: 'Processing', status: 'Processing', icon: RefreshCcw },
                    { label: 'Shipped', status: 'Shipped', icon: Truck },
                    { label: 'Delivered', status: 'Delivered', icon: CheckCircle }
                  ].map((step, i, arr) => {
                    const stepStatus = step.status || "";
                    const isCompleted = order.status && ["Delivered", "Shipped", "Processing", "Pending"].indexOf(order.status) >= ["Delivered", "Shipped", "Processing", "Pending"].indexOf(stepStatus);
                    const isCurrent = order.status === stepStatus;
                    
                    return (
                      <div key={i} className="flex-1 w-full flex items-center group">
                        <div className="flex flex-col items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                            isCurrent ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : 
                            isCompleted ? "bg-emerald-50 border-emerald-100 text-emerald-500" : 
                            "bg-slate-50 border-slate-100 text-slate-300"
                          }`}>
                            <step.icon size={20} className={isCurrent ? "animate-pulse" : ""} />
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${isCurrent ? "text-primary" : "text-slate-400"}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className="hidden md:block w-full h-[2px] bg-slate-50 mx-[-20px] transition-all duration-1000 relative">
                             {isCompleted && <div className="absolute inset-0 bg-emerald-100 animate-slide-in" />}
                          </div>
                        )}
                      </div>
                    )
                  })}
               </div>
               <div className="mt-8 flex items-center justify-center gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <button onClick={() => handleUpdateStatus(order.id, 'Shipped')} className="flex-1 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all">Mark as Shipped</button>
                  <button onClick={() => handleUpdateStatus(order.id, 'Delivered')} className="flex-1 bg-primary text-white px-6 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all">Confirm Delivery</button>
               </div>
             </div>
          </div>

          <div className="space-y-8">
             {/* Customer Profile Card */}
             <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-700" />
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 relative z-10">Customer Profile</h3>
               
               <div className="space-y-6 relative z-10">
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-900 border border-slate-200">
                     {order.customer_name?.charAt(0) || "G"}
                   </div>
                   <div>
                     <p className="font-black text-slate-900 tracking-tight leading-none">{order.customer_name || "Guest User"}</p>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Prime Customer</p>
                   </div>
                 </div>

                 <div className="space-y-4 pt-4">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><Mail size={14} /></div>
                     <span className="text-xs font-bold text-slate-600 truncate">{order.customer_email}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center"><Smartphone size={14} /></div>
                     <span className="text-xs font-bold text-slate-600">{order.customer_phone || "+91 XXXXXXXXXX"}</span>
                   </div>
                   <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><MapPin size={14} /></div>
                     <div className="text-xs font-bold text-slate-600 leading-relaxed">
                       Sector 5, HSR Layout<br />
                       Bangalore, Karnataka 560102<br />
                       <span className="text-[9px] text-slate-400 uppercase">Home Address</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Payment Card */}
             <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-[8rem]" />
               <div className="flex items-center justify-between mb-8">
                 <CreditCard size={24} className="opacity-40" />
                 <ShieldCheck size={20} className="text-emerald-400" />
               </div>
               
               <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Payment Status</p>
                 <h2 className="text-2xl font-black tracking-tighter">AUTHENTICATED</h2>
                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{order.payment_method || "ONLINE GATEWAY"}</p>
               </div>

               <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                 <div>
                   <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Transaction ID</p>
                   <p className="text-[10px] font-bold">TXN_{order.id.slice(0,10).toUpperCase()}</p>
                 </div>
                 <CheckCircle size={20} className="text-emerald-400" />
               </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
     const name = order.customer_name || 'Guest';
     const email = order.customer_email || '';
     const id = order.id || '';
     const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          id.toLowerCase().includes(searchTerm.toLowerCase());
     
     if (currentTab === 'All') return matchesSearch;
     return matchesSearch && order.status?.toLowerCase() === currentTab.toLowerCase();
  });

  return (
    <div className="p-8 md:p-12 min-h-screen bg-slate-50/50">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none">Operations</span>
                 <ChevronRight size={10} className="text-slate-300" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none">Fulfillment Center</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">Active Orders</h1>
           </motion.div>
           
           <div className="flex items-center gap-4">
              <button className="flex items-center justify-center gap-2 bg-white text-slate-600 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-95">
                 <Printer size={16} /> 
                 Sheet
              </button>
              <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                 <TrendingUp size={16} /> 
                 Revenue Insights
              </button>
           </div>
        </header>

        {/* Tab Selection */}
        <div className="flex items-center gap-6 mb-10 overflow-x-auto no-scrollbar scroll-smooth">
           {tabs.map((tab) => {
             const tabValue = tab.toLowerCase();
             const isActive = (tab === 'All' && !status) || status === tabValue;
             const linkPath = tab === 'All' ? '/admin/orders' : `/admin/orders/${tabValue}`;
             
             return (
               <Link
                  key={tab}
                  to={linkPath}
                  className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative inline-block whitespace-nowrap ${
                    isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                  }`}
               >
                  {tab}
                  {isActive && (
                    <motion.div layoutId="orderTab" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full" />
                  )}
               </Link>
             );
           })}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Find customer or order ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold transition-all shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/20" 
              />
           </div>
           <div className="flex items-center gap-2">
              <button onClick={fetchOrders} className="p-4 bg-white text-slate-400 hover:text-primary rounded-2xl border border-slate-100 shadow-sm transition-all" title="Refresh Feed">
                 <RefreshCcw size={16} />
              </button>
              <button className="flex items-center gap-2 bg-white text-slate-500 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-all">
                 <Filter size={14} /> Bulk Adjust
              </button>
           </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-50">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order / Date</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount (INR)</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Quick Fulfillment</th>
                   </tr>
                </thead>
                <tbody>
                   <AnimatePresence mode="popLayout">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-20 text-center">
                             <div className="flex flex-col items-center gap-4 text-slate-300">
                                <Package size={40} className="animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Connecting to Fulfillment Server...</p>
                             </div>
                          </td>
                        </tr>
                      ) : filteredOrders.map((order, i) => (
                        <motion.tr 
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className="group border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                        >
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                                    <ShoppingBag size={18} />
                                 </div>
                                 <div className="flex flex-col">
                                    <p className="text-xs font-black text-slate-900 tracking-tighter">#{order.id.slice(0, 8).toUpperCase()}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      {new Date(order.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex flex-col">
                                 <p className="text-sm font-bold text-slate-900 leading-none mb-1">{order.customer_name || "Guest User"}</p>
                                 <p className="text-[10px] font-bold text-slate-400">{order.customer_email}</p>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-center">
                              <div className="inline-block">
                                 <p className="text-sm font-black text-slate-900">₹{Number(order.total_amount || order.amount || 0).toLocaleString()}</p>
                                 <div className="flex items-center justify-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <CreditCard size={10} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">{order.payment_method || "Online"}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-center">
                              <OrderStatusBadge status={order.status || "Pending"} />
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center justify-end gap-3">
                                 <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 opacity-80 group-hover:opacity-100 group-hover:border-slate-200 transition-all">
                                    <button 
                                       onClick={() => handleUpdateStatus(order.id, 'Processing')}
                                       disabled={updating === order.id}
                                       className={`p-2 rounded-lg transition-all ${order.status?.toLowerCase() === 'processing' ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-400 hover:text-blue-500'}`}
                                       title="Mark Processing"
                                    >
                                       <RefreshCcw size={14} className={updating === order.id ? "animate-spin" : ""} />
                                    </button>
                                    <button 
                                       onClick={() => handleUpdateStatus(order.id, 'Shipped')}
                                       disabled={updating === order.id}
                                       className={`p-2 rounded-lg transition-all ${order.status?.toLowerCase() === 'shipped' ? 'bg-white text-purple-500 shadow-sm' : 'text-slate-400 hover:text-purple-500'}`}
                                       title="Mark Shipped"
                                    >
                                       <Truck size={14} />
                                    </button>
                                    <button 
                                       onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                                       disabled={updating === order.id}
                                       className={`p-2 rounded-lg transition-all ${order.status?.toLowerCase() === 'delivered' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-emerald-500'}`}
                                       title="Mark Delivered"
                                    >
                                       <CheckCircle size={14} />
                                    </button>
                                    <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                                    <button 
                                       onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                                       disabled={updating === order.id}
                                       className={`p-2 rounded-lg transition-all ${order.status?.toLowerCase() === 'cancelled' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400 hover:text-red-500'}`}
                                       title="Cancel Order"
                                    >
                                       <XCircle size={14} />
                                    </button>
                                 </div>
                                 <Link to={`/admin/orders/details/${order.id}`} className="p-3 text-slate-400 hover:text-primary hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all group/eye">
                                    <Eye size={16} className="group-hover/eye:scale-110 transition-transform" />
                                 </Link>
                              </div>
                           </td>
                        </motion.tr>
                      ))}
                   </AnimatePresence>
                </tbody>
             </table>
           </div>

           {!loading && filteredOrders.length === 0 && (
             <div className="p-20 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                   <Package size={40} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No match found</h3>
                <p className="text-sm text-slate-400 font-medium mt-2">Adjust your search or filter settings.</p>
             </div>
           )}
        </div>
    </div>
  );
};

export default Orders;

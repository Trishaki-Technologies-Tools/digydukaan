import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Search, 
  Package, 
  Printer, 
  ChevronRight,
  Navigation,
  CheckCircle2,
  Clock,
  Box,
  TruckIcon,
  ExternalLink
} from 'lucide-react';
import { dataService } from '../../dataService';

const Shipping = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchShipments = async () => {
       setLoading(true);
       const data = await dataService.getOrders();
       setShipments(data);
       setLoading(false);
    };
    fetchShipments();
  }, []);

  const filteredShipments = shipments.filter(shp => {
     return (shp.id && shp.id.toLowerCase().includes(searchTerm.toLowerCase())) || (shp.customer_name && shp.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const outForDelivery = shipments.filter(s => s.status === 'Processing').length;
  const delivered = shipments.filter(s => s.status === 'Delivered').length;

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Logistics</span>
                 <ChevronRight size={10} className="text-slate-300" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Shipping & Delivery</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">Shipping</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="flex items-center justify-center gap-2 bg-white text-slate-600 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-95">
                 <Box size={16} /> 
                 Bulk Manifest
              </button>
              <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                 <Truck size={16} /> 
                 Schedule Pickup
              </button>
           </div>
        </header>

        {/* Logistics Partners */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {['Delhivery', 'BlueDart', 'Shiprocket', 'Ecom Express'].map((partner, i) => (
             <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{partner}</p>
                   <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       <span className="text-xs font-bold text-slate-900">Connected</span>
                   </div>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                   <Navigation size={18} />
                </div>
             </div>
           ))}
        </div>

        {/* Action Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Out for Delivery</p>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase font-heading relative z-10">{outForDelivery} Shipments</h3>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Delivered Today</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading">{delivered} Orders</h3>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending Pickups</p>
              <h3 className="text-3xl font-black text-amber-500 tracking-tighter uppercase font-heading">{shipments.filter(s => s.status === 'Pending').length} Items</h3>
           </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
           <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by Tracking ID or Order..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold transition-all focus:ring-4 focus:ring-primary/5" 
                 />
              </div>
              <div className="flex items-center gap-2">
                 <button className="text-[10px] font-black text-slate-400 bg-slate-50 px-6 py-4 rounded-2xl hover:text-slate-900 transition-all uppercase tracking-widest">Active Filters (0)</button>
              </div>
           </div>

           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50/30 border-b border-slate-50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Details</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Courier Partner</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Label Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                   <tr>
                     <td colSpan={5} className="px-8 py-20 text-center">
                        <TruckIcon size={40} className="mx-auto text-slate-100 animate-pulse mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Shipments...</p>
                     </td>
                   </tr>
                 ) : filteredShipments.map((shp, i) => (
                   <motion.tr 
                     key={shp.id}
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.05 }}
                     className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                   >
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                               <Package size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 tracking-tighter mb-0.5">TRK-{shp.id.slice(0, 8).toUpperCase()}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order {shp.id.slice(0, 5)}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-tighter">
                            {shp.customer_name}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-md border border-slate-100">Delhivery</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           shp.status === 'Delivered' ? 'text-emerald-500 bg-emerald-50' : 
                           shp.status === 'Processing' ? 'text-blue-500 bg-blue-50' : 
                           shp.status === 'Pending' ? 'text-amber-500 bg-amber-50' :
                           'text-slate-500 bg-slate-50'
                         }`}>
                            {shp.status === 'Delivered' ? <CheckCircle2 size={12} /> : 
                             shp.status === 'Pending' ? <Clock size={12} /> :
                             <Truck size={12} />}
                            {shp.status}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-end gap-2">
                            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-sm">
                               <Printer size={12} /> Print Label
                            </button>
                            <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-100 transition-all">
                               <ExternalLink size={16} />
                            </button>
                         </div>
                      </td>
                   </motion.tr>
                 ))}
              </tbody>
           </table>

           {!loading && filteredShipments.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <Truck size={40} />
                 </div>
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No shipments found</h3>
                 <p className="text-sm text-slate-400 font-medium mt-2">All orders have been dispatched or are pending processing.</p>
              </div>
           )}
        </div>
    </div>
  );
};

export default Shipping;

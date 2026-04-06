import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Megaphone, 
  BarChart3, 
  CreditCard, 
  Truck, 
  Store, 
  FileText, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  ChevronDown,
  Plus,
  List,
  Tags,
  Boxes,
  Clock,
  CheckCircle2,
  Undo2,
  Ticket,
  Gift,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface SubItem {
  name: string;
  path: string;
  icon?: any;
}

interface NavItem {
  name: string;
  icon: any;
  path?: string;
  subItems?: SubItem[];
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(['Products', 'Orders']);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { 
      name: 'Products', 
      icon: Package, 
      subItems: [
        { name: 'All Products', path: '/admin/products', icon: List },
        { name: 'Add Product', path: '/admin/products/add', icon: Plus },
        { name: 'Categories', path: '/admin/categories', icon: Tags },
        { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
      ]
    },
    { 
      name: 'Orders', 
      icon: ShoppingCart, 
      subItems: [
        { name: 'All Orders', path: '/admin/orders', icon: List },
        { name: 'Pending', path: '/admin/orders/pending', icon: Clock },
        { name: 'Delivered', path: '/admin/orders/delivered', icon: CheckCircle2 },
        { name: 'Returns', path: '/admin/orders/returns', icon: Undo2 },
      ]
    },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { 
      name: 'Marketing', 
      icon: Megaphone, 
      subItems: [
        { name: 'Coupons', path: '/admin/marketing/coupons', icon: Ticket },
        { name: 'Offers', path: '/admin/marketing/offers', icon: Gift },
        { name: 'Banners', path: '/admin/marketing/banners', icon: ImageIcon },
      ]
    },
    { name: 'Reports', icon: BarChart3, path: '/admin/reports' },
    { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { name: 'Shipping', icon: Truck, path: '/admin/shipping' },
    { name: 'Vendors', icon: Store, path: '/admin/vendors' },
    { name: 'CMS', icon: FileText, path: '/admin/cms' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
    { name: 'Admins', icon: ShieldCheck, path: '/admin/admins' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Package size={20} />
           </div>
           <div>
              <h2 className="text-xl font-black tracking-tighter text-slate-900 leading-none">ADMIN<span className="text-primary">.D</span></h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Management Suite</p>
           </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
             const isParentActive = (item.path && location.pathname === item.path) || (item.subItems?.some(si => location.pathname === si.path));
             
             return (
               <div key={item.name} className="space-y-1">
                 {item.subItems ? (
                   <button
                     onClick={() => toggleMenu(item.name)}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm tracking-tight transition-all duration-200 group
                       ${isParentActive ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                   >
                     <div className="flex items-center gap-3">
                       <item.icon size={18} className={isParentActive ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'} />
                       {item.name}
                     </div>
                     <ChevronDown 
                       size={14} 
                       className={`transition-transform duration-300 ${openMenus.includes(item.name) ? 'rotate-180' : ''}`} 
                     />
                   </button>
                 ) : (
                   <Link
                     to={item.path || '#'}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm tracking-tight transition-all duration-200 group
                       ${isParentActive ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                   >
                     <div className="flex items-center gap-3">
                       <item.icon size={18} className={isParentActive ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'} />
                       {item.name}
                     </div>
                   </Link>
                 )}

                 <AnimatePresence>
                   {item.subItems && openMenus.includes(item.name) && (
                     <motion.div
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       transition={{ duration: 0.3, ease: 'easeInOut' }}
                       className="overflow-hidden ml-4 pl-4 border-l border-slate-100 space-y-1"
                     >
                       {item.subItems.map((subItem) => {
                         const isSubActive = location.pathname === subItem.path;
                         return (
                           <Link
                             key={subItem.name}
                             to={subItem.path}
                             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold tracking-tight transition-all
                               ${isSubActive ? 'text-primary bg-primary/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                           >
                              {subItem.icon && <subItem.icon size={14} className={isSubActive ? 'text-primary' : 'text-slate-300'} />}
                              {subItem.name}
                           </Link>
                         );
                       })}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all w-full group"
        >
           <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
           Logout Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Layout, 
  Image as ImageIcon, 
  PenTool, 
  ChevronRight,
  Plus,
  Eye,
  Trash2,
  Globe,
  Monitor,
  Smartphone
} from 'lucide-react';


const mockPages = [
  { id: 1, title: "Home Page", lastModified: "24 Mar, 2026", status: "Published", url: "/" },
  { id: 2, title: "About Us", lastModified: "12 Mar, 2026", status: "Published", url: "/about" },
  { id: 3, title: "Shipping Policy", lastModified: "10 Jan, 2026", status: "Draft", url: "/shipping" },
  { id: 4, title: "Terms & Conditions", lastModified: "20 Dec, 2025", status: "Published", url: "/terms" },
];

const mockSections = [
  { id: 1, name: "Hero Carousel", type: "Visual Slider", pages: ["Home"] },
  { id: 2, name: "Product Grid", type: "Dynamic Collection", pages: ["Home", "Shop"] },
  { id: 3, name: "Testimonials", type: "Review Slider", pages: ["Home"] },
];

const CMS = () => {
  const [currentView, setCurrentView] = useState('Pages');

  return (
    <div className="p-8 md:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Commerce</span>
                 <ChevronRight size={10} className="text-slate-300" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Content Management</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-heading leading-none mt-2">CMS</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                 <button onClick={() => setCurrentView('Pages')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'Pages' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Pages</button>
                 <button onClick={() => setCurrentView('Sections')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'Sections' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Sections</button>
                 <button onClick={() => setCurrentView('Media')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'Media' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Media Library</button>
              </div>
              <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                 <Plus size={16} /> 
                 Create New
              </button>
           </div>
        </header>

        <AnimatePresence mode="wait">
           <motion.div
             key={currentView}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
           >
              {currentView === 'Pages' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                   {mockPages.map((page) => (
                     <div key={page.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                        <div className="flex items-center justify-between mb-8">
                           <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                              <FileText size={24} />
                           </div>
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${page.status === 'Published' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                              {page.status}
                           </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">{page.title}</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">Direct URL: {page.url}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                           <div className="flex items-center gap-2 text-slate-400">
                              <Globe size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Modified: {page.lastModified}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <button className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-slate-50">
                                 <Eye size={16} />
                              </button>
                              <button className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-primary transition-all">
                                 <PenTool size={16} />
                              </button>
                           </div>
                        </div>
                     </div>
                   ))}
                   <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center hover:bg-slate-50 cursor-pointer transition-all">
                      <Plus size={32} className="text-slate-200 mb-4" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Create Custom Landing Page</p>
                   </div>
                </div>
              )}

              {currentView === 'Sections' && (
                <div className="space-y-6">
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden mb-12">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"></div>
                      <div className="relative z-10 flex items-center justify-between gap-8">
                         <div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Live Store Preview</h3>
                            <p className="text-sm text-white/40 font-medium mb-6">Editing the Home Page layout. Drag and drop sections to rearrange.</p>
                            <div className="flex items-center gap-4">
                               <button className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest"><Monitor size={14} /> Desktop</button>
                               <button className="flex items-center gap-2 bg-white/5 text-white/40 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest"><Smartphone size={14} /> Mobile</button>
                            </div>
                         </div>
                         <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Save Changes</button>
                      </div>
                   </div>

                   <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="divide-y divide-slate-50">
                         {mockSections.map((section) => (
                           <div key={section.id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-center gap-6">
                                 <div className="w-4 h-12 bg-slate-50 rounded flex flex-col gap-1 items-center justify-center cursor-move text-slate-200 group-hover:text-primary transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                 </div>
                                 <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                    <Layout size={20} />
                                 </div>
                                 <div>
                                    <h4 className="font-black text-slate-900 uppercase tracking-tight">{section.name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type: {section.type} • Active on {section.pages.join(", ")}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Settings</button>
                                 <div className="w-11 h-6 bg-emerald-500 rounded-full relative shadow-inner overflow-hidden">
                                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {currentView === 'Media' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                   {[1, 2, 3, 4, 5, 6].map((i) => (
                     <div key={i} className="aspect-square bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group relative">
                        <img src={`https://images.unsplash.com/photo-${1580000000000 + (i * 1000)}?q=80&w=200&auto=format&fit=crop`} alt="Media" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                           <button className="p-2 text-white hover:text-primary transition-colors"><Eye size={18} /></button>
                           <button className="p-2 text-white hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                     </div>
                   ))}
                   <div className="aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 text-center hover:bg-slate-50 cursor-pointer transition-all">
                      <ImageIcon size={24} className="text-slate-300 mb-2" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Upload Asset</p>
                   </div>
                </div>
              )}
           </motion.div>
        </AnimatePresence>
    </div>
  );
};

export default CMS;

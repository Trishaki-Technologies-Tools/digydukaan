import { motion } from 'framer-motion';

const BannerCollage = () => {
  return (
    <section className="py-12 md:py-24 bg-white px-4 md:px-0">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto lg:h-[600px]">
          {/* Main Box - Smart Sound */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-1 min-h-[400px] md:h-auto rounded-[2.5rem] md:rounded-[3rem] bg-slate-950 p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-[60px] md:blur-[80px] rounded-full -translate-y-1/2" />
            <div className="relative z-10 text-center">
              <span className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 block">Smart Sound with</span>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight">Smart System</h2>
            </div>
            <div className="relative z-10 flex justify-center mt-auto">
              <img 
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=2070&auto=format&fit=crop" 
                alt="Smart Sound" 
                className="w-full max-w-[180px] md:max-w-[200px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              />
            </div>
          </motion.div>

          {/* Right Area - Nested Grid */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
            {/* VR Experience - Large Wide */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-1 min-h-[300px] rounded-[2.5rem] md:rounded-[3rem] bg-indigo-900 overflow-hidden relative flex items-center p-8 md:p-12 group cursor-pointer"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2078&auto=format&fit=crop" 
                  alt="VR" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 to-transparent" />
              </div>
              <div className="relative z-10 max-w-[180px]">
                 <span className="text-[9px] md:text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-4 block">LIMITED OFFER</span>
                 <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-6 md:mb-8">Virtual Reality Experience</h2>
                 <button className="text-[9px] md:text-[10px] font-black uppercase text-white border-b border-white/30 pb-1">View Info</button>
              </div>
            </motion.div>

            {/* CC Camera - Small Vertical */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-1 md:row-span-1 min-h-[300px] rounded-[2.5rem] md:rounded-[3rem] bg-slate-100 p-8 flex flex-col justify-between items-center group cursor-pointer"
            >
               <div className="text-center">
                 <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block">NEW ARRIVALS</span>
                 <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">CC Camera</h2>
               </div>
               <img 
                src="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop" 
                alt="Camera" 
                className="w-1/2 md:w-3/4 object-contain group-hover:rotate-12 transition-transform duration-500"
               />
               <button className="text-[9px] font-black uppercase text-blue-600 border-b border-blue-600/30 pb-1">Shop Now</button>
            </motion.div>

            {/* Smartphone - Small Horizontal */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-1 md:row-span-1 min-h-[180px] rounded-[2.5rem] md:rounded-[3rem] bg-slate-100 p-8 flex items-center justify-between group cursor-pointer overflow-hidden"
            >
                <div className="flex-1 text-left relative z-10">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">BEST DEALS</span>
                   <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">Smartphone</h2>
                   <button className="text-[9px] font-black uppercase text-blue-600 border-b border-blue-600/30 pb-1">View All</button>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop" 
                  alt="Phone" 
                  className="w-1/2 relative z-0 translate-x-4 group-hover:translate-x-0 transition-transform duration-500"
                />
            </motion.div>

            {/* New Collection - Medium Wide */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-1 min-h-[300px] rounded-[2.5rem] md:rounded-[3rem] bg-slate-950 overflow-hidden relative p-8 md:p-12 flex items-center group cursor-pointer"
            >
               <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070&auto=format&fit=crop" 
                    alt="Camera" 
                    className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent" />
               </div>
               <div className="relative z-10">
                  <span className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-4 block">LIGHT UP TRENDING</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-6 md:mb-8">New Camera <br /> collections</h2>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerCollage;

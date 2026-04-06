import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { dataService } from '../dataService';

const OfferCarousel = () => {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
       const data = await dataService.getBanners();
       setBanners(data);
    };
    fetchBanners();
  }, []);

  const duplicatedOffers = [...banners, ...banners];

  return (
    <section className="py-8 md:py-12 bg-white overflow-hidden">
      <div className="container overflow-visible">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-4">
           <div>
             <h2 className="text-2xl md:text-4xl font-black text-secondary uppercase tracking-tighter font-heading">
                Special Offers
             </h2>
             <p className="text-muted text-xs md:text-sm font-medium uppercase tracking-widest mt-1">
                Grab them before they are gone
             </p>
           </div>
           <div className="flex items-center gap-2">
              <span className="h-1 w-12 bg-primary rounded-full"></span>
              <span className="text-[10px] md:text-xs font-bold text-secondary uppercase tracking-[0.2em]">Live Now</span>
           </div>
        </div>
      </div>

      <div className="relative flex">
        <motion.div 
          className="flex gap-4 md:gap-8 px-4"
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear"
            }
          }}
        >
          {duplicatedOffers.map((offer, idx) => (
            <div 
              key={`${offer.id}-${idx}`}
              className={`flex-shrink-0 w-[280px] md:w-[450px] aspect-[16/9] rounded-2xl md:rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-secondary/5`}
            >
              <img 
                src={offer.img} 
                alt={offer.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
                 <span className="text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 drop-shadow-md">
                   {offer.discount}
                 </span>
                 <h3 className="text-white text-xl md:text-3xl font-black uppercase tracking-tighter font-heading drop-shadow-lg">
                   {offer.title}
                 </h3>
                 <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                    <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-primary pb-1">Shop Collection</span>
                 </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OfferCarousel;

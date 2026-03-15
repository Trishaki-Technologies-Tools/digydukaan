import { motion } from 'framer-motion';

const Card = ({ card, className }: { card: any, className: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] group cursor-pointer ${className} bg-slate-900 border border-white/5 shadow-2xl transition-all duration-500`}
    >
      {/* Background Image - Immersive Full Cover */}
      <div className="absolute inset-0 z-0">
        <img 
          src={card.img} 
          alt={card.title} 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out"
        />
        {/* Elegant Gradient to ensure legibility and blend images */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
        <div className="max-w-[280px]">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black tracking-[0.3em] text-blue-500 uppercase mb-4">
            {card.label}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-[1.15] uppercase tracking-tighter">
            {card.title}
          </h2>
        </div>

        <div className="flex items-center gap-4 group/btn mt-8">
           <div className="h-[2px] w-10 bg-blue-600 transition-all duration-500 group-hover/btn:w-16" />
           <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors duration-500">
             {card.link}
           </span>
        </div>
      </div>
      
      {/* Interactive Glow on Hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${card.glow} blur-[100px] pointer-events-none`} />
    </motion.div>
  );
};

const PromoCards = () => {
  const cards = [
    {
      label: "PREMIUM STUDIO",
      title: "Experience The Future of Sound",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop", // High-end Headphones
      glow: "bg-blue-600",
      link: "Shop Series"
    },
    {
      label: "NEW ARRIVAL",
      title: "Latest Pro Tablet Series",
      img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2030&auto=format&fit=crop", // Clean Tablet
      glow: "bg-purple-600",
      link: "View Now"
    },
    {
      label: "ELITE SERIES",
      title: "The Ultimate Smartphone Pro",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop", // Clean vertical smartphone
      glow: "bg-indigo-600",
      link: "Buy Now"
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-white px-4 md:px-0">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card card={cards[0]} className="min-h-[450px] md:min-h-[550px]" />
          <Card card={cards[1]} className="min-h-[450px] md:min-h-[550px]" />
          <Card card={cards[2]} className="min-h-[450px] md:min-h-[550px]" />
        </div>
      </div>
    </section>
  );
};

export default PromoCards;

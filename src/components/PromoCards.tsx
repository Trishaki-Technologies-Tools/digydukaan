import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Card = ({ card, className }: { card: any, className: string }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.2rem] md:rounded-[3rem] group cursor-pointer ${className} bg-slate-900 border border-white/5 shadow-lg transition-all duration-500 w-full flex flex-col`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 text-white">
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-1000 ease-out"
        />
        {/* Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 p-4 md:p-12 h-full flex flex-col justify-between items-start text-left">
        <div>
          <span className="inline-block px-2 py-0.5 rounded-full bg-primary text-white text-[7px] md:text-[9px] font-bold tracking-[0.2em] uppercase mb-1 shadow-md">
            {card.label}
          </span>
          <h2 className="text-sm md:text-3xl font-bold text-white leading-tight uppercase tracking-tighter font-heading max-w-[140px] md:max-w-full">
            {card.title}
          </h2>
        </div>

        <div className="flex items-center gap-1 md:gap-3 group/btn mt-auto">
          <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] text-white group-hover:text-primary transition-colors duration-500">
            {card.link}
          </span>
          <div className="h-[1px] w-4 md:w-8 bg-primary transition-all duration-500 group-hover/btn:w-10 md:group-hover/btn:w-14" />
        </div>
      </div>

      {/* Glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${card.glow} blur-[100px] pointer-events-none`} />
    </div>
  );
};

const PromoCards = () => {
  const cards = [
    {
      label: "PREMIUM STUDIO",
      title: "Experience The Future of Sound",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
      glow: "bg-primary",
      link: "Shop Series"
    },
    {
      label: "NEW ARRIVAL",
      title: "Latest Pro Tablet Series",
      img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2030&auto=format&fit=crop",
      glow: "bg-purple-600",
      link: "View Now"
    },
    {
      label: "ELITE SERIES",
      title: "Ultimate Smartphone Pro",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop",
      glow: "bg-indigo-600",
      link: "Buy Now"
    }
  ];

  return (
    <section className="py-6 md:py-24 bg-background px-4 md:px-0">
      <div className="container">
        {/* Mobile: Grid mix for a structured look based on ref image */}
        <div className="grid grid-cols-2 md:hidden gap-4 mb-2">
            <div className="col-span-1">
                <Card card={cards[0]} className="h-[240px]" />
            </div>
            <div className="col-span-1">
                <Card card={cards[1]} className="h-[240px]" />
            </div>
            <div className="col-span-2">
                <Card card={cards[2]} className="h-[160px]" />
            </div>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card card={card} className="min-h-[450px] md:min-h-[550px]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoCards;

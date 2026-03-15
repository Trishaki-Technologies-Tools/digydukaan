import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';

const slides = [
  {
    title: "Elevate Your Lifestyle",
    desc: "Discover premium fashion, cutting-edge electronics, and stunning home goods. Dedicated to quality and design for the modern lifestyle.",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
    primary: "Shop Now",
    secondary: "Learn More"
  },
  {
    title: "Modern Fashion Series",
    desc: "Explore our curated collection of designer apparel and accessories for the contemporary wardrobe. Style meets comfort.",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    primary: "View Trends",
    secondary: "View Gallery"
  },
  {
    title: "Cutting-Edge Innovation",
    desc: "Experience the next level of technology with our exclusive range of high-performance electronics and curated accessories.",
    img: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2064&auto=format&fit=crop",
    primary: "Shop Tech",
    secondary: "User Guide"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[650px] md:h-[750px] lg:h-[850px] bg-black overflow-hidden flex items-center">
      {/* Background Slides with Smooth Fade */}
      <AnimatePresence mode="wait">
        <motion.div
           key={`bg-${current}`}
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.2, ease: "easeOut" }}
           className="absolute inset-0 z-0"
        >
          {/* Multi-layer Overlays for perfect legibility */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          
          <img 
            src={slides[current].img} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-[40] mx-auto px-6 md:px-12">
        <div className="max-w-4xl pt-10 md:pt-0">
           <AnimatePresence mode="wait">
             <motion.div
               key={`content-${current}`}
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="text-left"
             >
                <motion.h1 
                  className="font-black leading-[1] md:leading-[1.1] uppercase tracking-tighter mb-6 md:mb-8 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-4xl sm:text-6xl md:text-8xl lg:text-[110px]"
                >
                  {slides[current].title}
                </motion.h1>
                
                <motion.p 
                  className="text-white/90 leading-relaxed max-w-2xl mb-10 md:mb-12 font-medium drop-shadow-md text-sm sm:text-lg md:text-xl lg:text-2xl"
                >
                  {slides[current].desc}
                </motion.p>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4">
                  <button 
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#ff5722] hover:bg-[#ff7043] text-white px-8 md:px-12 py-4 md:py-5 rounded-xl font-black text-xs md:text-sm tracking-widest uppercase transition-all shadow-2xl group"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {slides[current].primary}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-2 border-white/10 px-8 md:px-12 py-4 md:py-5 rounded-xl font-black text-xs md:text-sm tracking-widest uppercase transition-all backdrop-blur-md"
                  >
                    {slides[current].secondary}
                  </button>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls Bar - Fixed for Mobile Visibility */}
      <div className="absolute bottom-6 md:bottom-12 left-0 right-0 z-50 px-6 md:px-12 pointer-events-none">
        <div className="container mx-auto flex items-center justify-between pointer-events-auto">
          {/* Slide Navigation */}
          <div className="flex items-center gap-2 md:gap-4">
             {slides.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrent(i)}
                 className={`h-1 md:h-1.5 transition-all duration-700 rounded-full ${current === i ? 'w-12 md:w-20 bg-[#ff5722]' : 'w-3 md:w-4 bg-white/30 hover:bg-white/50'}`}
               />
             ))}
          </div>

          {/* Arrow Controls */}
          <div className="flex gap-2 md:gap-4">
             <button onClick={prev} className="p-3 md:p-4 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
             </button>
             <button onClick={next} className="p-3 md:p-4 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

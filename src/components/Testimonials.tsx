import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Sahil Kumar",
      role: "Tech Enthusiast",
      text: "The quality of products at DigyDukaan is unmatched. The VR experience is literally out of this world!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Product Designer",
      text: "I love the minimalist yet powerful design of the website and the products. Their customer service is 10/10.",
      rating: 5
    },
    {
      name: "Rahul Varma",
      role: "Pro Gamer",
      text: "Best place to buy high-end gadgets. The delivery was fast and the packaging was premium.",
      rating: 5
    }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      currentRef.current = (currentRef.current + 1) % reviews.length;
      if (scrollRef.current) {
        const child = scrollRef.current.children[currentRef.current] as HTMLElement;
        if (child) {
          scrollRef.current.scrollTo({ left: child.offsetLeft - 16, behavior: 'smooth' });
        }
      }
    }, 3000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleTouchStart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTouchEnd = () => {
    startAutoPlay();
  };

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-tighter mb-4 font-heading">Our Client's Happiness</h2>
          <p className="text-muted font-medium text-sm md:text-base">What our regular customers say about us</p>
        </div>

        {/* Mobile: swipeable horizontal carousel */}
        <div
          ref={scrollRef}
          className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {reviews.map((r, i) => (
            <div key={i} className="snap-center flex-shrink-0 w-[82vw]">
              <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-secondary/5 flex flex-col items-center text-center h-full">
                <Quote className="h-6 w-6 text-primary/30 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <p className="text-secondary/70 font-medium leading-relaxed mb-6 italic text-sm">"{r.text}"</p>
                <div>
                  <h4 className="text-sm font-bold text-secondary uppercase tracking-[0.1em] font-heading">{r.name}</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white p-12 rounded-[3rem] shadow-xl shadow-secondary/5 border border-secondary/5 flex flex-col items-center text-center group hover:scale-[1.02] transition-all duration-500">
              <Quote className="h-8 w-8 text-primary/20 mb-8 group-hover:text-primary transition-colors" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-secondary/70 font-medium leading-relaxed mb-8 italic">"{r.text}"</p>
              <div>
                <h4 className="text-sm font-bold text-secondary uppercase tracking-[0.1em] font-heading">{r.name}</h4>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

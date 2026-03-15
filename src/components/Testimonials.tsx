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

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Our Client's Happiness</h2>
          <p className="text-slate-400 font-medium">What our regular customers say about us</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:scale-[1.02] transition-all duration-500">
              <Quote className="h-8 w-8 text-blue-100 mb-8 group-hover:text-blue-500 transition-colors" />
              <div className="flex gap-1 mb-6">
                 {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-orange-400 text-orange-400" />)}
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">"{r.text}"</p>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">{r.name}</h4>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

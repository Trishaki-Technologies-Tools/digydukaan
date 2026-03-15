
const Newsletter = () => {
  return (
    <section className="bg-slate-950 py-16 md:py-24 border-t border-white/5 px-4 md:px-0">
      <div className="container flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12">
        <div className="max-w-xl text-center lg:text-left">
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
            Subscribe our Newsletter <br className="hidden md:block" /> and get all of our update
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium">Join 20k+ subcribers for exclusive deals and new product launches.</p>
        </div>
        
        <div className="w-full max-w-lg">
          <form className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl sm:rounded-2xl">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 bg-transparent border-0 px-6 py-4 text-white placeholder:text-slate-600 focus:ring-0 text-sm font-medium"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 md:px-10 py-4 rounded-xl font-black text-[11px] md:text-[12px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

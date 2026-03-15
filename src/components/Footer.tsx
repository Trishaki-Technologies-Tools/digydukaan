
const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-slate-950 pt-16 md:pt-24 pb-12 px-6 md:px-0">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-y-12 md:gap-x-12 mb-16 md:mb-24">
          {/* Brand Column */}
          <div className="md:col-span-1 lg:col-span-2 text-left">
            <a href="/" className="text-2xl font-black tracking-tighter text-white uppercase italic mb-6 block">
              Digy<span className="text-blue-500">Dukaan</span>
            </a>
            <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed mb-8">
              The next generation of e-commerce experience. We bring the future of technology to your doorstep with unmatched quality and style.
            </p>
            <div className="flex gap-4">
               {['fb', 'tw', 'ig', 'yt'].map(s => (
                  <div key={s} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-500 hover:border-blue-500/30 transition-all cursor-pointer">
                     <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
                  </div>
               ))}
            </div>
          </div>
          
          {/* Links Grid for Mobile - 2 columns */}
          <div className="grid grid-cols-2 md:contents gap-x-8 gap-y-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 mb-6 md:mb-8">Shop</h4>
              <ul className="space-y-4 text-xs md:text-sm font-medium text-slate-500">
                <li><a href="#" className="hover:text-blue-500 transition-colors">PC & Laptop</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Phones</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Webcam</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 mb-6 md:mb-8">Links</h4>
              <ul className="space-y-4 text-xs md:text-sm font-medium text-slate-500">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 mb-6 md:mb-8">Support</h4>
              <ul className="space-y-4 text-xs md:text-sm font-medium text-slate-500">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Our Service</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Gift Card</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Terms Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest text-center md:text-left">
              © 2026 DIGY DUKAAN. Designed by TriShaki
            </p>
            <div className="hidden md:flex gap-6 text-[9px] font-black text-slate-800 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-800 uppercase tracking-widest">
              <span>Powered by Bun</span>
              <span>Vite + React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

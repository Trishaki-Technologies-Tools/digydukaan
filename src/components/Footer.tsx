
const Footer = () => {
  return (
    <footer className="border-t border-secondary/5 bg-secondary pt-16 md:pt-24 pb-12 px-6 md:px-0 text-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-y-12 md:gap-x-12 mb-16 md:mb-24">
          {/* Brand Column */}
          <div className="md:col-span-1 lg:col-span-2 text-left">
            <a href="/" className="flex flex-col mb-6">
              <span className="text-2xl font-bold tracking-tighter text-white uppercase italic font-heading">
                Digy<span className="text-primary">Dukaan</span>
              </span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Apna Local Store, Abb Online.</span>
            </a>
            <p className="text-sm font-medium text-white/60 max-w-sm leading-relaxed mb-8">
              Digy Dukaan is your trusted local store, now online. We bring quality products and exceptional service directly to your screen.
            </p>
            <div className="flex gap-4">
               {['fb', 'tw', 'ig', 'yt'].map(s => (
                  <div key={s} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all cursor-pointer">
                     <span className="text-[10px] font-bold uppercase tracking-widest">{s}</span>
                  </div>
               ))}
            </div>
          </div>
          
          {/* Links Grid for Mobile - 2 columns */}
          <div className="grid grid-cols-2 md:contents gap-x-8 gap-y-12">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6 md:mb-8 font-heading">Shop</h4>
              <ul className="space-y-4 text-xs md:text-sm font-medium text-white/60">
                <li><a href="#" className="hover:text-primary transition-colors">PC & Laptop</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Phones</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Webcam</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6 md:mb-8 font-heading">Links</h4>
              <ul className="space-y-4 text-xs md:text-sm font-medium text-white/60">
                <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6 md:mb-8 font-heading">Support</h4>
              <ul className="space-y-4 text-xs md:text-sm font-medium text-white/60">
                <li><a href="#" className="hover:text-primary transition-colors">Our Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Gift Card</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center md:text-left">
              © 2026 DIGY DUKAAN. Designed by TriShaki
            </p>
            <div className="hidden md:flex gap-6 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <span>Next Gen E-Commerce</span>
              <span>Digy Dukaan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

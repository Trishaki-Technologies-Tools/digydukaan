import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PromoCards from '../components/PromoCards';
import CategorySelector from '../components/CategorySelector';
import ProductSection from '../components/ProductSection';
import BannerCollage from '../components/BannerCollage';
import Testimonials from '../components/Testimonials';
import InstagramSection from '../components/InstagramSection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-500 selection:text-white">
      <TopBar />
      <Navbar />
      <Hero />
      <Features />
      <PromoCards />
      <CategorySelector />
      
      {/* Highly Recommended Section */}
      <ProductSection 
        title="Highly Recommended" 
        subtitle="Exclusive products continue to drive innovation and shape the way we live, work, and interact with our environment."
      />
      
      {/* Running Marquee / Divider in Image */}
      <div className="bg-slate-900 py-6 overflow-hidden border-y border-white/5 relative">
         <div className="flex items-center whitespace-nowrap marquee">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                 <span className="text-white font-black text-sm uppercase tracking-[0.4em] italic opacity-40">Await!</span>
                 <span className="text-blue-500 font-bold opacity-40">+</span>
                 <span className="text-white font-black text-sm uppercase tracking-[0.4em] italic opacity-40">Smart Shopping!</span>
                 <span className="text-blue-500 font-bold opacity-40">+</span>
                 <span className="text-white font-black text-sm uppercase tracking-[0.4em] italic opacity-40">Shop More, Save More!</span>
                 <span className="text-blue-500 font-bold opacity-40">+</span>
              </div>
            ))}
         </div>
      </div>

      <BannerCollage />

      {/* Best Selling Product Section */}
      <ProductSection 
        title="Best Selling Products" 
        subtitle="Our most loved items based on customer feedback and sales performance over the last quarter."
      />

      {/* Another Marquee (slightly different) */}
      <div className="bg-slate-900 py-6 overflow-hidden border-y border-white/5 relative">
         <div className="flex items-center whitespace-nowrap marquee">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                 <span className="text-white font-black text-sm uppercase tracking-[0.4em] italic opacity-40">Unbelievable Discounts!</span>
                 <span className="text-blue-500 font-bold opacity-40">+</span>
                 <span className="text-white font-black text-sm uppercase tracking-[0.4em] italic opacity-40">Welcome to DigyDukaan</span>
                 <span className="text-blue-500 font-bold opacity-40">+</span>
              </div>
            ))}
         </div>
      </div>

      <Testimonials />
      <InstagramSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;

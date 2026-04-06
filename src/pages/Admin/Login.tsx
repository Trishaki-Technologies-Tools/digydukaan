import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShoppingBag, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock Login Logic
    setTimeout(() => {
        if (email === 'admin@digydukaan.com' && password === 'admin123') {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
            setIsLoading(false);
        }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl mb-6 shadow-2xl">
              <ShoppingBag className="w-8 h-8 text-primary" />
           </div>
           <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 font-heading">
              DigyDukaan<span className="text-primary">.Admin</span>
           </h1>
           <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
              Access the command center
           </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                 <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@digydukaan.com"
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/10"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                 <label className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1">Password</label>
                 <button type="button" className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                 <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/10"
                 />
                 <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                 >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-3 rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group relative overflow-hidden disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
           <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
              &copy; 2026 DIGYDUKAAN TECHNOLOGIES
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Mail, ArrowRight, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'identify' | 'otp'>('identify');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']); // UPGRADED TO 8 DIGITS
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setLoading(true);
    setError('');
    
    const isEmail = identifier.includes('@');
    
    const { error } = await supabase.auth.signInWithOtp(
      isEmail 
        ? { email: identifier } 
        : { phone: identifier }
    );

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep('otp');
      setTimer(60);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('').trim();
    if (otpString.length < 6) return; // SUPABASE TYPICALLY REQUIRES 6, BUT WE ALLOW UP TO 8 IN UI

    setLoading(true);
    setError('');

    const isEmail = identifier.includes('@');
    const { error } = await supabase.auth.verifyOtp(
      isEmail
        ? { email: identifier, token: otpString, type: 'magiclink' }
        : { phone: identifier, token: otpString, type: 'sms' }
    );

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      const destination = localStorage.getItem('redirect_after_login');
      localStorage.removeItem('redirect_after_login');
      onClose();
      if (destination) {
         navigate(destination);
      } else {
         window.location.reload(); 
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 7) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-secondary/80 backdrop-blur-xl" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative bg-white w-full max-w-[480px] rounded-[3rem] shadow-4xl overflow-hidden border border-white/20"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-primary transition-all active:scale-90"
        >
          <X size={18} />
        </button>

        <div className="p-8 md:p-14">
          <div className="text-center mb-10">
             <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-3xl shadow-primary/30">
                  <ShieldCheck size={32} />
                </div>
             </div>
             <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase font-heading mb-3 leading-none">
                {step === 'identify' ? 'Login or Sign Up' : 'Enter 8-Digit Code'}
             </h2>
             <p className="text-[9px] font-black text-secondary/40 uppercase tracking-[0.2em] leading-relaxed max-w-[240px] mx-auto">
                {step === 'identify' 
                  ? 'Welcome! Enter your details to access your account.' 
                  : `We sent an 8-digit verification code to your device.`}
             </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'identify' ? (
              <motion.form key="identify" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest pl-2">Email or Phone Number</p>
                   <div className="relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-primary transition-all">
                       {identifier.includes('@') ? <Mail size={16} /> : <Smartphone size={16} />}
                     </div>
                     <input 
                       type="text" placeholder="e.g. name@email.com" value={identifier}
                       onChange={(e) => setIdentifier(e.target.value)}
                       className="w-full bg-slate-50 border-2 border-transparent rounded-[1.2rem] py-5 pl-14 pr-6 text-sm font-black placeholder:text-slate-300 focus:bg-white focus:border-primary/20 focus:ring-8 ring-primary/5 transition-all outline-none text-secondary shadow-inner"
                       autoFocus
                     />
                   </div>
                </div>

                {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-shake bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}

                <button 
                  type="submit" disabled={loading || !identifier}
                  className="w-full bg-secondary text-white py-5 rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl shadow-secondary/20 flex items-center justify-center gap-4 active:scale-[0.98] transition-all hover:bg-black group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <>Send Login Code <ArrowRight size={18} /></>}
                </button>
              </motion.form>
            ) : (
              <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="space-y-6">
                   <div className="flex justify-between gap-1.5 md:gap-2">
                     {otp.map((digit, idx) => (
                       <input
                         key={idx} id={`otp-${idx}`} type="text" inputMode="numeric" value={digit}
                         onChange={(e) => handleOtpChange(idx, e.target.value)}
                         onKeyDown={(e) => handleKeyDown(idx, e)}
                         className="w-full h-14 bg-slate-50 border-2 border-transparent rounded-xl text-center text-xl font-black text-secondary focus:bg-white focus:border-primary focus:ring-4 md:ring-8 ring-primary/5 transition-all outline-none shadow-inner"
                       />
                     ))}
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                      <p className="text-[9px] font-black text-secondary/40 uppercase tracking-[0.2em] leading-relaxed">
                         Code sent to: <span className="text-secondary">{identifier}</span>
                      </p>
                   </div>
                </div>

                {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-shake bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}

                <div className="space-y-5">
                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-primary text-white py-5 rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl shadow-primary/30 flex items-center justify-center gap-4 active:scale-[0.98] transition-all group/verify"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <>Verify & Continue <ShieldCheck size={20} /></>}
                  </button>

                  <div className="flex flex-col items-center gap-4">
                    {timer > 0 ? (
                      <span className="text-[9px] font-black text-secondary/20 uppercase tracking-widest">Resend code in <span className="text-secondary">{timer}s</span></span>
                    ) : (
                      <button type="button" onClick={handleSendOtp} className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full transition-all border border-primary/5"><RefreshCw size={12} /> Resend Code</button>
                    )}
                    <button type="button" onClick={() => setStep('identify')} className="text-[8px] font-black text-secondary/20 uppercase tracking-widest hover:text-secondary transition-colors">Change Account Info</button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <style dangerouslySetInnerHTML={{ __html: `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } } .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }`}} />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;

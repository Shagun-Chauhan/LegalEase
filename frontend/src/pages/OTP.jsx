import React, { useState, useRef, useEffect } from 'react';
import { Scale, ArrowLeft, RefreshCw, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from "../services/authService";

const maskEmail = (email) => {
  if (!email || !email.includes('@')) return 'your email';
  const [local, domain] = email.split('@');
  const visible = local.slice(0, 2);
  const masked = '*'.repeat(Math.max(local.length - 2, 3));
  return `${visible}${masked}@${domain}`;
};

export default function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'user@example.com';
  const maskedEmail = maskEmail(email);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const inputs = useRef([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    setError('');
    if (val && idx < 5) inputs.current[idx + 1].focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputs.current[5]?.focus();
    }
  };


const handleVerify = async () => {
  const code = otp.join('');

  if (code.length < 6) {
    setError('Please enter the complete 6-digit code');
    return;
  }

  setLoading(true);

  try {
    const res = await authService.verifyOtp({
      email,
      otp: code,
    });
    localStorage.setItem("user", JSON.stringify(res.data.user));
    navigate("/dashboard");

  } catch (err) {
    setError(err.response?.data?.message || "Invalid OTP");
  }

  setLoading(false);
};

const handleResend = async () => {
  if (!canResend) return;

  try {
    await authService.resendOtp({ email });

    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendCount(c => c + 1);

  } catch (err) {
    setError(err.response?.data?.message || "Error resending OTP");
  }
};
  const isFilled = otp.every(d => d !== '');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-navy-500/10 dark:bg-navy-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-navy-700 rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-navy group transition-all hover:rotate-6 active:scale-95 cursor-pointer" onClick={() => navigate('/')}>
            <Scale size={36} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight uppercase">LegalEase</h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Verify OTP</p>
        </div>

        {/* Card */}
        <div className="card-base p-8 md:p-10 shadow-2xl shadow-slate-200 dark:shadow-none border-slate-200 dark:border-white/10 relative overflow-hidden group text-center">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-navy-500/5 dark:bg-navy-500/10 rounded-full group-hover:scale-110 transition-transform duration-700" />
          
          <button
            onClick={() => navigate('/login')}
            className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-navy-600 dark:hover:text-navy-400 transition-all uppercase tracking-widest group/back"
          >
            <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back
          </button>

          {/* Header */}
          <div className="mb-10 mt-4 relative z-10">
            <div className="w-16 h-16 bg-navy-50 dark:bg-navy-950/40 rounded-3xl mx-auto mb-4 flex items-center justify-center border border-navy-100 dark:border-navy-900/30">
              <Mail size={28} className="text-navy-700 dark:text-navy-400" />
            </div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight uppercase">Verify Email</h2>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed mb-1">
              A security code was sent to
            </p>
            <p className="text-sm font-bold text-navy-700 dark:text-navy-400 font-mono tracking-wider bg-navy-50/50 dark:bg-navy-950/30 py-1 px-3 rounded-lg inline-block">{maskedEmail}</p>
          </div>

          {/* OTP Inputs */}
          <div className="flex gap-2.5 justify-center mb-8 relative z-10" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                className={`w-11 h-14 md:w-12 md:h-16 text-center text-xl md:text-2xl font-black border-2 rounded-2xl transition-all duration-300 outline-none
                  ${digit 
                    ? 'border-navy-600 dark:border-navy-500 bg-white dark:bg-slate-800 text-navy-800 dark:text-white shadow-lg shadow-navy' 
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 focus:border-navy-300 dark:focus:border-navy-700'
                  }
                  ${error ? '!border-red-500 !bg-red-50 dark:!bg-red-950/20' : ''}
                `}
              />
            ))}
          </div>

          {/* Progress / Resend */}
          <div className="relative z-10">
            {error && (
              <p className="text-center text-[10px] font-bold text-red-500 mb-6 flex items-center justify-center gap-2 uppercase tracking-tight animate-fade-in bg-red-50 dark:bg-red-950/20 py-2 rounded-xl border border-red-100 dark:border-red-900/10">
                <AlertCircle size={14} strokeWidth={3} />
                {error}
              </p>
            )}

            {!error && <div className="h-4 mb-6" />}

            {/* Verify */}
            <button
              onClick={handleVerify}
              disabled={!isFilled || loading}
              className="w-full bg-navy-700 hover:bg-navy-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-navy transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale group flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Account'}
            </button>

            {/* Resend */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy-600 dark:text-navy-400 mx-auto hover:text-navy-800 dark:hover:text-white transition-colors group/resend"
                >
                  <RefreshCw size={13} strokeWidth={3} className="group-hover/resend:rotate-180 transition-transform duration-700" /> Resend Security Code
                </button>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Request new code in <span className="text-navy-700 dark:text-navy-400 font-mono text-xs">{String(timer).padStart(2, '0')}s</span>
                  </p>
                  <div className="w-32 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-navy-500 transition-all duration-1000 ease-linear" style={{ width: `${(timer / 30) * 100}%` }} />
                  </div>
                </div>
              )}
              {resendCount > 0 && (
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-4 animate-fade-in flex items-center justify-center gap-1.5">
                  <CheckCircle size={12} strokeWidth={3} /> Code Resent Successfully
                </p>
              )}
            </div>
          </div>
       </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-600 mt-8 leading-relaxed">
          Wrong email address?{' '}
          <span onClick={() => navigate('/login')} className="text-navy-600 dark:text-navy-400 underline decoration-navy-500/30 underline-offset-4 cursor-pointer hover:text-navy-700 transition-colors">
            Modify Inbox
          </span>
        </p>
     </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Scale, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-navy-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-navy-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-navy">
            <Scale size={30} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">LegalEase</h1>
        </div>

        {/* Card */}
        <div className="card-base p-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ArrowLeft size={15} /> Back to Sign In
          </button>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 bg-navy-100 rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <Mail size={24} className="text-navy-700" />
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-900 mb-2">Check your email</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We sent a 6-digit verification code to
            </p>
            <p className="text-sm font-bold text-slate-800 mt-1 font-mono tracking-wide">{maskedEmail}</p>
          </div>

          {/* OTP Inputs */}
          <div className="flex gap-2 justify-center mb-2" onPaste={handlePaste}>
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
                className={`otp-input transition-all duration-200
                  ${digit ? 'border-navy-500 bg-navy-50 text-navy-700' : 'border-slate-200'}
                  ${error ? '!border-red-400 bg-red-50' : ''}
                `}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-xs text-red-500 mb-4 flex items-center justify-center gap-1.5">
              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-[9px] font-bold">!</span>
              {error}
            </p>
          )}

          {!error && <p className="text-center text-xs text-slate-400 mb-5">Enter the code from your inbox · check spam if not seen</p>}

          {/* Verify */}
          <button
            onClick={handleVerify}
            disabled={!isFilled || loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? <span className="spinner" /> : 'Verify & Continue'}
          </button>

          {/* Resend */}
          <div className="text-center mt-5">
            {canResend ? (
              <button
                onClick={handleResend}
                className="flex items-center gap-1.5 text-sm text-navy-600 font-semibold mx-auto hover:underline"
              >
                <RefreshCw size={13} /> Resend Code
              </button>
            ) : (
              <p className="text-sm text-slate-500">
                Resend code in{' '}
                <span className="font-bold text-navy-700 font-mono">{String(timer).padStart(2, '0')}s</span>
              </p>
            )}
            {resendCount > 0 && (
              <p className="text-xs text-emerald-600 mt-1.5 font-medium">✓ New code sent to {maskedEmail}</p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Wrong email?{' '}
          <span onClick={() => navigate('/login')} className="text-navy-600 font-semibold cursor-pointer hover:underline">
            Go back and change it
          </span>
        </p>
      </div>
    </div>
  );
}

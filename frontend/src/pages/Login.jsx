import React, { useState, useCallback } from 'react';
import { Scale, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from "../services/authService";
import toast from 'react-hot-toast';

const Field = ({ label, error, children }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">{label}</label>
    {children}
    {error && (
      <p className="text-[10px] font-bold text-red-500 mt-1.5 flex items-center gap-1.5 pl-1 uppercase tracking-tight">
        <AlertCircle size={12} strokeWidth={3} />
        {error}
      </p>
    )}
  </div>
);

const getPasswordStrength = (password) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', width: 'w-1/4' };
  if (score === 2) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500', width: 'w-2/4' };
  if (score === 3) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500', width: 'w-3/4' };
  return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500', width: 'w-full' };
};

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validateLogin = () => {
    const e = {};
    if (!validateEmail(email)) e.email = 'Enter a valid email address';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const validateSignup = () => {
    const e = {};
    if (!fullName.trim() || fullName.trim().length < 2) e.fullName = 'Enter your full name';
    if (!validateEmail(email)) e.email = 'Enter a valid email address';
    if (!password || password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };


  const handleSubmit = async () => {
    const errs = mode === 'signup' ? validateSignup() : validateLogin();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await authService.register({
          name: fullName,
          email,
          password,
        });

        toast.success(res.data.message || "Registration successful!");
        navigate('/otp', { state: { email } });

      } else {
        const res = await authService.login({
          email,
          password,
        });

        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // onMouseDown + preventDefault keeps focus on the input when toggling visibility
  const handleTogglePassword = useCallback((e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  }, []);

  const handleToggleConfirm = useCallback((e) => {
    e.preventDefault();
    setShowConfirm((prev) => !prev);
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirm(false);
  };

  const strength = mode === 'signup' ? getPasswordStrength(password) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-navy-500/10 dark:bg-navy-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-navy-700 rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-navy group transition-all hover:rotate-6 active:scale-95 cursor-pointer">
            <Scale size={36} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">LegalEase</h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Your Smart Legal Companion</p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-1.5 mb-8 border border-slate-200 dark:border-white/5">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-800 shadow-xl text-navy-700 dark:text-white' : 'text-slate-500 dark:text-slate-500 hover:text-navy-600'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white dark:bg-slate-800 shadow-xl text-navy-700 dark:text-white' : 'text-slate-500 dark:text-slate-500 hover:text-navy-600'
              }`}
          >
            Create Account
          </button>
        </div>

        {/* Card */}
        <div className="card-base p-8 md:p-10 shadow-2xl shadow-slate-200 dark:shadow-none border-slate-200 dark:border-white/10 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-navy-500/5 dark:bg-navy-500/10 rounded-full group-hover:scale-110 transition-transform duration-700" />

          {/* ── SIGN IN ── */}
          {mode === 'login' && (
            <>
              <div className="mb-8 relative z-10">
                <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">Login</h1>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sign in to your LegalEase vault</p>
              </div>

              <div className="space-y-6 relative z-10">
                <Field label="Identity / Email" error={errors.email}>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="name@vault.com"
                      autoComplete="email"
                      className={`input-field pl-12 py-3.5 text-sm font-medium ${errors.email ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                  </div>
                </Field>

                <Field label="Secret Password" error={errors.password}>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`input-field pl-12 pr-12 py-3.5 text-sm font-medium ${errors.password ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                    <button
                      type="button"
                      onMouseDown={handleTogglePassword}
                      tabIndex={-1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Field>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-navy-700 hover:bg-navy-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-navy transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <> Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>}
                </button>
              </div>
            </>
          )}

          {/* ── SIGN UP ── */}
          {mode === 'signup' && (
            <>
              <div className="mb-8 relative z-10">
                <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-1">Create Account</h2>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Get free access to premium legal tools</p>
              </div>

              <div className="space-y-5 relative z-10">
                <Field label="Full Legal Name" error={errors.fullName}>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: '' })); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Arjun Kumar Sharma"
                    autoComplete="name"
                    className={`input-field py-3.5 text-sm font-medium ${errors.fullName ? 'border-red-300 focus:ring-red-400' : ''}`}
                  />
                </Field>

                <Field label="Email Address" error={errors.email}>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="name@vault.com"
                      autoComplete="email"
                      className={`input-field pl-12 py-3.5 text-sm font-medium ${errors.email ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                  </div>
                </Field>

                <Field label="Secure Password" error={errors.password}>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      className={`input-field pl-12 pr-12 py-3.5 text-sm font-medium ${errors.password ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                    <button
                      type="button"
                      onMouseDown={handleTogglePassword}
                      tabIndex={-1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password && strength && (
                    <div className="mt-3 px-1">
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width} shadow-sm shadow-inherit`} />
                      </div>
                      <p className={`text-[10px] mt-2 font-black uppercase tracking-widest ${strength.text}`}>{strength.label} Strength</p>
                    </div>
                  )}
                </Field>

                <Field label="Match Password" error={errors.confirmPassword}>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      className={`input-field pl-12 pr-12 py-3.5 text-sm font-medium ${errors.confirmPassword ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                    <button
                      type="button"
                      onMouseDown={handleToggleConfirm}
                      tabIndex={-1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors p-1"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Field>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-navy-700 hover:bg-navy-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-navy transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <> Register <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-8 mt-10">
          <div className="flex items-center gap-2 transition-all hover:scale-105">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
              <Shield size={14} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Encrypted</span>
          </div>
          <div className="flex items-center gap-2 transition-all hover:scale-105">
            <div className="w-8 h-8 rounded-full bg-navy-100 dark:bg-navy-950/40 flex items-center justify-center text-navy-600 dark:text-navy-400">
              <CheckCircle size={14} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Secure</span>
          </div>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-8 uppercase tracking-widest leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-navy-600 dark:text-navy-400 underline decoration-navy-500/30 underline-offset-4 cursor-pointer hover:text-navy-700 transition-colors">Terms</span>
          {' '}and{' '}
          <span className="text-navy-600 dark:text-navy-400 underline decoration-navy-500/30 underline-offset-4 cursor-pointer hover:text-navy-700 transition-colors">Privacy</span>
        </p>
      </div>
    </div>
  );
}

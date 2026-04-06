import React, { useState, useCallback } from 'react';
import { Scale, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle, AlertCircle, Loader2, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import authService from "../services/authService";

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

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validateSignup = () => {
    const e = {};
    if (!fullName.trim() || fullName.trim().length < 2) e.fullName = 'Enter your full name';
    if (!validateEmail(email)) e.email = 'Enter a valid email address';
    if (!password || password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validateSignup();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);

    try {
      const res = await authService.register({
        name: fullName,
        email,
        password,
      });

      alert(res.data.message);
      navigate('/otp', { state: { email } });

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleTogglePassword = useCallback((e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  }, []);

  const handleToggleConfirm = useCallback((e) => {
    e.preventDefault();
    setShowConfirm((prev) => !prev);
  }, []);

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-navy-500/10 dark:bg-navy-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-navy-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-navy cursor-pointer" onClick={() => navigate("/")}>
            <Scale size={32} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">Create Account</h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Join the legal revolution</p>
        </div>

        <div className="card-base p-8 md:p-10 shadow-2xl shadow-slate-200 dark:shadow-none border-slate-200 dark:border-white/10 relative overflow-hidden group">
          <div className="space-y-5 relative z-10">
            <Field label="Full Legal Name" error={errors.fullName}>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: '' })); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Arjun Kumar Sharma"
                  className={`input-field pl-12 py-3.5 text-sm font-medium ${errors.fullName ? 'border-red-300 focus:ring-red-400' : ''}`}
                />
              </div>
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
                  className={`input-field pl-12 pr-12 py-3.5 text-sm font-medium ${errors.password ? 'border-red-300 focus:ring-red-400' : ''}`}
                />
                <button
                  type="button"
                  onMouseDown={handleTogglePassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && strength && (
                <div className="mt-3 px-1">
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-[10px] mt-2 font-black uppercase tracking-widest ${strength.text}`}>{strength.label} Strength</p>
                </div>
              )}
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword}>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Repeat password"
                  className={`input-field pl-12 pr-12 py-3.5 text-sm font-medium ${errors.confirmPassword ? 'border-red-300 focus:ring-red-400' : ''}`}
                />
                <button
                  type="button"
                  onMouseDown={handleToggleConfirm}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-600 transition-colors p-1"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-navy-700 hover:bg-navy-800 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-navy transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <> Create Account <ArrowRight size={18} /> </>}
            </button>
          </div>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-white/5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Already have an account?{' '}
              <Link to="/login" className="text-navy-600 dark:text-navy-400 font-black hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-8 mt-10">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-navy-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}

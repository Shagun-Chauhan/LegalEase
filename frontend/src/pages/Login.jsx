import React, { useState, useCallback } from 'react';
import { Scale, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from "../services/authService";

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    {children}
    {error && (
      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold">!</span>
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

        alert(res.data.message);
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
      alert(err.response?.data?.message || "Something went wrong");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-navy-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-navy-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-navy">
            <Scale size={30} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">LegalEase</h1>
          <p className="text-slate-500 text-sm">Your Smart Legal Companion</p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Create Account
          </button>
        </div>

        {/* Card */}
        <div className="card-base p-8">

          {/* ── SIGN IN ── */}
          {mode === 'login' && (
            <>
              <div className="mb-6">
                <h2 className="font-display text-xl font-semibold text-slate-900 mb-1">Welcome back</h2>
                <p className="text-sm text-slate-500">Sign in to your LegalEase account</p>
              </div>

              <div className="space-y-4">
                <Field label="Email Address" error={errors.email}>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`input-field pl-10 ${errors.email ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                  </div>
                </Field>

                <Field label="Password" error={errors.password}>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                    <button
                      type="button"
                      onMouseDown={handleTogglePassword}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? <span className="spinner" /> : <> Sign In <ArrowRight size={16} /> </>}
                </button>
              </div>
            </>
          )}

          {/* ── SIGN UP ── */}
          {mode === 'signup' && (
            <>
              <div className="mb-6">
                <h2 className="font-display text-xl font-semibold text-slate-900 mb-1">Create your account</h2>
                <p className="text-sm text-slate-500">Get free access to legal guidance and tools</p>
              </div>

              <div className="space-y-4">
                <Field label="Full Name" error={errors.fullName}>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: '' })); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Arjun Kumar Sharma"
                    autoComplete="name"
                    className={`input-field ${errors.fullName ? 'border-red-300 focus:ring-red-400' : ''}`}
                  />
                </Field>

                <Field label="Email Address" error={errors.email}>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`input-field pl-10 ${errors.email ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                  </div>
                </Field>

                <Field label="Password" error={errors.password}>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                    <button
                      type="button"
                      onMouseDown={handleTogglePassword}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && strength && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <p className={`text-xs mt-1 font-semibold ${strength.text}`}>{strength.label} password</p>
                    </div>
                  )}
                </Field>

                <Field label="Confirm Password" error={errors.confirmPassword}>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className={`input-field pl-10 pr-11 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-400' : ''}`}
                    />
                    <button
                      type="button"
                      onMouseDown={handleToggleConfirm}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? <span className="spinner" /> : <> Create Account <ArrowRight size={16} /> </>}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Shield size={12} className="text-emerald-500" />
            <span>256-bit encrypted</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle size={12} className="text-navy-500" />
            <span>No spam, ever</span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          By continuing, you agree to our{' '}
          <span className="text-navy-600 underline cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-navy-600 underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

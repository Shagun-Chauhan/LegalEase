import React, { useState, useEffect } from 'react';
import { Scale, Menu, X, Moon, Sun } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-navy-700 rounded-2xl flex items-center justify-center shadow-lg shadow-navy transition-transform group-hover:scale-105 border border-navy-600">
            <Scale size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-slate-900 dark:text-white text-xl tracking-tight leading-none">LegalEase</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">Smart Legal Tech</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors">Features</a>
          <a href="#how-it-works" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors">How it works</a>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all active:scale-95"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2" />
          
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-black uppercase tracking-widest text-navy-700 dark:text-navy-400 hover:underline underline-offset-8 decoration-navy-500/30"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-navy-700 hover:bg-navy-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-navy transition-all active:scale-95"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
           <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-900 dark:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-500">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-500">How it works</a>
          </div>
          <div className="h-px bg-slate-200 dark:bg-white/5" />
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              className="w-full py-4 text-xs font-black uppercase tracking-widest text-navy-700 dark:text-navy-400 border border-navy-100 dark:border-navy-900/40 rounded-xl"
            >
              Login
            </button>
            <button 
               onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
              className="w-full py-4 bg-navy-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-navy"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

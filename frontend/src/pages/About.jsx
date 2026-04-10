import React from 'react';
import { Scale, Shield, Zap, Target, Users, Globe, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <PublicNavbar />

      <main className="pt-40 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-600 mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Go Back
          </button>
          
          {/* Hero Section */}
          <div className="text-center mb-24 animate-slide-up">
            <h1 className="section-label mb-4">Our Story</h1>
            <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-none">
              Making the Law <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-700 to-indigo-600 dark:from-navy-400 dark:to-indigo-400">Accessible to All</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              LegalEase was born out of a simple realization: the legal system is often too complex, 
              intimidating, and expensive for the average person. We're here to change that using 
              the power of Artificial Intelligence.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            <div className="card-base p-10 md:p-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="w-14 h-14 bg-navy-50 dark:bg-navy-950/40 rounded-2xl flex items-center justify-center mb-8 border border-navy-100 dark:border-navy-900/50">
                <Target className="text-navy-700 dark:text-navy-400" size={28} />
              </div>
              <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-6">Our Mission</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                To democratize legal services by providing instant, affordable, and accurate 
                legal guidance to everyone, regardless of their background or financial status. 
                We believe everyone deserves to understand their rights.
              </p>
            </div>
            <div className="card-base p-10 md:p-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100 dark:border-emerald-900/50">
                <Globe className="text-emerald-700 dark:text-emerald-400" size={28} />
              </div>
              <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-6">Our Vision</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                To become the world's most trusted legal companion, where anyone can 
                resolve legal disputes, analyze contracts, and navigate the law with the 
                same confidence as a legal professional.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-32">
            <h2 className="section-label text-center mb-16">The Core Values that drive us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Uncompromising Integrity", desc: "We handle your sensitive legal data with the highest security standards." },
                { icon: Zap, title: "Radical Simplicity", desc: "Turning complex legal jargon into clear, actionable steps for everyone." },
                { icon: Users, title: "User Empowerment", desc: "Putting the power of the library of law into the hands of the individual." },
                { icon: Award, title: "Precision First", desc: "Leveraging state-of-the-art AI models cross-referenced with legal precedents." }
              ].map((val, i) => (
                <div key={i} className="card-base p-8 hover:translate-y-[-4px] transition-all duration-300">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center mb-6 text-navy-600 dark:text-navy-400 border border-slate-100 dark:border-white/5">
                    <val.icon size={24} />
                  </div>
                  <h4 className="font-bold text-lg mb-3 uppercase tracking-tight leading-tight">{val.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="card-base p-12 md:p-20 bg-navy-900 overflow-hidden relative group text-center">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-navy-800/50 -skew-x-12 translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 max-w-3xl mx-auto leading-none">
                Ready to handle your <br /> legal matters smarter?
              </h2>
              <button 
                className="bg-white text-navy-900 px-12 py-5 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
                onClick={() => window.location.href = '/register'}
              >
                Join LegalEase Today
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale size={20} className="text-navy-700 dark:text-navy-400" />
          <span className="font-display font-bold uppercase tracking-tight">LegalEase AI</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Made with excellence for the common person.
        </p>
      </footer>
    </div>
  );
}

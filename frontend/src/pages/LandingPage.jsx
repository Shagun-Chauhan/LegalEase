import React, { useEffect } from 'react';
import { Scale, ArrowRight, Shield, Zap, FileText, Search, MapPin, CheckCircle, Globe, Award, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import FeatureCard from '../components/FeatureCard';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: Scale,
      title: "Solve Legal Issues",
      description: "Get step-by-step guidance for over 50+ legal categories including consumer fraud, tenancy, and labor disputes.",
      delay: 100
    },
    {
      icon: FileText,
      title: "Analyze Documents",
      description: "Upload any contract or legal notice. Our AI identifies risks, hidden clauses, and missing information in seconds.",
      delay: 200
    },
    {
      icon: Zap,
      title: "Generate Notices",
      description: "Draft legally sound complaint letters, rent agreements, and legal notices effortlessly using our AI generator.",
      delay: 300
    },
    {
      icon: MapPin,
      title: "Find Nearby Help",
      description: "Instantly locate the nearest courts, police stations, and legal aid centers with contact info and navigation details.",
      delay: 400
    },
    {
      icon: Shield,
      title: "Case Monitoring",
      description: "Keep track of your legal activities, important documents, and upcoming deadlines in one secure vault.",
      delay: 500
    },
    {
      icon: Search,
      title: "Legal Search",
      description: "Search through thousands of legal resources and precedents simplified for the common person, not just lawyers.",
      delay: 600
    }
  ];

  const steps = [
    {
      id: "01",
      title: "Choose Problem",
      description: "Select from 50+ legal categories or simply upload a document that needs analysis.",
      icon: Search
    },
    {
      id: "02",
      title: "AI Analysis",
      description: "Our advanced AI processes your data, cross-referencing it with standard legal frameworks.",
      icon: Zap
    },
    {
      id: "03",
      title: "Get Solution",
      description: "Receive a detailed report, risk analysis, or a ready-to-use legal document instantly.",
      icon: CheckCircle
    }
  ];

  const testimonials = [
    {
      text: "LegalEase helped me draft a legal notice for my unpaid salary in under 5 minutes. The process was seamless!",
      author: "Rahul Sharma",
      role: "Software Engineer",
      stars: 5,
      avatar: "R"
    },
    {
      text: "The document analysis tool saved me from a major rental agreement trap. It flagged a hidden security deposit clause.",
      author: "Priya V.",
      role: "Freelance Designer",
      stars: 5,
      avatar: "P"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-60 md:pb-40 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[60%] h-[100%] bg-navy-500/5 dark:bg-navy-500/10 rounded-bl-full blur-[150px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-tr-full blur-[150px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-50 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-900/50 text-navy-700 dark:text-navy-400 mb-8 animate-slide-up">
            <span className="flex h-2 w-2 rounded-full bg-navy-600 animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Legal Tech</span>
          </div>

          <h1 className="font-display text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase animate-slide-up" style={{ animationDelay: '100ms' }}>
            Simplify Legal <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-indigo-600 dark:from-navy-400 dark:to-indigo-400">Problems with AI</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
            The all-in-one legal companion. Analyze document risks, generate legal notices,
            and get expert guidance on issues—all powered by advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-navy-700 hover:bg-navy-800 text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-navy transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Get Started Now <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xl"
            >
              Login to Vault
            </button>
          </div>

          {/* Floating Indicators */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {[Award, Users, Globe, Shield].map((Icon, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Icon size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Trusted Partner</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 md:px-10 bg-white dark:bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="section-label mb-4">Powerful Features</h2>
            <h3 className="font-display text-4xl md:text-5xl font-black tracking-tight uppercase">Everything you need <br /> to handle Legal matters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-6 md:px-10 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="section-label mb-4 text-left">Process</h2>
              <h3 className="font-display text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-none">How it works</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Legal problems shouldn't be endless headaches. We've simplified the entire process into three simple steps.
              </p>

              <div className="mt-12 space-y-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-navy-700 hover:bg-navy-800 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-navy transition-all"
                >
                  Start Your Analysis
                </button>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-white/5 -translate-y-1/2 hidden lg:block" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {steps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center lg:items-start lg:text-left group">
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 border-2 border-navy-100 dark:border-navy-900/50 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl group-hover:bg-navy-700 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      <step.icon size={24} />
                    </div>
                    <span className="text-4xl font-black text-navy-600/10 dark:text-white/5 mb-2 leading-none">{step.id}</span>
                    <h4 className="font-display text-xl font-bold mb-3 uppercase tracking-tight">{step.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Testimonials Section */}
      <section className="py-32 px-6 md:px-10 bg-white dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-label mb-4 text-left font-black">Trusted by Thousands</h2>
              <h3 className="font-display text-4xl md:text-5xl font-black tracking-tight uppercase mb-8">What our users <br /> are saying</h3>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <span className="font-black text-sm uppercase tracking-widest">4.9/5 Rating</span>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-black text-navy-700 dark:text-navy-400 mb-1 leading-none tracking-tighter">5k+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Users</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-navy-700 dark:text-navy-400 mb-1 leading-none tracking-tighter">12k+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Docs Scanned</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-navy-700 dark:text-navy-400 mb-1 leading-none tracking-tighter">98%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Success Rate</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {testimonials.map((t, i) => (
                <div key={i} className="card-base p-8 border-slate-100 dark:border-white/5 hover:scale-[1.02] transition-transform">
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-700 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg border border-navy-600">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-display font-bold uppercase tracking-tight text-slate-900 dark:text-white leading-none mb-1">{t.author}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center shadow-lg shadow-navy border border-navy-600">
                  <Scale size={16} className="text-white" />
                </div>
                <h1 className="font-display font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-none uppercase">LegalEase</h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mb-8">
                Making the law accessible, understandable, and affordable for everyone using the power of AI.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">Analysis</a></li>
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">Generator</a></li>
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">Nearby Case</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">Privacy</a></li>
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">Terms</a></li>
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">Vault Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">About</a></li>
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">Contact</a></li>
                <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 transition-colors uppercase tracking-widest">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5 opacity-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 md:mb-0">
              © 2026 LegalEase AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Twitter</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">LinkedIn</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Github</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

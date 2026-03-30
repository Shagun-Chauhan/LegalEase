import React, { useState, useEffect } from 'react';
import {
  Scale, ArrowRight, Shield, Zap, FileText, MapPin, Star,
  CheckCircle, Menu, X, ChevronDown, Upload, Users, Award,
  BookOpen, Phone, Mail, Twitter, Linkedin, Instagram,
  Play, TrendingUp, Clock, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Scale,
    title: 'Solve Legal Issues',
    desc: 'Step-by-step AI guidance for 50+ legal problems — fraud, salary disputes, tenant issues, and more.',
    color: 'text-navy-600', bg: 'bg-navy-100',
  },
  {
    icon: Upload,
    title: 'Analyze Documents',
    desc: 'Upload any contract or agreement and get an instant AI risk analysis with plain-language summaries.',
    color: 'text-emerald-600', bg: 'bg-emerald-100',
  },
  {
    icon: FileText,
    title: 'Generate Legal Docs',
    desc: 'Draft professional legal notices, complaints, and agreements in English, Hindi, or Marathi.',
    color: 'text-purple-600', bg: 'bg-purple-100',
  },
  {
    icon: MapPin,
    title: 'Find Legal Resources',
    desc: 'Locate nearby courts, police stations, and free legal aid centres with directions and timings.',
    color: 'text-red-500', bg: 'bg-red-100',
  },
];



const testimonials = [
  {
    name: 'Priya Nair',
    role: 'Small Business Owner, Pune',
    avatar: 'PN',
    avatarBg: 'bg-rose-500',
    text: 'LegalEase helped me draft a legal notice for my vendor dispute in minutes. What would have taken a week with a lawyer was done in 10 minutes. Incredible!',
    rating: 5,
  },
  {
    name: 'Rohan Deshmukh',
    role: 'Software Engineer, Bangalore',
    avatar: 'RD',
    avatarBg: 'bg-navy-600',
    text: 'I uploaded my rental agreement and immediately found 3 risky clauses I had missed. Saved me from signing something terrible. This app is a must-have.',
    rating: 5,
  },
  {
    name: 'Sunita Patil',
    role: 'Teacher, Nagpur',
    avatar: 'SP',
    avatarBg: 'bg-emerald-600',
    text: 'The Hindi language support made it so easy for my mother to file a consumer complaint. She understood everything clearly. Thank you LegalEase!',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'Is LegalEase a substitute for a lawyer?',
    a: 'No. LegalEase is an AI-powered tool that helps you understand your legal situation, draft documents, and prepare for meetings with lawyers. For complex matters, we always recommend consulting a qualified advocate.',
  },
  {
    q: 'How secure are my documents?',
    a: 'All documents are encrypted in transit and at rest using 256-bit AES encryption. We never share your data with third parties, and files are auto-deleted after 30 days.',
  },
  {
    q: 'Which languages are supported?',
    a: 'Currently English, Hindi (हिन्दी), and Marathi (मराठी). We are actively adding more Indian regional languages.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes! The free plan includes 3 document analyses, 3 legal notices, and unlimited issue guidance per month. Premium plans unlock unlimited access and priority support.',
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${open ? 'border-navy-200 bg-navy-50/30' : 'border-slate-200 bg-white'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className={`font-semibold text-sm leading-relaxed ${open ? 'text-navy-800' : 'text-slate-800'}`}>{q}</span>
        <ChevronDown size={16} className={`flex-shrink-0 ml-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-navy-600' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center shadow-navy">
              <Scale size={16} className="text-white" />
            </div>
            <span className={`font-display font-bold text-lg transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>LegalEase</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Testimonials', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 hover:text-navy-700' : 'text-white/80 hover:text-white'}`}>
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className={`text-sm font-semibold transition-colors px-4 py-2 ${scrolled ? 'text-slate-700 hover:text-navy-700' : 'text-white/90 hover:text-white'}`}>
              Sign In
            </button>
            <button onClick={() => navigate('/login')}
              className="btn-primary text-sm py-2 px-5">
              Get Started Free
            </button>
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {navOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-5 py-4 space-y-3">
            {['Features', 'How It Works', 'Testimonials', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setNavOpen(false)}
                className="block text-sm font-medium text-slate-700 py-2">
                {item}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button onClick={() => navigate('/login')} className="btn-secondary w-full text-sm py-2.5">Sign In</button>
              <button onClick={() => navigate('/login')} className="btn-primary w-full text-sm py-2.5">Get Started Free</button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-navy-400/15 rounded-full blur-3xl" />
          {/* Grid lines */}
          <div className="absolute inset-0 h-[600px]"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-6 backdrop-blur-sm">
            <Zap size={11} className="text-amber-400" />
            AI-Powered Legal Assistance for Every Indian
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Legal Help That's
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
              Simple, Fast & Affordable
            </span>
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            From fraud complaints to rental disputes — LegalEase guides you through every legal problem with AI-powered step-by-step advice, document analysis, and instant notice generation.
          </p>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-xs">
            {[
              { icon: Shield, text: '256-bit Encrypted' },
              { icon: Lock,   text: 'Privacy First' },
              { icon: Award,  text: 'Trusted by 2.4L+ Users' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon size={13} className="text-emerald-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

      </section>


      {/* ── FEATURES ── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-2">What We Offer</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need, legally
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              One platform to understand, navigate, and resolve any legal situation — no law degree required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="group card-base p-6 card-hover border-2 border-transparent hover:border-navy-100">
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-2">Simple Process</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">How LegalEase works</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Get legal clarity in 3 simple steps — no jargon, no confusion.</p>
          </div>
          <div className="relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-10 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-navy-200 via-navy-400 to-navy-200" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: Scale,    title: 'Describe Your Issue',    desc: 'Select your legal problem from 50+ categories or describe it in your own words.' },
                { step: '02', icon: Zap,      title: 'Get AI Guidance',        desc: 'Our AI instantly provides step-by-step actions, required documents, and legal context.' },
                { step: '03', icon: CheckCircle, title: 'Take Action',          desc: 'Draft notices, locate nearby courts, or connect with a lawyer — all from one place.' },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="text-center relative">
                  <div className="w-20 h-20 bg-navy-700 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-navy relative z-10">
                    <Icon size={28} className="text-white" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-navy-200 rounded-full flex items-center justify-center text-[10px] font-bold text-navy-700">{step}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <button onClick={() => navigate('/login')} className="btn-primary inline-flex items-center gap-2">
              Try It Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-2">Real Stories</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by thousands</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-amber-400 fill-amber-400" />)}
              <span className="ml-2 text-sm font-semibold text-slate-700">4.9/5 from 12,000+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, avatar, avatarBg, text, rating }) => (
              <div key={name} className="card-base p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(rating)].map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed flex-1">"{text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className={`w-9 h-9 ${avatarBg} rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 leading-none">{name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-2">FAQ</p>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-navy-400/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Your legal rights matter.
            <span className="block text-indigo-400">Let's protect them together.</span>
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Join 2.4 lakh Indians who use LegalEase to navigate legal challenges with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')}
              className="bg-white text-navy-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-xl hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2">
              Create Free Account <ArrowRight size={16} />
            </button>
            <button className="border border-white/25 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2">
              <Phone size={14} /> Talk to a Lawyer
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-navy-700 rounded-lg flex items-center justify-center">
                  <Scale size={13} className="text-white" />
                </div>
                <span className="font-display font-bold text-white text-base">LegalEase</span>
              </div>
              <p className="text-xs leading-relaxed mb-4">AI-powered legal assistance for every Indian citizen.</p>
              <div className="flex gap-3">
                {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-navy-700 cursor-pointer transition-colors">
                    <Icon size={14} />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: 'Product',  links: ['Features', 'Pricing', 'Dashboard', 'Document Generator'] },
              { title: 'Legal',    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'] },
              { title: 'Support',  links: ['Help Centre', 'Contact Us', 'Report a Bug', 'Community'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-white font-semibold text-sm mb-3">{title}</p>
                <ul className="space-y-2">
                  {links.map(l => (
                    <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>© 2026 LegalEase. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <Mail size={11} />
              <span>support@legalease.in</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

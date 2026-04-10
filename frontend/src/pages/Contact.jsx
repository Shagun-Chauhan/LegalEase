import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Scale, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import toast from 'react-hot-toast';

export default function Contact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Info */}
            <div className="animate-slide-up">
              <h1 className="section-label mb-4 text-left">Get in Touch</h1>
              <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                Let's Discuss <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-700 to-indigo-600 dark:from-navy-400 dark:to-indigo-400">Your Concerns</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12 max-w-lg">
                Have questions about our AI tools? Or need help navigating a legal issue? 
                Our support team and legal experts are here to assist you 24/7.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Mail, label: 'Email Support', val: 'support@legalease.ai', color: 'text-navy-600' },
                  { icon: Phone, label: 'Helpline', val: '+91 800-LAW-TECH', color: 'text-emerald-600' },
                  { icon: MapPin, label: 'Office', val: 'Digital Square, Tech Park, Gurugram', color: 'text-rose-600' },
                  { icon: Clock, label: 'Availability', val: '24/7 AI Support, Mon-Fri Human Support', color: 'text-amber-600' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <item.icon size={20} className={item.color} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                      <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links placeholder */}
              <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 flex gap-8">
                {['LinkedIn', 'Twitter', 'Github'].map((social) => (
                  <span key={social} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 cursor-pointer transition-colors">
                    {social}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="card-base p-8 md:p-12 relative overflow-hidden group">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-navy-500/5 dark:bg-navy-500/10 rounded-bl-full pointer-events-none" />
                
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-8">Send a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Your Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe" 
                        className="input-field" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com" 
                        className="input-field" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      placeholder="How can we help you?" 
                      className="input-field" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="Type your message here..." 
                      className="input-field resize-none py-4" 
                    />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-navy-700 hover:bg-navy-800 text-white py-5 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-navy transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <> Send Message <Send size={18} /> </>}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale size={20} className="text-navy-700 dark:text-navy-400" />
          <span className="font-display font-bold uppercase tracking-tight">LegalEase Support</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Typically responds within 4 hours.
        </p>
      </footer>
    </div>
  );
}

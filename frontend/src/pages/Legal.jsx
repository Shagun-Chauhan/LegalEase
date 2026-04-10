import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, FileText, Lock, ArrowLeft, Scale, ChevronRight } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'April 2026',
    icon: Shield,
    sections: [
      { h: 'Data Collection', p: 'We collect information you provide directly to us when you create an account, upload documents, or communicate with us.' },
      { h: 'Usage of AI', p: 'Your documents are processed by our AI models to provide legal insights. We do not use your personal legal documents to train our public models.' },
      { h: 'Data Security', p: 'We implement industry-standard encryption to protect your data both in transit and at rest in your secure vault.' }
    ]
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'April 2026',
    icon: FileText,
    sections: [
      { h: 'Service Usage', p: 'LegalEase provides AI-driven legal assistance. This does not constitute professional legal advice from a licensed attorney.' },
      { h: 'User Responsibilities', p: 'You are responsible for the accuracy of the information you provide and for any actions taken based on AI insights.' },
      { h: 'Subscription', p: 'Certain premium features may require a paid subscription. All fees are clearly stated before purchase.' }
    ]
  },
  vault: {
    title: 'Vault Policy',
    lastUpdated: 'April 2026',
    icon: Lock,
    sections: [
      { h: 'Document Retention', p: 'Documents in your vault are kept until you explicitly delete them or close your account.' },
      { h: 'Access Control', p: 'Only you have access to your vault documents. Even LegalEase employees cannot view your private vault content.' },
      { h: 'Encryption Standards', p: 'All vault content is encrypted using AES-256 standards, ensuring your legal privacy.' }
    ]
  }
};

export default function Legal() {
  const { section } = useParams();
  const navigate = useNavigate();
  const data = CONTENT[section] || CONTENT.privacy;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <PublicNavbar />

      <main className="pt-40 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-600 mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Go Back
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-navy-50 dark:bg-navy-950/40 rounded-xl flex items-center justify-center border border-navy-100 dark:border-navy-900/50">
              <data.icon className="text-navy-700 dark:text-navy-400" size={24} />
            </div>
            <div>
              <h1 className="font-display text-4xl font-black uppercase tracking-tighter">{data.title}</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Last Updated: {data.lastUpdated}</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/5 my-10" />

          {/* Navigation Tabs for other legal sections */}
          <div className="flex gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
            {Object.keys(CONTENT).map(key => (
              <button
                key={key}
                onClick={() => navigate(`/legal/${key}`)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  section === key 
                    ? 'bg-navy-900 text-white border-navy-900 shadow-lg shadow-navy' 
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-white/5 hover:border-navy-300'
                }`}
              >
                {CONTENT[key].title}
              </button>
            ))}
          </div>

          <div className="space-y-12 animate-fade-in">
            {data.sections.map((s, i) => (
              <section key={i} className="group">
                <div className="flex gap-4 mb-4">
                  <span className="text-xs font-black text-navy-600 dark:text-navy-400 mt-1">0{i+1}.</span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">{s.h}</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium pl-8 border-l-2 border-transparent group-hover:border-navy-100 dark:group-hover:border-navy-900 transition-all duration-500">
                  {s.p}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-20 p-10 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/5">
            <h4 className="font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Scale size={18} className="text-navy-600" /> Need Clarification?
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">
              If you have any questions regarding our legal documents or how we handle your data, 
              please reach out to our legal compliance team.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              className="text-[10px] font-black uppercase tracking-widest text-navy-700 dark:text-navy-400 flex items-center gap-2 group"
            >
              Contact Legal Compliance <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </main>

      <footer className="py-12 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          © 2026 LegalEase AI • Dedicated to Transparency
        </p>
      </footer>
    </div>
  );
}

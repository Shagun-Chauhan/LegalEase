import React from 'react';
import { Newspaper, Calendar, User, ArrowRight, Scale, Search, Tag } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const POSTS = [
  {
    id: 1,
    title: 'How AI is Revolutionizing Consumer Law in 2026',
    excerpt: 'Discover how automated legal assistants are helping everyday citizens fight back against corporate fraud.',
    author: 'Adv. Sarah Chen',
    date: 'April 10, 2026',
    category: 'Legal Tech',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Navigating New Rental Agreements with AI Analysis',
    excerpt: 'Avoid hidden clauses and unfair security deposit terms with our latest document parsing updates.',
    author: 'LegalEase AI Team',
    date: 'April 08, 2026',
    category: 'Property Law',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'The Future of Digital Evidence in Small Claims Court',
    excerpt: 'Everything you need to know about presenting digital chat logs as valid evidence in court.',
    author: 'Rahul Verma',
    date: 'April 05, 2026',
    category: 'Court Tips',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <PublicNavbar />

      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20 animate-slide-up">
            <h1 className="section-label mb-4">The Newsroom</h1>
            <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              Legal Insights <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-700 to-indigo-600 dark:from-navy-400 dark:to-indigo-400">Simplified for You</span>
            </h2>
            
            <div className="max-w-xl mx-auto relative group mt-10">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search articles, guides, or categories..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl pl-16 pr-6 py-5 text-sm font-medium focus:ring-4 focus:ring-navy-500/10 focus:border-navy-500 outline-none transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post, i) => (
              <article key={post.id} className="card-base overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-500 group">
                <div className="relative h-56 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-navy-700 dark:text-navy-400 border border-navy-100 dark:border-navy-900/50">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><User size={12} /> {post.author}</span>
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight mb-4 group-hover:text-navy-700 dark:group-hover:text-navy-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-navy-700 dark:text-navy-400 mt-auto group/btn">
                    Read Full Article <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button className="btn-secondary px-10 py-4 uppercase tracking-widest text-xs font-black">
              Load More Insights
            </button>
          </div>

        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
          <Scale size={16} className="text-navy-600" /> LegalEase Blog • Stay Informed
        </p>
      </footer>
    </div>
  );
}

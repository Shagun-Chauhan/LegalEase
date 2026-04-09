import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, DollarSign, Home, Briefcase, Car, CreditCard,
  Users, ShieldAlert, Scale, ArrowRight, Search, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AIChat from '../components/AIChat';

const categories = [
  {
    id: 'fraud',
    icon: AlertTriangle,
    title: 'Fraud & Cheating',
    description: 'Online scams, financial fraud, cheating by individuals or businesses',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    tag: 'High Priority',
    tagColor: 'badge-red',
    count: '12 sub-issues',
  },
  {
    id: 'salary',
    icon: DollarSign,
    title: 'Salary & Workplace',
    description: 'Unpaid wages, wrongful termination, harassment, PF/ESI issues',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    tag: 'Common',
    tagColor: 'badge-yellow',
    count: '8 sub-issues',
  },
  {
    id: 'tenant',
    icon: Home,
    title: 'Tenant Dispute',
    description: 'Illegal eviction, deposit refund, maintenance negligence, rent hike',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    tag: 'Common',
    tagColor: 'badge-yellow',
    count: '10 sub-issues',
  },
  {
    id: 'consumer',
    icon: CreditCard,
    title: 'Consumer Rights',
    description: 'Product defects, service failures, e-commerce disputes, refund issues',
    iconBg: 'bg-navy-100',
    iconColor: 'text-navy-600',
    tag: 'Popular',
    tagColor: 'badge-blue',
    count: '15 sub-issues',
  },
  {
    id: 'property',
    icon: Briefcase,
    title: 'Property Dispute',
    description: 'Ownership conflicts, encroachment, inheritance, builder fraud',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    tag: 'Complex',
    tagColor: 'badge-red',
    count: '9 sub-issues',
  },
  {
    id: 'vehicle',
    icon: Car,
    title: 'Motor Vehicle',
    description: 'Accident claims, insurance disputes, challan issues, RC transfer',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    tag: 'New',
    tagColor: 'badge-green',
    count: '7 sub-issues',
  },
  {
    id: 'family',
    icon: Users,
    title: 'Family & Marriage',
    description: 'Divorce, custody, maintenance, domestic violence, property rights',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    tag: 'Sensitive',
    tagColor: 'badge-red',
    count: '11 sub-issues',
  },
  {
    id: 'cyber',
    icon: ShieldAlert,
    title: 'Cybercrime',
    description: 'Hacking, identity theft, cyber stalking, account takeover',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    tag: 'Urgent',
    tagColor: 'badge-red',
    count: '6 sub-issues',
  },
];

import authService from '../services/authService';

export default function IssueSelection() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => {
    authService.getProfile()
      .then(res => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(err => console.error(err));
  }, []);

  const filtered = categories.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelected(id);
    setTimeout(() => navigate('/action', { state: { issueId: id } }), 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} user={user} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`transition-all duration-500 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} pt-20`}>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">
            <span className="cursor-pointer hover:text-navy-600 transition-colors" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-slate-900 dark:text-slate-300">Select Issue</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-navy-100 dark:bg-navy-950/40 flex items-center justify-center border border-navy-200/50 dark:border-navy-800/30">
                <Scale size={18} className="text-navy-700 dark:text-navy-400" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy-600 dark:text-navy-400">Legal Help</p>
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white tracking-tight uppercase mb-2">What is your concern?</h1>
            <p className="text-md font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Select the category that best describes your situation. We'll provide specific legal frameworks, documentation checklists, and procedural guidance tailored to your needs.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-10 max-w-xl group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors" />
            <input
              type="text"
              placeholder="Search legal issues, laws, or keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-12 py-4 text-sm font-medium shadow-xl shadow-slate-200 dark:shadow-none"
            />
          </div>

          {/* Category Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 card-base border-dashed bg-slate-50/50 dark:bg-slate-900/20">
              <Scale size={48} className="text-slate-200 dark:text-slate-800 mx-auto mb-4" />
              <h3 className="font-display text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">No matching issues found</h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(cat => {
                const Icon = cat.icon;
                const isSelected = selected === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelect(cat.id)}
                    className={`card-base p-6 group cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col h-full
                      ${isSelected 
                        ? 'ring-2 ring-navy-500 bg-navy-50/50 dark:bg-navy-950/20' 
                        : 'hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-navy hover:border-navy-200 dark:hover:border-navy-800/50 hover:-translate-y-1'
                      }`}
                  >
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-navy-500/5 dark:bg-navy-500/10 rounded-full group-hover:scale-110 transition-transform duration-700" />
                    
                    <div className="flex items-start justify-between mb-5 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl ${cat.iconBg} dark:bg-opacity-10 flex items-center justify-center transition-transform group-hover:scale-110 border border-white/20 dark:border-white/5 shadow-sm`}>
                        <Icon size={24} className={cat.iconColor} />
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${cat.tagColor.replace('badge-', 'border-').replace('red', 'red-500/20').replace('yellow', 'amber-500/20').replace('blue', 'blue-500/20').replace('green', 'emerald-500/20')} ${cat.iconColor} bg-white dark:bg-slate-900 shadow-sm`}>
                        {cat.tag}
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-navy-700 dark:group-hover:text-navy-400 transition-colors mb-2">
                      {cat.title}
                    </h2>
                    <p className="text-md font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-grow">{cat.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{cat.count}</span>
                      <div className="flex items-center gap-1.5 text-navy-600 dark:text-navy-400">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">Select</span>
                        <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Help Banner */}
          <div className="mt-12 p-8 rounded-[2rem] bg-navy-900 dark:bg-navy-900/40 border border-navy-800/50 dark:border-navy-700/30 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl shadow-navy">
            <div className="absolute top-0 right-0 w-64 h-64 bg-navy-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="w-16 h-16 rounded-[1.25rem] bg-navy-800 dark:bg-navy-950 flex items-center justify-center flex-shrink-0 border border-navy-700/50 shadow-xl relative z-10">
              <Scale size={32} className="text-navy-400" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <h4 className="font-display text-lg font-bold text-white tracking-tight uppercase mb-1">In doubt? Consult AI Assistant</h4>
              <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest leading-relaxed">Describe your unique problem and our system will map out the correct legal pathway for you.</p>
            </div>
            
            <button
            onClick={() => setChatOpen(true)}
            className="bg-white hover:bg-navy-50 text-navy-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl relative z-10 group flex items-center gap-2"
          >
            Start Session
            <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
          {chatOpen && <AIChat onClose={() => setChatOpen(false)} />}
          </div>

        </div>
      </main>
    </div>
  );
}

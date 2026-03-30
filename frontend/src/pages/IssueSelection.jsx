import React, { useState } from 'react';
import {
  AlertTriangle, DollarSign, Home, Briefcase, Car, CreditCard,
  Users, ShieldAlert, Scale, ArrowRight, Search, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

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

export default function IssueSelection() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = categories.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelected(id);
    setTimeout(() => navigate('/action', { state: { issueId: id } }), 300);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 pt-16">
        <div className="p-5 md:p-7 max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <span className="cursor-pointer hover:text-navy-600" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium">Select Legal Issue</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Scale size={18} className="text-navy-600" />
              <p className="section-label">Legal Guidance</p>
            </div>
            <h1 className="page-title">What's your legal concern?</h1>
            <p className="text-sm text-slate-500 mt-1">
              Select the category that best describes your issue to get step-by-step legal guidance.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search legal issues..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 card-base">
              <Scale size={36} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-600 mb-1">No issues found</h3>
              <p className="text-sm text-slate-400">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(cat => {
                const Icon = cat.icon;
                const isSelected = selected === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelect(cat.id)}
                    className={`card-base card-hover p-5 group ${isSelected ? 'ring-2 ring-navy-500 ring-offset-2 bg-navy-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon size={20} className={cat.iconColor} />
                      </div>
                      <span className={`badge ${cat.tagColor} text-[10px]`}>{cat.tag}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1.5 group-hover:text-navy-700 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">{cat.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{cat.count}</span>
                      <ArrowRight size={14} className="text-navy-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Help Banner */}
          <div className="mt-7 p-5 rounded-2xl bg-navy-50 border border-navy-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center flex-shrink-0">
              <Scale size={18} className="text-navy-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-800">Can't find your issue?</p>
              <p className="text-xs text-navy-600 mt-0.5">Describe your problem and our AI will match the right legal pathway for you.</p>
            </div>
            <button className="btn-primary text-sm px-4 py-2 flex-shrink-0">Ask AI</button>
          </div>

        </div>
      </main>
    </div>
  );
}

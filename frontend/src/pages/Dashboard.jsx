import React, { useState } from 'react';
import { Scale, Upload, FileText, TrendingUp, Clock, CheckCircle, ArrowRight, Sparkles, BookOpen, Shield, MapPin, Navigation, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import LocationPicker from '../components/LocationPicker';

const stats = [
  { label: 'Issues Resolved', value: '12', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { label: 'Active Cases', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'Docs Generated', value: '28', icon: FileText, color: 'text-navy-600', bg: 'bg-navy-100' },
  { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const recentActivity = [
  { title: 'Rental Agreement Analyzed', type: 'Document', time: '2 hours ago', status: 'completed' },
  { title: 'Workplace Harassment Complaint', type: 'Legal Issue', time: '1 day ago', status: 'pending' },
  { title: 'Legal Notice Generated', type: 'Document', time: '2 days ago', status: 'completed' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 pt-16">
        <div className="p-5 md:p-7 max-w-6xl mx-auto">

          {/* Welcome Banner */}
          <div className="mb-7 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-600 p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10">
              <Scale size={180} className="absolute -right-8 -top-4 text-white" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-navy-200">Good Morning</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Hello, Arjun 👋</h2>
              <p className="text-navy-200 text-sm max-w-lg leading-relaxed">
                You have <span className="text-white font-semibold">3 active cases</span> and{' '}
                <span className="text-white font-semibold">1 pending document</span> to review. LegalEase is here to help.
              </p>
              <button
                onClick={() => navigate('/issues')}
                className="mt-4 inline-flex items-center gap-2 bg-white text-navy-800 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-navy-50 transition-colors"
              >
                Get Started <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card-base p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon size={15} className={color} />
                  </div>
                </div>
                <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Main Action Cards */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-label">Quick Actions</p>
                <h3 className="font-display text-lg font-semibold text-slate-900 mt-0.5">What do you need help with?</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                icon={Scale}
                iconBg="bg-navy-100"
                iconColor="text-navy-700"
                title="Solve a Legal Issue"
                description="Get step-by-step guidance for fraud, salary disputes, tenant issues, and 50+ more legal matters."
                footer="Explore Issues"
                onClick={() => navigate('/issues')}
                badge="Most Popular"
                badgeVariant="blue"
                highlighted
              />
              <Card
                icon={Upload}
                iconBg="bg-emerald-100"
                iconColor="text-emerald-700"
                title="Upload & Analyze Document"
                description="Upload any legal document—contract, notice, or agreement—and get an AI-powered risk analysis instantly."
                footer="Upload Now"
                onClick={() => navigate('/upload')}
              />
              <Card
                icon={FileText}
                iconBg="bg-purple-100"
                iconColor="text-purple-700"
                title="Generate Legal Document"
                description="Create professional legal notices, agreements, and complaint letters in minutes using AI."
                footer="Generate Document"
                onClick={() => navigate('/generate')}
                badge="New"
                badgeVariant="green"
              />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            {/* Recent Activity */}
            <div className="card-base">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-500" />
                  <h3 className="font-semibold text-slate-800">Recent Activity</h3>
                </div>
                <button className="text-xs text-navy-600 font-semibold hover:underline">View All</button>
              </div>
              <div className="divide-y divide-slate-50">
                {recentActivity.map((item, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.type} · {item.time}</p>
                    </div>
                    <span className={`badge text-[10px] ${item.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Tips */}
            <div className="card-base">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <BookOpen size={16} className="text-slate-500" />
                <h3 className="font-semibold text-slate-800">Legal Tips for You</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { icon: Shield, color: 'text-navy-600', bg: 'bg-navy-100', tip: 'Always keep copies of all legal documents and correspondences.', label: 'Document Safety' },
                  { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', tip: 'Limitation period for consumer complaints is typically 2 years from the date of cause.', label: 'Time Limits' },
                  { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', tip: 'A valid contract requires offer, acceptance, consideration, and mutual consent.', label: 'Contract Basics' },
                ].map(({ icon: Icon, color, bg, tip, label }, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={14} className={color} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nearby Legal Resources Widget */}
          <div className="mt-5 card-base overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-navy-600" />
                <h3 className="font-semibold text-slate-800">Nearby Legal Resources</h3>
              </div>
              <button
                onClick={() => setLocationOpen(true)}
                className="text-xs text-navy-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Navigation size={11} /> Find Near Me
              </button>
            </div>

            {/* Quick links grid */}
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { icon: Scale, label: 'Courts', desc: 'District & High Courts', color: 'text-navy-600', bg: 'bg-navy-100', count: '12 nearby' },
                  { icon: Shield, label: 'Police Stations', desc: 'Cyber & general crime', color: 'text-red-600', bg: 'bg-red-100', count: '8 nearby' },
                  { icon: Building2, label: 'Legal Aid', desc: 'Free legal assistance', color: 'text-emerald-600', bg: 'bg-emerald-100', count: '5 nearby' },
                ].map(({ icon: Icon, label, desc, color, bg, count }) => (
                  <button
                    key={label}
                    onClick={() => setLocationOpen(true)}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-navy-50 border border-slate-200 hover:border-navy-200 transition-all group text-left"
                  >
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-navy-800">{label}</p>
                      <p className="text-xs text-slate-400 truncate">{desc}</p>
                      <p className={`text-xs font-bold mt-0.5 ${color}`}>{count}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Location prompt banner */}
              <div
                onClick={() => setLocationOpen(true)}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-navy-50 to-indigo-50 border border-navy-100 cursor-pointer hover:border-navy-300 transition-all group"
              >
                <div className="w-10 h-10 bg-navy-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-navy group-hover:scale-105 transition-transform">
                  <Navigation size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-800">Find courts, police stations & legal aid near you</p>
                  <p className="text-xs text-navy-500 mt-0.5">Get directions, phone numbers, and opening hours instantly</p>
                </div>
                <ArrowRight size={16} className="text-navy-400 group-hover:text-navy-700 flex-shrink-0 transition-colors" />
              </div>
            </div>
          </div>

          {locationOpen && (
            <LocationPicker onClose={() => setLocationOpen(false)} onCitySelect={() => setLocationOpen(false)} />
          )}

        </div>
      </main>
    </div>
  );
}

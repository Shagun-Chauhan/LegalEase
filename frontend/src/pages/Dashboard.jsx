import React, { useState, useEffect } from 'react';
import { Scale, Upload, FileText, TrendingUp, Clock, CheckCircle, ArrowRight, Sparkles, BookOpen, Shield, MapPin, Navigation, Building2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import LocationPicker from '../components/LocationPicker';
import authService from '../services/authService';
import documentService from '../services/documentService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    highRiskCount: 0,
    avgRiskScore: 0,
    recentActivity: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          authService.getProfile(),
          documentService.getStats()
        ]);

        setUser(profileRes.data);
        localStorage.setItem("user", JSON.stringify(profileRes.data));
        setStats(statsRes.data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: 'High Risk Docs', value: stats.highRiskCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Total Analyzed', value: stats.totalDocuments, icon: FileText, color: 'text-navy-600', bg: 'bg-navy-100' },
    { label: 'Avg Risk Score', value: stats.avgRiskScore, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Safety Rating', value: stats.totalDocuments > 0 ? (100 - (stats.avgRiskScore * 10)).toFixed(0) + '%' : 'N/A', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} user={user} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`transition-all duration-500 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} pt-20`}>
        <div className="p-5 md:p-7 max-w-6xl mx-auto">

          {/* Welcome Banner */}
          <div className="mb-7 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-600 p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10">
              <Scale size={180} className="absolute -right-8 -top-4 text-white" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-navy-200">Legal Assistant</span>
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Hello, {user?.name.split(' ')[0] || 'User'} 👋</h2>
              <p className="text-navy-200 text-sm max-w-lg leading-relaxed">
                You have <span className="text-white font-semibold">{stats.totalDocuments} document{stats.totalDocuments !== 1 ? 's' : ''}</span> analyzed.
                Keep track of your legal activities easily.
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="mt-4 inline-flex items-center gap-2 bg-white dark:bg-slate-900/50 backdrop-blur-md text-navy-800 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-navy-50 transition-colors"
              >
                Upload New Document <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card-base p-5 group hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} dark:bg-opacity-20 flex items-center justify-center border dark:border-transparent group-hover:rotate-6 transition-transform`}>
                    <Icon size={18} className={color} />
                  </div>
                </div>
                <p className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Main Action Cards */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="mb-6">
                <p className="section-label mb-1">Actions</p>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight">Need help with something?</h3>
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
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-500 dark:text-slate-400" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-300">Recent Activity</h3>
                </div>
                <button
                  onClick={() => navigate('/upload')}
                  className="text-xs text-navy-600 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((item, i) => (
                    <div
                      key={item.id}
                      onClick={() => navigate('/upload')}
                      className="px-6 py-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                    >
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 shadow-sm ${item.riskLevel === 'Low' ? 'bg-emerald-500' : item.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-navy-700 dark:group-hover:text-navy-400 transition-colors uppercase tracking-tight">{item.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{item.type} · {new Date(item.time).toLocaleDateString()}</p>
                      </div>
                      <span className={`badge ${item.riskLevel === 'Low' ? 'badge-green' : item.riskLevel === 'Medium' ? 'badge-yellow' : 'badge-red'} scale-90`}>
                        {item.riskLevel} Risk
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">No recent activity yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legal Tips */}
            <div className="card-base">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
                <BookOpen size={16} className="text-slate-500 dark:text-slate-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-300">Legal Tips for You</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { icon: Shield, color: 'text-navy-600 dark:text-navy-400', bg: 'bg-navy-100 dark:bg-navy-900/30', tip: 'Always keep copies of all legal documents and correspondences.', label: 'Document Safety' },
                  { icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', tip: 'Limitation period for consumer complaints is typically 2 years from the date of cause.', label: 'Time Limits' },
                  { icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', tip: 'A valid contract requires offer, acceptance, consideration, and mutual consent.', label: 'Contract Basics' },
                ].map(({ icon: Icon, color, bg, tip, label }, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 hover:border-navy-200 dark:hover:border-navy-900 transition-all group">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 mt-0.5 border dark:border-transparent group-hover:scale-110 transition-transform`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nearby Legal Resources Widget */}
          <div className="mt-5 card-base overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-navy-600" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-300">Nearby Legal Resources</h3>
              </div>

            </div>

            {/* Quick links grid */}
            <div className="p-6">

              {/* Location prompt banner */}
              <div
                onClick={() => setLocationOpen(true)}
                className="flex items-center gap-5 p-6 rounded-3xl bg-gradient-to-br from-navy-50 via-white to-indigo-50 dark:from-navy-950/40 dark:via-slate-900 dark:to-navy-950/20 border border-navy-100 dark:border-navy-900/30 cursor-pointer hover:border-navy-400 dark:hover:border-navy-700 transition-all group relative overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Navigation size={120} className="-rotate-12" />
                </div>
                <div className="w-14 h-14 bg-navy-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-navy group-hover:scale-110 group-hover:rotate-3 transition-all relative z-10">
                  <Navigation size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <p className="text-base font-bold text-navy-900 dark:text-navy-100 tracking-tight">Access Local Legal Network</p>
                  <p className="text-xs font-medium text-navy-600/70 dark:text-navy-400/60 mt-1 leading-relaxed">Find courts, police stations & legal aid with instant directions and contact info</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-navy-100 dark:bg-navy-900/50 flex items-center justify-center text-navy-600 dark:text-navy-400 group-hover:bg-navy-700 group-hover:text-white transition-all relative z-10">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>

          {locationOpen && (
            <LocationPicker onClose={() => setLocationOpen(false)} />
          )}

        </div>
      </main>
    </div>
  );
}

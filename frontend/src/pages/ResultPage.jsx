import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Scale,
  BarChart,
  ShieldAlert,
  FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function ResultPage() {
  const [data, setData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return <div className="p-10">No Data</div>;

  const riskColor =
    data.riskLevel === "High"
      ? "text-red-500"
      : data.riskLevel === "Medium"
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={`transition-all duration-500 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} pt-20`}>
        <div className="p-6 md:p-10 max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-navy-100 dark:bg-navy-950/40 flex items-center justify-center border border-navy-200/50 dark:border-navy-800/30">
              <FileText size={18} className="text-navy-700 dark:text-navy-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-navy-600 dark:text-navy-400">Analysis Report</p>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight uppercase mb-2">
            Analysis Results
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {data.legalProcessType} · Powered by LegalEase
          </p>
        </div>

        {/* TOP SUMMARY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Risk Score */}
          <div className="card-base p-6 md:p-8 relative overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center border border-red-100 dark:border-red-900/20">
                <BarChart size={20} className="text-red-500" strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Risk Score</p>
            </div>

            <p className={`text-2xl font-bold tracking-tight mb-4 relative z-10 ${riskColor}`}>
              {data.riskScore}<span className="text-lg text-slate-300 dark:text-slate-700">/10</span>
            </p>

            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10 border border-slate-200/50 dark:border-white/5">
              <div
                className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(239,68,68,0.4)] ${
                   data.riskScore > 7 ? 'bg-red-500' : data.riskScore > 4 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${data.riskScore * 10}%` }}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div className="card-base p-6 md:p-8 relative overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-navy-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-navy-50 dark:bg-navy-950/30 flex items-center justify-center border border-navy-100 dark:border-navy-900/20">
                <ShieldAlert size={20} className="text-navy-600 dark:text-navy-400" strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Risk Level</p>
            </div>

            <p className={`text-xl font-bold uppercase tracking-widest font-display relative z-10 ${riskColor}`}>
              {data.riskLevel}
            </p>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 relative z-10">AI Analysis</p>
          </div>

          {/* Dominant Party */}
          <div className="card-base p-6 md:p-8 relative overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/20">
                <Scale size={20} className="text-emerald-500" strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Main Beneficiary</p>
            </div>

            <p className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight relative z-10">
              {data.dominantParty || "Neutral Balance"}
            </p>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 relative z-10">Contract Balance</p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="card-base p-8 mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 relative overflow-hidden group rounded-2xl">
          <div className="absolute top-0 left-0 w-1 h-full bg-navy-500/50" />
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white tracking-widest uppercase mb-4">
            Summary
          </h2>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            {data.documentSummary}
          </p>
        </div>

        {/* KEY POINTS */}
        <div className="mb-10">
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" strokeWidth={3} /> Key Points
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {data.keyPoints.map((p, i) => (
              <div
                key={i}
                className="card-base p-6 hover:translate-y-[-2px] transition-transform flex items-start gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-navy-500 mt-1.5 flex-shrink-0" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RED FLAGS */}
        <div className="mb-10 pt-4 border-t border-slate-100 dark:border-white/5">
          <h2 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle size={14} strokeWidth={3} /> Risky Clauses Detected
          </h2>

          <div className="space-y-4">
            {data.redFlags?.map((r, i) => (
              <div
                key={i}
                className="p-6 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-100/50 dark:border-red-900/20 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                <p className="text-sm font-bold text-red-800 dark:text-red-300 leading-relaxed pl-2">
                   {r}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FINANCIAL + TIME */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-base p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Estimated Legal Cost</p>
            <p className="text-lg font-black text-navy-800 dark:text-navy-400 tracking-tight">
              {data.estimatedCost}
            </p>
          </div>

          <div className="card-base p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Projected Timeline</p>
            <p className="text-lg font-black text-navy-800 dark:text-navy-400 tracking-tight">
              {data.estimatedTime}
            </p>
          </div>
        </div>

        {/* SUCCESS PROBABILITY */}
        <div className="card-base p-6 mb-8 bg-emerald-500 dark:bg-emerald-900/40 text-white dark:text-emerald-400 border-none relative overflow-hidden group rounded-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 relative z-10">Chance of Success</h2>
          <p className="text-xl font-bold tracking-tight relative z-10 drop-shadow-sm">
            {data.successProbability}
          </p>
        </div>

        {/* SIMPLE EXPLANATION */}
        <div className="p-8 md:p-10 rounded-[2.5rem] bg-indigo-900 dark:bg-indigo-950/40 text-white border border-indigo-800/50 dark:border-indigo-900/30 relative overflow-hidden shadow-2xl shadow-indigo-500">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mb-48" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-4 relative z-10">Simple Explanation</h2>
          <p className="text-base md:text-lg font-bold leading-relaxed tracking-tight relative z-10 italic">
            "{data.simpleExplanation}"
          </p>
        </div>

        </div>
      </main>
    </div>
  );
}



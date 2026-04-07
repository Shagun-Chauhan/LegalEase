import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Copy, Check, ChevronRight,
  ArrowLeft, Printer, Share2, Sparkles, Edit3, RefreshCw, AlertTriangle, CheckCircle, Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import generatorService from '../services/generatorService';
import toast from 'react-hot-toast';

export default function GeneratorOutput() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const { form, docType, language } = location.state || {};
  const [docText, setDocText] = useState("Initializing intelligence synthesis... Establishing secure protocol with backend.");
  const [draftLoaded, setDraftLoaded] = useState(false);

  const langLabel = { english: '🇬🇧 English', hindi: '🇮🇳 Hindi', marathi: '🟠 Marathi' }[language] || '🇬🇧 English';

  const fetchDraft = async () => {
    try {
      setDraftLoaded(false);
      const res = await generatorService.getDraft({ docType, form });
      setDocText(res.data.text);
      setDraftLoaded(true);
    } catch (err) {
      setDocText("Failed to generate draft. Please try again.");
    }
  };

  useEffect(() => {
    fetchDraft();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Artifact text copied to clipboard.");
  };

  const handleDownload = async () => {
    if (!draftLoaded) return;
    setFinalizing(true);
    const toastId = toast.loading("Finalizing artifact and translating dynamically...", { duration: 15000 });

    try {
      const res = await generatorService.finalizeDocument({
        docText,
        language: language || 'english',
        docType: docType || 'general',
        issueType: form?.issueType
      });

      if (res.data.document?.cloudinaryUrl) {
        toast.success("Document finalized securely! Downloading PDF...", { id: toastId });
        const url = res.data.document.cloudinaryUrl;

        window.open(url, "_blank");
      }
    } catch (err) {
      toast.error("Finalization failed: " + (err.response?.data?.message || err.message), { id: toastId });
    }
    setFinalizing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`transition-all duration-500 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} pt-20`}>
        <div className="p-6 md:p-10 max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">
            <span className="cursor-pointer hover:text-navy-600 transition-colors" onClick={() => navigate('/dashboard')}>Vault</span>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="cursor-pointer hover:text-navy-600 transition-colors" onClick={() => navigate('/generate')}>Generator</span>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-slate-900 dark:text-slate-300 font-black">Artifact Preview</span>
          </div>

          <button onClick={() => navigate('/generate')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-navy-600 dark:hover:text-navy-400 mb-6 transition-all uppercase tracking-widest group/back">
            <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back to Parameters
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center border border-amber-200/50 dark:border-amber-800/30">
                  <Sparkles size={18} className="text-amber-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Synthesis Complete</p>
                <span className="px-2 py-0.5 rounded-md bg-navy-50 dark:bg-navy-950 text-navy-700 dark:text-navy-400 text-[9px] font-black uppercase tracking-widest border border-navy-200/50 dark:border-navy-800/30">{langLabel}</span>
              </div>
              <h1 className="font-display text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Review Your Artifact</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">Intelligence successfully synthesized. Conduct a final audit before execution or semantic translation.</p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(!editing)}
                disabled={!draftLoaded}
                className={`p-3 rounded-xl border transition-all ${editing ? 'bg-navy-900 border-navy-900 text-white shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-navy-200'} disabled:opacity-50`}
              >
                <Edit3 size={18} strokeWidth={2.5} />
              </button>
              <button onClick={handleCopy} disabled={!draftLoaded} className={`p-3 rounded-xl border transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-navy-200 disabled:opacity-50 ${copied ? 'text-emerald-500 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20' : ''}`}>
                {copied ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {/* Success Marker */}
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500/50" />
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-emerald-950 flex items-center justify-center shadow-lg border border-emerald-100 dark:border-emerald-900/30 flex-shrink-0">
              {draftLoaded ? <CheckCircle size={20} className="text-emerald-500" strokeWidth={3} /> : <Loader2 size={20} className="animate-spin text-emerald-500" strokeWidth={3} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-0.5">{draftLoaded ? "Structural Integrity Verified" : "Constructing Base Template..."}</p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500">Document formulated using Tier-1 legal statutes and secure templating constraints.</p>
            </div>
          </div>

          {/* Document */}
          <div className="card-base mb-5 overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 rounded-3xl">
            {/* Document Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-navy-600" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Generated_Artifact.txt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Document Content */}
            {editing ? (
              <textarea
                value={docText}
                onChange={e => setDocText(e.target.value)}
                className="w-full p-8 font-mono text-sm text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900 focus:outline-none resize-none min-h-[500px] leading-relaxed"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              />
            ) : (
              <pre className="p-8 font-mono text-sm text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900 whitespace-pre-wrap leading-relaxed overflow-x-auto min-h-[400px] max-h-[500px] overflow-y-auto"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {docText}
              </pre>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              disabled={!draftLoaded || finalizing}
              className="btn-primary flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {finalizing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {finalizing ? "Translating & Encoding PDF..." : "Encode & Download PDF"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

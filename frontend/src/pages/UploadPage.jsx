import React, { useState } from 'react';
import { Upload, FileText, Shield, Zap, ChevronRight, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UploadBox from '../components/UploadBox';

export default function UploadPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [docType, setDocType] = useState('');

  const docTypes = [
    'Rental / Lease Agreement',
    'Employment Contract',
    'Legal Notice',
    'Sale Deed / Property Agreement',
    'Partnership Deed',
    'NDA / Confidentiality Agreement',
    'Loan Agreement',
    'Other',
  ];

  const handleAnalyze = () => {
    if (!files.length) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      navigate('/result');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 pt-16">
        <div className="p-5 md:p-7 max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <span className="cursor-pointer hover:text-navy-600" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium">Upload Document</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Upload size={18} className="text-navy-600" />
              <p className="section-label">Document Analysis</p>
            </div>
            <h1 className="page-title">Upload Your Legal Document</h1>
            <p className="text-sm text-slate-500 mt-1">
              Our AI analyzes your document for key clauses, important dates, risks, and legal implications.
            </p>
          </div>

          {/* Feature Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { icon: Zap, text: 'Instant AI Analysis', color: 'text-amber-600' },
              { icon: Shield, text: '100% Confidential', color: 'text-emerald-600' },
              { icon: FileText, text: 'Multi-format Support', color: 'text-navy-600' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                <Icon size={12} className={color} />
                {text}
              </div>
            ))}
          </div>

          {/* Upload Card */}
          <div className="card-base p-6 mb-5">
            <h2 className="font-semibold text-slate-800 mb-4 text-sm flex items-center gap-2">
              <Upload size={15} className="text-navy-600" /> Upload Document
            </h2>
            <UploadBox onFileSelect={setFiles} />
          </div>

          {/* Document Type */}
          <div className="card-base p-6 mb-5">
            <h2 className="font-semibold text-slate-800 mb-1 text-sm">Document Type</h2>
            <p className="text-xs text-slate-400 mb-4">Helps AI provide more targeted analysis</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {docTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`text-xs font-medium px-3 py-2.5 rounded-xl border text-left transition-all duration-200
                    ${docType === type
                      ? 'bg-navy-700 text-white border-navy-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-navy-300 hover:text-navy-700'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6">
            <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Privacy Guaranteed:</strong> Your documents are encrypted using AES-256 and processed in a secure environment. 
              We never store or share your documents. Files are auto-deleted after analysis.
            </p>
          </div>

          {/* What We Analyze */}
          <div className="card-base p-5 mb-6">
            <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Zap size={15} className="text-amber-500" /> What Our AI Analyzes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Key Clauses', desc: 'Important terms and conditions', color: 'bg-navy-100 text-navy-700' },
                { label: 'Important Dates', desc: 'Deadlines and expiry dates', color: 'bg-purple-100 text-purple-700' },
                { label: 'Financial Terms', desc: 'Amounts, penalties, fees', color: 'bg-emerald-100 text-emerald-700' },
                { label: 'Risky Clauses', desc: 'Unfair or unusual terms', color: 'bg-red-100 text-red-700' },
              ].map(({ label, desc, color }) => (
                <div key={label} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
                  <span className={`badge ${color} mt-0.5 flex-shrink-0 text-[10px]`}>{label}</span>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAnalyze}
            disabled={!files.length || analyzing}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base py-4"
          >
            {analyzing ? (
              <>
                <span className="spinner" />
                Analyzing Document...
              </>
            ) : (
              <>
                <Zap size={18} /> Analyze Document <ArrowRight size={16} />
              </>
            )}
          </button>

          {analyzing && (
            <div className="mt-4 p-4 bg-navy-50 border border-navy-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="spinner" style={{ borderColor: 'rgba(67,56,202,0.3)', borderTopColor: '#4338ca' }} />
                <p className="text-sm font-semibold text-navy-700">AI is analyzing your document...</p>
              </div>
              <div className="space-y-1.5">
                {['Extracting text and structure...', 'Identifying key clauses...', 'Detecting risky terms...'].map((t, i) => (
                  <p key={i} className="text-xs text-navy-500 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-navy-400 rounded-full" /> {t}
                  </p>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

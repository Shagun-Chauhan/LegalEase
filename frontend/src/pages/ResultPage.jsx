import React, { useState } from 'react';
import {
  FileText, Download, Share2, ChevronRight, CheckCircle,
  AlertTriangle, BarChart2, Printer, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ResultCard from '../components/ResultCard';

const keyPoints = [
  {
    variant: 'keypoint',
    title: 'Lock-in Period Clause',
    content: 'The agreement includes a 12-month lock-in period during which neither party can terminate the contract without paying 3 months rent as penalty.',
    meta: 'Section 4.2 · Page 3',
  },
  {
    variant: 'keypoint',
    title: 'Renewal Terms',
    content: 'Automatic renewal unless 60-day written notice is given before expiry. Rent may increase up to 10% on renewal.',
    meta: 'Section 8.1 · Page 6',
  },
  {
    variant: 'success',
    title: 'Security Deposit Refund',
    content: 'Landlord must return security deposit within 30 days of vacating, with deductions only for documented damages.',
    meta: 'Section 5.3 · Page 4',
  },
];

const dates = [
  { variant: 'date', title: 'Agreement Start Date', content: 'The rental agreement becomes effective from January 1, 2025.', meta: 'Section 2.1' },
  { variant: 'date', title: 'Expiry / End Date', content: 'Agreement expires on December 31, 2025, after 12 months.', meta: 'Section 2.1' },
  { variant: 'date', title: 'Rent Due Date', content: 'Monthly rent must be paid by the 5th of every month to avoid a 2% late fee.', meta: 'Section 3.4' },
];

const amounts = [
  { variant: 'amount', title: 'Monthly Rent', content: '₹25,000 per month for a 12-month period, totalling ₹3,00,000 annually.', meta: 'Section 3.1' },
  { variant: 'amount', title: 'Security Deposit', content: '₹75,000 (3 months rent) paid as refundable security deposit at signing.', meta: 'Section 5.1' },
  { variant: 'amount', title: 'Maintenance Charges', content: '₹2,500/month for society maintenance charged separately to the tenant.', meta: 'Section 6.2' },
];

const risks = [
  {
    variant: 'risk',
    title: 'One-sided Eviction Clause',
    content: 'Landlord can evict tenant with only 15 days notice for "personal use" — significantly less than the standard 2-month notice period under the Rent Control Act.',
    meta: 'Section 9.1 · Page 7',
    severity: 'High',
  },
  {
    variant: 'risk',
    title: 'Unlimited Subletting Prohibition',
    content: 'Subletting is completely prohibited without written consent. Violation results in immediate eviction with forfeiture of full security deposit.',
    meta: 'Section 7.3 · Page 6',
    severity: 'Medium',
  },
  {
    variant: 'warning',
    title: 'Repair Liability Shifted to Tenant',
    content: 'All repairs under ₹5,000 are the tenant\'s responsibility regardless of cause — this is unusually high and may be challenged.',
    meta: 'Section 6.5 · Page 5',
    severity: 'Low',
  },
];

const summary = {
  score: 62,
  label: 'Moderate Risk',
  keyPoints: 3,
  dates: 3,
  amounts: 3,
  risks: 3,
};

export default function ResultPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Findings' },
    { id: 'risks', label: 'Risks' },
    { id: 'dates', label: 'Dates' },
    { id: 'amounts', label: 'Amounts' },
  ];

  const scoreColor = summary.score >= 75 ? 'text-emerald-600' : summary.score >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBg = summary.score >= 75 ? 'bg-emerald-100' : summary.score >= 50 ? 'bg-amber-100' : 'bg-red-100';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 pt-16">
        <div className="p-5 md:p-7 max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <span className="cursor-pointer hover:text-navy-600" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight size={12} />
            <span className="cursor-pointer hover:text-navy-600" onClick={() => navigate('/upload')}>Upload</span>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium">Analysis Result</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart2 size={18} className="text-navy-600" />
                <p className="section-label">AI Analysis</p>
              </div>
              <h1 className="page-title">Document Analysis Report</h1>
              <p className="text-sm text-slate-500 mt-1">Rental Agreement · Analyzed just now</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-sm flex items-center gap-1.5 px-4 py-2">
                <Printer size={14} /> Print
              </button>
              <button className="btn-primary text-sm flex items-center gap-1.5 px-4 py-2">
                <Download size={14} /> Download Report
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="card-base p-5 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Score */}
              <div className={`w-24 h-24 rounded-2xl ${scoreBg} flex flex-col items-center justify-center flex-shrink-0`}>
                <span className={`font-display text-3xl font-bold ${scoreColor}`}>{summary.score}</span>
                <span className={`text-xs font-semibold ${scoreColor}`}>/100</span>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-lg font-display font-bold ${scoreColor}`}>{summary.label}</span>
                  <AlertTriangle size={16} className="text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mb-3">This document has some clauses that may be unfavorable. Review highlighted risks before signing.</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                    <CheckCircle size={12} className="text-emerald-500" /> {summary.keyPoints} Key Points
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                    <AlertTriangle size={12} className="text-red-500" /> {summary.risks} Risky Clauses
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                    <FileText size={12} className="text-navy-500" /> {summary.dates + summary.amounts} Important Details
                  </div>
                </div>
              </div>

              {/* Re-analyze */}
              <button
                onClick={() => navigate('/upload')}
                className="btn-ghost text-sm flex items-center gap-1.5 flex-shrink-0"
              >
                <RefreshCw size={13} /> Re-analyze
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="space-y-6">
            {(activeTab === 'all' || activeTab === 'risks') && (
              <div>
                <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" /> Risky Clauses
                  <span className="badge badge-red">{risks.length}</span>
                </h2>
                <div className="space-y-3">
                  {risks.map((r, i) => <ResultCard key={i} {...r} />)}
                </div>
              </div>
            )}

            {activeTab === 'all' && (
              <div>
                <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-navy-600" /> Key Points
                  <span className="badge badge-blue">{keyPoints.length}</span>
                </h2>
                <div className="space-y-3">
                  {keyPoints.map((r, i) => <ResultCard key={i} {...r} />)}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'dates') && (
              <div>
                <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-purple-600" /> Important Dates
                  <span className="badge bg-purple-100 text-purple-700">{dates.length}</span>
                </h2>
                <div className="space-y-3">
                  {dates.map((r, i) => <ResultCard key={i} {...r} />)}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'amounts') && (
              <div>
                <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-emerald-600" /> Amounts & Financials
                  <span className="badge badge-green">{amounts.length}</span>
                </h2>
                <div className="space-y-3">
                  {amounts.map((r, i) => <ResultCard key={i} {...r} />)}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="mt-8 p-5 card-base flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800">Need legal help with this document?</p>
              <p className="text-xs text-slate-500 mt-0.5">Generate a legal notice or connect with a lawyer</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-sm flex items-center gap-1.5">
                <Share2 size={14} /> Share Report
              </button>
              <button
                onClick={() => navigate('/generate')}
                className="btn-primary text-sm flex items-center gap-1.5"
              >
                <FileText size={14} /> Generate Legal Notice
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

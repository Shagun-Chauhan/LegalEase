import React, { useState } from 'react';
import {
  FileText, User, ChevronRight, ArrowRight, Info, Sparkles,
  Building, Scale, AlignLeft, Calendar, MapPin, Mail, Languages, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// ── Static data – outside component so they never re-create ──────────────────
const docTypes = [
  { id: 'legal_notice', label: 'Legal Notice',             icon: '⚖️' },
  { id: 'complaint',    label: 'Complaint Letter',          icon: '📝' },
  { id: 'demand',       label: 'Demand Notice',             icon: '📋' },
  { id: 'noc',          label: 'No Objection Certificate',  icon: '✅' },
  { id: 'affidavit',    label: 'Affidavit',                 icon: '📜' },
  { id: 'agreement',    label: 'Rental Agreement',          icon: '🏠' },
];

const languages = [
  { id: 'english', label: 'English', native: 'English',  flag: '🇬🇧', desc: 'Standard legal English'   },
  { id: 'hindi',   label: 'Hindi',   native: 'हिन्दी',   flag: '🇮🇳', desc: 'मानक हिन्दी भाषा'         },
  { id: 'marathi', label: 'Marathi', native: 'मराठी',    flag: '🟠',  desc: 'मानक मराठी भाषा'          },
];

// ── Shared field wrapper – outside so React never remounts children ──────────
const FieldWrapper = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
// ─────────────────────────────────────────────────────────────────────────────

export default function GeneratorForm() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [selectedType, setSelectedType] = useState('legal_notice');
  const [selectedLang, setSelectedLang] = useState('english');
  const [errors, setErrors]             = useState({});
  const [form, setForm] = useState({
    yourName:        '',
    yourEmail:       '',
    yourAddress:     '',
    opponentName:    '',
    opponentEmail:   '',
    opponentAddress: '',
    issueType:       '',
    incidentDate:    '',
    description:     '',
    reliefSought:    '',
  });

  // Single stable updater — does NOT recreate on every render
  const update = (k) => (e) => {
    const v = e.target.value;
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const validateEmail = (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validate = () => {
    const e = {};
    if (!form.yourName.trim())                                    e.yourName     = 'Your name is required';
    if (form.yourEmail && !validateEmail(form.yourEmail))         e.yourEmail    = 'Enter a valid email address';
    if (!form.opponentName.trim())                                e.opponentName = 'Opponent name is required';
    if (form.opponentEmail && !validateEmail(form.opponentEmail)) e.opponentEmail = 'Enter a valid email address';
    if (!form.description.trim())                                 e.description  = 'Description is required';
    if (form.description.trim().length < 30)                      e.description  = 'Please provide more detail (min 30 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/generate/output', { state: { form, docType: selectedType, language: selectedLang } });
    }, 2000);
  };

  const inputCls = (name) =>
    `input-field ${errors[name] ? 'border-red-400 ring-1 ring-red-300' : ''}`;

  const iconInputCls = (name) =>
    `input-field pl-10 ${errors[name] ? 'border-red-400 ring-1 ring-red-300' : ''}`;

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
            <span className="text-slate-700 font-medium">Generate Document</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-amber-500" />
              <p className="section-label">AI Document Generator</p>
            </div>
            <h1 className="page-title">Generate Legal Document</h1>
            <p className="text-sm text-slate-500 mt-1">
              Fill in the details below. Our AI will draft a professional legal document for you instantly.
            </p>
          </div>

          {/* ── Document Type ── */}
          <div className="card-base p-5 mb-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <FileText size={15} className="text-navy-600" /> Select Document Type
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {docTypes.map(dt => (
                <button
                  key={dt.id}
                  onClick={() => setSelectedType(dt.id)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200
                    ${selectedType === dt.id
                      ? 'bg-navy-700 text-white border-navy-700 shadow-navy'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-navy-300 hover:bg-navy-50'
                    }`}
                >
                  <span className="text-base">{dt.icon}</span>
                  <span className="text-xs leading-tight">{dt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Language Selector ── */}
          <div className="card-base p-5 mb-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Languages size={15} className="text-indigo-600" /> Document Language
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {languages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`relative flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl border-2 text-center transition-all duration-200
                    ${selectedLang === lang.id
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
                    }`}
                >
                  {selectedLang === lang.id && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
                  )}
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <p className={`text-sm font-bold leading-tight ${selectedLang === lang.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {lang.native}
                    </p>
                    <p className={`text-[10px] mt-0.5 leading-tight ${selectedLang === lang.id ? 'text-indigo-500' : 'text-slate-400'}`}>
                      {lang.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {selectedLang !== 'english' && (
              <div className="mt-3 flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                <Info size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  {selectedLang === 'hindi'
                    ? 'दस्तावेज़ हिन्दी में तैयार किया जाएगा। कानूनी शब्दावली मानक हिन्दी में होगी।'
                    : 'दस्तावेज मराठीत तयार केला जाईल. कायदेशीर शब्दावली मानक मराठीत असेल.'}
                </p>
              </div>
            )}
          </div>

          {/* ── Main Form ── */}
          <div className="card-base p-6 space-y-6 mb-5">

            {/* Your Details */}
            <div>
              <h2 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <User size={15} className="text-navy-600" /> Your Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <FieldWrapper label="Your Full Name" required error={errors.yourName}>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={form.yourName}
                      onChange={update('yourName')}
                      placeholder="e.g. Arjun Sharma"
                      autoComplete="name"
                      className={iconInputCls('yourName')}
                    />
                  </div>
                </FieldWrapper>

                <FieldWrapper label="Your Email Address" error={errors.yourEmail}>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={form.yourEmail}
                      onChange={update('yourEmail')}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={iconInputCls('yourEmail')}
                    />
                  </div>
                </FieldWrapper>

                <div className="sm:col-span-2">
                  <FieldWrapper label="Your Address" error={errors.yourAddress}>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={form.yourAddress}
                        onChange={update('yourAddress')}
                        placeholder="House No., Street, City, State – PIN"
                        autoComplete="street-address"
                        className={iconInputCls('yourAddress')}
                      />
                    </div>
                  </FieldWrapper>
                </div>
              </div>
            </div>

            {/* Opposing Party */}
            <div className="border-t border-slate-100 pt-5">
              <h2 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <Building size={15} className="text-red-500" /> Opposing Party Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <FieldWrapper label="Opponent Name / Company" required error={errors.opponentName}>
                  <div className="relative">
                    <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={form.opponentName}
                      onChange={update('opponentName')}
                      placeholder="e.g. ABC Pvt. Ltd."
                      className={iconInputCls('opponentName')}
                    />
                  </div>
                </FieldWrapper>

                <FieldWrapper label="Opponent Email Address" error={errors.opponentEmail}>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={form.opponentEmail}
                      onChange={update('opponentEmail')}
                      placeholder="opponent@example.com"
                      className={iconInputCls('opponentEmail')}
                    />
                  </div>
                </FieldWrapper>

                <div className="sm:col-span-2">
                  <FieldWrapper label="Their Address" error={errors.opponentAddress}>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={form.opponentAddress}
                        onChange={update('opponentAddress')}
                        placeholder="House No., Street, City, State – PIN"
                        className={iconInputCls('opponentAddress')}
                      />
                    </div>
                  </FieldWrapper>
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="border-t border-slate-100 pt-5">
              <h2 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <Scale size={15} className="text-purple-600" /> Issue Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Issue Type</label>
                  <div className="relative">
                    <Scale size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={form.issueType}
                      onChange={update('issueType')}
                      className="input-field pl-10 appearance-none pr-10"
                    >
                      <option value="">Select issue type</option>
                      <option>Fraud / Cheating</option>
                      <option>Unpaid Salary</option>
                      <option>Tenant Dispute</option>
                      <option>Consumer Complaint</option>
                      <option>Property Dispute</option>
                      <option>Cybercrime</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <FieldWrapper label="Date of Incident" error={errors.incidentDate}>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={form.incidentDate}
                      onChange={update('incidentDate')}
                      className={iconInputCls('incidentDate')}
                    />
                  </div>
                </FieldWrapper>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description of Issue <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AlignLeft size={15} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <textarea
                    value={form.description}
                    onChange={update('description')}
                    placeholder="Describe the issue in detail — what happened, when, and how it affected you..."
                    rows={4}
                    className={`input-field pl-10 resize-none ${errors.description ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                  />
                </div>
                {errors.description
                  ? <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                  : <p className="text-xs text-slate-400 mt-1">{form.description.length} characters (min 30)</p>
                }
              </div>

              {/* Relief */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Relief / Action Sought</label>
                <textarea
                  value={form.reliefSought}
                  onChange={update('reliefSought')}
                  placeholder="What outcome are you seeking? e.g. Refund of ₹50,000 + compensation..."
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* AI Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 mb-6">
            <Info size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>AI-Powered Generation:</strong> Our AI will generate a legally formatted document in{' '}
              <strong>{languages.find(l => l.id === selectedLang)?.label}</strong> based on your inputs.
              Please review before sending. For high-stakes matters, consider having a lawyer review the final document.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base py-4"
          >
            {loading ? (
              <><span className="spinner" /> Generating Document...</>
            ) : (
              <><Sparkles size={18} /> Generate in {languages.find(l => l.id === selectedLang)?.label} <ArrowRight size={16} /></>
            )}
          </button>

        </div>
      </main>
    </div>
  );
}

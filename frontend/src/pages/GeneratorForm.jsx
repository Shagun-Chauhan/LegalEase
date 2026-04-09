import React, { useState } from 'react';
import {
  FileText, User, ChevronRight, ArrowRight, Info, Sparkles,
  Building, Scale, AlignLeft, Calendar, MapPin, Mail, Languages, ChevronDown, Loader2
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
  <div className="space-y-2">
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight pl-1">{error}</p>}
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
    if (!form.yourAddress.trim())                                 e.yourAddress  = 'Physical address is required';
    
    if (!form.opponentName.trim())                                e.opponentName = 'Opponent name is required';
    if (form.opponentEmail && !validateEmail(form.opponentEmail)) e.opponentEmail = 'Enter a valid email address';
    if (!form.opponentAddress.trim())                             e.opponentAddress = 'Opponent address is required';
    
    if (!form.description.trim())                                 e.description  = 'Description is required';
    if (form.description.trim().length < 30)                      e.description  = 'Please provide more detail (min 30 chars)';
    
    if (form.incidentDate) {
      if (new Date(form.incidentDate) > new Date()) {
        e.incidentDate = 'Incident date cannot be in the future';
      }
    }
    
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

  const iconInputCls = (name) =>
    `input-field pl-10 ${errors[name] ? 'border-red-400 ring-1 ring-red-300' : ''}`;

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
            <span className="text-slate-900 dark:text-slate-300 font-black">Contract Generation</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center border border-amber-200/50 dark:border-amber-800/30">
                <Sparkles size={18} className="text-amber-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Document Assistant</p>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight uppercase mb-2">Create Legal Documents</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Construct high-fidelity legal documents instantly. Our AI models analyze jurisdictional requirements to ensure structural integrity.
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
          <div className="card-base p-6 md:p-8 mb-6">
            <h2 className="font-display text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
               <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
                <Languages size={14} className="text-indigo-600 dark:text-indigo-400" />
               </div>
                Linguistic Protocol
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {languages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300
                    ${selectedLang === lang.id
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-lg'
                      : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900'
                    }`}
                >
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{lang.flag}</span>
                  <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${selectedLang === lang.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {lang.native}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {selectedLang !== 'english' && (
              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
                <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wide leading-relaxed">
                  {selectedLang === 'hindi'
                    ? 'दस्तावेज़ हिन्दी में तैयार किया जाएगा। कानूनी शब्दावली मानक हिन्दी में होगी।'
                    : 'दस्तावेज मराठीत तयार केला जाईल. कायदेशीर शब्दावली मानक मराठीत असेल.'}
                </p>
              </div>
            )}
          </div>

          {/* ── Main Form ── */}
          <div className="card-base p-6 md:p-10 space-y-10 mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-navy-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

            {/* Your Details */}
            <div className="relative z-10">
              <h2 className="font-display text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-navy-50 dark:bg-navy-950 flex items-center justify-center border border-navy-100 dark:border-navy-900">
                  <User size={16} className="text-navy-600 dark:text-navy-400" />
                 </div>
                 Your Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <FieldWrapper label="Full Legal Identity" required error={errors.yourName}>
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type="text"
                      value={form.yourName}
                      onChange={update('yourName')}
                      placeholder="Enter legal name"
                      autoComplete="name"
                      className={iconInputCls('yourName')}
                    />
                  </div>
                </FieldWrapper>

                <FieldWrapper label="Direct Communication Line" error={errors.yourEmail}>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type="email"
                      value={form.yourEmail}
                      onChange={update('yourEmail')}
                      placeholder="email@address.legal"
                      autoComplete="email"
                      className={iconInputCls('yourEmail')}
                    />
                  </div>
                </FieldWrapper>

                <div className="sm:col-span-2">
                  <FieldWrapper label="Primary Domicile" required error={errors.yourAddress}>
                    <div className="relative group">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                      <input
                        type="text"
                        value={form.yourAddress}
                        onChange={update('yourAddress')}
                        placeholder="State full physical address for legal service"
                        autoComplete="street-address"
                        className={iconInputCls('yourAddress')}
                      />
                    </div>
                  </FieldWrapper>
                </div>
              </div>
            </div>

            {/* Opposing Party */}
            <div className="border-t border-slate-100 dark:border-white/5 pt-10 relative z-10">
              <h2 className="font-display text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center border border-red-100 dark:border-red-900">
                  <Building size={16} className="text-red-600 dark:text-red-400" />
                 </div>
                 Opponent's Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <FieldWrapper label="Opponent Identity" required error={errors.opponentName}>
                  <div className="relative group">
                    <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type="text"
                      value={form.opponentName}
                      onChange={update('opponentName')}
                      placeholder="Enter opponent name or company"
                      className={iconInputCls('opponentName')}
                    />
                  </div>
                </FieldWrapper>

                <FieldWrapper label="Opponent Endpoint" error={errors.opponentEmail}>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <input
                      type="email"
                      value={form.opponentEmail}
                      onChange={update('opponentEmail')}
                      placeholder="opponent@address.legal"
                      className={iconInputCls('opponentEmail')}
                    />
                  </div>
                </FieldWrapper>

                <div className="sm:col-span-2">
                  <FieldWrapper label="Service Address" required error={errors.opponentAddress}>
                    <div className="relative group">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                      <input
                        type="text"
                        value={form.opponentAddress}
                        onChange={update('opponentAddress')}
                        placeholder="Full physical address for notice delivery"
                        className={iconInputCls('opponentAddress')}
                      />
                    </div>
                  </FieldWrapper>
                </div>
              </div>
            </div>

            {/* Tactical Brief */}
            <div className="border-t border-slate-100 dark:border-white/5 pt-10 relative z-10">
              <h2 className="font-display text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center border border-purple-100 dark:border-purple-900">
                  <AlignLeft size={16} className="text-purple-600 dark:purple-400" />
                 </div>
                 Case Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <FieldWrapper label="Issue Categorization">
                  <div className="relative group">
                    <Scale size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <select
                      value={form.issueType}
                      onChange={update('issueType')}
                      className="input-field pl-12 appearance-none pr-10"
                    >
                      <option value="">Select violation class</option>
                      <option>Fraud / Cheating</option>
                      <option>Unpaid Salary</option>
                      <option>Tenant Dispute</option>
                      <option>Consumer Complaint</option>
                      <option>Property Dispute</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </FieldWrapper>

                <FieldWrapper label="Temporal Log" required error={errors.incidentDate}>
                  <div className="relative group">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
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
              <div className="mb-8">
                <FieldWrapper label="Brief of Argument" required error={errors.description}>
                  <div className="relative group">
                    <AlignLeft size={16} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-navy-500 transition-colors pointer-events-none" />
                    <textarea
                      value={form.description}
                      onChange={update('description')}
                      placeholder="State facts of the case in chronological order..."
                      rows={5}
                      className={`input-field pl-12 pt-4 resize-none ${errors.description ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                    />
                  </div>
                </FieldWrapper>
                <div className="mt-2 flex justify-end">
                   <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${form.description.length < 30 ? 'text-red-500' : 'text-slate-400'}`}>
                    Intelligence Density: {form.description.length} / 30 Min
                   </p>
                </div>
              </div>

              {/* Relief */}
              <div>
                <FieldWrapper label="Requested Remediation">
                  <textarea
                    value={form.reliefSought}
                    onChange={update('reliefSought')}
                    placeholder="Specify monetary compensation or specific performance required..."
                    rows={3}
                    className="input-field p-4 pt-4 resize-none"
                  />
                </FieldWrapper>
              </div>
            </div>
          </div>

          {/* intelligence protocol info */}
          <div className="flex items-start gap-4 p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-full w-1 bg-amber-500/50 group-hover:w-2 transition-all" />
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm flex-shrink-0">
               <Info size={16} className="text-amber-500" strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-500 leading-relaxed">
              <strong className="block mb-1 text-[11px]">Secure Intelligence Protocol</strong>
              Artifacts are synthesized in <strong>{languages.find(l => l.id === selectedLang)?.label}</strong> linguistic structure. 
              Draft remains in staging for manual audit. External legal review recommended for finalized high-stakes artifacts.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-navy-900 hover:bg-black text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-navy transition-all active:scale-[0.98] disabled:opacity-50 group flex items-center justify-center gap-4 border border-navy-800"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={18} /> Generating Document...</>
            ) : (
              <><Sparkles size={18} strokeWidth={2.5} /> Generate Document in {languages.find(l => l.id === selectedLang)?.label} <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>

        </div>
      </main>
    </div>
  );
}

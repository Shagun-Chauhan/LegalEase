import React, { useState } from 'react';
import {
  Scale, FileText, ChevronRight, ArrowLeft, AlertTriangle,
  CheckCircle, Clock, ArrowRight, Info, Gavel, Phone, Globe,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StepList from '../components/StepList';
import ChecklistItem from '../components/ChecklistItem';

const issueData = {
  fraud: {
    title: 'Fraud & Financial Cheating',
    subtitle: 'Online/offline fraud, financial scams, cheating',
    severity: 'High',
    steps: [
      { title: 'Collect All Evidence', description: 'Gather screenshots, transaction records, communication history, and any receipts or contracts related to the fraud.', duration: '1-2 days', note: 'Do not delete any messages or emails — they are critical evidence.' },
      { title: 'File a Complaint at Cybercrime Portal', description: 'Visit cybercrime.gov.in or your nearest police station and file an FIR under IPC Section 420 (cheating).', duration: '1 day' },
      { title: 'Contact Your Bank / Payment Platform', description: 'Immediately report fraudulent transactions to your bank for reversal or chargeback under RBI guidelines.', duration: 'Same day', note: 'Report within 3 days for maximum chargeback protection.' },
      { title: 'Send Legal Notice to Accused', description: 'Through LegalEase, generate a legal notice to the fraudulent party demanding compensation.', duration: '2-3 days' },
      { title: 'Approach Consumer Forum or Court', description: 'If unresolved, file a case in the Consumer Disputes Redressal Forum or civil court for monetary compensation.', duration: '2-4 weeks' },
    ],
    documents: [
      { label: 'FIR Copy / Complaint Receipt', description: 'Obtain a copy from the police station after filing', required: true },
      { label: 'Bank Transaction Proof', description: 'Screenshot or statement showing fraudulent transfer', required: true },
      { label: 'Identity Proof (Aadhaar/PAN)', description: 'Government-issued ID for verification', required: true },
      { label: 'Communication Records', description: 'Emails, chats, call recordings with the fraudster', required: false },
      { label: 'Contract or Agreement (if any)', description: 'Any signed document related to the transaction', required: false },
    ],
    whatNext: [
      { icon: Clock, label: 'Timeline', text: 'Police investigation typically takes 30-90 days. Court proceedings may take 6-18 months.' },
      { icon: CheckCircle, label: 'Best Outcome', text: 'Full refund of defrauded amount + compensation for damages and mental harassment.' },
      { icon: AlertTriangle, label: 'Worst Case', text: 'If the accused is untraceable, civil recovery may be difficult. Criminal case can still proceed.' },
    ],
    contacts: [
      { label: 'Cybercrime Helpline', value: '1930', icon: Phone },
      { label: 'Cybercrime Portal', value: 'cybercrime.gov.in', icon: Globe },
    ],
  },
  salary: {
    title: 'Salary & Workplace Dispute',
    subtitle: 'Unpaid wages, wrongful termination, harassment',
    severity: 'Medium',
    steps: [
      { title: 'Document All Evidence', description: 'Collect salary slips, bank statements, employment contract, and all HR communications.', duration: '1-2 days' },
      { title: 'Send Written Demand to Employer', description: 'Send a formal written demand for payment via email and registered post, citing Payment of Wages Act.', duration: '1 day', note: 'Keep the delivery receipt — it proves you gave them notice.' },
      { title: 'File Complaint with Labour Commissioner', description: 'Approach the Labour Commissioner or Labour Court in your district under Section 33C of the Industrial Disputes Act.', duration: '1 day' },
      { title: 'Approach Labour Court if Ignored', description: 'If no resolution within 30 days, file a formal case in the Labour Court with all documentation.', duration: '2-3 weeks' },
    ],
    documents: [
      { label: 'Employment Contract / Offer Letter', description: 'Proof of employment terms and agreed salary', required: true },
      { label: 'Salary Slips (Last 6 months)', description: 'Proof of salary amount and payment history', required: true },
      { label: 'Bank Statements', description: 'Showing salary credits and any gaps', required: true },
      { label: 'HR Communication', description: 'Emails or messages about salary disputes', required: false },
    ],
    whatNext: [
      { icon: Clock, label: 'Timeline', text: 'Labour Commissioner resolution usually takes 30-60 days. Court may take 3-12 months.' },
      { icon: CheckCircle, label: 'Best Outcome', text: 'Full payment of unpaid salary + interest + compensation for wrongful termination.' },
      { icon: AlertTriangle, label: 'Worst Case', text: 'Employer may contest the claim, extending the timeline.' },
    ],
    contacts: [
      { label: 'Labour Helpline', value: '14455', icon: Phone },
      { label: 'Labour Ministry', value: 'labour.gov.in', icon: Globe },
    ],
  },
  tenant: {
    title: 'Tenant Dispute',
    subtitle: 'Illegal eviction, deposit issues, maintenance',
    severity: 'Medium',
    steps: [
      { title: 'Review Your Rental Agreement', description: 'Carefully review all clauses regarding notice period, deposit, maintenance, and eviction terms.', duration: '1 day' },
      { title: 'Send Written Notice to Landlord', description: 'Draft a legal notice citing relevant sections of the Rent Control Act applicable to your state.', duration: '1-2 days', note: 'Send via registered post to create a legal record.' },
      { title: 'File Complaint with Rent Authority', description: 'Approach the Rent Controller or Rent Tribunal in your jurisdiction for official dispute resolution.', duration: '1-2 days' },
      { title: 'Approach Civil Court if Needed', description: 'For deposit refund above Rs. 1 lakh or illegal eviction, file a civil suit in the appropriate court.', duration: '2-4 weeks' },
    ],
    documents: [
      { label: 'Rental Agreement', description: 'Original signed agreement between tenant and landlord', required: true },
      { label: 'Deposit Receipt', description: 'Receipt showing security deposit paid', required: true },
      { label: 'Rent Payment Receipts', description: 'Proof of regular rent payments', required: true },
      { label: 'Maintenance Complaints', description: 'Written complaints about unaddressed maintenance', required: false },
    ],
    whatNext: [
      { icon: Clock, label: 'Timeline', text: 'Rent Authority resolution takes 30-90 days. Civil court may take 6-18 months.' },
      { icon: CheckCircle, label: 'Best Outcome', text: 'Full return of security deposit + compensation for harassment and illegal eviction.' },
      { icon: AlertTriangle, label: 'Worst Case', text: 'Tenant may need to vacate pending resolution if interim stay is not granted.' },
    ],
    contacts: [
      { label: 'Rent Helpline', value: '1800-11-4000', icon: Phone },
      { label: 'Housing Portal', value: 'mohua.gov.in', icon: Globe },
    ],
  },
  consumer: {
    title: 'Consumer Rights & Disputes',
    subtitle: 'Product defects, service failure, refund issues',
    severity: 'Medium',
    steps: [
      { title: 'Preserve Proof of Purchase', description: 'Collect invoices, warranty cards, delivery receipts, and photos/videos of the defect.', duration: '1 day' },
      { title: 'Send Formal Notice to Company', description: 'Send a notice via email and registered post demanding replacement or refund within 15 days.', duration: '1 day' },
      { title: 'Register Complaint on NCH', description: 'Call 1915 or use the National Consumer Helpline portal to seek early mediation.', duration: '1 day' },
      { title: 'File Case on E-Daakhil', description: 'If unresolved, file an official case in the District/State Consumer Forum through e-daakhil.nic.in.', duration: '1-2 weeks' },
    ],
    documents: [
      { label: 'Invoice / Purchase Bill', description: 'Proof of purchase from the seller', required: true },
      { label: 'Warranty / Guarantee Card', description: 'Relevant if product is under warranty coverage', required: true },
      { label: 'Service Job Card', description: 'History of previous repair attempts', required: false },
    ],
    whatNext: [
      { icon: CheckCircle, label: 'Best Outcome', text: 'Full refund/replacement + compensation for mental agony and litigation costs.' },
      { icon: Clock, label: 'Timeline', text: 'Consumer Forum typically resolves cases in 3-12 months.' },
    ],
    contacts: [
      { label: 'Consumer Helpline', value: '1915', icon: Phone },
      { label: 'E-Daakhil Portal', value: 'edaakhil.nic.in', icon: Globe },
    ],
  },
  property: {
    title: 'Property & Real Estate Dispute',
    subtitle: 'Ownership conflicts, encroachment, builder fraud',
    severity: 'High',
    steps: [
      { title: 'Verify Title Documents', description: 'Examine Sale Deed, Mutation records, and Encumbrance Certificate from Sub-Registrar office.', duration: '2-4 days' },
      { title: 'Send Legal Notice to Builder/Opposite Party', description: 'Through a lawyer, send a formal notice for possession, refund, or clearance of encroachment.', duration: '2-3 days' },
      { title: 'File RERA Complaint', description: 'If against a builder, file a complaint in the State Real Estate Regulatory Authority (RERA).', duration: '1-2 weeks' },
      { title: 'File Civil Suit / Police Complaint', description: 'For encroachment or document forgery, file a suit in civil court or an FIR for land grabbing.', duration: '2-4 weeks' },
    ],
    documents: [
      { label: 'Sale Deed / Agreement to Sell', description: 'Primary ownership document', required: true },
      { label: 'Possession Letter / Allotment', description: 'If claiming property from builder', required: true },
      { label: '7/12 Extract / Khata Certificate', description: 'Revenue records of the property', required: true },
    ],
    whatNext: [
      { icon: CheckCircle, label: 'Best Outcome', text: 'Clear possession, title rectification, or recovery of property value + damages.' },
      { icon: Clock, label: 'Timeline', text: 'Property suits are lengthy, often taking 2-5 years in civil court.' },
    ],
    contacts: [
      { label: 'RERA Portal', value: 'State Specific', icon: Globe },
      { label: 'Revenue Dept', value: 'District Office', icon: Phone },
    ],
  },
  vehicle: {
    title: 'Motor Vehicle & Accident Claims',
    subtitle: 'Accident claims, insurance disputes, challans',
    severity: 'High',
    steps: [
      { title: 'Ensure FIR and Spot Panchnama', description: 'Immediately call police at the accident spot and obtain a copy of the FIR and Panchnama.', duration: 'Same day' },
      { title: 'Notify Insurance Company', description: 'Inform your insurer within 24-48 hours to initiate the accident claim process.', duration: '1 day' },
      { title: 'File Claim in MACT', description: 'File a petition in the Motor Accident Claims Tribunal for compensation for injury or death.', duration: '2-4 weeks' },
    ],
    documents: [
      { label: 'FIR / MLC Report', description: 'Police and Medical Legal Certificate copies', required: true },
      { label: 'Insurance Policy', description: 'Copy of valid insurance for the vehicle', required: true },
      { label: 'Driving License / RC', description: 'Validity proof of the vehicle and driver', required: true },
    ],
    whatNext: [
      { icon: CheckCircle, label: 'Best Outcome', text: 'Fair compensation for medical bills, loss of income, and vehicle repair.' },
      { icon: Clock, label: 'Timeline', text: 'MACT proceedings usually take 12-24 months.' },
    ],
    contacts: [
      { label: 'Police Helpline', value: '112', icon: Phone },
      { label: 'Parivahan Portal', value: 'parivahan.gov.in', icon: Globe },
    ],
  },
  family: {
    title: 'Family & Marriage Law',
    subtitle: 'Divorce, custody, maintenance, domestic violence',
    severity: 'High',
    steps: [
      { title: 'Attempt Mediation', description: 'Try resolution through counseling or neutral mediators before starting litigation.', duration: '1-2 weeks' },
      { title: 'Draft and File Petition', description: 'Prepare legal petition for divorce, maintenance (Section 125 CrPC), or custody through a lawyer.', duration: '1-2 weeks' },
      { title: 'Interim Orders', description: 'Apply for urgent relief such as interim maintenance or a stay on domestic violence.', duration: '2-4 weeks' },
    ],
    documents: [
      { label: 'Marriage Certificate / Photos', description: 'Proof of legal or factual marriage', required: true },
      { label: 'Income Proof', description: 'Important for maintenance and alimony claims', required: true },
      { label: 'Children Birth Certificates', description: 'Relevant for custody and support', required: false },
    ],
    whatNext: [
      { icon: CheckCircle, label: 'Best Outcome', text: 'A fair settlement/decree ensuring safety, custody, and financial security.' },
      { icon: Clock, label: 'Timeline', text: 'Family cases take 6-24 months depending on whether contested.' },
    ],
    contacts: [
      { label: 'Women Helpline', value: '1091', icon: Phone },
      { label: 'Family Court', value: 'District Court', icon: Globe },
    ],
  },
  cyber: {
    title: 'Cybercrime & Identity Theft',
    subtitle: 'Hacking, identity theft, financial cyber fraud',
    severity: 'High',
    steps: [
      { title: 'Secure Digital Accounts', description: 'Immediately change passwords, enable 2FA, and logout from all active sessions.', duration: 'Same day' },
      { title: 'Preserve Evidence', description: 'Take screenshots of URLs, profiles, and messages. Save search/browser history.', duration: 'Same day' },
      { title: 'Report on Cybercrime Portal', description: 'File a complaint on cybercrime.gov.in or report to the nearest Cyber Cell.', duration: '1 day' },
    ],
    documents: [
      { label: 'Digital Evidence Screenshots', description: 'Visible proof of the incident or account takeover', required: true },
      { label: 'Bank Statement / Transaction Log', description: 'If money was stolen or used fraudulently', required: true },
      { label: 'Identity Proof', description: 'Required to reclaim accounts or verify yourself', required: true },
    ],
    whatNext: [
      { icon: CheckCircle, label: 'Best Outcome', text: 'Recovery of stolen funds, account restoration, and investigation of perpetrator.' },
      { icon: Clock, label: 'Timeline', text: 'Investigation varies; typically 30-180 days.' },
    ],
    contacts: [
      { label: 'National Cyber Helpline', value: '1930', icon: Phone },
      { label: 'Cyber Portal', value: 'cybercrime.gov.in', icon: Globe },
    ],
  },
};

const defaultIssue = issueData.fraud;

export default function ActionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([0]);

  const issueId = location.state?.issueId || 'fraud';
  const issue = issueData[issueId] || defaultIssue;

  const toggleStep = (i) => {
    setCompletedSteps(prev =>
      prev.includes(i) ? prev.filter(s => s !== i) : [...prev, i]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`transition-all duration-500 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} pt-20 animate-fade-in`}>
        <div className="p-6 md:p-10 max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">
            <span className="cursor-pointer hover:text-navy-600 transition-colors" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="cursor-pointer hover:text-navy-600 transition-colors" onClick={() => navigate('/issues')}>Legal Issues</span>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-slate-900 dark:text-slate-300 font-bold">{issue.title}</span>
          </div>

          {/* Back Action */}
          <button onClick={() => navigate('/issues')} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-navy-600 dark:hover:text-navy-400 mb-6 transition-all uppercase tracking-widest group/back">
            <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back
          </button>

          {/* Hero Section */}
          <div className="card-base p-6 mb-6 bg-gradient-to-r from-navy-700 to-navy-600 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gavel size={16} className="text-navy-300" />
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-200">Legal Guidance</p>
                </div>
                <h1 className="font-display text-xl md:text-2xl font-bold mb-1">{issue.title}</h1>
                <p className="text-navy-200 text-sm">{issue.subtitle}</p>
              </div>
              <span className={`badge flex-shrink-0 ${issue.severity === 'High' ? 'bg-red-500 text-white' : 'bg-amber-400 text-amber-900'}`}>
                {issue.severity} Priority
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 text-xs font-medium">
                <Clock size={12} /> {issue.steps.length} Steps to Follow
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 text-xs font-medium">
                <FileText size={12} /> {issue.documents.length} Documents Needed
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 text-xs font-medium">
                <CheckCircle size={12} /> {completedSteps.length}/{issue.steps.length} Completed
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-5">

              {/* Steps Area */}
              <div className="card-base p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-navy-50 dark:bg-navy-950/40 flex items-center justify-center border border-navy-100 dark:border-navy-900/30">
                    <CheckCircle size={24} className="text-navy-700 dark:text-navy-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">How to Solve This</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Decision steps for resolution</p>
                  </div>
                </div>

                <div className="relative group/steps" onClick={(e) => {
                  const stepEl = e.target.closest('[data-step]');
                  if (stepEl) {
                    const idx = parseInt(stepEl.dataset.step);
                    if (!isNaN(idx)) toggleStep(idx);
                  }
                }}>
                  <StepList steps={issue.steps} completedSteps={completedSteps} />
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-3">
                  {issue.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => toggleStep(i)}
                      className={`text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest transition-all
                        ${completedSteps.includes(i)
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-navy-50 dark:hover:bg-navy-950 hover:text-navy-700 dark:hover:text-navy-400'
                        }`}
                    >
                      P{i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outcomes Intelligence */}
              <div className="card-base p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center border border-amber-100 dark:border-amber-900/30">
                    <Info size={24} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Expected Outcomes</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Possible results and timelines</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {issue.whatNext.map(({ icon: Icon, label, text }, i) => (
                    <div key={i} className={`flex items-start gap-5 p-6 rounded-2xl border transition-all hover:translate-x-1 duration-300 ${label === 'Best Outcome' ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100/50 dark:border-emerald-900/20' :
                      label === 'Worst Case' ? 'bg-red-50/50 dark:bg-red-950/10 border-red-100/50 dark:border-red-900/20' :
                        'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-white/5'
                      }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${label === 'Best Outcome' ? 'bg-white dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
                        label === 'Worst Case' ? 'bg-white dark:bg-red-950 text-red-500' :
                          'bg-white dark:bg-slate-800 text-slate-500'
                        }`}>
                        <Icon size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${label === 'Best Outcome' ? 'text-emerald-700 dark:text-emerald-400' :
                          label === 'Worst Case' ? 'text-red-700 dark:text-red-400' :
                            'text-slate-500 dark:text-slate-400'
                          }`}>{label}</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar panel */}
            <div className="space-y-5">
              {/* Documents Checklist */}
              <div className="card-base p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center border border-purple-200/50 dark:border-purple-900/30">
                    <FileText size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Documents Needed</h2>
                </div>
                <div className="space-y-3">
                  {issue.documents.map((doc, i) => (
                    <ChecklistItem key={i} label={doc.label} description={doc.description} required={doc.required} />
                  ))}
                </div>
              </div>

              {/* Contacts Intelligence */}
              <div className="card-base p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-900/30">
                    <Phone size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Contacts</h2>
                </div>
                <div className="space-y-3">
                  {issue.contacts.map(({ label, value, icon: Icon }, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-white/5 group/contact cursor-pointer hover:border-navy-200 dark:hover:border-navy-900 transition-all">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover/contact:scale-110 transition-transform">
                        <Icon size={16} className="text-navy-600 dark:text-navy-400" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
                        <p className="text-sm font-black text-navy-800 dark:text-navy-300 tracking-tight">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Actions */}
              <button
                onClick={() => navigate('/generate')}
                className="w-full bg-navy-900 hover:bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-navy transition-all active:scale-[0.98] group flex items-center justify-center gap-3 border border-navy-800"
              >
                <FileText size={16} strokeWidth={2.5} /> Generate Legal Notice <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

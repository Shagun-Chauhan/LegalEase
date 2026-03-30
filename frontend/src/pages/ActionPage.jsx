import React, { useState } from 'react';
import {
  Scale, FileText, ChevronRight, ArrowLeft, AlertTriangle,
  CheckCircle, Clock, ArrowRight, Info, Gavel, Phone, Globe
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
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 pt-16">
        <div className="p-5 md:p-7 max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <span className="cursor-pointer hover:text-navy-600" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight size={12} />
            <span className="cursor-pointer hover:text-navy-600" onClick={() => navigate('/issues')}>Issues</span>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium">{issue.title}</span>
          </div>

          {/* Back + Title */}
          <button onClick={() => navigate('/issues')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
            <ArrowLeft size={15} /> Back to Issues
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

              {/* Steps */}
              <div className="card-base p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                    <CheckCircle size={16} className="text-navy-700" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">Steps to Follow</h2>
                    <p className="text-xs text-slate-400">Click a step to mark as completed</p>
                  </div>
                </div>
                <div onClick={(e) => {
                  const idx = parseInt(e.currentTarget.closest('[data-step]')?.dataset.step);
                  if (!isNaN(idx)) toggleStep(idx);
                }}>
                  <StepList steps={issue.steps} completedSteps={completedSteps} />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {issue.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => toggleStep(i)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        completedSteps.includes(i)
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Step {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* What Happens Next */}
              <div className="card-base p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Info size={16} className="text-amber-600" />
                  </div>
                  <h2 className="font-semibold text-slate-800">What Happens Next?</h2>
                </div>

                <div className="space-y-3">
                  {issue.whatNext.map(({ icon: Icon, label, text }, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                      label === 'Best Outcome' ? 'bg-emerald-50 border-emerald-100' :
                      label === 'Worst Case' ? 'bg-red-50 border-red-100' :
                      'bg-slate-50 border-slate-200'
                    }`}>
                      <Icon size={16} className={
                        label === 'Best Outcome' ? 'text-emerald-600 mt-0.5 flex-shrink-0' :
                        label === 'Worst Case' ? 'text-red-500 mt-0.5 flex-shrink-0' :
                        'text-slate-500 mt-0.5 flex-shrink-0'
                      } />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">{label}</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar panel */}
            <div className="space-y-5">
              {/* Documents Checklist */}
              <div className="card-base p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText size={16} className="text-purple-600" />
                  </div>
                  <h2 className="font-semibold text-slate-800 text-sm">Required Documents</h2>
                </div>
                <div className="space-y-2">
                  {issue.documents.map((doc, i) => (
                    <ChecklistItem key={i} label={doc.label} description={doc.description} required={doc.required} />
                  ))}
                </div>
              </div>

              {/* Contacts */}
              <div className="card-base p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Scale size={16} className="text-emerald-600" />
                  </div>
                  <h2 className="font-semibold text-slate-800 text-sm">Key Contacts</h2>
                </div>
                <div className="space-y-2">
                  {issue.contacts.map(({ label, value, icon: Icon }, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Icon size={13} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="text-sm font-semibold text-navy-700">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate('/generate')}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                <FileText size={15} /> Generate Legal Notice <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

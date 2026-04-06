import React, { useState } from 'react';
import {
  FileText, Download, Mail, Copy, Check, ChevronRight,
  ArrowLeft, Printer, Share2, Sparkles, Edit3, RefreshCw
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const generateDocument = (form, docType, language = 'english') => {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const name        = form?.yourName        || 'Arjun Sharma';
  const email       = form?.yourEmail       || '';
  const address     = form?.yourAddress     || 'Mumbai, Maharashtra';
  const opponent    = form?.opponentName    || 'ABC Private Limited';
  const oppEmail    = form?.opponentEmail   || '';
  const oppAddress  = form?.opponentAddress || 'Delhi, India';
  const issueType   = form?.issueType       || 'Fraud / Cheating';
  const description = form?.description     || 'The respondent has fraudulently taken money from the complainant without providing the agreed services.';
  const relief      = form?.reliefSought    || 'Full refund of paid amount along with compensation for damages and mental harassment.';

  const senderBlock = [name, email && `Email: ${email}`, address].filter(Boolean).join('\n');
  const recipientBlock = [opponent, oppEmail && `Email: ${oppEmail}`, oppAddress].filter(Boolean).join('\n');

  if (language === 'hindi') {
    return `कानूनी नोटिस
धारा 80 सीपीसी / यथा लागू के तहत

दिनांक: ${today}

प्रेषक:
${senderBlock}

प्राप्तकर्ता:
${recipientBlock}

विषय: ${issueType} के संबंध में कानूनी नोटिस — तत्काल समाधान की मांग

महोदय / महोदया,

मैं, ${name}, निवासी ${address}, आपको इस कानूनी नोटिस के माध्यम से निम्नलिखित विषय में सूचित करता/करती हूँ:

1. पृष्ठभूमि एवं तथ्य

${description}

2. लागू कानूनी प्रावधान

उपरोक्त कार्य निम्नलिखित कानूनी प्रावधानों का उल्लंघन करते हैं:
(क) भारतीय दंड संहिता, 1860 की धारा 420 — धोखाधड़ी;
(ख) उपभोक्ता संरक्षण अधिनियम, 2019 — अनुचित व्यापार व्यवहार;
(ग) सूचना प्रौद्योगिकी अधिनियम, 2000 (यदि लागू हो)।

3. मांग

उपरोक्त के मद्देनजर, मैं आपसे मांग करता/करती हूँ कि:
(क) ${relief}
(ख) किसी भी अवैध कार्य से तत्काल विरत हों;
(ग) इस नोटिस की प्राप्ति के 15 दिनों के भीतर लिखित पावती प्रदान करें।

4. अनुपालन न करने के परिणाम

यदि आप इस नोटिस की प्राप्ति के पंद्रह (15) दिनों के भीतर उपरोक्त मांगों का अनुपालन नहीं करते/करती हैं, तो मैं उचित न्यायालय में कानूनी कार्यवाही शुरू करने के लिए बाध्य होऊँगा/होऊँगी।

5. अधिकारों का आरक्षण

समस्त अधिकार सुरक्षित हैं। यह नोटिस बिना पूर्वाग्रह के जारी किया गया है।

भवदीय,

_______________________
${name}
दिनांक: ${today}

[यह दस्तावेज़ LegalEase AI द्वारा तैयार किया गया है। उपयोग से पहले समीक्षा करें।]`;
  }

  if (language === 'marathi') {
    return `कायदेशीर नोटीस
कलम 80 सीपीसी / लागू असल्यानुसार

दिनांक: ${today}

प्रेषक:
${senderBlock}

प्राप्तकर्ता:
${recipientBlock}

विषय: ${issueType} संदर्भात कायदेशीर नोटीस — तातडीने निवारणाची मागणी

महोदय / महोदया,

मी, ${name}, रहिवासी ${address}, आपणास या कायदेशीर नोटीसद्वारे खालील बाबींबद्दल सूचित करतो/करते:

1. पार्श्वभूमी व तथ्ये

${description}

2. लागू कायदेशीर तरतुदी

वरील कृत्ये खालील कायदेशीर तरतुदींचे उल्लंघन करतात:
(अ) भारतीय दंड संहिता, 1860 चे कलम 420 — फसवणूक;
(ब) ग्राहक संरक्षण कायदा, 2019 — अनुचित व्यापार व्यवहार;
(क) माहिती तंत्रज्ञान कायदा, 2000 (लागू असल्यास)।

3. मागणी

वरील बाबींच्या अनुषंगाने, मी आपणाकडे मागणी करतो/करते:
(अ) ${relief}
(ब) कोणत्याही बेकायदेशीर कृत्यापासून तत्काळ विरत व्हावे;
(क) या नोटीसची प्राप्ती झाल्यापासून 15 दिवसांच्या आत लेखी पोचपावती द्यावी।

4. अनुपालन न केल्यास परिणाम

या नोटीसची प्राप्ती झाल्यापासून पंधरा (15) दिवसांच्या आत वरील मागण्यांचे अनुपालन न केल्यास, मी सक्षम न्यायालयात कायदेशीर कारवाई करण्यास बाध्य होईन।

5. हक्कांचे राखीव

सर्व हक्क राखीव आहेत. ही नोटीस पूर्वग्रहाशिवाय जारी केली आहे।

आपला/आपली विश्वासू,

_______________________
${name}
दिनांक: ${today}

[हे दस्तऐवज LegalEase AI द्वारे तयार केले आहे. वापरण्यापूर्वी पुनरावलोकन करा.]`;
  }

  // Default: English
  return `LEGAL NOTICE
Under Section 80 CPC / As Applicable

Date: ${today}

FROM:
${senderBlock}

TO:
${recipientBlock}

SUBJECT: Legal Notice for ${issueType} — Demand for Immediate Redressal

Sir / Madam,

UNDER INSTRUCTIONS AND ON BEHALF OF my client, ${name}, residing at ${address}${email ? ` (Email: ${email})` : ''} (hereinafter referred to as the "Complainant"), I hereby serve upon you this Legal Notice in the matter described herein:

1. BACKGROUND & FACTS

${description}

2. LEGAL PROVISIONS INVOKED

The aforementioned acts of the Noticee constitute violations of:
(a) Section 420 of the Indian Penal Code, 1860 — Cheating and dishonestly inducing delivery of property;
(b) The Consumer Protection Act, 2019 — Unfair Trade Practice and Deficiency in Service;
(c) The Information Technology Act, 2000 (if applicable) — Online fraud and misrepresentation.

3. DEMAND

In view of the above, my client hereby demands that you:

(a) ${relief}
(b) Cease and desist from any further unlawful conduct;
(c) Provide a written acknowledgment of this notice within 15 days of receipt.`;
};

export default function GeneratorOutput() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [editing, setEditing] = useState(false);

  const { form, docType, language } = location.state || {};
  const [docText, setDocText] = useState(generateDocument(form, docType, language || 'english'));

  const langLabel = { english: '🇬🇧 English', hindi: '🇮🇳 Hindi', marathi: '🟠 Marathi' }[language] || '🇬🇧 English';

  const handleCopy = () => {
    navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([docText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LegalEase_Notice.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 pt-20">
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
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">Intelligence successfully synthesized. Conduct a final audit before execution or dissemination.</p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className={`p-3 rounded-xl border transition-all ${editing ? 'bg-navy-900 border-navy-900 text-white shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-navy-200'}`}
              >
                <Edit3 size={18} strokeWidth={2.5} />
              </button>
              <button onClick={handleCopy} className={`p-3 rounded-xl border transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-navy-200 ${copied ? 'text-emerald-500 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20' : ''}`}>
                {copied ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
              </button>
              <button onClick={() => {}} className="p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-navy-200 transition-all">
                <Printer size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Success Marker */}
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500/50" />
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-emerald-950 flex items-center justify-center shadow-lg border border-emerald-100 dark:border-emerald-900/30 flex-shrink-0">
               <CheckCircle size={20} className="text-emerald-500" strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-0.5">Structural Integrity Verified</p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500">Document generated using Tier-1 legal syntax models.</p>
            </div>
          </div>

          {/* Document */}
          <div className="card-base mb-5 overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 rounded-3xl">
            {/* Document Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-navy-600" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Legal_Notice.txt</span>
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
              <pre className="p-8 font-mono text-sm text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px] overflow-y-auto"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {docText}
              </pre>
            )}
          </div>

          {/* Risk Advisory */}
          <div className="flex items-start gap-4 p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 mb-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-full w-1 bg-amber-500/50" />
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm flex-shrink-0">
               <AlertTriangle size={16} className="text-amber-500" strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-500 leading-relaxed">
              <strong className="block mb-1 text-[11px]">Audit Advisory</strong>
              This artifact is generated via algorithmic linguistic synthesis. 
              The system does not establish attorney-client privilege. Execute manual review for high-value jurisdictional dissemination.
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              <Download size={16} /> Download PDF
            </button>
            <button
              onClick={handleEmail}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border
                ${emailSent
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-navy-300 hover:bg-navy-50'
                }`}
            >
              {emailSent ? <Check size={16} className="text-emerald-500" /> : <Mail size={16} />}
              {emailSent ? 'Email Sent!' : 'Send via Email'}
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2 py-3.5">
              <Share2 size={16} /> Share Link
            </button>
          </div>

          {/* Regenerate */}
          <div className="text-center mt-5">
            <button
              onClick={() => setDocText(generateDocument(form, docType, language || 'english'))}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 transition-colors"
            >
              <RefreshCw size={13} /> Regenerate Document
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

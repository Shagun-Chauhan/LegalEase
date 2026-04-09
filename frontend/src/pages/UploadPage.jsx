import React, { useState } from 'react';
import { Upload, FileText, Shield, Zap, ChevronRight, ArrowRight, Info, Loader2, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UploadBox from '../components/UploadBox';
import { useEffect } from 'react';
import documentService from '../services/documentService';
import authService from '../services/authService';

export default function UploadPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    Promise.all([
      documentService.list(),
      authService.getProfile()
    ])
      .then(([docRes, profileRes]) => {
        setHistory(docRes.data.documents || []);
        setUser(profileRes.data);
        localStorage.setItem("user", JSON.stringify(profileRes.data));
      })
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-sm text-slate-800">Delete this document?</p>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await documentService.delete(id);
                setHistory(prev => prev.filter(doc => doc._id !== id));
                toast.success("Document deleted");
              } catch (err) {
                toast.error("Delete failed: " + (err.response?.data?.message || err.message));
              }
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const filteredHistory = history.filter(doc =>
    doc.originalFileName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAnalyze = async () => {
    if (!files.length) return;

    try {
      setAnalyzing(true);

      const formData = new FormData();
      formData.append("document", files[0]);

      const res = await documentService.upload(formData);
      const data = res.data;

      // store result
      localStorage.setItem("analysisResult", JSON.stringify(data));

      navigate("/result");
      toast.success("Analysis complete");

    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} user={user} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className={`transition-all duration-500 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} pt-20`}>
        <div className="p-6 md:p-10 max-w-4xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">
            <span className="cursor-pointer hover:text-navy-600 transition-colors" onClick={() => navigate('/dashboard')}>Vault</span>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-slate-900 dark:text-slate-300 font-black">Document Intelligence</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-navy-100 dark:bg-navy-950/40 flex items-center justify-center border border-navy-200/50 dark:border-navy-800/30">
                <Upload size={18} className="text-navy-700 dark:text-navy-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-navy-600 dark:text-navy-400">Security & Compliance</p>
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white tracking-tight uppercase mb-2">Upload Document</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl">
              Upload any legal document to get a simple summary and risk analysis.
            </p>
          </div>

          {/* Upload Area */}
          <div className="card-base p-8 md:p-10 mb-8 shadow-2xl shadow-slate-200 dark:shadow-none border-dashed border-2 border-slate-200 dark:border-navy-900/30 bg-slate-50/50 dark:bg-slate-900/10 group transition-all hover:border-navy-300 dark:hover:border-navy-700">
            <UploadBox onFileSelect={setFiles} />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!files.length || analyzing}
            className="w-full bg-navy-900 hover:bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-navy transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale group flex items-center justify-center gap-3 mb-16"
          >
            {analyzing ? <Loader2 className="animate-spin" size={18} /> : <> <Zap size={16} strokeWidth={2.5} /> Analyze Document </>}
          </button>

          {/* History Section */}
          <div className="pt-10 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Your Intelligence Vault</h2>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Previously scanned legal artifacts</p>
              </div>
              <span className="bg-navy-100 dark:bg-navy-950 text-navy-700 dark:text-navy-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-navy-200/50 dark:border-navy-900/30">
                {filteredHistory.length} Total
              </span>
            </div>

            <div className="relative mb-6 group">
              <input
                type="text"
                placeholder="Find document by filename..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field py-4 pl-12 text-sm font-medium shadow-lg shadow-slate-100 dark:shadow-none w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-20 card-base border-dashed bg-slate-50/50 dark:bg-slate-900/20">
                  <FileText size={48} className="text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">Empty Vault</h3>
                </div>
              ) : (
                filteredHistory.map(doc => (
                  <div
                    key={doc._id}
                    className="card-base p-5 flex items-center justify-between group/doc hover:border-navy-200 dark:hover:border-navy-800 transition-all cursor-pointer overflow-hidden relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <div className="absolute top-0 right-0 h-full w-1 bg-navy-500 opacity-0 group-hover/doc:opacity-100 transition-opacity" />
                    
                    <div
                      onClick={() => {
                        localStorage.setItem("analysisResult", JSON.stringify(doc));
                        navigate("/result");
                      }}
                      className="flex items-center gap-4 flex-1"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover/doc:bg-navy-50 dark:group-hover/doc:bg-navy-950 transition-colors">
                        <FileText size={20} className="text-slate-400 dark:text-slate-600 group-hover/doc:text-navy-500 transition-colors" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white tracking-tight group-hover/doc:text-navy-700 dark:group-hover/doc:text-navy-400 transition-colors">
                          {doc.originalFileName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            doc.riskLevel === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 
                            doc.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            Risk: {doc.riskLevel}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                             {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc._id); }}
                      className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover/doc:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

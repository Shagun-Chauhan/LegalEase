import React, { useState } from 'react';
import { Upload, FileText, Shield, Zap, ChevronRight, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await documentService.delete(id);
      setHistory(prev => prev.filter(doc => doc._id !== id));
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
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

    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={user} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 pt-16">
        <div className="p-6 max-w-3xl mx-auto">

          <div className="text-xs text-slate-400 mb-4 flex gap-2">
            <span onClick={() => navigate('/dashboard')} className="cursor-pointer">Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-slate-700 dark:text-slate-200">Upload</span>
          </div>


          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Upload Legal Document
          </h1>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 mb-6">
            <UploadBox onFileSelect={setFiles} />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!files.length || analyzing}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {analyzing ? "Analyzing..." : "Analyze Document"}
          </button>

        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">
            Your Documents
          </h2>

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700"
          />

          <div className="space-y-3">
            {filteredHistory.map(doc => (
              <div
                key={doc._id}
                className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl flex justify-between items-center"
              >
                <div
                  onClick={() => {
                    localStorage.setItem("analysisResult", JSON.stringify(doc));
                    navigate("/result");
                  }}
                  className="cursor-pointer"
                >
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    {doc.originalFileName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {doc.riskLevel} · {new Date(doc.uploadedAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(doc._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>

  );
}
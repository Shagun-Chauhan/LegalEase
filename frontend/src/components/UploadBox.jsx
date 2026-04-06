import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadBox({ onFileSelect, accept=".pdf,.docx,.txt,text/plain", maxSizeMB = 10 }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `${file.name} exceeds ${maxSizeMB}MB limit`;
    }
    return null;
  };

  const handleFiles = (newFiles) => {
    const fileArr = Array.from(newFiles);
    const newErrors = [];
    const validFiles = [];

    fileArr.forEach(file => {
      const err = validateFile(file);
      if (err) {
        newErrors.push(err);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);
    setFiles(prev => [...prev, ...validFiles]);
    if (onFileSelect) onFileSelect([...files, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeFile = (idx) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    if (onFileSelect) onFileSelect(updated);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current.click()}
        className={`
          relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer
          transition-all duration-300 group
          ${dragActive
            ? 'border-navy-500 bg-navy-50/50 dark:bg-navy-950/20 scale-[1.01] shadow-xl shadow-navy-500'
            : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-navy-400 hover:bg-navy-50/30 dark:hover:bg-navy-950/10 hover:shadow-lg hover:shadow-slate-200 dark:hover:shadow-none'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all duration-300
          ${dragActive ? 'bg-navy-500 text-white shadow-navy scale-110' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-navy-500 group-hover:scale-105 group-hover:bg-navy-50 dark:group-hover:bg-navy-950/50'}`}
        >
          <Upload size={32} strokeWidth={2.5} />
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
          {dragActive ? 'Release to upload' : 'Upload your documents'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
          Drag and drop your files here or <span className="text-navy-600 dark:text-navy-400 font-bold hover:underline">browse files</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {['PDF', 'DOCX', 'TXT'].map(type => (
            <span key={type} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/5">
              {type}
            </span>
          ))}
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-1" />
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Max {maxSizeMB}MB
          </span>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-sm font-semibold text-red-600 dark:text-red-400 animate-slide-up">
              <AlertCircle size={18} className="flex-shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="section-label px-1">Selected Files ({files.length})</p>
          <div className="grid grid-cols-1 gap-3">
            {files.map((file, i) => (
              <div key={i} className="group flex items-center gap-4 px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all animate-fade-in">
                <div className="w-10 h-10 bg-navy-50 dark:bg-navy-950/40 rounded-xl flex items-center justify-center flex-shrink-0 border border-navy-100 dark:border-navy-900/30 shadow-sm">
                  <File size={18} className="text-navy-600 dark:text-navy-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{formatSize(file.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-green">Ready</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-all active:scale-90"
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


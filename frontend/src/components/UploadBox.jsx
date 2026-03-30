import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadBox({ onFileSelect, accept = '.pdf,.doc,.docx', maxSizeMB = 10 }) {
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
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
          transition-all duration-200
          ${dragActive
            ? 'border-navy-500 bg-navy-50 scale-[1.01]'
            : 'border-slate-300 bg-slate-50 hover:border-navy-400 hover:bg-navy-50/50'
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

        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors
          ${dragActive ? 'bg-navy-100' : 'bg-white shadow-card'}`}
        >
          <Upload size={28} className={dragActive ? 'text-navy-600' : 'text-slate-400'} />
        </div>

        <h3 className="font-semibold text-slate-700 mb-1">
          {dragActive ? 'Drop files here' : 'Drag & drop files here'}
        </h3>
        <p className="text-sm text-slate-400 mb-3">or <span className="text-navy-600 font-semibold underline">browse to choose</span></p>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <File size={12} /> PDF, DOC, DOCX
          </span>
          <span>·</span>
          <span>Max {maxSizeMB}MB per file</span>
        </div>
      </div>

      {/* Errors */}
      {errors.map((err, i) => (
        <div key={i} className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          <AlertCircle size={15} className="flex-shrink-0" />
          {err}
        </div>
      ))}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <File size={16} className="text-navy-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
              </div>
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

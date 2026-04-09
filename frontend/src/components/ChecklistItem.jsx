import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function ChecklistItem({ label, description, required = false, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div
      onClick={() => setChecked(!checked)}
      className={`
        flex items-start gap-4 p-4 rounded-2xl border cursor-pointer
        transition-all duration-300 group
        ${checked
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 shadow-sm shadow-emerald-100 dark:shadow-none'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-navy-300 dark:hover:border-navy-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-md hover:shadow-slate-200 dark:hover:shadow-none'
        }
      `}
    >
      {/* Checkbox */}
      <div
        className={`
          w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
          transition-all duration-300 border-2
          ${checked
            ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 group-hover:border-navy-400'
          }
        `}
      >
        <div className={`transition-all duration-300 ${checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <Check size={12} strokeWidth={4} className="text-white" />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <p className={`text-sm font-bold tracking-tight transition-all duration-300 ${
            checked 
              ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-60' 
              : 'text-slate-900 dark:text-white'
          }`}>
            {label}
          </p>
          {required && (
            <span className="badge badge-red py-0 px-2 text-[9px] font-black uppercase tracking-wider">Required</span>
          )}
        </div>
        {description && (
          <p className={`text-xs mt-1 leading-relaxed font-medium transition-colors ${
            checked ? 'text-emerald-600/50 dark:text-emerald-400/50' : 'text-slate-500 dark:text-slate-400'
          }`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

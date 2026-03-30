import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function ChecklistItem({ label, description, required = false, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div
      onClick={() => setChecked(!checked)}
      className={`
        flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer
        transition-all duration-200
        ${checked
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }
      `}
    >
      {/* Checkbox */}
      <div
        className={`
          w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5
          transition-all duration-200
          ${checked
            ? 'bg-emerald-500 border-2 border-emerald-500'
            : 'border-2 border-slate-300 bg-white'
          }
        `}
      >
        {checked && <Check size={11} strokeWidth={3} className="text-white" />}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold transition-colors ${checked ? 'text-emerald-700 line-through' : 'text-slate-800'}`}>
            {label}
          </p>
          {required && (
            <span className="badge badge-red text-[10px]">Required</span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}

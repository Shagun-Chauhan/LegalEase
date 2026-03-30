import React from 'react';
import { AlertTriangle, CheckCircle, Info, Calendar, DollarSign, FileWarning } from 'lucide-react';

const variants = {
  keypoint: {
    icon: Info,
    iconBg: 'bg-navy-100',
    iconColor: 'text-navy-600',
    border: 'border-navy-100',
    headerBg: 'bg-navy-50',
    label: 'Key Point',
    labelColor: 'text-navy-700',
  },
  date: {
    icon: Calendar,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    border: 'border-purple-100',
    headerBg: 'bg-purple-50',
    label: 'Important Date',
    labelColor: 'text-purple-700',
  },
  amount: {
    icon: DollarSign,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    headerBg: 'bg-emerald-50',
    label: 'Amount',
    labelColor: 'text-emerald-700',
  },
  risk: {
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    border: 'border-red-100',
    headerBg: 'bg-red-50',
    label: 'Risky Clause',
    labelColor: 'text-red-700',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    headerBg: 'bg-emerald-50',
    label: 'Favorable Clause',
    labelColor: 'text-emerald-700',
  },
  warning: {
    icon: FileWarning,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
    headerBg: 'bg-amber-50',
    label: 'Warning',
    labelColor: 'text-amber-700',
  },
};

export default function ResultCard({ variant = 'keypoint', title, content, meta, severity }) {
  const v = variants[variant];
  const Icon = v.icon;

  return (
    <div className={`rounded-2xl border ${v.border} overflow-hidden shadow-sm`}>
      {/* Header */}
      <div className={`${v.headerBg} px-4 py-3 flex items-center gap-2.5`}>
        <div className={`w-7 h-7 rounded-lg ${v.iconBg} flex items-center justify-center`}>
          <Icon size={14} className={v.iconColor} />
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider ${v.labelColor}`}>{v.label}</span>
        {severity && (
          <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
            severity === 'High' ? 'bg-red-100 text-red-700' :
            severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
            'bg-emerald-100 text-emerald-700'
          }`}>{severity}</span>
        )}
      </div>

      {/* Body */}
      <div className="bg-white px-4 py-4">
        <h4 className="font-semibold text-slate-800 text-sm mb-1.5">{title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
        {meta && (
          <p className="text-xs text-slate-400 mt-2.5 flex items-center gap-1">
            <span className="w-1 h-1 bg-slate-300 rounded-full" /> {meta}
          </p>
        )}
      </div>
    </div>
  );
}

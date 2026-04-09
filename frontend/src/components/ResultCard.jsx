import React from 'react';
import { AlertTriangle, CheckCircle, Info, Calendar, DollarSign, FileWarning } from 'lucide-react';

const variants = {
  keypoint: {
    icon: Info,
    iconBg: 'bg-navy-50 dark:bg-navy-950/40',
    iconColor: 'text-navy-600 dark:text-navy-400',
    border: 'border-navy-100 dark:border-navy-900/30',
    headerBg: 'bg-navy-50/50 dark:bg-navy-950/20',
    label: 'Key Point',
    labelColor: 'text-navy-700 dark:text-navy-300',
  },
  date: {
    icon: Calendar,
    iconBg: 'bg-purple-50 dark:bg-purple-950/40',
    iconColor: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-900/30',
    headerBg: 'bg-purple-50/50 dark:bg-purple-950/20',
    label: 'Important Date',
    labelColor: 'text-purple-700 dark:text-purple-300',
  },
  amount: {
    icon: DollarSign,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    headerBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    label: 'Amount',
    labelColor: 'text-emerald-700 dark:text-emerald-300',
  },
  risk: {
    icon: AlertTriangle,
    iconBg: 'bg-red-50 dark:bg-red-950/40',
    iconColor: 'text-red-600 dark:text-red-400',
    border: 'border-red-100 dark:border-red-900/30',
    headerBg: 'bg-red-50/50 dark:bg-red-950/20',
    label: 'Risky Clause',
    labelColor: 'text-red-700 dark:text-red-300',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    headerBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    label: 'Favorable Clause',
    labelColor: 'text-emerald-700 dark:text-emerald-300',
  },
  warning: {
    icon: FileWarning,
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/30',
    headerBg: 'bg-amber-50/50 dark:bg-amber-950/20',
    label: 'Warning',
    labelColor: 'text-amber-700 dark:text-amber-300',
  },
};

export default function ResultCard({ variant = 'keypoint', title, content, meta, severity }) {
  const v = variants[variant] || variants.keypoint;
  const Icon = v.icon;

  return (
    <div className={`rounded-2xl border ${v.border} overflow-hidden shadow-sm card-base`}>
      {/* Header */}
      <div className={`${v.headerBg} px-4 py-3 flex items-center gap-3 border-b ${v.border}`}>
        <div className={`w-8 h-8 rounded-xl ${v.iconBg} flex items-center justify-center shadow-sm`}>
          <Icon size={16} className={v.iconColor} />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${v.labelColor}`}>{v.label}</span>
        {severity && (
          <span className={`ml-auto badge ${
            severity === 'High' ? 'badge-red' :
            severity === 'Medium' ? 'badge-yellow' :
            'badge-green'
          }`}>{severity} Risk</span>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-5 bg-white dark:bg-slate-900">
        <h4 className="font-bold text-slate-900 dark:text-white text-[15px] mb-2 leading-tight">{title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{content}</p>
        
        {meta && (
          <div className="mt-4 flex items-center gap-2 group">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-navy-400 transition-colors" />
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              {meta}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


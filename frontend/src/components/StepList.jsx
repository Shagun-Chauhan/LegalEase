import React from 'react';
import { Check, AlertCircle, Clock } from 'lucide-react';

export default function StepList({ steps = [], completedSteps = [] }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, i) => {
        const isCompleted = completedSteps.includes(i);
        const isCurrent = !isCompleted && (i === 0 || completedSteps.includes(i - 1));
        const isLast = i === steps.length - 1;

        return (
          <li key={i} className="relative flex gap-6 pb-10 last:pb-0 group">
            {/* Connector line */}
            {!isLast && (
              <div
                className={`absolute left-5 top-10 bottom-0 w-0.5 rounded-full transition-colors duration-500
                           ${isCompleted ? 'bg-navy-500' : 'bg-slate-200 dark:bg-slate-800'}`}
              />
            )}

            {/* Step indicator */}
            <div className="relative flex-shrink-0">
              <div
                className={`
                  w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black
                  transition-all duration-500 z-10 relative border-2 uppercase tracking-tighter
                  ${isCompleted
                    ? 'bg-navy-700 border-navy-700 text-white shadow-lg shadow-navy rotate-0 scale-100'
                    : isCurrent
                      ? 'bg-white dark:bg-slate-900 border-navy-500 text-navy-600 dark:text-navy-400 shadow-xl shadow-navy scale-110'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 grayscale'
                  }
                `}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : i + 1}
              </div>

              {/* Pulse effect for current step */}
              {isCurrent && (
                <div className="absolute inset-0 rounded-2xl bg-navy-500/20 animate-ping -z-0 scale-125" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pt-0.5 transition-opacity duration-300 ${!isCompleted && !isCurrent ? 'opacity-60' : 'opacity-100'}`}>
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <h4 className={`font-bold text-base tracking-tight transition-colors ${isCompleted
                  ? 'text-navy-700 dark:text-navy-400'
                  : isCurrent
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-500'
                  }`}>
                  {step.title}
                </h4>
                {isCurrent && (
                  <span className="badge badge-blue text-[9px] py-0 px-2 font-black uppercase whitespace-nowrap animate-pulse">In Progress</span>
                )}
              </div>

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">{step.description}</p>

              {step.note && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm transition-all hover:bg-amber-50 dark:hover:bg-amber-950/30">
                  <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={14} className="text-amber-600 dark:text-amber-500" strokeWidth={3} />
                  </div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 leading-relaxed">{step.note}</p>
                </div>
              )}

              {step.duration && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                    <Clock size={12} strokeWidth={2.5} /> {step.duration}
                  </span>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

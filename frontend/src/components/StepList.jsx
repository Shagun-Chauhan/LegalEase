import React from 'react';
import { Check } from 'lucide-react';

export default function StepList({ steps = [], completedSteps = [] }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, i) => {
        const isCompleted = completedSteps.includes(i);
        const isLast = i === steps.length - 1;

        return (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connector line */}
            {!isLast && (
              <div
                className={`absolute left-4 top-8 bottom-0 w-0.5 ${isCompleted ? 'bg-navy-500' : 'bg-slate-200'}`}
              />
            )}

            {/* Step number / check */}
            <div className="relative flex-shrink-0">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300 z-10 relative
                  ${isCompleted
                    ? 'bg-navy-700 text-white shadow-navy'
                    : 'bg-white border-2 border-slate-300 text-slate-500'
                  }
                `}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <h4 className={`font-semibold text-sm mb-1 ${isCompleted ? 'text-navy-700' : 'text-slate-800'}`}>
                {step.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              {step.note && (
                <div className="mt-2 flex items-start gap-1.5 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-amber-500 font-bold text-xs mt-0.5">!</span>
                  <p className="text-xs text-amber-700">{step.note}</p>
                </div>
              )}
              {step.duration && (
                <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-medium">
                  ⏱ {step.duration}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

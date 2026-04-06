import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Card({
  icon: Icon,
  iconBg = 'bg-navy-50 dark:bg-navy-950/40',
  iconColor = 'text-navy-600 dark:text-navy-400',
  title,
  description,
  badge,
  badgeVariant = 'blue',
  onClick,
  footer,
  highlighted = false,
  className = '',
  children,
}) {
  const badgeClasses = {
    blue: 'badge-blue',
    green: 'badge-green',
    red: 'badge-red',
    yellow: 'badge-yellow',
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-6 rounded-2xl
        card-base
        ${onClick ? 'card-hover translate-y-0 active:translate-y-0' : ''}
        ${highlighted ? 'ring-2 ring-navy-500 dark:ring-navy-400 ring-offset-2 dark:ring-offset-slate-950' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-colors border border-navy-100 dark:border-navy-900/30 shadow-sm`}>
            <Icon size={20} className={iconColor} />
          </div>
        )}

        {badge && (
          <span className={`badge ${badgeClasses[badgeVariant]}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        {title && (
          <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      {children}

      {/* Footer */}
      {footer && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 text-sm text-navy-600 dark:text-navy-400 font-bold flex items-center gap-2 group/footer">
          {footer}
          <ArrowRight size={14} className="group-hover/footer:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );
}

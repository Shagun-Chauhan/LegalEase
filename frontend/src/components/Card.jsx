import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Card({
  icon: Icon,
  iconBg = 'bg-navy-100',
  iconColor = 'text-navy-700',
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
        card-base p-5
        ${onClick ? 'card-hover' : ''}
        ${highlighted ? 'ring-2 ring-navy-500 ring-offset-2' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={18} className={iconColor} />
          </div>
        )}
        {badge && (
          <span className={`badge ${badgeClasses[badgeVariant]}`}>{badge}</span>
        )}
      </div>

      {/* Content */}
      {title && (
        <h3 className="font-semibold text-slate-900 text-base mb-1.5">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      )}

      {children}

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-navy-600 font-semibold flex items-center gap-1.5">
          {footer} <ArrowRight size={14} />
        </div>
      )}
    </div>
  );
}

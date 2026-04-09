import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="card-base p-8 group hover:scale-[1.03] transition-all duration-300 border-slate-300 dark:border-white/5 relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative background element */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-navy-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
      
      <div className="mb-6 relative">
        <div className="w-14 h-14 bg-navy-50 dark:bg-navy-950/40 rounded-2xl flex items-center justify-center text-navy-700 dark:text-navy-400 group-hover:bg-navy-700 group-hover:text-white transition-all duration-300 shadow-sm border border-navy-100 dark:border-navy-900/30">
          <Icon size={28} strokeWidth={1.5} />
        </div>
      </div>
      
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-navy-700 dark:group-hover:text-navy-400 transition-colors uppercase">
        {title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
        {description}
      </p>

    </div>
  );
};

export default FeatureCard;

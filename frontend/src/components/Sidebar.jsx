import React from 'react';
import {
  LayoutDashboard, Scale, Upload, FileText, HelpCircle,
  BookOpen, Shield, Clock, Star, ChevronRight, X, Activity, Command
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Scale, label: 'Legal Issues', path: '/issues' },
  { icon: Upload, label: 'Upload Document', path: '/upload' },
  { icon: FileText, label: 'Generate Document', path: '/generate' },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] md:hidden transition-all duration-500"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[70] w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5
          transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full p-8">

          {/* Logo - Mobile Only (Already in Navbar for Desktop) */}
          <div className="flex md:hidden items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center shadow-xl shadow-navy">
              <Scale size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-slate-900 dark:text-white text-xl tracking-tighter uppercase leading-none">LegalEase</h1>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-navy-500 mt-1">Legal Assistant</p>
            </div>
            <button onClick={onClose} className="ml-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="md:mt-16 sm:mt-0 flex flex-col h-full">
            {/* Main Navigation */}
            <div className="space-y-10">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-500 mb-6 px-4">Menu</p>
                <nav className="space-y-1">
                  {navItems.map(({ icon: Icon, label, path }) => {
                    const active = location.pathname === path;
                    return (
                      <button
                        key={path}
                        onClick={() => handleNav(path)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group
                          ${active
                            ? 'bg-navy-900 text-white shadow-xl shadow-navy active:scale-95'
                            : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-navy-600 dark:hover:text-navy-400'
                          }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-navy-800' : 'bg-transparent group-hover:bg-navy-100 dark:group-hover:bg-navy-950'}`}>
                          <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                        </div>
                        <span className={`text-[12px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>{label}</span>
                        {active && (
                          <div className="ml-auto w-1 h-4 rounded-full bg-navy-400/50" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="flex-1 min-h-[40px]" />



            {/* Footer Note */}
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">v2.4 Production</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

    </>
  );
}

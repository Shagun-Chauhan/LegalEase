import React from 'react';
import {
  LayoutDashboard, Scale, Upload, FileText, HelpCircle,
  BookOpen, Shield, Clock, Star, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Scale, label: 'Legal Issues', path: '/issues' },
  { icon: Upload, label: 'Upload Document', path: '/upload' },
  { icon: FileText, label: 'Generate Document', path: '/generate' },
];

const secondaryItems = [
  { icon: BookOpen, label: 'Legal Library', path: '#' },
  { icon: Shield, label: 'My Cases', path: '#', badge: '3' },
  { icon: Clock, label: 'History', path: '#' },
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 z-40 w-64 bg-white/80 backdrop-blur-md dark:bg-slate-950/50 border-r border-slate-100 dark:border-white/5
          transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Main Navigation */}
          <div>
            <p className="section-label mb-3 px-2">Main Menu</p>
            <nav className="space-y-1">
              {navItems.map(({ icon: Icon, label, path }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => handleNav(path)}
                    className={`sidebar-link w-full text-left ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                  >
                    <Icon size={17} className={active ? 'text-white' : 'text-slate-500'} />
                    <span>{label}</span>
                    {active && <ChevronRight size={14} className="ml-auto text-white/60" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className="my-5 border-t border-slate-100 dark:border-white/5" />

         
          <div className="flex-1" />

          {/* Footer Note */}
          <p className="text-center text-xs text-slate-400 mt-4 pb-2">
            LegalEase v2.1 · <span className="text-navy-500 cursor-pointer hover:underline">Help Center</span>
          </p>
        </div>
      </aside>
    </>
  );
}

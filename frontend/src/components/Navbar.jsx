import React, { useState } from 'react';
import { Scale, Bell, Search, ChevronDown, Menu, X, User, LogOut, Settings, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker';

export default function Navbar({ onMenuToggle, menuOpen }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [savedCity, setSavedCity] = useState(null);

  const closeAll = () => { setDropdownOpen(false); setNotifOpen(false); };

  const notifications = [
    { id: 1, text: 'Your document analysis is ready', time: '2 min ago', unread: true },
    { id: 2, text: 'Legal notice draft generated', time: '1 hr ago', unread: true },
    { id: 3, text: 'Reminder: File complaint by Friday', time: '2 hr ago', unread: false },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button onClick={onMenuToggle} className="md:hidden btn-ghost p-2">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center shadow-navy">
                <Scale size={16} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-slate-900 text-lg leading-none">LegalEase</span>
                <span className="hidden sm:block text-[10px] font-medium text-slate-400 leading-none mt-0.5">Smart Legal Companion</span>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search legal issues, documents..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent focus:bg-white transition-all duration-200 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">

            {/* Location button */}
            <button
              onClick={() => { closeAll(); setLocationOpen(true); }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-colors duration-200 group ${savedCity ? 'bg-navy-50 hover:bg-navy-100' : 'hover:bg-slate-100'}`}
              title="Find nearby courts and legal offices"
            >
              <MapPin size={16} className={savedCity ? 'text-navy-600' : 'text-slate-500 group-hover:text-navy-600'} />
              <span className={`hidden lg:block text-xs font-semibold max-w-[90px] truncate ${savedCity ? 'text-navy-700' : 'text-slate-600 group-hover:text-navy-700'}`}>
                {savedCity || 'Find Nearby'}
              </span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              >
                <Bell size={18} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 card-base animate-slide-up z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                  </div>
                  <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? 'bg-navy-50/40' : ''}`}>
                        <p className="text-sm text-slate-700 font-medium">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100">
                    <button className="text-xs text-navy-600 font-semibold hover:underline">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center text-white font-bold text-sm">A</div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-none">Arjun Sharma</p>
                  <p className="text-xs text-slate-400 mt-0.5">Premium Plan</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 card-base animate-slide-up z-50">
                  <div className="p-1">
                    <button onClick={() => { navigate('/profile'); closeAll(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <User size={15} className="text-slate-400" /> My Profile
                    </button>
                    <button onClick={() => { navigate('/dashboard'); closeAll(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings size={15} className="text-slate-400" /> Settings
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button onClick={() => navigate('/login')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {locationOpen && (
        <LocationPicker
          onClose={() => setLocationOpen(false)}
          onCitySelect={(city) => { setSavedCity(city); setLocationOpen(false); }}
        />
      )}
    </>
  );
}

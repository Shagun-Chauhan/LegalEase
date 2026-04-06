import React, { useState } from 'react';
import { Scale, Bell, Search, ChevronDown, Menu, X, User, LogOut, Settings, MapPin, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import { useEffect } from 'react';

export default function Navbar({ onMenuToggle, menuOpen, user: propUser }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [savedCity, setSavedCity] = useState(null);
  const [userName, setUserName] = useState('User');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchCategories = [
    { id: 'fraud', title: 'Fraud & Cheating', desc: 'Online scams & fraud' },
    { id: 'salary', title: 'Salary & Workplace', desc: 'Unpaid wages & harassment' },
    { id: 'tenant', title: 'Tenant Dispute', desc: 'Eviction & deposits' },
    { id: 'consumer', title: 'Consumer Rights', desc: 'Product & service defects' },
    { id: 'property', title: 'Property Dispute', desc: 'Ownership & inheritance' },
    { id: 'vehicle', title: 'Motor Vehicle', desc: 'Accidents & insurance' },
    { id: 'family', title: 'Family & Marriage', desc: 'Divorce & domestic issues' },
    { id: 'cyber', title: 'Cybercrime', desc: 'Hacking & identity theft' },
  ];

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = searchCategories.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filtered);
  }, [search]);

  useEffect(() => {
    const fetchIfNeeded = async () => {
      if (propUser) {
        setUserName(propUser.name || 'User');
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed.name && parsed.name !== 'User') {
              setUserName(parsed.name);
              return;
            }
          } catch (e) {
            console.error("Error parsing user from localStorage", e);
          }
        }
        
        // Final fallback: Try to fetch profile from API
        try {
          const res = await authService.getProfile();
          if (res.data && res.data.name) {
            setUserName(res.data.name);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Navbar profile fetch failed:", err);
        }
      }
    };

    fetchIfNeeded();
  }, [propUser]);

  const closeAll = () => { setDropdownOpen(false); setNotifOpen(false); };

  const notifications = [
    { id: 1, text: 'Your document analysis is ready', time: '2 min ago', unread: true },
    { id: 2, text: 'Legal notice draft generated', time: '1 hr ago', unread: true },
    { id: 3, text: 'Reminder: File complaint by Friday', time: '2 hr ago', unread: false },
  ];

  return (
    <>
      <header className={`fixed top-0 ${menuOpen ? 'md:left-64' : 'left-0'} right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 transition-all duration-300`}>
        <div className="flex items-center justify-between h-20 px-6 md:px-10 max-w-screen-2xl mx-auto">

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuToggle} 
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-navy-700 rounded-2xl flex items-center justify-center shadow-lg shadow-navy group-hover:scale-105 transition-all border border-navy-600">
                <Scale size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-display font-bold text-slate-900 dark:text-white text-xl tracking-tight leading-none group-hover:text-navy-700 dark:group-hover:text-navy-400 transition-colors">LegalEase</h1>
                  <span className="px-1.5 py-0.5 rounded-md bg-navy-100 dark:bg-navy-900/40 text-[8px] font-bold text-navy-600 dark:text-navy-400 tracking-widest uppercase">Beta</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-1">Legal Assistant</p>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-16">
            <div className="relative w-full group">
              <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-navy-500/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
              <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors" />
              <input
                type="text"
                placeholder="Search resources, cases, documents..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full pl-12 pr-6 py-3 text-xs font-bold uppercase tracking-widest rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 focus:border-navy-500/20 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
              />
              
              {/* Search Results Dropdown */}
              {searchFocused && search && (
                <div className="absolute top-full left-0 right-0 mt-3 p-2 bg-white dark:bg-slate-950 rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map(res => (
                        <button
                          key={res.id}
                          onClick={() => {
                            navigate('/action', { state: { issueId: res.id } });
                            setSearch('');
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 group transition-all text-left"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-navy-600 transition-colors uppercase">{res.title}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">{res.desc}</p>
                          </div>
                          <ChevronDown size={14} className="text-slate-300 -rotate-90" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search size={24} className="mx-auto text-slate-200 dark:text-slate-800 mb-2" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No results found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">

            {/* Location button */}
            <button
              onClick={() => { closeAll(); setLocationOpen(true); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group ${savedCity ? 'bg-navy-50 dark:bg-navy-950/30 text-navy-700 dark:text-navy-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              title="Find nearby courts and legal offices"
            >
              <MapPin size={18} className={savedCity ? 'text-navy-600' : 'group-hover:text-navy-600 transition-colors'} />
              <span className="hidden lg:block text-xs font-bold truncate max-w-[100px]">
                {savedCity || 'Nearby'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-300 text-slate-500 dark:text-slate-400 active:scale-90 group/theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400 group-hover:rotate-90 transition-transform duration-500" /> : <Moon size={18} className="group-hover:-rotate-12 transition-transform duration-500" />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                className="flex items-center gap-4 pl-2 pr-4 py-2 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-navy-950 flex items-center justify-center text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-navy border border-navy-800">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none mb-1">
                    {userName}
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">Legal Assistant</p>
                </div>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-64 p-3 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-white/5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-navy-600 transition-all group/item"
                    >
                      <User size={14} className="text-slate-400 group-hover/item:scale-110 transition-transform" /> 
                      Profile Settings
                    </button>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-navy-600 transition-all group/item"
                    >
                      <Settings size={14} className="text-slate-400 group-hover/item:scale-110 transition-transform" /> 
                      Settings
                    </button>
                    
                    <div className="h-px bg-slate-100 dark:bg-white/5 my-2 mx-2" />
                    
                    <button 
                      onClick={async () => {
                        await authService.logout();
                        localStorage.removeItem("user");
                        navigate('/login');
                      }} 
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group/item"
                    >
                      <LogOut size={14} className="group-hover/item:-translate-x-1 transition-transform" /> 
                      Logout
                    </button>
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
          onCitySelect={(city) => { setSavedCity(city); }}
        />
      )}
    </>
  );
}

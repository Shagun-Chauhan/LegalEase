import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Edit3,
  CheckCircle, Camera, ChevronRight, Save,
  AlertCircle, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// ── Static components outside – no remount on re-render ─────────────────────
const EditField = ({ label, name, type = 'text', value, onChange, error, icon: Icon, placeholder, disabled = false }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`input-field ${Icon ? 'pl-10' : ''} ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}
          ${error ? 'border-red-300 focus:ring-red-400' : ''}`}
      />
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    fullName:    'Arjun Kumar Sharma',
    email:       'arjun.sharma@gmail.com',
    phone:       '+91 98765 43210',
    address:     'Koramangala, Bangalore – 560034',
    dob:         '1992-08-15',
    language:    'English',
    occupation:  'Software Engineer',
    joinedDate:  'March 2024',
  });
  const [draft, setDraft]     = useState({ ...profile });
  const [profileErrors, setProfileErrors] = useState({});

  const updateDraft = (k) => (e) => {
    setDraft(d => ({ ...d, [k]: e.target.value }));
    if (profileErrors[k]) setProfileErrors(p => ({ ...p, [k]: '' }));
  };

  const validateProfile = () => {
    const e = {};
    if (!draft.fullName.trim() || draft.fullName.trim().length < 2) e.fullName = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email))           e.email   = 'Enter a valid email';
    if (draft.phone && !/^\+?[\d\s\-]{7,15}$/.test(draft.phone))   e.phone   = 'Enter a valid phone number';
    return e;
  };

  const saveProfile = () => {
    const e = validateProfile();
    if (Object.keys(e).length) { setProfileErrors(e); return; }
    setSavingProfile(true);
    setTimeout(() => {
      setProfile({ ...draft });
      setSavingProfile(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  const initials = profile.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 pt-16">
        <div className="max-w-5xl mx-auto p-5 md:p-7">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <span className="cursor-pointer hover:text-navy-600" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium">My Profile</span>
          </div>

          {/* ── PROFILE HERO CARD ── */}
          <div className="card-base overflow-hidden mb-6">
            {/* Cover banner */}
            <div className="h-28 bg-gradient-to-r from-navy-800 via-navy-700 to-indigo-700 relative">
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }} />
            </div>

            <div className="px-6 pb-6">
              {/* Avatar row */}
              <div className="flex flex-wrap items-end justify-between gap-4 -mt-10 mb-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl font-display border-4 border-white shadow-lg">
                    {initials}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-navy-700 rounded-lg flex items-center justify-center border-2 border-white hover:bg-navy-800 transition-colors">
                    <Camera size={12} className="text-white" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="badge badge-green text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Active
                  </span>
                  <span className="badge badge-blue">Premium Plan</span>
                </div>
              </div>

              {/* Name & meta */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">{profile.fullName}</h1>
                  <p className="text-slate-500 text-sm mt-0.5">{profile.email}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={11} /> {profile.address.split(',').slice(-1)[0].trim()}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={11} /> Joined {profile.joinedDate}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Globe size={11} /> {profile.language}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── EDIT PROFILE SECTION HEADING ── */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 bg-navy-100 rounded-xl flex items-center justify-center">
              <Edit3 size={16} className="text-navy-700" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-base">Edit Profile</h2>
              <p className="text-xs text-slate-400">Update your personal information</p>
            </div>
          </div>

          {/* ── EDIT PROFILE CONTENT ── */}
          <div className="animate-fade-in">
            {saveSuccess && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-5">
                <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-emerald-800">Profile updated successfully!</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Avatar card */}
              <div className="card-base p-6 text-center flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-navy-600 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl font-display">
                    {initials}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center border-2 border-white hover:bg-navy-800 transition-colors">
                    <Camera size={14} className="text-white" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{draft.fullName || 'Your Name'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Premium Member</p>
                </div>
                <button className="w-full btn-secondary text-sm py-2">Upload Photo</button>
              </div>

              {/* Form */}
              <div className="lg:col-span-2 card-base p-6 space-y-4">
                <h3 className="font-semibold text-slate-800 mb-2">Personal Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EditField label="Full Name" name="fullName" value={draft.fullName}
                    onChange={updateDraft('fullName')} error={profileErrors.fullName}
                    icon={User} placeholder="Your full name" />

                  <EditField label="Email Address" name="email" type="email" value={draft.email}
                    onChange={updateDraft('email')} error={profileErrors.email}
                    icon={Mail} placeholder="you@example.com" />

                  <EditField label="Phone Number" name="phone" type="tel" value={draft.phone}
                    onChange={updateDraft('phone')} error={profileErrors.phone}
                    icon={Phone} placeholder="+91 98765 43210" />

                  <EditField label="Date of Birth" name="dob" type="date" value={draft.dob}
                    onChange={updateDraft('dob')} icon={Calendar} />

                  <EditField label="Occupation" name="occupation" value={draft.occupation}
                    onChange={updateDraft('occupation')} icon={Globe}
                    placeholder="e.g. Software Engineer" />

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Preferred Language</label>
                    <select value={draft.language} onChange={updateDraft('language')}
                      className="input-field appearance-none">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <EditField label="Address" name="address" value={draft.address}
                    onChange={updateDraft('address')} icon={MapPin}
                    placeholder="Street, City, State – PIN" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button onClick={() => { setDraft({ ...profile }); setProfileErrors({}); }}
                    className="btn-ghost text-sm text-slate-500">
                    Reset changes
                  </button>
                  <button onClick={saveProfile} disabled={savingProfile}
                    className="btn-primary flex items-center gap-2 text-sm py-2.5 px-6 disabled:opacity-60">
                    {savingProfile ? <span className="spinner" /> : <><Save size={14} /> Save Profile</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

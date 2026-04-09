import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import toast from "react-hot-toast";
import { User, Mail, Shield, Edit, Save, X, Eye, EyeOff, Loader2, CheckCircle, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();

      setUser(res.data);
      setName(res.data.name);
      setPreview(res.data.avatar || null);

    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const img = e.target.files[0];
    if (!img) return;

    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (file) formData.append("avatar", file);

      const res = await authService.updateProfile(formData);

      toast.success("Profile updated ✅");

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setEditing(false);

    } catch (err) {
      toast.error("Update failed");
    }

    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) return toast.error("All fields required");
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully! 🔒");
      setShowPwdModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
    setLoading(false);
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} user={user} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`transition-all duration-500 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} pt-20`}>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">

            <div className="card-base p-6 md:p-8 flex items-center justify-between group transition-all">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profile</h1>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Manage your information</p>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-navy-700 text-white rounded-xl hover:bg-navy-800 transition-all shadow-lg shadow-navy active:scale-95 font-bold uppercase tracking-widest text-[10px]"
                >
                  <Edit size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500 active:scale-95"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-white/10 active:scale-95"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="card-base p-8 flex flex-col md:flex-row gap-10 items-center md:items-start">

              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-xl relative isolate transition-transform group-hover:scale-[1.02] duration-500">
                  <img
                    src={preview || "https://via.placeholder.com/150"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                  {editing && (
                    <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors">
                        <Edit size={20} />
                        <input type="file" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                  )}
                </div>

                {editing && (
                  <p className="text-[10px] font-black uppercase text-center mt-3 text-navy-600 dark:text-navy-400 tracking-widest animate-pulse">Update Avatar</p>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">Full Name</label>
                  <p className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">{user.name}</p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">Email</label>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">{user.email}</p>
                    {!editing && <CheckCircle size={16} className="text-emerald-500" />}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">Status</label>
                  <span className="badge badge-green py-0.5 px-3 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                    <Shield size={12} strokeWidth={3} /> Verified
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">Joined</label>
                  <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recently'}
                  </p>
                </div>

              </div>
            </div>


            <div className="card-base p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-navy-100 dark:bg-navy-900/50 rounded-xl flex items-center justify-center text-navy-700 dark:text-navy-400">
                  <Shield size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Security</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 transition-all hover:border-navy-200 dark:hover:border-navy-900">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-tight">Password</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 mt-1 uppercase tracking-widest">Change your password</p>
                  </div>
                  <button onClick={() => setShowPwdModal(true)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-navy-700 dark:text-navy-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-navy-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm">
                    Modify
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 transition-all">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-tight">Email</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 mt-1 uppercase tracking-widest">Your verified inbox</p>
                  </div>
                  <span className="badge badge-green font-black scale-90">Verified</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Password Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={() => setShowPwdModal(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative isolate animate-slide-up border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-navy-500/5 dark:bg-navy-500/10 rounded-full" />

            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight uppercase">Update Password</h3>
              <button
                onClick={() => setShowPwdModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              {[
                { id: 'oldPassword', label: 'Current Password', value: oldPassword, setter: setOldPassword },
                { id: 'newPassword', label: 'New Password', value: newPassword, setter: setNewPassword },
                { id: 'confirmPassword', label: 'Match New Password', value: confirmPassword, setter: setConfirmPassword },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">{field.label}</label>
                  <div className="relative group">
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      className="input-field py-3 pr-12 text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-600 dark:text-slate-600 dark:hover:text-navy-400 transition-colors"
                    >
                      {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-navy-700 hover:bg-navy-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-navy transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                {loading ? "Processing..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

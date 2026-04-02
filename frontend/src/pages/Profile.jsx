import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import toast from "react-hot-toast";
import { User, Mail, Shield, Edit, Save, X, Eye, EyeOff } from "lucide-react";
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

      <main className="md:ml-64 pt-16">
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-md p-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-300">My Profile</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your personal information</p>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit size={16} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6">

              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-200 dark:border-white/10">
                  <img
                    src={preview || "https://via.placeholder.com/150"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {editing && (
                  <label className="mt-3 text-sm text-blue-600 cursor-pointer">
                    Change Photo
                    <input type="file" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Full Name</label>
                  {editing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800 dark:text-slate-300">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Email</label>
                  <p className="font-semibold text-slate-800 dark:text-slate-300">{user.email}</p>
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Status</label>
                  <p className="text-green-600 font-semibold flex items-center gap-1">
                    <Shield size={14} /> Verified
                  </p>
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Joined</label>
                  <p className="font-semibold text-slate-800 dark:text-slate-300">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-xl shadow text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Documents</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-300">12</p>
              </div>

              <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-xl shadow text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Legal Queries</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-300">8</p>
              </div>

              <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-xl shadow text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Account Security</p>
                <p className="text-green-600 font-bold">Strong</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-4">Security</h2>

              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Last updated recently</p>
                </div>
                <button onClick={() => setShowPwdModal(true)} className="text-blue-600 text-sm font-semibold">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your email is verified</p>
                </div>
                <span className="text-green-600 font-semibold">Verified</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Password Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowPwdModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-300"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-300 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm text-slate-600 dark:text-slate-300">Current Password</label>
                <input type={showPasswords ? "text" : "password"} value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1 pr-10 focus:ring-2 focus:ring-blue-400 outline-none" />
                <button onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:text-slate-300">
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <label className="text-sm text-slate-600 dark:text-slate-300">New Password</label>
                <input type={showPasswords ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1 pr-10 focus:ring-2 focus:ring-blue-400 outline-none" />
                <button onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:text-slate-300">
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <label className="text-sm text-slate-600 dark:text-slate-300">Confirm New Password</label>
                <input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1 pr-10 focus:ring-2 focus:ring-blue-400 outline-none" />
                <button onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:text-slate-300">
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
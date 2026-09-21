import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import toast from "react-hot-toast";
import API from "../api";
import { 
  User, 
  Lock, 
  Shield, 
  Bell, 
  Moon, 
  Sun,
  Smartphone,
  Laptop,
  Trash2,
  Download,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from "../lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "preferences", label: "Preferences", icon: Bell },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
];

export default function Setting() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    monthlyIncome: "",
    avatar: null,
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
    twoFactor: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "English",
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    dashboardLayout: "default",
  });

  const [privacy] = useState({
    accountPrivacy: "public",
    devices: [
      { device: "iPhone 14 Pro", lastActive: "2026-03-25", location: "Mumbai, India", type: "mobile" },
      { device: "MacBook Pro", lastActive: "2026-03-28", location: "Mumbai, India", type: "desktop" },
    ],
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setProfile((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          username: user.name ? user.name.toLowerCase().replace(/\s+/g, "") : "",
          monthlyIncome: String(user.monthlyIncome || 0),
        }));

        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("monthlyIncome", String(user.monthlyIncome || 0));
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  // Handlers
  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPassword({ ...password, [e.target.name]: e.target.value });

  const handlePreferencesChange = (field, value) =>
    setPreferences({ ...preferences, [field]: value });

  const handleNotificationChange = (type) =>
    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [type]: !preferences.notifications[type],
      },
    });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
      toast.success("Avatar updated!");
    }
  };

  const handleSaveProfile = () => {
    if (!profile.name || !profile.email || !profile.username) {
      toast.error("Please fill all fields");
      return;
    }

    const saveProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.put(
          "/auth/profile",
          {
            name: profile.name,
            email: profile.email,
            monthlyIncome: Number(profile.monthlyIncome || 0),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = response.data.user;
        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("monthlyIncome", String(user.monthlyIncome || 0));
        setProfile((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          monthlyIncome: String(user.monthlyIncome || 0),
        }));
        toast.success(response.data.msg || "Profile updated successfully!");
      } catch (error) {
        console.error("Failed to save profile:", error);
        toast.error(error.response?.data?.msg || "Failed to update profile");
      }
    };

    saveProfile();
  };

  const handleSavePassword = () => {
    if (!password.current || !password.new || !password.confirm) {
      toast.error("Please fill all password fields");
      return;
    }
    if (password.new !== password.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (password.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    toast.success("Password changed successfully!");
    setPassword({ current: "", new: "", confirm: "", twoFactor: password.twoFactor });
  };

  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully!");
  };

  const handleExportData = () => {
    const exportData = {
      profile,
      preferences,
      privacy,
      exportDate: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `fintrackr-data-${new Date().toISOString().slice(0,10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Data exported successfully!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
      toast.error("Account deletion requested");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  return (
    <Layout contentClassName="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col gap-4">
        {/* Top Header & Tab Ribbon in Single Frame */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">Account Settings</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Manage your personal credentials, preferences, and privacy controls</p>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800/80">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    isActive
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  )}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panes - Viewport Capped for Single Frame */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-sm max-h-[calc(100vh-175px)] overflow-y-auto pr-2">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
                <div className="p-2 border border-white/10 bg-zinc-800 rounded-xl text-zinc-300">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-white">Profile Information</h2>
                  <p className="text-xs text-zinc-400">Update your account name, email and declared monthly income</p>
                </div>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-zinc-700 shadow-md">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <User size={24} className="text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-md cursor-pointer hover:bg-zinc-800 transition">
                    <input type="file" onChange={handleAvatarChange} className="hidden" accept="image/*" />
                    <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </label>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Profile Photo</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Click camera icon to upload (PNG, JPG max 5MB)</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-xs"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-xs"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    className="w-full bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-xs"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Monthly Income (₹)</label>
                  <input
                    type="number"
                    min="0"
                    name="monthlyIncome"
                    value={profile.monthlyIncome}
                    onChange={handleProfileChange}
                    className="w-full bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-xs font-mono font-medium"
                    placeholder="Enter monthly income"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleSaveProfile} 
                  className="bg-white text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition shadow-sm flex items-center gap-2 text-xs active:scale-95"
                >
                  <Save size={15} />
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
                <div className="p-2 border border-white/10 bg-zinc-800 rounded-xl text-zinc-300">
                  <Lock size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-white">Password & Security</h2>
                  <p className="text-xs text-zinc-400">Manage your password strength and two-factor authentication</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="current"
                      value={password.current}
                      onChange={handlePasswordChange}
                      className="w-full bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-xs pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword.current ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="new"
                      value={password.new}
                      onChange={handlePasswordChange}
                      className="w-full bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-xs pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword.new ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirm"
                      value={password.confirm}
                      onChange={handlePasswordChange}
                      className="w-full bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-xs pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-950/60 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-white/10 bg-zinc-800 text-zinc-300 rounded-lg">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">Two-Factor Authentication</p>
                    <p className="text-[11px] text-zinc-400">Add an extra layer of security to your account logins</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={password.twoFactor}
                    onChange={() => setPassword({ ...password, twoFactor: !password.twoFactor })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white peer-checked:after:bg-black"></div>
                </label>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleSavePassword} 
                  className="bg-white text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition shadow-sm flex items-center gap-2 text-xs active:scale-95"
                >
                  <Lock size={15} />
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
                <div className="p-2 border border-white/10 bg-zinc-800 rounded-xl text-zinc-300">
                  <Bell size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-white">Application Preferences</h2>
                  <p className="text-xs text-zinc-400">Configure visual themes, language, and notification channels</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Theme</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePreferencesChange("theme", "light")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all",
                        preferences.theme === "light" 
                          ? "border-white/20 bg-white/10 text-white" 
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white"
                      )}
                    >
                      <Sun size={15} />
                      Light
                    </button>
                    <button
                      onClick={() => handlePreferencesChange("theme", "dark")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all",
                        preferences.theme === "dark" 
                          ? "border-white/20 bg-white/10 text-white" 
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white"
                      )}
                    >
                      <Moon size={15} />
                      Dark
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferencesChange("language", e.target.value)}
                    className="w-full bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none text-xs"
                  >
                    <option className="bg-zinc-900">English</option>
                    <option className="bg-zinc-900">Hindi</option>
                    <option className="bg-zinc-900">Spanish</option>
                    <option className="bg-zinc-900">French</option>
                    <option className="bg-zinc-900">German</option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2.5 uppercase tracking-wider">Notification Channels</label>
                <div className="flex flex-wrap gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300">
                    <input
                      type="checkbox"
                      checked={preferences.notifications.email}
                      onChange={() => handleNotificationChange("email")}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0"
                    />
                    <span>Email Alerts</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300">
                    <input
                      type="checkbox"
                      checked={preferences.notifications.push}
                      onChange={() => handleNotificationChange("push")}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0"
                    />
                    <span>Push Notifications</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300">
                    <input
                      type="checkbox"
                      checked={preferences.notifications.sms}
                      onChange={() => handleNotificationChange("sms")}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0"
                    />
                    <span>SMS Updates</span>
                  </label>
                </div>
              </div>

              {/* Dashboard Layout */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Dashboard View Mode</label>
                <select
                  value={preferences.dashboardLayout}
                  onChange={(e) => handlePreferencesChange("dashboardLayout", e.target.value)}
                  className="w-full max-w-xs bg-zinc-950/70 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none text-xs"
                >
                  <option value="default" className="bg-zinc-900">Default View</option>
                  <option value="widgets" className="bg-zinc-900">Widgets View</option>
                  <option value="compact" className="bg-zinc-900">Compact View</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleSavePreferences} 
                  className="bg-white text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition shadow-sm flex items-center gap-2 text-xs active:scale-95"
                >
                  <Save size={15} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* PRIVACY & DATA TAB */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
                <div className="p-2 border border-white/10 bg-zinc-800 rounded-xl text-zinc-300">
                  <Shield size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-white">Privacy & Account Security</h2>
                  <p className="text-xs text-zinc-400">Manage authorized devices and data governance</p>
                </div>
              </div>

              {/* Authorized Devices */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Active Device Sessions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {privacy.devices.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300">
                          {d.type === "mobile" ? <Smartphone size={16} /> : <Laptop size={16} />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">{d.device}</p>
                          <p className="text-[10px] text-zinc-400">{d.location} • {d.lastActive}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-300">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Export / Delete */}
              <div className="pt-2 border-t border-zinc-800/60">
                <label className="block text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Data Governance & Danger Zone</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleExportData}
                    className="border border-white/10 bg-white/5 text-zinc-300 px-4 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-semibold active:scale-95"
                  >
                    <Download size={15} />
                    Export Account Data (.json)
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 text-xs font-bold active:scale-95"
                  >
                    <Trash2 size={15} />
                    Delete Account
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 text-center pt-3">
                  Deleting your account will permanently remove all your transaction histories. This action cannot be reversed.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

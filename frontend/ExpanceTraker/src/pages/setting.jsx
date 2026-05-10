import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import toast from "react-hot-toast";
import API from "../api";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Globe, 
  Moon, 
  Sun,
  Smartphone,
  Laptop,
  Trash2,
  Download,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from "../lib/utils";

export default function Setting() {
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

  const [privacy, setPrivacy] = useState({
    accountPrivacy: "public",
    devices: [
      { device: "iPhone 14 Pro", lastActive: "2026-03-25", location: "Mumbai, India" },
      { device: "MacBook Pro", lastActive: "2026-03-28", location: "Mumbai, India" },
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
    <Layout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-zinc-900">Account Settings</h1>
            <p className="text-zinc-500 text-sm lg:text-base mt-1">Manage your account preferences and security</p>
          </div>
        </div>

        {/* Profile Info */}
        <section className="bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-xl">
              <User size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-zinc-900">Profile Information</h2>
          </div>
          
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-purple-50 border-4 border-white shadow-lg">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-100">
                      <User size={32} className="text-purple-600" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition">
                  <input type="file" onChange={handleAvatarChange} className="hidden" accept="image/*" />
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </label>
              </div>
              <p className="text-sm text-zinc-500">Click the camera icon to upload a profile picture (max 5MB)</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  className="w-full border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Monthly Income</label>
                <input
                  type="number"
                  min="0"
                  name="monthlyIncome"
                  value={profile.monthlyIncome}
                  onChange={handleProfileChange}
                  className="w-full border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  placeholder="Enter monthly income"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveProfile} 
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
              <Save size={18} />
              Save Profile
            </button>
          </div>
        </section>

        {/* Password Management */}
        <section className="bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Lock size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-zinc-900">Password & Security</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="current"
                    value={password.current}
                    onChange={handlePasswordChange}
                    className="w-full border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="new"
                    value={password.new}
                    onChange={handlePasswordChange}
                    className="w-full border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    className="w-full border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-purple-600" />
                <div>
                  <p className="font-medium text-zinc-900">Two-Factor Authentication</p>
                  <p className="text-sm text-zinc-600">Add an extra layer of security to your account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={password.twoFactor}
                  onChange={() => setPassword({ ...password, twoFactor: !password.twoFactor })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <button 
              onClick={handleSavePassword} 
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 font-medium"
            >
              <Lock size={18} />
              Update Password
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-xl">
              <Bell size={20} className="text-green-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-zinc-900">Preferences</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePreferencesChange("theme", "light")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
                      preferences.theme === "light" 
                        ? "border-purple-500 bg-purple-50 text-purple-700" 
                        : "border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    <Sun size={18} />
                    Light
                  </button>
                  <button
                    onClick={() => handlePreferencesChange("theme", "dark")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
                      preferences.theme === "dark" 
                        ? "border-purple-500 bg-purple-50 text-purple-700" 
                        : "border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    <Moon size={18} />
                    Dark
                  </button>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferencesChange("language", e.target.value)}
                  className="w-full border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-3">Notifications</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={() => handleNotificationChange("email")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-zinc-700">Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.push}
                    onChange={() => handleNotificationChange("push")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-zinc-700">Push Notifications</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.sms}
                    onChange={() => handleNotificationChange("sms")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-zinc-700">SMS</span>
                </label>
              </div>
            </div>

            {/* Dashboard Layout */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Dashboard Layout</label>
              <select
                value={preferences.dashboardLayout}
                onChange={(e) => handlePreferencesChange("dashboardLayout", e.target.value)}
                className="w-full max-w-xs border border-zinc-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="default">Default View</option>
                <option value="widgets">Widgets View</option>
                <option value="compact">Compact View</option>
              </select>
            </div>

            <button 
              onClick={handleSavePreferences} 
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 font-medium"
            >
              <Save size={18} />
              Save Preferences
            </button>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-50 rounded-xl">
              <Shield size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-zinc-900">Privacy & Security</h2>
          </div>

          <div className="space-y-6">
            {/* Account Privacy */}
            {/* <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Account Privacy</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setPrivacy({ ...privacy, accountPrivacy: "public" })}
                  className={cn(
                    "px-4 py-2.5 rounded-xl border transition-all",
                    privacy.accountPrivacy === "public" 
                      ? "border-purple-500 bg-purple-50 text-purple-700" 
                      : "border-zinc-200 hover:border-zinc-300"
                  )}
                >
                  Public
                </button>
                <button
                  onClick={() => setPrivacy({ ...privacy, accountPrivacy: "private" })}
                  className={cn(
                    "px-4 py-2.5 rounded-xl border transition-all",
                    privacy.accountPrivacy === "private" 
                      ? "border-purple-500 bg-purple-50 text-purple-700" 
                      : "border-zinc-200 hover:border-zinc-300"
                  )}
                >
                  Private
                </button>
              </div>
            </div> */}

            {/* Recent Devices */}
            {/* <div>
              <h3 className="font-semibold text-zinc-900 mb-3">Recent Devices</h3>
              <div className="space-y-3">
                {privacy.devices.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {d.device.includes("iPhone") ? (
                        <Smartphone size={20} className="text-zinc-600" />
                      ) : (
                        <Laptop size={20} className="text-zinc-600" />
                      )}
                      <div>
                        <p className="font-medium text-zinc-900 text-sm">{d.device}</p>
                        <p className="text-xs text-zinc-500">{d.location}</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500">Last active: {new Date(d.lastActive).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Data Export / Delete */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleExportData}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Download size={18} />
                Export All Data
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Trash2 size={18} />
                Delete Account
              </button>
            </div>
            <p className="text-xs text-zinc-500 text-center">
              Deleting your account will permanently remove all your data. This action cannot be undone.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}

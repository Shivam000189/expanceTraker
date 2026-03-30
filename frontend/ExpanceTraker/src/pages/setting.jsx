import { useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

export default function Setting() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
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
      { device: "iPhone", lastActive: "2026-03-25" },
      { device: "Laptop", lastActive: "2026-03-28" },
    ],
  });

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
    if (file) setProfile({ ...profile, avatar: URL.createObjectURL(file) });
  };

  const handleSaveProfile = () => toast.success("Profile updated!");
  const handleSavePassword = () => toast.success("Password changed!");
  const handleSavePreferences = () => toast.success("Preferences saved!");
  const handleDeleteAccount = () => toast.error("Account deleted!");

  return (
    <div className="flex min-h-screen bg-[#FAFAFF] text-[#1A1A1A]">
      <Sidebar />

      <main className="ml-64 flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-[#4B2C85] mb-4">
          Account Settings
        </h1>

        {/* Profile Info */}
        <section className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-[#4B2C85]">Profile Info</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 flex items-center justify-center h-full">Avatar</span>
              )}
            </div>
            <input type="file" onChange={handleAvatarChange} className="text-sm" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={profile.name}
              onChange={handleProfileChange}
              className="border border-gray-200 px-3 py-2 rounded-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleProfileChange}
              className="border border-gray-200 px-3 py-2 rounded-lg"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={profile.username}
              onChange={handleProfileChange}
              className="border border-gray-200 px-3 py-2 rounded-lg"
            />
          </div>

          <button onClick={handleSaveProfile} className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:opacity-90">
            Save Profile
          </button>
        </section>

        {/* Password Management */}
        <section className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-[#4B2C85]">Password Management</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="password"
              name="current"
              placeholder="Current Password"
              value={password.current}
              onChange={handlePasswordChange}
              className="border border-gray-200 px-3 py-2 rounded-lg"
            />
            <input
              type="password"
              name="new"
              placeholder="New Password"
              value={password.new}
              onChange={handlePasswordChange}
              className="border border-gray-200 px-3 py-2 rounded-lg"
            />
            <input
              type="password"
              name="confirm"
              placeholder="Confirm Password"
              value={password.confirm}
              onChange={handlePasswordChange}
              className="border border-gray-200 px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={password.twoFactor}
              onChange={() => setPassword({ ...password, twoFactor: !password.twoFactor })}
            />
            <span>Enable Two-Factor Authentication</span>
          </div>

          <button onClick={handleSavePassword} className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:opacity-90">
            Save Password
          </button>
        </section>

        {/* Preferences */}
        <section className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-[#4B2C85]">Preferences</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Theme */}
            <div className="flex items-center gap-2">
              <span>Theme:</span>
              <select
                value={preferences.theme}
                onChange={(e) => handlePreferencesChange("theme", e.target.value)}
                className="border px-2 py-1 rounded-lg"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Language */}
            <div className="flex items-center gap-2">
              <span>Language:</span>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferencesChange("language", e.target.value)}
                className="border px-2 py-1 rounded-lg"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="col-span-2 flex flex-col gap-2">
              <span>Notifications:</span>
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={() => handleNotificationChange("email")}
                  className="mr-2"
                />
                Email
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.push}
                  onChange={() => handleNotificationChange("push")}
                  className="mr-2"
                />
                Push
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.sms}
                  onChange={() => handleNotificationChange("sms")}
                  className="mr-2"
                />
                SMS
              </label>
            </div>

            {/* Dashboard layout */}
            <div className="flex items-center gap-2">
              <span>Dashboard Layout:</span>
              <select
                value={preferences.dashboardLayout}
                onChange={(e) => handlePreferencesChange("dashboardLayout", e.target.value)}
                className="border px-2 py-1 rounded-lg"
              >
                <option value="default">Default</option>
                <option value="widgets">Widgets View</option>
              </select>
            </div>
          </div>

          <button onClick={handleSavePreferences} className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:opacity-90">
            Save Preferences
          </button>
        </section>

        {/* Privacy & Security */}
        <section className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-[#4B2C85]">Privacy & Security</h2>

          {/* Account Privacy */}
          <div className="flex items-center gap-4">
            <span>Account Privacy:</span>
            <select
              value={privacy.accountPrivacy}
              onChange={(e) => setPrivacy({ ...privacy, accountPrivacy: e.target.value })}
              className="border px-2 py-1 rounded-lg"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Login History / Devices */}
          <div>
            <h3 className="font-semibold mt-2">Recent Devices</h3>
            <ul className="list-disc ml-5">
              {privacy.devices.map((d, idx) => (
                <li key={idx}>
                  {d.device} – Last Active: {d.lastActive}
                </li>
              ))}
            </ul>
          </div>

          {/* Data export / delete */}
          <div className="flex gap-4 mt-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:opacity-90">
              Export Data
            </button>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Delete Account
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
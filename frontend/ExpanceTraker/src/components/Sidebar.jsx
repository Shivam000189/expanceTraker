import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { LayoutDashboard, CreditCard, PieChart, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { id: "expenses", icon: CreditCard, label: "Expenses", path: "/expenses" },
    { id: "stats", icon: PieChart, label: "Statistics", path: "/analytics" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
  <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 p-8 flex flex-col">
    
    {/* Logo */}
    <div className="flex items-center gap-2 mb-12">
      <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold">Z</span>
      </div>
      <span className="text-xl font-bold text-[#7C3AED]">
        Expense Tracker
      </span>
    </div>

    {/* Nav */}
    <nav className="flex flex-col gap-6 flex-1">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item)}
          className={`flex items-center gap-4 transition-all
            ${
              activeTab === item.id
                ? "text-[#7C3AED]"
                : "text-gray-400 hover:text-[#7C3AED]"
            }`}
        >
          <item.icon size={20} />
          <span className="font-semibold">{item.label}</span>

          {activeTab === item.id && (
            <div className="ml-auto w-1.5 h-6 bg-[#7C3AED] rounded-full" />
          )}
        </button>
      ))}
    </nav>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="flex items-center gap-4 text-gray-400 hover:text-red-500 mt-auto"
    >
      <LogOut size={20} />
      <span className="font-semibold">Logout</span>
    </button>
  </aside>
);
}
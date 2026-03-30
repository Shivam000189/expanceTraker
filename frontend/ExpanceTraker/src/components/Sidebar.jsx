import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { LayoutDashboard, CreditCard, PieChart, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "expenses", icon: LayoutDashboard, label: "Expenses", path: "/expenses" },
    { id: "dashboard", icon: CreditCard, label: "Dashboard", path: "/dashboard" },
    { id: "stats", icon: PieChart, label: "Analytics", path: "/analytics" },
    { id: "setting", icon: Settings, label: "Settings", path: "/setting" },
  ];

  const handleNavigation = (item) => {
    // setActiveTab(item.id);
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
    <div className="flex items-center gap-2 mb-12 flex-nowrap">
      <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold">ET</span>
      </div>
      <span className="text-xl font-bold text-[#7C3AED] whitespace-nowrap">
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
              location.pathname === item.path
                ? "text-[#4B2C85]"
                : "text-gray-400 hover:text-[#4B2C85]"
            }`}
        >
          <item.icon size={20} />
          <span className="font-semibold">{item.label}</span>

          {location.pathname === item.path && (
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
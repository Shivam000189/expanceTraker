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
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 text-white bg-[#1a1617] p-2 rounded-md hover:bg-white/10 focus:outline-none lg:hidden"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#1a1617] text-white/60 w-64 p-8 flex flex-col z-40
          transform transition-transform duration-300 ease-in-out shadow-lg
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-[#1a1617]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Expense Tracker</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id
                  ? "bg-white/10 text-white shadow-lg"
                  : "hover:bg-white/5 hover:text-white"
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
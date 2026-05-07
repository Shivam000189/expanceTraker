import { useState } from "react";
import { Menu, X, LayoutDashboard, CreditCard, PieChart, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "expenses", icon: LayoutDashboard, label: "Expenses", path: "/expenses" },
    { id: "dashboard", icon: CreditCard, label: "Dashboard", path: "/dashboard" },
    { id: "stats", icon: PieChart, label: "Analytics", path: "/analytics" },
    { id: "setting", icon: Settings, label: "Settings", path: "/setting" },
  ];

  const handleNavigation = (item) => {
    navigate(item.path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur border-b border-gray-100 px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg text-[#4B2C85] hover:bg-violet-50"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">ET</span>
          </div>
          <span className="text-base font-bold text-[#7C3AED]">
            Expense Tracker
          </span>
        </div>

        <div className="w-10" />
      </div>

      {isOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 p-6 sm:p-8 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-10 md:mb-12">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex shrink-0 items-center justify-center">
              <span className="text-white font-bold">ET</span>
            </div>
            <span className="text-xl font-bold text-[#7C3AED] truncate">
              Expense Tracker
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex items-center gap-4 rounded-xl px-3 py-3 text-left transition-all ${
                location.pathname === item.path
                  ? "bg-violet-50 text-[#4B2C85]"
                  : "text-gray-400 hover:bg-gray-50 hover:text-[#4B2C85]"
              }`}
            >
              <item.icon size={20} className="shrink-0" />
              <span className="font-semibold">{item.label}</span>

              {location.pathname === item.path && (
                <div className="ml-auto w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 rounded-xl px-3 py-3 text-gray-400 hover:bg-red-50 hover:text-red-500 mt-auto"
        >
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </button>
      </aside>
    </>
  );
}

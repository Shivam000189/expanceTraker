import { useState, useEffect, useRef } from "react";
import { Bell, Settings, LogOut, Menu, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api";

function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const userName = localStorage.getItem("userName") || "User";
  const userHandle = `@${userName.toLowerCase().replace(/\s+/g, "") || "user001"}`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("monthlyIncome");
    navigate("/login");
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/20 bg-zinc-800 shrink-0">
          <img
            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${userName}`}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="hidden sm:flex flex-col leading-tight text-left">
          <span className="text-[11px] text-gray-400 font-mono">{userHandle}</span>
          <span className="text-xs lg:text-sm font-medium text-white group-hover:text-[#10EE74] transition-colors">
            {userName}
          </span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-48 rounded-2xl border border-white/10 bg-[#1C1C1C]/95 p-1.5 shadow-2xl backdrop-blur-xl z-50">
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-xs font-semibold text-white truncate">{userName}</p>
            <p className="text-[10px] text-gray-400 font-mono">{userHandle}</p>
          </div>
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/setting");
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Settings size={14} />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    API.get("/expenses", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setExpenses(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="relative shrink-0" ref={notifRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
      >
        <Bell size={16} />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#10EE74] shadow-[0_0_6px_#10EE74]" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-72 rounded-2xl border border-white/10 bg-[#1C1C1C]/95 p-4 shadow-2xl backdrop-blur-xl z-50 text-white">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
            <TrendingUp size={14} className="text-[#10EE74]" />
            <h4 className="text-xs font-semibold text-white">Financial Insights</h4>
          </div>
          <div className="mt-3 space-y-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[11px] text-gray-400">Total Tracked Expenses</p>
              <p className="text-base font-bold font-mono text-[#10EE74] mt-0.5">
                ₹{totalExpense.toLocaleString()}
              </p>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Your budget health is optimal. Keep logging regular expenses to maintain accurate forecasts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar({ onOpenMobile }) {
  const location = useLocation();

  // Determine current page title
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/expenses": "Dashboard",
    "/analytics": "Analytics",
    "/bank": "Bank Accounts",
    "/settlements": "Settlements",
    "/bulk-payout": "Bulk Payout",
    "/store-dashboard": "Store Dashboard",
    "/setting": "Settings",
  };
  const currentTitle = pageTitles[location.pathname] || "Spendora";

  return (
    <nav className="px-3 sm:px-4 pt-3 sm:pt-4">
      <div className="flex h-[52px] items-center justify-between gap-3 sm:gap-4 bg-[#1C1C1C] border border-white/5 rounded-full px-3.5 sm:px-6 lg:px-8 shadow-xl">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobile}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#10EE74] shadow-[0_0_8px_#10EE74] hidden xs:inline-block" />
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight font-display">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Right: Notifications, Divider, UserMenu */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <NotificationsMenu />

          <span className="text-gray-600 text-lg hidden sm:inline select-none">|</span>

          <UserMenu />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Wallet,
  Home,
  TrendingUp,
  Landmark,
  DollarSign,
  Users,
  Store,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/bank", label: "Bank", icon: Landmark },
  { href: "/settlements", label: "Settlements", icon: DollarSign },
  { href: "/bulk-payout", label: "Bulk Payout", icon: Users },
  { href: "/store-dashboard", label: "Store", icon: Store },
  { href: "/setting", label: "Settings", icon: Settings },
];

export function Sidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("monthlyIncome");
    navigate("/login");
  };

  const navContent = (
    <>
      {/* Brand Icon */}
      <div className="flex items-center justify-center p-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Dashboard Home"
          title="Spendora"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
        >
          <Wallet className="h-6 w-6 text-[#10EE74] drop-shadow-[0_0_10px_rgba(16,238,116,0.65)] transition-transform group-hover:scale-110" />
        </button>
      </div>

      {/* Nav List */}
      <ul className="mt-8 flex flex-col items-center gap-2.5 flex-1 w-full px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            location.pathname === href ||
            (href === "/dashboard" && location.pathname === "/expenses");

          return (
            <li key={href} className="relative group w-full flex justify-center">
              <NavLink
                to={href}
                aria-label={label}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-[#10EE74] shadow-sm shadow-[#10EE74]/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#10EE74] shadow-[0_0_8px_#10EE74]" />
                )}
              </NavLink>

              {/* Tooltip on desktop */}
              <div className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden md:block opacity-0 -translate-x-2 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0">
                <div className="rounded-lg border border-white/10 bg-[#131313] px-2.5 py-1 text-xs font-medium text-white shadow-xl whitespace-nowrap">
                  {label}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Logout button */}
      <div className="mt-auto p-3 flex justify-center w-full">
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          <div className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden md:block opacity-0 -translate-x-2 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0">
            <div className="rounded-lg border border-red-500/20 bg-[#131313] px-2.5 py-1 text-xs font-medium text-red-400 shadow-xl whitespace-nowrap">
              Log out
            </div>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar: 64px floating rounded column */}
      <nav
        aria-label="Main sidebar"
        className="hidden md:flex h-[calc(100vh-2rem)] w-[64px] flex-col m-4 shrink-0 rounded-2xl bg-[#1C1C1C] border border-white/5 shadow-2xl z-30"
      >
        {navContent}
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1C1C1C] border-r border-white/10 p-5 flex flex-col md:hidden text-white shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                    <Wallet className="h-5 w-5 text-[#10EE74]" />
                  </div>
                  <span className="font-semibold text-lg font-display text-white">Spendora</span>
                </div>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-1.5 flex-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    location.pathname === href ||
                    (href === "/dashboard" && location.pathname === "/expenses");
                  return (
                    <NavLink
                      key={href}
                      to={href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white/10 text-[#10EE74] font-semibold"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;

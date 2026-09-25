import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  CreditCard,
  Globe,
  LineChart,
  Lock,
  Menu,
  MessageSquare,
  PieChart,
  Shield,
  FileText,
  Star,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import API from "../api";
import LandingChatbot from "../components/LandingChatbot";

const Main = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const featuresData = [
    {
      title: "AI Expense Detection",
      desc: "Catch spending from SMS alerts and turn it into clean categories instantly.",
      icon: FileText,
    },
    {
      title: "Budget Intelligence",
      desc: "Spot risky habits early with adaptive limits that react to real behavior.",
      icon: Target,
    },
    {
      title: "Visual Analytics",
      desc: "See trends, category leaks, and monthly changes without digging through rows.",
      icon: BarChart3,
    },
    {
      title: "Cashflow Tracking",
      desc: "Follow income, savings, and spending momentum from one crisp bento dashboard.",
      icon: TrendingUp,
    },
    {
      title: "Secure by Design",
      desc: "Authentication and protected routes keep private finance data behind the vault.",
      icon: Shield,
    },
    {
      title: "Anywhere Access",
      desc: "A responsive workspace for checking your money on laptop, tablet, or phone.",
      icon: Globe,
    },
  ];

  const stats = [
    { label: "App Rating", value: "4.9" },
    {
      label: "Registered Users",
      value: totalUsers === null ? "..." : totalUsers.toLocaleString(),
    },
    { label: "Detection Flow", value: "AI Powered" },
  ];

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Dashboard", href: "#dashboard-preview" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/auth/stats");
        setTotalUsers(
          typeof data?.totalUsers === "number" ? data.totalUsers : 0
        );
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setTotalUsers(0);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (href) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);

    if (element) {
      const topOffset =
        element.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-[#10EE74] selection:text-black antialiased">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-gradient-to-b from-[#10EE74]/10 via-[#10EE74]/[0.02] to-transparent blur-[140px]" />

      {/* Floating Pill Nav on Landing */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "border-b border-white/5 bg-[#1C1C1C]/90 py-3.5 shadow-2xl backdrop-blur-md"
            : "border-b border-transparent bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2.5 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#10EE74]/20 bg-[#0D2E18] transition-colors group-hover:border-[#10EE74]/40">
              <Wallet className="h-5 w-5 text-[#10EE74] transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(16,238,116,0.6)]" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#10EE74]">
              Spendora
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleScrollTo(item.href)}
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full border border-white/10 bg-[#1C1C1C] px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-[#10EE74] px-5 py-2 text-xs font-semibold text-black shadow-lg shadow-[#10EE74]/20 transition-all hover:bg-[#10EE74]/90 active:scale-95 cursor-pointer"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-white/10 bg-[#1C1C1C]/95 backdrop-blur-lg md:hidden"
            >
              <div className="space-y-3 px-4 pb-6 pt-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleScrollTo(item.href)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#10EE74] px-5 py-2.5 text-xs font-semibold text-black"
                >
                  Get started
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10EE74]/10 blur-[130px]" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#131313] px-3.5 py-1 text-xs font-semibold text-gray-300 shadow-xl"
            >
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#10EE74]" />
              Smart Bento Expense Command Center
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Take Control of
              <br />
              <span className="bg-gradient-to-r from-[#10EE74] via-emerald-300 to-[#10EE74] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(16,238,116,0.3)]">
                Your Daily Money
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base"
            >
              Spendora turns scattered expenses into a clean financial workspace
              with sleek bento grids, smart SMS detection, visual charts, and an AI
              advisor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-12 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#10EE74] px-7 py-3.5 font-semibold text-black shadow-lg shadow-[#10EE74]/25 transition-all hover:bg-[#10EE74]/90 active:scale-95 sm:w-auto text-sm cursor-pointer"
              >
                Start tracking now
                <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-[#1C1C1C] px-7 py-3.5 font-semibold text-gray-200 transition-all hover:border-[#10EE74]/40 hover:text-white active:scale-95 sm:w-auto text-sm cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-[#10EE74]" />
                Talk to advisor
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-4 text-xs text-gray-500 sm:flex-row"
            >
              <div className="flex items-center">
                {["A", "B", "C", "D"].map((seed, index) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=spendora${seed}`}
                    alt="User avatar"
                    className={`h-7 w-7 rounded-full border-2 border-black bg-zinc-800 ${
                      index > 0 ? "-ml-2.5" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center gap-0.5 sm:items-start">
                <span className="font-semibold text-gray-300">
                  Trusted by focused spenders
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 fill-amber-400 stroke-none"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-300">4.9</span>
                  <span className="text-gray-500">(15k+ reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section
          id="dashboard-preview"
          className="relative bg-black px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#10EE74]">
                Live Finance Cockpit
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A sharper bento dashboard for every rupee
              </h2>
              <p className="mt-3 text-sm text-gray-400">
                Pure dark surfaces, neon green indicators, glassmorphic cards,
                and instant financial clarity.
              </p>
            </div>

            {/* Mock Dashboard Preview Frame */}
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#131313] p-4 sm:p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                {/* Total Balance Card */}
                <div className="md:col-span-4 rounded-[24px] bg-[#10EE74] text-black p-5 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <p className="text-xs font-semibold text-black/80">
                      Total Balance
                    </p>
                    <p className="text-3xl font-bold font-mono tracking-tight mt-1">
                      ₹20,670
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex-1 py-2 text-center rounded-full bg-black text-white text-xs font-semibold">
                      Add Expense
                    </span>
                    <span className="flex-1 py-2 text-center rounded-full bg-white text-black text-xs font-semibold">
                      Deposit
                    </span>
                  </div>
                </div>

                {/* AreaChart simulation */}
                <div className="md:col-span-8 rounded-[24px] border border-white/10 bg-[#1C1C1C] p-5 flex flex-col justify-between min-h-[180px]">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Expense Analysis
                      </p>
                      <p className="text-[11px] text-gray-400">Daily Trend Overview</p>
                    </div>
                    <span className="rounded-full bg-[#0D2E18] text-[#10EE74] px-2.5 py-0.5 text-[10px] font-semibold border border-[#10EE74]/20">
                      Live
                    </span>
                  </div>

                  {/* SVG Wave */}
                  <div className="h-20 w-full mt-2">
                    <svg viewBox="0 0 600 100" className="h-full w-full">
                      <defs>
                        <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10EE74" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10EE74" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,80 Q75,30 150,60 T300,30 T450,50 T600,20 L600,100 L0,100 Z"
                        fill="url(#prevGrad)"
                      />
                      <path
                        d="M0,80 Q75,30 150,60 T300,30 T450,50 T600,20"
                        fill="none"
                        stroke="#10EE74"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative overflow-hidden bg-black px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#10EE74]">
                Everything You Need
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Finance management with modern aesthetics.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuresData.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-[24px] border border-white/10 bg-[#131313] p-6 transition-all hover:border-[#10EE74]/40 hover:bg-[#181818]"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#10EE74]/20 bg-[#0D2E18] text-[#10EE74]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-black px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 rounded-[28px] border border-white/10 bg-[#131313] p-5 sm:grid-cols-3 sm:p-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/5 bg-[#1C1C1C] p-5"
              >
                <p className="font-display text-3xl font-bold text-[#10EE74] font-mono">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t border-white/5 bg-black px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#10EE74]/20 bg-[#0D2E18]">
              <Wallet className="h-4 w-4 text-[#10EE74]" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Spendora
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Terms", "Privacy", "Legal", "Help"].map((item) => (
              <a
                key={item}
                href="https://github.com/Shivam000189/expanceTraker"
                className="text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:text-[#10EE74]"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-600">
            © 2026 Spendora Inc. Built with modern bento design.
          </p>
        </div>
      </footer>

      <LandingChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default Main;

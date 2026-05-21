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
  Sparkles,
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
      title: "AI expense detection",
      desc: "Catch spending from SMS alerts and turn it into clean categories instantly.",
      icon: Sparkles,
    },
    {
      title: "Budget intelligence",
      desc: "Spot risky habits early with adaptive limits that react to real behavior.",
      icon: Target,
    },
    {
      title: "Visual analytics",
      desc: "See trends, category leaks, and monthly changes without digging through rows.",
      icon: BarChart3,
    },
    {
      title: "Cashflow tracking",
      desc: "Follow income, savings, and spending momentum from one crisp command center.",
      icon: TrendingUp,
    },
    {
      title: "Secure by design",
      desc: "Authentication and protected routes keep private finance data behind the vault.",
      icon: Shield,
    },
    {
      title: "Anywhere access",
      desc: "A responsive workspace for checking your money on laptop, tablet, or phone.",
      icon: Globe,
    },
  ];

  const stats = [
    { label: "App rating", value: "4.9" },
    {
      label: "Registered users",
      value: totalUsers === null ? "..." : totalUsers.toLocaleString(),
    },
    { label: "Detection flow", value: "AI" },
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
        setTotalUsers(typeof data?.totalUsers === "number" ? data.totalUsers : 0);
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
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 font-sans text-white selection:bg-emerald-500 selection:text-black antialiased">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-500/10 via-emerald-500/[0.03] to-transparent blur-[140px]" />

      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "border-b border-zinc-800/60 bg-zinc-950/85 py-4 shadow-lg shadow-zinc-950/20 backdrop-blur-md"
            : "border-b border-transparent bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 transition-colors group-hover:border-emerald-500/40">
              <Wallet className="h-5 w-5 text-emerald-400 transition-transform group-hover:scale-110" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-emerald-400">
              Spendora
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleScrollTo(item.href)}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-zinc-700 hover:bg-zinc-800 active:scale-95"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_4px_24px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-400 active:scale-95"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-lg md:hidden"
            >
              <div className="space-y-3 px-4 pb-6 pt-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleScrollTo(item.href)}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-base font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative">
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-36 text-center sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute left-1/4 top-1/3 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-sky-500/10 blur-[100px]" />
          <div className="radial-dot-grid pointer-events-none absolute inset-0" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-zinc-800/80 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-400"
            >
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              AI-powered expense command center
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Take Control of
              <br />
              <span className="text-glow-green bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Your Daily Money
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
            >
              Spendora turns scattered expenses into a clean financial workspace with smart
              detection, visual analytics, and an AI advisor that helps you spend with intent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-emerald-500 px-8 py-4 font-semibold text-black shadow-[0_4px_24px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_4px_30px_rgba(16,185,129,0.5)] active:scale-95 sm:w-auto"
              >
                Start tracking now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-8 py-4 font-semibold text-zinc-200 transition-all hover:border-emerald-500/30 hover:text-white active:scale-95 sm:w-auto"
              >
                <MessageSquare className="h-5 w-5 text-emerald-400" />
                Talk to advisor
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col items-center justify-center gap-4 text-sm text-zinc-500 sm:flex-row"
            >
              <div className="flex items-center">
                {["A", "B", "C", "D"].map((seed, index) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=spendora${seed}`}
                    alt="Spendora user avatar"
                    referrerPolicy="no-referrer"
                    className={`h-8 w-8 rounded-full border-2 border-zinc-900 bg-zinc-800 ${
                      index > 0 ? "-ml-3" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center gap-1 sm:items-start">
                <span className="font-semibold text-zinc-400">Trusted by focused spenders</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                  <span className="font-bold text-zinc-300">4.9</span>
                  <span className="text-zinc-600">(15k+ reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </section>

        <section id="dashboard-preview" className="radial-dot-grid relative bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[140px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live finance cockpit
              </span>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
                A clearer dashboard for every rupee
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                The landing page now borrows the Cryptix shell: dark surfaces, precise borders,
                emerald highlights, compact metrics, and a glassy app preview.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
              <div className="grid min-h-[560px] md:grid-cols-[240px_1fr]">
                <aside className="flex flex-col justify-between border-b border-zinc-800/60 bg-zinc-950/80 p-4 md:border-b-0 md:border-r">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-zinc-800/70 px-2 py-1.5">
                      <Wallet className="h-5 w-5 text-emerald-400" />
                      <span className="font-display text-sm font-bold tracking-tight text-white">
                        Spendora App
                      </span>
                    </div>

                    <div className="space-y-1">
                      {[
                        { label: "Overview", icon: LineChart, active: true },
                        { label: "Budgets", icon: PieChart },
                        { label: "AI Advisor", icon: Bot, badge: "Live" },
                        { label: "Security", icon: Lock },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                            item.active
                              ? "border-l-2 border-emerald-500 bg-zinc-800/70 text-white"
                              : "text-zinc-400"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 rounded-xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                      Smart monthly scan
                    </div>
                    <p className="mb-2.5 text-[10px] leading-normal text-zinc-500">
                      AI highlights subscriptions, spikes, and savings opportunities.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsChatOpen(true)}
                      className="flex w-full items-center justify-center gap-1 rounded-lg bg-zinc-800 py-1.5 text-[10px] font-bold text-emerald-400 transition-colors hover:bg-zinc-700"
                    >
                      Launch advisor
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </aside>

                <div className="flex min-h-0 flex-col bg-zinc-900/40 p-5 sm:p-6">
                  <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-800/50 pb-6 sm:flex-row sm:items-center">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Expense dashboard
                      </span>
                      <h3 className="font-display text-lg font-bold text-white">Main dashboard</h3>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Synced just now
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-5 lg:col-span-2">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500">Monthly balance</span>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                          <TrendingUp className="h-3 w-3" />
                          +12.4%
                        </span>
                      </div>
                      <div className="mb-5 font-display text-3xl font-medium tracking-tight text-white">
                        INR 84,250
                      </div>
                      <div className="relative h-32 overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-900/60">
                        <svg viewBox="0 0 700 180" className="h-full w-full">
                          <defs>
                            <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0 145 L70 132 L140 138 L210 104 L280 116 L350 82 L420 92 L490 55 L560 72 L630 38 L700 48 L700 180 L0 180 Z"
                            fill="url(#lineFill)"
                          />
                          <path
                            d="M0 145 L70 132 L140 138 L210 104 L280 116 L350 82 L420 92 L490 55 L560 72 L630 38 L700 48"
                            fill="none"
                            stroke="#10b981"
                            strokeLinecap="round"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-5">
                      <span className="text-xs font-semibold text-zinc-500">Expense split</span>
                      <div className="mx-auto my-6 grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#10b981_0_42%,#38bdf8_42%_68%,#f59e0b_68%_84%,#27272a_84%_100%)]">
                        <div className="grid h-24 w-24 place-items-center rounded-full bg-zinc-950 text-center">
                          <span className="font-display text-2xl font-bold text-white">42%</span>
                          <span className="-mt-2 text-[10px] uppercase tracking-widest text-zinc-500">
                            Saved
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        {["Savings", "Bills", "Lifestyle"].map((label, index) => (
                          <div key={label} className="flex items-center justify-between text-zinc-400">
                            <span className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  index === 0
                                    ? "bg-emerald-400"
                                    : index === 1
                                      ? "bg-sky-400"
                                      : "bg-amber-500"
                                }`}
                              />
                              {label}
                            </span>
                            <span className="font-mono text-zinc-300">
                              {index === 0 ? "42%" : index === 1 ? "26%" : "16%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    {[
                      { title: "Food delivery", amount: "INR 8,420", icon: CreditCard },
                      { title: "Investment saved", amount: "INR 24,000", icon: TrendingUp },
                      { title: "AI alerts closed", amount: "11", icon: CheckCircle2 },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-5"
                      >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                          <item.icon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <p className="text-xs text-zinc-500">{item.title}</p>
                        <p className="mt-1 font-display text-xl font-bold text-white">{item.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="relative overflow-hidden bg-zinc-950 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Everything you need
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Finance management with a sharper interface.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuresData.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 transition-all hover:border-emerald-500/30 hover:bg-zinc-900"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                    <feature.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-950 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 sm:grid-cols-3 sm:p-6">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-5">
                <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-zinc-900 bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">Spendora</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Terms", "Privacy", "Legal", "Help"].map((item) => (
              <a
                key={item}
                href="https://github.com/Shivam000189/expanceTraker"
                className="text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-emerald-400"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
            Copyright 2026 Spendora. Built by Shivam.
          </p>
        </div>
      </footer>

      <LandingChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Main;

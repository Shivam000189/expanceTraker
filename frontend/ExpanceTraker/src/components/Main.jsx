import React from "react";
import Navbar from "./Navbar";
import { Rocket, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Rocket size={20} className="text-white" />,
      title: "Track with Ease",
      body: "Add, edit, and manage your daily expenses effortlessly.",
      num: "01",
    },
    {
      icon: <Shield size={20} className="text-white" />,
      title: "Your Data, Secure",
      body: "Your financial data stays private and safe — always.",
      num: "02",
    },
    {
      icon: <Sparkles size={20} className="text-white" />,
      title: "Smart Insights",
      body: "Visual charts help you stay within limits.",
      num: "03",
    },
  ];

  return (
    <div className="bg-white text-[#4B2C85] min-h-screen overflow-x-hidden font-serif">
      
      <Navbar
        onLogin={() => navigate("/login")}
        onSignup={() => navigate("/signup")}
      />

      {/* HERO */}
      <section className="pt-28 pb-16 px-4 sm:px-6 md:pt-40 md:pb-28 max-w-[900px] mx-auto text-center">
        <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 block mb-5 font-sans">
          Personal Finance, Reimagined
        </span>

        <h1 className="text-[clamp(38px,7vw,88px)] font-black leading-[1.08] tracking-tight mb-6">
          Track smarter.{" "}
          <em className="italic text-black">Spend better.</em>
          <br />
          Live easier.
        </h1>

        <p className="text-neutral-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10 sm:mb-12 font-sans">
          Take control of your money with smart insights — track, manage,
          and balance your expenses effortlessly.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-black px-6 sm:px-8 py-3 text-sm tracking-widest uppercase font-medium hover:bg-neutral-200 transition"
          >
            Get Started Free
          </button>

          <a
            href="#features"
            className="border border-neutral-700 px-6 sm:px-8 py-3 text-sm tracking-wide uppercase text-[#4B2C85] hover:text-black hover:bg-gray-400 hover:border-neutral-500 transition"
          >
            See How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="mt-14 sm:mt-20 border-y border-neutral-800 py-6 sm:py-8 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0">
          {[
            { num: "10K+", label: "Active Users" },
            { num: "₹2Cr+", label: "Tracked Monthly" },
            { num: "99.9%", label: "Uptime" },
          ].map((s, i) => (
            <div
              key={i}
              className="px-4 sm:px-6 lg:px-10 text-center border-neutral-800 sm:border-r last:border-none"
            >
              <div className="text-2xl font-medium text-black">{s.num}</div>
              <div className="text-[11px] tracking-widest uppercase text-neutral-600 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-4 sm:px-6 py-16 sm:py-24 max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 block mb-4 font-sans">
            Features
          </span>
          <h2 className="text-[clamp(32px,4vw,52px)] font-bold tracking-tight">
            Why choose <span className="text-black">FinTrackr?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-px">
          {features.map((card, i) => (
            <div
              key={i}
              className="bg-[#0f0f0f] rounded-2xl p-6 sm:p-8 lg:p-12 hover:bg-[#111] border border-neutral-900 transition"
            >
              <div className="flex justify-between mb-8">
                <div className="w-12 h-12 border border-neutral-700 flex items-center justify-center">
                  {card.icon}
                </div>
                <span className="text-xs text-neutral-700 tracking-wider">
                  {card.num}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-4">
                {card.title}
              </h3>

              <p className="text-neutral-500 leading-relaxed text-sm">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 text-center">
        <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 block mb-4 font-sans">
          Get Started
        </span>

        <h2 className="text-[clamp(36px,5vw,64px)] font-black leading-tight mb-6">
          Ready to take <br />
          <em className="italic text-black">control?</em>
        </h2>

        <p className="text-neutral-500 max-w-md mx-auto mb-10 leading-relaxed">
          Join thousands using FinTrackr to manage their finances with clarity and confidence.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-black border rounded-2xl px-10 py-3 uppercase tracking-widest text-sm hover:bg-neutral-200 transition"
        >
          Start for Free
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 py-8 text-center text-neutral-700 text-sm">
        © {new Date().getFullYear()} FinTrackr. All rights reserved.
      </footer>
    </div>
  );
};

export default Main;

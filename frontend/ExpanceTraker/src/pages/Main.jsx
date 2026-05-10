import React from "react";
import Navbar from "../components/Navbar";
import { Rocket, Shield, Sparkles, Target, BarChart3, Globe, ArrowRight, MessageSquare, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../lib/utils"; // You'll need to create this or remove the cn function

const Main = () => {
  const navigate = useNavigate();

  const featuresData = [
    { title: 'AI Detection', desc: 'Auto-detect expenses from bank SMS and emails with 99% accuracy.', icon: Sparkles },
    { title: 'Goal Tracking', desc: 'Set financial goals and let our AI coach you to reach them faster.', icon: Target },
    { title: 'Rich Analytics', desc: 'Beautiful charts and deep insights into where every penny goes.', icon: BarChart3 },
    { title: 'Smart Budgeting', desc: 'Predictive budgeting that adjusts to your lifestyle automatically.', icon: TrendingUp },
    { title: 'Bank Security', desc: 'Enterprise-grade encryption keeps your financial data ultra-safe.', icon: Shield },
    { title: 'Global Sync', desc: 'Access your finances across all your devices, anywhere in the world.', icon: Globe },
  ];

  return (
    <div className="bg-white text-[#4B2C85] min-h-screen overflow-x-hidden font-serif">
      
      <Navbar
        onLogin={() => navigate("/login")}
        onSignup={() => navigate("/signup")}
      />

      {/* NEW HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-39 pb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            {/* <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-2xl text-sm font-bold border border-emerald-100 shadow-sm">
              <Sparkles size={18} />
              AI-Powered Financial Freedom
            </div> */}
            
            <h1 className="text-6xl lg:text-8xl font-display font-bold tracking-tight text-zinc-900 leading-[1.05]">
              Master your money with <span className="text-emerald-500 underline decoration-emerald-200 underline-offset-8">Precision</span>.
            </h1>
            
            <p className="text-xl text-zinc-500 max-w-lg leading-relaxed font-medium">
              Join smart users who use Spendora to track expenses, automate savings, and build wealth with advanced AI insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto bg-emerald-600 text-white font-bold px-10 py-5 rounded-[1.5rem] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 flex items-center justify-center gap-2 text-lg"
              >
                Start Your Journey
                <ArrowRight size={22} />
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 font-bold text-zinc-500 hover:text-zinc-900 transition-colors group">
                <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-50 transition-all">
                  <MessageSquare size={20} />
                </div>
                Talk to Advisor
              </button>
            </div>

            <div className="flex items-center gap-12 pt-10">
              <div>
                <p className="text-4xl font-bold font-display text-zinc-900">4.9/5</p>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">App Rating</p>
              </div>
              <div className="w-[1px] h-10 bg-zinc-200"></div>
              <div>
                <p className="text-4xl font-bold font-display text-zinc-900">12k+</p>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Active Users</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 bg-white rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-zinc-100"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Growth</p>
                    <p className="text-lg text-black font-bold">₹1,24,000</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                  <CreditCard size={18} />
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { name: 'Investments', amount: '₹45,300', color: 'bg-emerald-500' },
                  { name: 'Savings', amount: '₹22,100', color: 'bg-blue-500' },
                  { name: 'Spending', amount: '₹14,500', color: 'bg-orange-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-zinc-600">{item.name}</span>
                      <span className="text-zinc-900">{item.amount}</span>
                    </div>
                    <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '70%', transition: { delay: 1 + i * 0.2, duration: 1 } }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-emerald-100/30 rounded-full blur-[120px] -z-10"></div>
          </div>
        </div>
      </section>

      {/* NEW FEATURES SECTION */}
      <section className="bg-zinc-900 py-32 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.05),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <p className="text-emerald-500 font-bold tracking-widest uppercase text-xs">Everything you need</p>
            <h2 className="text-4xl lg:text-6xl font-display font-bold tracking-tight">Financial management, simplified by Intelligence.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, i) => (
              <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-emerald-500" size={28} />
                </div>
                <h3 className="text-xl font-bold font-display mb-4">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="py-20 sm:py-28 px-4 sm:px-6 text-center">
        <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 block mb-4 font-sans">
          Get Started
        </span>

        <h2 className="text-[clamp(36px,5vw,64px)] text-black font-black leading-tight mb-6">
          Ready to take <br />
          <em className="italic text-emerald-500">control?</em>
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
      </section> */}

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <Wallet size={16} />
            </div>
            <span className="text-xl font-display font-bold text-black tracking-tight">Spendora</span>
          </div>
          <div className="flex gap-10">
             {['Terms', 'Privacy', 'Legal', 'Help'].map((item) => (
              <a key={item} href="https://github.com/Shivam000189/expanceTraker" className="text-sm font-display font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">{item}</a>
            ))}
          </div>
          <p className="text-xs font-display text-black  tracking-widest uppercase">© 2026 Spendora. Built by Shivam.</p>
        </div>
      </footer>
    </div>
  );
};

export default Main;
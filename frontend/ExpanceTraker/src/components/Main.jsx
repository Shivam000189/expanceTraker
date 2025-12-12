import React from "react";
import Navbar from "./Navbar";
import { Rocket, Shield, Sparkles, Zap, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const navigate = useNavigate();
    const handleclick = () => {
        navigate('/signup');
    } 
  return (
    <div className="bg-black min-h-screen text-slate-100">
        <Navbar
            onLogin={() => navigate("/login")}
            onSignup={() => navigate("/signup")}
          />

      
      <section className="pt-40 pb-32 px-6 text-center max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-purple-500">
          Track smarter Spend better Live easier
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-10">
          Take control of your money with smart insights—track, manage, and balance your expenses effortlessly.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 rounded-full bg-brand-600 hover:bg-gray-500 text-white font-medium shadow-lg shadow-brand-500/30 transition-all cursor-pointer" onClick={handleclick}>
            Get Started
          </button>

          <a
            href="#features"
            className="px-8 py-3 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all"
          >
            Learn More
          </a>
        </div>
      </section>

      
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose <span className="text-brand-500">FinTrackr?</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-black/30">
            <Rocket className="w-12 h-12 text-brand-500 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Track with Ease</h3>
            <p className="text-slate-400">
                Add, edit, and manage your daily expenses effortlessly.  
                FinTrackr keeps everything organized so you always know where your money goes.
            </p>
            </div>

            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-black/30">
            <Shield className="w-12 h-12 text-brand-500 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Your Data, Secure</h3>
            <p className="text-slate-400">
                With encrypted authentication and protected routes, your financial data
                stays private and safe—always.
            </p>
            </div>

            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-black/30">
            <Sparkles className="w-12 h-12 text-brand-500 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Smart Insights</h3>
            <p className="text-slate-400">
                Visual charts and monthly analytics show where you overspend,
                helping you stay within limits and take control of your finances.
            </p>
            </div>

        </div>
        </section>

      
      <section className="py-24 text-center px-6 bg-gradient-to-br from-slate-900 to-black">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Manage Your expance?
        </h2>
        <p className="text-slate-300 mb-10 max-w-2xl mx-auto">
          Join thousands of User using FinTrackr to manage there Expance
          Service. Let’s build the future together.
        </p>

        <button className="px-10 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg shadow-lg shadow-brand-500/30 transition-all">
          Start Now
        </button>
      </section>

      
      <footer className="py-10 text-center border-t border-slate-800">
        <p className="text-slate-500">© {new Date().getFullYear()} FinTrackr. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Main;

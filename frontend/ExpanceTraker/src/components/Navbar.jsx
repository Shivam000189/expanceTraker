import React, { useState, useEffect } from "react";
import { Menu, X, Wallet, ArrowRight } from "lucide-react";

export const Navbar = ({ onLogin, onSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer min-w-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-[#4B2C85]/20">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-zinc-900">
            Spendora
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {['Features','Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-sm font-display font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onLogin} 
            className="text-sm font-bold text-zinc-900 hover:text-[#4B2C85] transition-colors px-4 cursor-pointer"
          >
            Sign in
          </button>
          <button 
            onClick={onSignup} 
            className="hidden sm:flex bg-zinc-900 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 items-center gap-2 cursor-pointer"
          >
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden border border-gray-300 p-2 rounded-sm text-gray-600"
        >
          {isMobileMenuOpen ? (
            <X size={18} className="text-black" />
          ) : (
            <Menu size={18} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="bg-white border-t border-gray-200 px-6 pb-8 pt-2 animate-slideDown">
          {['Features', 'Market', 'Company', 'Pricing'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="block py-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest"
            >
              {item}
            </a>
          ))}

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => {
                onLogin();
                setIsMobileMenuOpen(false);
              }}
              className="text-sm font-bold text-zinc-900 hover:text-[#4B2C85] transition-colors px-4 py-3 text-left"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                onSignup();
                setIsMobileMenuOpen(false);
              }}
              className="bg-zinc-900 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 items-center gap-2 w-full cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

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
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-[72px]">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer min-w-0">
            <div className="w-7 h-7 border border-gray-300 flex items-center justify-center rounded-sm">
              <div className="w-2.5 h-2.5 bg-[#4B2C85] rounded-sm" />
            </div>
            <span className="font-serif text-lg sm:text-xl font-bold text-[#4B2C85] tracking-tight">
              FinTrackr
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="nav-link">Product</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#" className="nav-link">Pricing</a>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={onLogin} className="nav-btn-ghost cursor-pointer">
              Sign In
            </button>
            <button onClick={onSignup} className="nav-btn-primary cursor-pointer">
              Get Started
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
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="bg-white border-t border-gray-200 px-4 sm:px-6 pb-8 pt-2 animate-slideDown">
          <a href="#" className="mobile-link">Product</a>
          <a href="#features" className="mobile-link">Features</a>
          <a href="#" className="mobile-link">Pricing</a>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => {
                onLogin();
                setIsMobileMenuOpen(false);
              }}
              className="nav-btn-ghost w-full py-3"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onSignup();
                setIsMobileMenuOpen(false);
              }}
              className="nav-btn-primary w-full py-3"
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

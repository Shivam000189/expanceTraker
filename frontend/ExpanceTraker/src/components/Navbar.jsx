import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, ChevronRight } from 'lucide-react';

export const Navbar = ({ onLogin, onSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-slate-900/80 backdrop-blur-lg border-b border-slate-800'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              FinTrackr
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Product</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Solutions</a>
            {/* <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Pricing</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Company</a> */}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onLogin}
              className="text-slate-300 hover:text-white font-medium text-sm transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={onSignup}
              className="group relative px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-medium text-sm transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                Get Started <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Product</a>
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Solutions</a>
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Pricing</a>
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Company</a>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  onLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-3 rounded-lg bg-slate-800 text-white font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onSignup();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-3 rounded-lg bg-brand-600 text-white font-medium shadow-lg shadow-brand-500/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
    
  );
};



export default Navbar;
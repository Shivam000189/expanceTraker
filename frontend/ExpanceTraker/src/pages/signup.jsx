import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, User, Wallet } from "lucide-react";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", formData);
      toast.success(res.data.msg || "User registered successfully!");
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("monthlyIncome", "0");
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(error.response?.data?.msg || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-3 sm:p-4 md:p-8 selection:bg-[#10EE74] selection:text-black">
      {/* Main Container */}
      <div className="w-full max-w-6xl min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[28px] bg-[#131313] border border-white/10 shadow-2xl sm:min-h-[calc(100vh-2rem)] sm:rounded-[40px] lg:h-[90vh] lg:min-h-[600px] lg:flex">
        {/* Left Container */}
        <div className="hidden lg:flex flex-1 relative flex-col p-12 overflow-hidden justify-between">
          {/* Ambient Glow Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />

          <div className="relative z-10">
            <p className="text-gray-400 text-sm font-light tracking-wide mb-16">
              Global smart expense tracking made effortless.
            </p>

            <h1 className="text-white text-6xl font-bold leading-[1.1] tracking-tight max-w-md font-display">
              Join <br />
              <span className="text-[#10EE74]">Spendora</span>
            </h1>
          </div>

          {/* Floating Card Illustration */}
          <div className="relative z-10 w-full max-w-xs mx-auto my-auto">
            <Motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-8 bg-[#10EE74]/20 blur-3xl rounded-full" />
              <div className="relative rounded-[28px] border border-white/20 bg-white/[0.10] p-6 shadow-2xl backdrop-blur-2xl text-white">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-9 h-9 rounded-xl bg-[#0D2E18] border border-[#10EE74]/20 flex items-center justify-center">
                    <Wallet size={18} className="text-[#10EE74]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#10EE74] bg-[#0D2E18] px-2 py-0.5 rounded-full border border-[#10EE74]/20">
                    Visa
                  </span>
                </div>
                <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-1 font-mono">
                  Monthly Budget
                </p>
                <p className="text-white text-3xl font-bold font-mono mb-6">
                  ₹50,000
                </p>
                <p className="text-gray-400 font-mono text-xs tracking-widest">
                  7812 •••• •••• 0823
                </p>
              </div>

              <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-2xl bg-[#10EE74] shadow-xl flex items-center justify-center rotate-6 text-black">
                <ArrowRight size={22} className="-rotate-6 stroke-[2.5]" />
              </div>
            </Motion.div>
          </div>

          <div className="relative z-10 text-xs text-gray-500">
            Powered by Spendora Engine
          </div>
        </div>

        {/* Right Container */}
        <div className="min-h-[calc(100vh-1.5rem)] flex-1 bg-[#1C1C1C] rounded-[28px] relative flex flex-col p-6 sm:p-10 lg:min-h-0 lg:rounded-l-[40px] lg:rounded-r-none lg:p-14 justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#0D2E18] border border-[#10EE74]/20 rounded-xl flex items-center justify-center shadow-lg shadow-[#10EE74]/15">
                <Wallet className="text-[#10EE74]" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Spendora
              </span>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center">
                <User size={13} />
              </div>
              Sign In
            </button>
          </div>

          {/* Form */}
          <div className="max-w-sm mx-auto w-full my-auto py-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
              Create account
            </h2>
            <p className="text-xs text-gray-400 mb-8">
              Start tracking expenses with intelligent bento insights
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#373737] border border-white/5 text-white placeholder-gray-400 focus:border-[#10EE74] outline-none text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#373737] border border-white/5 text-white placeholder-gray-400 focus:border-[#10EE74] outline-none text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#373737] border border-white/5 text-white placeholder-gray-400 focus:border-[#10EE74] outline-none text-sm transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 rounded-full bg-[#10EE74] text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#10EE74]/20 hover:bg-[#10EE74]/90 transition cursor-pointer"
                >
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </Motion.button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#10EE74] font-semibold hover:underline ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-[11px] text-gray-500 border-t border-white/5 pt-4">
            <p>© 2026 Spendora Inc.</p>
            <p>Protected by 256-bit SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
}

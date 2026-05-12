import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Eye, Globe, User, Wallet } from "lucide-react"; 
import toast from "react-hot-toast";


export default function Signup() {
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
});
    const [hovered, setHovered] = useState(false);

    const navigate = useNavigate();

    // const [message, setMessage] = useState("");


    const handleChange =  (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await API.post("/auth/register", formData);
            toast.success(res.data.msg || "User registered successfully!");
            localStorage.setItem("userName", formData.name);
            localStorage.setItem("userEmail", formData.email);
            localStorage.setItem("monthlyIncome", "0");
            setFormData({name:"", email:"", password:""});
            setTimeout(() => navigate("/login"), 1500);
        }catch(error){
            console.error("Error registering user:", error);
            toast.error(error.response?.data?.msg || "Something went wrong.");
        }
    };

    return ( <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-3 sm:p-4 md:p-8">
        {/*main container */}
        <div className="w-full max-w-6xl min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[28px] bg-[#1a1617] shadow-2xl sm:min-h-[calc(100vh-2rem)] sm:rounded-[40px] lg:h-[90vh] lg:min-h-[600px] lg:flex">

            {/*Left container */}
            <div className="hidden lg:flex flex-1 relative flex-col p-12 overflow-hidden">
                {/*background container */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <p className="text-white/40 text-sm font-light tracking-wide mb-24">
                        Global payments made simple - online payments solutions for you
                    </p>

                    <h1 className="text-white text-7xl font-bold leading-[1.1] tracking-tight max-w-md">
                        Manger <br /> Your Money
                    </h1>       
                </div>
            
                {/*Phone container */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-2/3 flex items-end justify-center">
                    <Motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full h-full"
                    >
                        <img src="" alt="hand holding phone with financial app"  className="w-full h-full object-bottom drop-shadow-2xl" referrerPolicy="no-referrer"/>
                    </Motion.div>
                </div>

                <div className="absolute bottom-8 right-8">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40">
                        <span>A</span>
                    </div>
                </div>
            </div>


            {/*Right container - left */}
            <div className="min-h-[calc(100vh-1.5rem)] flex-1 bg-white rounded-[28px] relative flex flex-col p-5 sm:p-8 md:p-12 lg:min-h-0 lg:rounded-l-[40px] lg:rounded-r-none lg:p-16">
                {/*Navigation container */}
                <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between lg:mb-14">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-[#4B2C85]/20">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1617]">Spendora</span>
                    </div>


                    <button onClick={()=> {navigate('/login')}} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                            <User size={16}/>
                        </div>
                        Singn In
                    </button>
                </div>

                {/*SingUp container */}

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full relative">
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1617] mb-8 sm:mb-10">Sign Up</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="relative">
                                <input 
                                    type="text"
                                    name="name"
                                    placeholder="Username"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-gray-200 focus:border-black-500 focus:ring-1 focus:ring-black-500 outline-none text-base sm:text-lg placeholder:text-gray-400"
                                />
                            </div>
                        </div>


                        <div className="space-y-6">
                            <div className="space-y-2">
                                <input 
                                type="email" 
                                name="email"
                                placeholder="Email" 
                                value={formData.email} 
                                onChange={handleChange}
                                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-gray-200 focus:border-black-500 focus:ring-1 focus:ring-black-500 outline-none text-base sm:text-lg placeholder:text-gray-400"
                                />
                            </div>
                        </div>


                        <div className="space-y-2">
                            <div className="relative">
                                <input type="password" name="password" placeholder="password" value={formData.password} onChange={handleChange}
                                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-gray-200 focus:border-black-500 focus:ring-1 focus:ring-black-500 outline-none text-base sm:text-lg placeholder:text-gray-400"
                                />
                                <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Eye size={20}/>
                                </button>
                            </div>
                        </div>

                        

                        <Motion.button type="submit"  whileHover={{scale:1.02}} whileTap={{scale:0.98}} 
                        className="w-full py-3 sm:py-4 rounded-full bg-gradient-to-r bg-primary text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 hover:shadow-primary-500/40 transition-all"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        >
                            <ArrowRight size={20} />
                            Sign Up
                        </Motion.button>

                        {/* Tooltip */}
                        {hovered && (
                            <div className="absolute top-full mt-2 bg-black text-white text-sm px-3 py-1 rounded-md shadow-lg">
                            Render take time to load, please wait.... 
                            </div>
                        )}
                    </form>
                </div>

                {/*footer container */}
                <div className="mt-auto pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
                    <p>© 2005-2026 Spendora Inc.</p>
                    <div className="flex items-center gap-6">
                        <button className="hover:text-gray-900 transition-colors flex items-center gap-1">Contact Us</button>
                    </div>

                    <div className="flex items-center gap-2 group cursor-pointer">
                        <span className="hover:text-gray-900 transition-colors">English</span>
                        <Globe size={14} className="group-hover:text-gray-900 transition-colors" />
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

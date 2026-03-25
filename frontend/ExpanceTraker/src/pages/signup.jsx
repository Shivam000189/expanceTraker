import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Eye, Globe, User } from "lucide-react"; 


export default function Signup() {
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
});

    const navigate = useNavigate();

    // const [message, setMessage] = useState("");


    const handleChange =  (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await API.post("/auth/register", formData);
            console.log("Response:", res.data);
            // setMessage(res.data.msg || "User registered Successfully!");
            setFormData({name:"", email:"", password:""});
            setTimeout(() => navigate("/login"), 1500);
        }catch(error){
            console.error("Error registering user:", error);
            // setMessage(error.response?.data?.msg || "Something went wrong.");
        }
    };


//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nile-blue-950 via-nile-blue-900 to-nile-blue-800 relative overflow-hidden">
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute -top-40 -right-40 w-80 h-80 bg-nile-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//                 <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-nile-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-nile-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
//             </div>



//             <div className="relative z-10 w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg  rounded-2xl shadow-2xl border border-white/20 animate-fade-in-up">
//                 <div className="text-center mb-8">
//                     <h2 className="text-4xl font-bold text-white mb-2 tracking-wide">ExpenceTraker</h2>
//                     <p className="text-nile-blue-200 text-sm">Sign up to Track your Expences</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="space-y-2">
//                         <input type="text"
//                         name="name"
//                         placeholder="Name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-nile-blue-200 focus:outline-none focus:ring-2 focus:ring-nile-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
//                         required
//                         /> 
//                     </div>

//                     <div className="space-y-2">
//                         <input type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-nile-blue-200 focus:outline-none focus:ring-2 focus:ring-nile-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
//                         required
//                         />
//                     </div>


//                     <div className="space-y-2">
//                         <input type="password"
//                         name="password"
//                         placeholder="Password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-nile-blue-200 focus:outline-none focus:ring-2 focus:ring-nile-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
//                         required
//                         />
//                     </div>


//                     <button type="submit" className="w-full bg-gradient-to-r from-nile-blue-600 to-nile-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-nile-blue-700 hover:to-nile-blue-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-nile-blue-400 focus:ring-offset-2 focus:ring-offset-transparent">Register</button>
//                 </form>

//                 {message && (
//                     <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
//                 )}

//             </div>

//             <style>{`
//                 @keyframes blob {
//                 0%, 100% {
//                     transform: translate(0, 0) scale(1);
//                 }
//                 33% {
//                     transform: translate(30px, -50px) scale(1.1);
//                 }
//                 66% {
//                     transform: translate(-20px, 20px) scale(0.9);
//                 }
//                 }
                
//                 .animate-blob {
//                 animation: blob 7s infinite;
//                 }
                
//                 .animation-delay-2000 {
//                 animation-delay: 2s;
//                 }
                
//                 .animation-delay-4000 {
//                 animation-delay: 4s;
//                 }
                
//                 @keyframes fade-in-up {
//                 from {
//                     opacity: 0;
//                     transform: translateY(30px);
//                 }
//                 to {
//                     opacity: 1;
//                     transform: translateY(0);
//                 }
//                 }
                
//                 .animate-fade-in-up {
//                 animation: fade-in-up 0.6s ease-out;
//                 }
//             `}</style>

//         </div>

    return ( <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4 md:p-8">
        {/*main container */}
        <div className="w-full max-w-6xl h-[90vh] min-h-[600px] flex overflow-hidden rounded-[40px] shadow-2xl bg-[#1a1617]">

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
            <div className="flex-1 bg-white rounded-[40px] lg:rounded-l-[40px] lg:rounded-r-none relative flex flex-col p-8 md:p-16">
                {/*Navigation container */}
                <div className="flex justify-between items-center mb-14">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center" >
                            <div className="w-6 h-6 rounded-full bg-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-[#1a1617]">Spendora</span>
                    </div>


                    <button onClick={()=> {navigate('/login')}} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                            <User size={16}/>
                        </div>
                        Singn In
                    </button>
                </div>

                {/*SingUp container */}

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <h2 className="text-5xl font-bold text-[#1a1617] mb-10">Sign Up</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="relative">
                                <input 
                                    type="text"
                                    name="name"
                                    placeholder="Username"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-lg placeholder:text-gray-400"
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
                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-lg placeholder:text-gray-400"
                                />
                            </div>
                        </div>


                        <div className="space-y-2">
                            <div className="relative">
                                <input type="password" name="password" placeholder="password" value={formData.password} onChange={handleChange}
                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-lg placeholder:text-gray-400"
                                />
                                <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Eye size={20}/>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <button type="button" className="text-orange-500 font-medium hover:underline text-sm">Forgot password?</button>
                        </div>

                        <Motion.button type="submit"  whileHover={{scale:1.02}} whileTap={{scale:0.98}} 
                        className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all"
                        >
                            <ArrowRight size={20} />
                            Sign Up
                        </Motion.button>
                    </form>
                </div>

                {/*footer container */}
                <div className="mt-auto pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
                    <p>© 2005-2026 ExpanceTraker Inc.</p>
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
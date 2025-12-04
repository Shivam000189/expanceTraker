import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
    });

    const navigate = useNavigate();

    const [message, setMessage] = useState("");


    const handleChange =  (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSumbit = async (e) => {
        e.preventDefault();
        try{
            const res = await API.post("/auth/register", formData);

            setMessage(res.data.msg || "User registered Successfully!");
            setFormData({name:"", email:"", password:""});
            navigate("/login")
        }catch(error){
            console.error("Error registering user:", error);
            setMessage(error.response?.data?.msg || "Something went wrong.");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nile-blue-950 via-nile-blue-900 to-nile-blue-800 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-nile-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-nile-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-nile-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>



            <div className="relative z-10 w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg  rounded-2xl shadow-2xl border border-white/20 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-wide">ExpenceTraker</h2>
                    <p className="text-nile-blue-200 text-sm">Sign up to Track your Expences</p>
                </div>

                <form onSubmit={handleSumbit} className="space-y-6">
                    <div className="space-y-2">
                        <input type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-nile-blue-200 focus:outline-none focus:ring-2 focus:ring-nile-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                        required
                        /> 
                    </div>

                    <div className="space-y-2">
                        <input type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-nile-blue-200 focus:outline-none focus:ring-2 focus:ring-nile-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                        required
                        />
                    </div>


                    <div className="space-y-2">
                        <input type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-nile-blue-200 focus:outline-none focus:ring-2 focus:ring-nile-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                        required
                        />
                    </div>


                    <button type="Sumbit" className="w-full bg-gradient-to-r from-nile-blue-600 to-nile-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-nile-blue-700 hover:to-nile-blue-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-nile-blue-400 focus:ring-offset-2 focus:ring-offset-transparent">Register</button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
                )}

            </div>

            <style>{`
                @keyframes blob {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                }
                33% {
                    transform: translate(30px, -50px) scale(1.1);
                }
                66% {
                    transform: translate(-20px, 20px) scale(0.9);
                }
                }
                
                .animate-blob {
                animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                animation-delay: 4s;
                }
                
                @keyframes fade-in-up {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
                }
                
                .animate-fade-in-up {
                animation: fade-in-up 0.6s ease-out;
                }
            `}</style>

        </div>
    )
}
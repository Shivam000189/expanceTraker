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
        <div className="min-h-screen flex items-center justify-center bg-nile-blue-300 ">
            <div className="bg-nile-blue-950 p-6 rounded-lg shadow-md w-96 h-96">
                <h2 className="text-2xl font-semibold mb-15 text-center">Sign Up</h2>

                <form onSubmit={handleSumbit} className="space-y-3">
                    <input type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    />

                    <input type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    />



                    <input type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                     />


                    <button type="Sumbit" className="w-full bg-nile-blue-800 text-white py-2 rounded hover:bg-nile-blue-400 hover:cursor-pointer">Register</button>
                    
                
                
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
                )}

            </div>

        </div>
    )
}
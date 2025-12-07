import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Home() {
    
    const [isScrolled , setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const naviate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return window.removeEventListener('scroll', handleScroll);
    }, []);


    const handleChange = (event) => {
        const id = event.target.id;
        if (id === "login")
            naviate('/login');
        else {
            naviate('/signup')
        }
    }
    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled || isMobileMenuOpen
                ? 'bg-slate-900/80 backdrop-blur-lg border-b border-slate-800'
                : 'bg-transparent border-b border-transparent'}`}>
            {/* <button id="login" className="w-20 h-10 border-2 text-2xl cursor-pointer" onClick={handleChange}>Login</button>
            <button id="signup" className="w-20 h-10 border-2 text-2xl cursor-pointer" onClick={handleChange}>Signup</button> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* rightlogo */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20  group-hover:shadow-brand-500/40 transition-all duration-300">
                            <div className="w-6 h-6 text-white"></div> 
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            ExpanceTraker
                        </span>
                    </div>

                    


                </div>

            </div>

            
      </nav>
    );
  }
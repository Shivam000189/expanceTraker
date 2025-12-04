import { useNavigate } from "react-router-dom";


export default function Home() {
    
    const naviate = useNavigate();

    const handleChange = (event) => {
        const id = event.target.id;
        if (id === "login")
            naviate('/login');
        else {
            naviate('/signup')
        }
    }
    return (
      <div className="flex flex-col w-10 p-10 gap-5">
            <button id="login" className="w-20 h-10 border-2 text-2xl cursor-pointer" onClick={handleChange}>Login</button>
            <button id="signup" className="w-20 h-10 border-2 text-2xl cursor-pointer" onClick={handleChange}>Signup</button>
      </div>
    );
  }
import { useState } from "react";
import { FaBars, FaChartPie, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 text-white bg-quill-gray-900 p-2 rounded-md hover:bg-quill-gray-700 focus:outline-none"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-quill-gray-950 text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg z-40`}
      >
        <div className="flex flex-col h-full">
          
          <div className="text-xl font-bold px-13 py-4 border-b border-gray-700">
            Expense Tracker
          </div>

          
          <nav className="flex-1 px-4 py-6 space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-quill-gray-800 w-full text-left"
            >
              <FaHome /> Dashboard
            </button>

            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-quill-gray-800 w-full text-left"
            >
              <FaChartPie /> Analytics
            </button>
          </nav>

          
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-md bg-red-500 text-white justify-center hover:bg-red-600 shadow-md transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm opacity-100 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

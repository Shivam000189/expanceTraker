import React, { useEffect, useState } from "react";

export default function ExpenseModal({ expense, onClose }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
            setTimeout(() => setShow(true), 10);
        }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => onClose(), 200)
    }


    if (!expense) return null; 
    return (
        <div
            className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ${show ? "bg-black/40 backdrop-blur-sm opacity-100" : "bg-transparent backdrop-blur-0 opacity-0"}`}
                onClick={handleClose}
            >
            <div
                className={`bg-white rounded-xl shadow-lg p-6 w-96 transform transition-all duration-300 
                        ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {expense.title}
                </h2>

                <div className="space-y-2 text-gray-700">
                    <p>
                        <strong>Amount:</strong> ₹{expense.amount}
                    </p>
                    <p>
                        <strong>Category:</strong> {expense.category}
                    </p>
                    <p>
                        <strong>Date:</strong>{" "}
                        {new Date(expense.date).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Time:</strong>{" "}
                        {new Date(expense.date).toLocaleTimeString()}
                    </p>
                </div>

                <button
                onClick={handleClose}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                Close
                </button>
            </div>

                <style>
                    {`
                    @keyframes pop {
                        0% { transform: scale(0.9); }
                        50% { transform: scale(1.03); }
                        100% { transform: scale(1); }
                    }
                    `}
                </style>
            </div>
    );
}

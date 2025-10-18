import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard1() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        //token header
        const res = await API.get("/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to load expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-masala-300 p-8 text-masala-950">
      <h1 className="text-3xl mb-6 text-center istok-web-bold">
        Your Expenses
      </h1>

      {expenses.length === 0 ? (
        <p className="text-center text-masala-400">No expenses found.</p>
      ) : (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <ul className="divided-y divided-gray-200">
            {expenses.map((exp) => (
              <li key={exp._id} className=" py-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{exp.title}</span>
                  <span className="font-medium">
                    ₹{exp.amount}
                  </span>
                </div>
                <div className="text-sm">
                  {exp.category} • {new Date(exp.date).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

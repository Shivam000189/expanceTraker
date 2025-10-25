// import { useMemo } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";


// export default function ExpenseStats({ expenses }) {
    
//     const montlyLimit = 10000;

//     const currentMonth = new Date().getMonth();
//     const currentMonthExpense = useMemo(
//         () => 
//             expenses.filter(
//                 (e) => new Date(e.date).getMonth() === currentMonth
//         ),
//         [expenses, currentMonth]
//     )


//     const categoryData = useMemo(() => {
//         const map = {};
//         currentMonthExpense.forEach((e) => {
//             map[e.category] = (map[e.category] || 0) + Number(e.amount);
//         });

//         return Object.entries(map).map(([category, amount]) => ({category, amount}));

//     }, [currentMonthExpense])
    

//     const totalSpent = categoryData.reduce((sum, cat)=> sum + cat.amount, 0);
//     const spendingPercent = Math.min((totalSpent/montlyLimit)*100, 100);


//     const highestCategory = categoryData.reduce(
//         (max, cat) => (cat.amount > max.amount ? cat : max),
//         {category : "None" , amount:0}
//     );


//     return (
//         <div className="bg-white shadow-lg rounded-lg p-6 mt-8 max-w-4xl mx-auto">
//             <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">Monthly Insights</h3>

//             <div className="mb-6">
//                 <div className="flex justify-center text-gray-700 mb-1">
//                     <span>Total Spent: ₹{totalSpent}</span>
//                     <span>Limit: ₹{montlyLimit}</span>
//                 </div>

//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div className={`h-3 rounded-full ${
//                         spendingPercent < 75 
//                         ? "bg-green-500"
//                         : spendingPercent < 100
//                         ? "bg-yellow-500" 
//                         : "bg-red-500"
//                     }`}
//                     style={{width: `${spendingPercent}%`}}
//                     ></div>
//                 </div>
//             </div>

//             {/* Pie Chart */}
//             <div className="flex flex-col md:flex-row justify-center items-center gap-6">
//                 <div className="w-full md:w-1/2 h-64">
//                     <ResponsiveContainer>
//                         <PieChart>
//                             <Pie
//                                 date={categoryData}
//                                 dateKey="amount"
//                                 nameKey="Category"
//                                 cx="50%"
//                                 cy="50%"
//                                 outerRadius={80}
//                                 label
//                             >
//                                 {categoryData.map((_, i) => (
//                                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip/>
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>

//                 {/* Weekly spending */}

//                 <div className="w-full md:w-1/2 h-64">
//                     <ResponsiveContainer>
//                         <BarChart data={currentMonthExpense}>
//                             <CartesianGrid strokeDasharray={"3 3"} />
//                             <XAxis
//                                 dateKey="date"
//                                 tickFormatter={(date)=> new Date(date).getDate()} />
//                                 <YAxis/>
//                                 <Tooltip />
//                                 <Bar dateKey="amount" fill="#82ca9d" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             <p className="text-center mt-6 text-gray-700">
//                 🏆 Highest Spending: <strong>{highestCategory.category}</strong> (
//                 ₹{highestCategory.amount})
//             </p>
            
//         </div>
//     )
// }




import ExpenseChart from "./ExpenseChart";

export default function ExpenseStats({ expenses }) {
  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const limit = 2000;
  const highestCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});
  const topCategory = Object.entries(highestCategory).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="mt-10 bg-quill-gray-100 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-quill-gray-900">Expense Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Total Spent</p>
          <h3 className="text-xl font-bold text-gray-900">₹{totalSpent}</h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Spending Limit</p>
          <h3 className="text-xl font-bold text-gray-900">₹{limit}</h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Top Category</p>
          <h3 className="text-xl font-bold text-gray-900">{topCategory || "N/A"}</h3>
        </div>
      </div>

      <ExpenseChart data={expenses} />
    </div>
  );
}

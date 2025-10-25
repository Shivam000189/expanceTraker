import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function ExpenseChart({ data }) {
    
    const limit = 10000;

    const chartData = data.reduce((acc, exp)=> {
        const category = exp.category;
        const amount = exp.amount;
        const existing = acc.find(item => item.category === category);
        if(existing) existing.amount += amount;
        else acc.push({category, amount});
        return acc;
    }, []);

    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Monthly Spending Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#3b82f6" name="Amount Spent" />
                <Bar dataKey={() => limit} fill="#ef4444" name="Spending Limit" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
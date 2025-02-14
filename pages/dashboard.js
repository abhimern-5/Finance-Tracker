import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/Navbar';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from Supabase when the component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Function to fetch transactions from the database
  const fetchTransactions = async () => {
    const { data: user } = await supabase.auth.getUser();

    if (user && user.id) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching transactions:', error);
      } else if (data) {
        setTransactions(data);
      }
    }
  };

  // Calculate total income, expenses, and net balance
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Data for the pie chart
  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#4ade80', '#f87171'], // Green for income, Red for expenses
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-green-100 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Total Income</h2>
            <p className="text-2xl">₹{totalIncome.toFixed(2)}</p>
          </div>
          <div className="p-6 bg-red-100 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Total Expenses</h2>
            <p className="text-2xl">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="p-6 bg-blue-100 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Net Balance</h2>
            <p className="text-2xl">₹{netBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Spending Overview</h2>
          <div className="w-full md:w-1/2 mx-auto">
            <Pie data={chartData} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {transaction.type === 'income' ? '+' : '-'}₹
                    {transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-600">{transaction.category}</p>
                  <p className="text-gray-800">{transaction.description}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

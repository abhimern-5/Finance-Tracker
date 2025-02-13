import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from Supabase
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    // Null check for user and user.user
    if (user && user.user) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.user.id)
        .order('date', { ascending: false }); // Sort by date (newest first)

      if (error) {
        console.error('Error fetching transactions:', error);
      }

      if (data) setTransactions(data);
    } else {
      console.log('User not logged in or user data not available');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>

        {/* Add Transaction Button */}
        <Link href="/add-transaction">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-6">
            Add Transaction
          </button>
        </Link>

        {/* Transaction List */}
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-gray-600">No transactions found.</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center">
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

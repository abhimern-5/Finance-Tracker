import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError('Error fetching user.');
        console.error('User Error:', userError.message);
        return;
      }

      if (user) {
        // Fetch transactions for the logged-in user
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }); // Latest first

        if (error) {
          setError('Error fetching transactions.');
          console.error('Transaction Error:', error.message);
        } else {
          setTransactions(data);
        }
      } else {
        setError('User not logged in.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Unexpected Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Transaction List</h2>
      
      {loading && <p className="text-gray-600">Loading transactions...</p>}
      
      {error && <p className="text-red-600">{error}</p>}
      
      {!loading && transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 border rounded-lg">
            <p className="text-lg font-semibold">
              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
            </p>
            <p className="text-gray-600">{transaction.category}</p>
            <p className="text-gray-800">{transaction.description}</p>
          </div>
        ))
      ) : (
        !loading && <p className="text-gray-600">No transactions found.</p>
      )}
    </div>
  );
}

// transactionlist.js
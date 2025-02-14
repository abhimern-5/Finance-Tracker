import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Budget() {
  const [budget, setBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  // Calculate remaining budget
  const remainingBudget = budget - totalExpenses;

  // Fetch budget and expenses on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchBudget();
      await fetchExpenses();
      setLoading(false);
    };

    fetchData();
  }, []);

  // Alert when budget is exceeded or close to exceeding
  useEffect(() => {
    if (!loading && budget > 0) {
      if (remainingBudget < 0) {
        alert('Your budget has been exceeded!');
      } else if (remainingBudget <= budget * 0.2) {
        alert('You have used 80% of your budget.');
      }
    }
  }, [remainingBudget, budget, loading]);

  // Fetch budget from Supabase
  const fetchBudget = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session Error:', sessionError.message);
        return;
      }

      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        console.warn('User is not logged in.');
        return;
      }

      const { data, error: budgetError } = await supabase
        .from('Budget')  // Table name should be 'Budget'
        .select('amount')
        .eq('user_id', userId)
        .single();

      if (budgetError) {
        console.error('Error fetching budget:', budgetError.message);
      } else if (data) {
        setBudget(data.amount || 0);  // Set to 0 if no amount is found
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
    }
  };

  // Fetch total expenses from Supabase
  const fetchExpenses = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session Error:', sessionError.message);
        return;
      }

      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        console.warn('User is not logged in.');
        return;
      }

      const { data, error: expenseError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'expense');

      if (expenseError) {
        console.error('Error fetching expenses:', expenseError.message);
      } else if (data) {
        const total = data.reduce((sum, t) => sum + t.amount, 0);
        setTotalExpenses(total);
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-bold mb-4">Monthly Budget</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-lg font-semibold">Budget</p>
            <p className="text-2xl">₹{budget.toFixed(2)}</p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              remainingBudget >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <p className="text-lg font-semibold">
              {remainingBudget >= 0 ? 'Remaining' : 'Exceeded'}
            </p>
            <p className="text-2xl">
              ₹{Math.abs(remainingBudget).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

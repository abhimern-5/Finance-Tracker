import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Budget() {
  const [budget, setBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Calculate remaining budget
  const remainingBudget = budget - totalExpenses;

  // Fetch budget and expenses on component load
  useEffect(() => {
    fetchBudget();
    fetchExpenses();
  }, []);

  // Fetch user's budget
  const fetchBudget = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      // Check if user is logged in before proceeding
      if (userData?.user) {
        const { data, error: budgetError } = await supabase
          .from('budget') // Ensure this matches your table name
          .select('amount')
          .eq('user_id', userData.user.id)
          .single();

        if (budgetError) {
          console.error('Error fetching budget:', budgetError.message);
        } else if (data) {
          setBudget(Number(data.amount)); // Convert amount to number
        } else {
          setBudget(0); // Set to 0 if no budget is found
        }
      } else {
        console.warn('User is not logged in.');
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
    }
  };

  // Fetch user's total expenses
  const fetchExpenses = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      // Check if user is logged in before proceeding
      if (userData?.user) {
        const { data, error: expenseError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', userData.user.id)
          .eq('type', 'expense');

        if (expenseError) {
          console.error('Error fetching expenses:', expenseError.message);
        } else if (data) {
          const total = data.reduce((sum, t) => sum + t.amount, 0);
          setTotalExpenses(total);
        }
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-bold mb-4">Monthly Budget</h2>
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
          <p className="text-lg font-semibold">Remaining</p>
          <p className="text-2xl">₹{remainingBudget.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

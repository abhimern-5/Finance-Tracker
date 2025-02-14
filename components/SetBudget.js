import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SetBudget({ fetchBudget }) {  // Added prop to refetch budget

  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // Check if session is available and user is logged in
      if (sessionError) {
        console.error('Session Error:', sessionError);
        alert('Failed to get session. Please try again.');
        return;
      }
      
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        alert('User is not logged in.');
        return;
      }

      // Insert or update budget in the database
      const { error } = await supabase
        .from('Budget')
        .upsert([{ user_id: userId, amount: parseFloat(amount) }]);

      if (error) {
        alert(error.message);
      } else {
        alert('Budget set successfully!');
        setAmount('');  // Clear input field
        fetchBudget();  // Refetch budget to update state
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Monthly Budget
        </label>
        <input
          type="number"
          placeholder="Enter budget amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-lg"
      >
        Set Budget
      </button>
    </form>
  );
}

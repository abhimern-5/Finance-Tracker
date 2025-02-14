import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SetBudget() {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      // Check if user is logged in
      if (!userData || !userData.user) {
        alert('User is not logged in.');
        return;
      }

      // Safely parse amount
      const budgetAmount = Number(amount);
      if (isNaN(budgetAmount) || budgetAmount <= 0) {
        alert('Please enter a valid budget amount.');
        return;
      }

      // Insert or update budget
      const { error } = await supabase
        .from('budget') // Ensure table name is exactly 'budget' in Supabase
        .upsert([{ user_id: userData.user.id, amount: budgetAmount }]);

      if (error) {
        console.error('Error setting budget:', error.message);
        alert('Error setting budget. Please try again.');
      } else {
        alert('Budget set successfully!');
        setAmount(''); // Clear input after setting budget
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      alert('An unexpected error occurred.');
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

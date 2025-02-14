import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SetBudget() {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      
      // Check if user is logged in
      if (!user || !user.user) {
        alert('User is not logged in.');
        return;
      }

      // Insert or update budget
      const { error } = await supabase
        .from('budget')
        .upsert([{ user_id: user.user.id, amount: parseFloat(amount) }]);

      if (error) {
        alert(error.message);
      } else {
        alert('Budget set successfully!');
        window.location.reload();
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

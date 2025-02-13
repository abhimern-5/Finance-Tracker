import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('Salary');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get user data from Supabase
    const { data: user, error: userError } = await supabase.auth.getUser();

    // Check if user is authenticated and user data is available
    if (user && user.user) {
      const { error } = await supabase.from('transactions').insert([
        {
          user_id: user.user.id,
          amount: parseFloat(amount),
          type,
          category,
          description,
          date: new Date().toISOString(),
        },
      ]);

      if (error) {
        alert('Error adding transaction: ' + error.message);
      } else {
        alert('Transaction added successfully!');
        window.location.href = '/'; // Redirect to home page
      }
    } else {
      alert('User not logged in. Please log in to add transactions.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      {/* Type Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Category Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      >
        Add Transaction
      </button>
    </form>
  );
}

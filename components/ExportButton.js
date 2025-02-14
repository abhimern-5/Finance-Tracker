import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function ExportButton() {
  const router = useRouter();

  const handleExport = async () => {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    // If no user is found, redirect to the login page
    if (!user) {
      alert('You must be logged in to export transactions.');
      router.push('/auth');  // Change this to your login page route
      return;
    }

    // Fetch transactions for the logged-in user
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    // Handle errors
    if (error) {
      console.error('Error fetching transactions:', error.message);
      alert('Failed to fetch transactions.');
      return;
    }

    // Generate CSV if data exists
    if (data) {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        data.map((t) => Object.values(t).join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
    } else {
      alert('No transactions to export.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-500 text-white px-4 py-2 rounded"
    >
      Export to CSV
    </button>
  );
}

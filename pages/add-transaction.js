import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';

export default function AddTransaction() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Add Transaction</h1>

        {/* Transaction Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TransactionForm />
        </div>
      </div>
    </div>
  );
}

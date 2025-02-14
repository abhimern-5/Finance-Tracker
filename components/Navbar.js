import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Reset user state
    router.push('/auth'); // Redirect to auth page
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">Finance Tracker</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <span className="bg-green-500 px-4 py-2 rounded cursor-pointer">Dashboard</span>
          </Link>

          {user ? (
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button>
          ) : (
            <Link href="/auth">
              <span className="bg-green-500 px-4 py-2 rounded cursor-pointer">
                Login / Signup
              </span>
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

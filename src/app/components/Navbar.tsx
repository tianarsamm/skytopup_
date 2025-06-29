'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xxzpmjydzrjvbbifsywo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4enBtanlkenJqdmJiaWZzeXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODgwOTAsImV4cCI6MjA2NTc2NDA5MH0.Q6-I9_rGESfndmeHuJcmSTCFZQVYfru8J148qKJeEsg'
);

const Navbar = ({ isAdmin, setIsAdmin, setPage }: any) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    setIsLoading(false);

    if (data) {
      setIsAdmin(true);
      setShowLoginForm(false);
      setUsername('');
      setPassword('');
      setLoginSuccess(true);
      setTimeout(() => setLoginSuccess(false), 3000);
    } else {
      setLoginError('Username atau Password salah');
    }
  };

  return (
    <>
      <nav className="p-4 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="./Image/logosky.png" alt="Logo" className="h-10 w-auto" />
            <h1 className="font-bold text-[#e7000b] text-2xl ml-2">Sky Game Store</h1>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            <div className="w-6 h-0.5 bg-red-500 mb-1"></div>
            <div className="w-6 h-0.5 bg-red-500 mb-1"></div>
            <div className="w-6 h-0.5 bg-red-500"></div>
          </button>

          <div className="hidden md:flex space-x-4">
            <NavigationLinks
              isAdmin={isAdmin}
              setPage={setPage}
              setShowLoginForm={setShowLoginForm}
              showLoginForm={showLoginForm}
            />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-2">
            <NavigationLinks
              isAdmin={isAdmin}
              setPage={setPage}
              setShowLoginForm={setShowLoginForm}
              showLoginForm={showLoginForm}
            />
          </div>
        )}

        <AnimatePresence>
          {showLoginForm && !isAdmin && (
            <motion.form
              key="login-form"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLogin}
              className="absolute top-16 right-4 bg-black/80 p-4 rounded shadow-lg flex flex-col space-y-3 w-64 z-50"
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 rounded bg-gray-800 text-white"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 rounded bg-gray-800 text-white"
                required
              />
              {loginError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center"
                >
                  {loginError}
                </motion.p>
              )}
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors duration-200"
              >
                Login
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </nav>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      )}

      {/* Success Toast */}
      {loginSuccess && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl text-center max-w-sm w-full mx-4">
            <p className="text-lg font-semibold mb-2">✅ Berhasil login sebagai Admin!</p>
            <button
              onClick={() => setLoginSuccess(false)}
              className="mt-2 bg-white text-green-700 font-semibold py-1 px-4 rounded hover:bg-gray-100 transition"
            >
              OK
            </button>
          </div>
        </motion.div>
      )}

    </>
  );
};

const NavigationLinks = ({ isAdmin, setPage, setShowLoginForm, showLoginForm }: any) => (
  <>
    <button
      onClick={() => setPage('landing')}
      className="border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white px-4 py-2 rounded transition duration-200 backdrop-blur-md w-full md:w-auto"
    >
      Home
    </button>

    {!isAdmin && (
      <button
        onClick={() => setPage('topup')}
        className="border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white px-4 py-2 rounded transition duration-200 backdrop-blur-md w-full md:w-auto"
      >
        Top Up
      </button>
    )}

    {isAdmin ? (
      <>
        <button
          onClick={() => setPage('adminProducts')}
          className="border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white px-4 py-2 rounded transition duration-200 backdrop-blur-md w-full md:w-auto"
        >
          Admin Products
        </button>
        <button
          onClick={() => setPage('adminOrders')}
          className="border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white px-4 py-2 rounded transition duration-200 backdrop-blur-md w-full md:w-auto"
        >
          Admin Orders
        </button>
      </>
    ) : (
      <button
        onClick={() => setShowLoginForm(!showLoginForm)}
        className="border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white px-4 py-2 rounded transition duration-200 backdrop-blur-md w-full md:w-auto"
      >
        Login as Admin
      </button>
    )}
  </>
);

export default Navbar;

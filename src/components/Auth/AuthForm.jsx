import { useState } from 'react';
import { signIn, signUp } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';

export default function AuthForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  async function handleSignIn(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setError('');
    if (!email || !password) { setError('Please enter email and password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const data = await signUp(email, password);
      if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists. Try signing in.');
      } else {
        setInfo('Account created! Check your email for confirmation, or sign in now.');
      }
    } catch (err) {
      setError(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 fade-in relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Learning Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">AI Infrastructure & Cloud Roadmap</p>
        </div>
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 text-sm">{error}</div>
        )}
        {info && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 text-sm">{info}</div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              id="password" type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
            <button type="button" disabled={loading} onClick={handleSignUp}
              className="flex-1 bg-white dark:bg-dark-800 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">Your progress is saved per account.</p>
      </div>
    </div>
  );
}

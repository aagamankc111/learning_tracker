import { useState } from 'react';
import { signIn, signUp } from '../../services/authService';

export default function AuthForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Learning Tracker</h1>
          <p className="text-gray-500 mt-1 text-sm">AI Infrastructure & Cloud Roadmap</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}
        {info && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{info}</div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
            <button type="button" disabled={loading} onClick={handleSignUp}
              className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-400 text-center mt-6">Your progress is saved per account.</p>
      </div>
    </div>
  );
}

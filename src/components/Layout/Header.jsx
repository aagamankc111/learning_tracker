import { signOut } from '../../services/authService';

export default function Header({ email }) {
  async function handleLogout() {
    try { await signOut(); } catch { /* ignore */ }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-indigo-600">Learning Tracker</h1>
          <span className="text-sm text-gray-500 hidden sm:inline">{email}</span>
        </div>
        <button onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

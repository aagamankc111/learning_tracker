import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/week/1', label: 'Phase 1 — Foundations', icon: '🖥️' },
  { to: '/week/2', label: 'Phase 2 — Cloud & DevOps', icon: '☁️' },
  { to: '/week/3', label: 'Phase 3 — K8s & AI', icon: '🤖' },
  { to: '/week/4', label: 'Phase 4 — Portfolio', icon: '🚀' },
  { to: '/week/5', label: 'Phase 5 — K8s & Observability', icon: '🔬' },
  { to: '/week/6', label: 'Phase 6 — ML Fundamentals', icon: '📐' },
  { to: '/week/7', label: 'Phase 7 — MLOps Core', icon: '🏭' },
  { to: '/week/8', label: 'Phase 8 — LLM Infrastructure', icon: '🧠' },
  { to: '/week/9', label: 'Phase 9 — Mega Project', icon: '🏆' },
  { to: '/projects', label: 'Projects', icon: '🏗️' },
  { to: '/daily-review', label: 'Daily Review', icon: '📝' },
  { to: '/practice', label: 'Practice Resources', icon: '🎯' },
  { to: '/quiz', label: 'Quiz Generator', icon: '🧪' },
  { to: '/reviews', label: 'Spaced Repetition', icon: '🔄' },
  { to: '/notes', label: 'Notes & Snippets', icon: '📋' },
  { to: '/motivation', label: 'Motivation & Journey', icon: '💪' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/industry-insights', label: 'Industry Insights', icon: '💼' },
];

import { useTheme } from '../../context/ThemeContext';

export default function Sidebar({ open, onClose }) {
  const { theme, toggleTheme } = useTheme();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-200'
    }`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-5 border-b border-gray-100 dark:border-dark-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Learning Tracker</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">90-Day MLOps Architect</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass} onClick={onClose}>
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-4 border-t border-gray-100 dark:border-dark-700 space-y-3">
          <div className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            <p className="font-medium text-gray-500 dark:text-gray-400 mb-1">Job-Ready in 90 Days</p>
            <p>AI Infrastructure + Cloud + Security</p>
            <p className="mt-1">Target: MLOps / AI Infrastructure Engineer</p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 text-xs text-indigo-700 dark:text-indigo-300">
            <p className="font-medium mb-1">📈 Market Demand</p>
            <p>3:1 demand gap — more jobs than qualified engineers. Salaries: $130K-$220K+.</p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200"
          >
            {theme === 'dark' ? (
              <>
                <span className="text-lg">☀️</span>
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <span className="text-lg">🌙</span>
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

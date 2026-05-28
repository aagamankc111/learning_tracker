import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/week/1', label: 'Week 1 — Foundations', icon: '🖥️' },
  { to: '/week/2', label: 'Week 2 — Cloud & DevOps', icon: '☁️' },
  { to: '/week/3', label: 'Week 3 — K8s & AI', icon: '🤖' },
  { to: '/week/4', label: 'Week 4 — Portfolio', icon: '🚀' },
  { to: '/projects', label: 'Projects', icon: '🏗️' },
  { to: '/daily-review', label: 'Daily Review', icon: '📝' },
  { to: '/industry-insights', label: 'Industry Insights', icon: '📈' },
];

export default function Sidebar({ open, onClose }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Learning Tracker</h2>
              <p className="text-xs text-gray-400">30-Day AI Infrastructure</p>
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

        <div className="p-4 mt-4 border-t border-gray-100 space-y-3">
          <div className="text-xs text-gray-400 leading-relaxed">
            <p className="font-medium text-gray-500 mb-1">Job-Ready in 30 Days</p>
            <p>AI Infrastructure + Cloud + Security</p>
            <p className="mt-1">Target: MLOps / AI Infrastructure Engineer</p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-700">
            <p className="font-medium mb-1">📈 Market Demand</p>
            <p>3:1 demand gap — more jobs than qualified engineers. Salaries: $130K-$220K+.</p>
          </div>
        </div>
      </aside>
    </>
  );
}

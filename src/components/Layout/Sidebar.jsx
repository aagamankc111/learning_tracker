import { NavLink, useLocation } from 'react-router-dom';
import curriculum from '../../data/curriculum';

const primaryNav = [
  { to: '/', label: 'Dashboard', icon: 'grid' },
  { to: '/daily-review', label: 'Daily Review', icon: 'book' },
  { to: '/quiz', label: 'Quiz', icon: 'target' },
  { to: '/journey', label: 'Journey', icon: 'map' },
  { to: '/resources', label: 'Resources', icon: 'link' },
  { to: '/cheatsheet', label: 'Cheatsheet', icon: 'bookmark' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

function Icon({ name, className = '' }) {
  const icons = {
    grid: <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />,
    book: <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 0l6 4m0 0l6-4m-6 4v12" />,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    map: <><path d="M3 3l7.5 2.5L21 3l-7.5 2.5L3 3z" /><path d="M10.5 5.5v15l10.5-4V1l-10.5 4z" /><path d="M3 3v15l7.5 2.5V5.5L3 3z" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />,
    moon: <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
    chevronRight: <path d="M9 18l6-6-6-6" />,
    chevronDown: <path d="M6 9l6 6 6-6" />,
  };

  return (
    <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-accent/10 text-accent shadow-sm'
        : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
    }`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-60
          bg-surface border-r border-white/[0.06]
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
              <span className="text-accent text-xs font-bold">LT</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-100 text-sm">LearnTrack</h2>
              <p className="text-[10px] text-gray-500">Your DevOps Journey</p>
            </div>
          </div>
        </div>

        <nav className="p-2 space-y-0.5">
          <p className="px-3 py-1.5 text-[10px] font-medium text-gray-500 uppercase tracking-widest">Main</p>
          {primaryNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass} onClick={onClose}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <p className="px-3 pt-4 pb-1.5 text-[10px] font-medium text-gray-500 uppercase tracking-widest">Curriculum</p>
          {curriculum.weeks.map((w) => (
            <NavLink
              key={w.id}
              to={`/phase/${w.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith(`/phase/${w.id}`)
                    ? 'bg-accent/10 text-accent shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`
              }
              onClick={onClose}
            >
              <span className="w-5 text-center text-xs">{['🖥️', '☁️', '🤖', '🚀', '🔬', '📐', '🏭', '🧠', '🏆'][w.id - 1]}</span>
              <span className="truncate">Phase {w.id}</span>
              <span className="ml-auto text-[10px] text-gray-500">{w.days.length}d</span>
            </NavLink>
          ))}
        </nav>

      </aside>
    </>
  );
}

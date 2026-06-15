import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AchievementPopup from '../Motivation/AchievementPopup';

const pageTitles = {
  '/': 'Dashboard',
  '/daily-review': 'Daily Review',
  '/quiz': 'Quiz',
  '/journey': 'Journey',
  '/resources': 'Resources',
  '/cheatsheet': 'Cheatsheet',
  '/settings': 'Settings',
};

function Icon({ name }) {
  const icons = {
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    chevronLeft: <path d="M15 19l-7-7 7-7" />,
  };

  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

function isActiveRoute(pathname, pattern) {
  if (pattern === '/') return pathname === '/';
  return pathname.startsWith(pattern);
}

export default function PageLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageInfo = () => {
    const path = location.pathname;

    if (isActiveRoute(path, '/phase/') && path.includes('/topic/')) {
      const parts = path.split('/');
      const phaseNum = parts[2];
      const dayNum = parts[4];
      const topic = decodeURIComponent(parts[6]?.replace(/-/g, ' ') || '');
      return { title: topic, subtitle: `Phase ${phaseNum} · Day ${dayNum}`, backTo: `/phase/${phaseNum}`, backLabel: 'Phase' };
    }

    if (isActiveRoute(path, '/phase/')) {
      const phaseNum = path.split('/')[2];
      return { title: `Phase ${phaseNum}`, subtitle: 'Daily Breakdown', backTo: '/', backLabel: 'Dashboard' };
    }

    const staticPage = Object.entries(pageTitles).find(([p]) => isActiveRoute(path, p));
    if (staticPage) {
      return { title: staticPage[1], subtitle: null, backTo: '/', backLabel: 'Dashboard' };
    }

    return { title: 'LearnTrack', subtitle: null, backTo: '/', backLabel: 'Dashboard' };
  };

  const page = getPageInfo();

  return (
    <div className="h-screen flex bg-surface overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface-alt/80 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-2.5 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-white/[0.06] transition shrink-0"
                title="Menu"
              >
                <Icon name="menu" />
              </button>

              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(page.backTo)}
                  className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-accent hover:bg-accent/10 rounded-lg transition shrink-0"
                >
                  <Icon name="chevronLeft" />
                  {page.backLabel}
                </button>
              )}

              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-gray-100 truncate leading-tight">{page.title}</h1>
                {page.subtitle && (
                  <p className="text-[10px] text-gray-500 truncate">{page.subtitle}</p>
                )}
              </div>
            </div>

            <div /> {/* header right spacer */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full px-4 py-5">
            {children}
          </div>
        </main>
      </div>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AchievementPopup />
      </div>
    </div>
  );
}

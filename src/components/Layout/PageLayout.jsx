import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';

const pageTitles = {
  '/': 'Dashboard',
  '/projects': 'Portfolio Projects',
  '/daily-review': 'Daily Review',
  '/practice': 'Practice Resources',
  '/quiz': 'Quiz Generator',
  '/reviews': 'Spaced Repetition',
  '/notes': 'Notes & Snippets',
  '/motivation': 'Motivation & Journey',
  '/analytics': 'Analytics',
  '/industry-insights': 'Industry Insights',
};

function isActiveRoute(pathname, pattern) {
  if (pattern === '/') return pathname === '/';
  return pathname.startsWith(pattern);
}

export default function PageLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const getPageInfo = () => {
    const path = location.pathname;

    if (isActiveRoute(path, '/week/') && path.includes('/topic/')) {
      const parts = path.split('/');
      const weekNum = parts[2];
      const dayNum = parts[4];
      const topic = decodeURIComponent(parts[6]?.replace(/-/g, ' ') || '');
      return {
        title: topic,
        subtitle: `Phase ${weekNum} · Day ${dayNum}`,
        backTo: `/week/${weekNum}`,
        backLabel: 'Back to Phase',
      };
    }

    if (isActiveRoute(path, '/week/')) {
      const weekNum = path.split('/')[2];
      return {
        title: `Phase ${weekNum}`,
        subtitle: 'Daily Breakdown',
        backTo: '/',
        backLabel: 'Dashboard',
      };
    }

    const staticPage = Object.entries(pageTitles).find(([p]) => isActiveRoute(path, p));
    if (staticPage) {
      return {
        title: staticPage[1],
        subtitle: null,
        backTo: '/',
        backLabel: 'Dashboard',
      };
    }

    return { title: 'Learning Tracker', subtitle: null, backTo: '/', backLabel: 'Dashboard' };
  };

  const page = getPageInfo();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition shrink-0"
                title="Menu"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(page.backTo)}
                  className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  {page.backLabel}
                </button>
              )}

              <div className="min-w-0">
                <h1 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate leading-tight">{page.title}</h1>
                {page.subtitle && (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{page.subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition shrink-0"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => navigate(page.backTo)}
                className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition shrink-0"
                title={page.backLabel}
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-5">
          {children}
        </main>
      </div>
    </div>
  );
}

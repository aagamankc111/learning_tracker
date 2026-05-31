import { useState, useEffect, useCallback } from 'react';

const LEVEL_COLORS = {
  1: 'from-slate-500 to-slate-600',
  2: 'from-stone-500 to-stone-600',
  3: 'from-blue-500 to-blue-600',
  4: 'from-indigo-500 to-indigo-600',
  5: 'from-violet-500 to-violet-600',
  6: 'from-amber-500 to-amber-600',
  7: 'from-orange-500 to-orange-600',
  8: 'from-red-500 to-red-600',
  9: 'from-purple-500 to-purple-600',
};

export default function AchievementPopup({ type, data, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (type === 'achievement') {
    const ach = data;
    return (
      <div
        className={`fixed bottom-6 right-6 z-[100] max-w-sm transition-all duration-400 ${
          visible && !exiting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-800 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5" />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl animate-bounce">{ach.icon || '🏆'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Achievement Unlocked!
                </p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mt-0.5">{ach.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ach.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded text-[10px] font-medium">
                    +{ach.xp_reward || 0} XP
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setExiting(true); setTimeout(onDismiss, 400); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'rank') {
    const rank = data;
    const gradient = LEVEL_COLORS[rank.id] || 'from-indigo-500 to-purple-500';
    return (
      <div
        className={`fixed bottom-6 right-6 z-[100] max-w-sm transition-all duration-400 ${
          visible && !exiting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden">
          <div className={`bg-gradient-to-r ${gradient} h-1.5`} />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{rank.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Rank Up!
                </p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mt-0.5">
                  {rank.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{rank.subtitle}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{rank.description}</p>
              </div>
              <button
                onClick={() => { setExiting(true); setTimeout(onDismiss, 400); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'xp') {
    return (
      <div
        className={`fixed bottom-6 right-6 z-[100] max-w-sm transition-all duration-400 ${
          visible && !exiting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-emerald-200 dark:border-emerald-800 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5" />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">+{data.xp} XP</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{data.reason}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Total: {data.totalXp} XP</p>
              </div>
              <button
                onClick={() => { setExiting(true); setTimeout(onDismiss, 400); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function useNotificationQueue() {
  const [queue, setQueue] = useState([]);

  const addNotification = useCallback((notification) => {
    setQueue(prev => [...prev, { ...notification, id: Date.now() + Math.random() }]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setQueue(prev => prev.filter(n => n.id !== id));
  }, []);

  return { queue, addNotification, dismissNotification };
}

import { useState, useEffect, useCallback } from 'react';

const LEVEL_COLORS = {
  1: 'from-indigo-500 to-indigo-600',
  2: 'from-indigo-500 to-indigo-600',
  3: 'from-indigo-500 to-indigo-600',
  4: 'from-indigo-500 to-indigo-600',
  5: 'from-indigo-500 to-indigo-600',
  6: 'from-indigo-500 to-indigo-600',
  7: 'from-indigo-500 to-indigo-600',
  8: 'from-indigo-500 to-indigo-600',
  9: 'from-indigo-500 to-indigo-600',
};

function Confetti() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    duration: `${0.6 + Math.random() * 0.8}s`,
    color: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 6)],
    size: `${4 + Math.random() * 6}px`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg) scale(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg) scale(1); opacity: 0; }
        }
        @keyframes star-burst {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(2) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-10px',
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration} ${p.delay} ease-out forwards`,
            zIndex: 10,
          }}
        />
      ))}
    </div>
  );
}

export default function AchievementPopup({ type, data, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 400);
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (type === 'achievement') {
    const ach = data;
    return (
      <div
        className={`fixed bottom-6 right-6 z-[100] max-w-sm transition-all duration-500 ${
          visible && !exiting ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'
        }`}
      >
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 rounded-2xl shadow-2xl border-2 border-amber-300 dark:border-amber-700 overflow-hidden">
          <Confetti />
          <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 h-2" />
          <div className="p-5 relative z-20">
            <div className="flex items-start gap-4">
              <div className="relative">
                <span className="text-4xl block animate-bounce">{ach.icon || '🏆'}</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    🎉 Achievement Unlocked!
                  </span>
                </div>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-base mt-1">{ach.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{ach.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 rounded-full text-xs font-bold shadow">
                    ⚡ +{ach.xp_reward || 0} XP
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setExiting(true); setTimeout(onDismiss, 400); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition shrink-0 relative z-30"
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
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1.5" />
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

  if (type === 'streak') {
    const streakCount = data.streak || 0;
    return (
      <div
        className={`fixed bottom-6 right-6 z-[100] max-w-sm transition-all duration-500 ${
          visible && !exiting ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'
        }`}
      >
        <style>{`
          @keyframes streak-glow {
            0%, 100% { filter: drop-shadow(0 0 4px rgba(249, 115, 22, 0.6)); transform: scale(1); }
            50% { filter: drop-shadow(0 0 16px rgba(249, 115, 22, 0.9)); transform: scale(1.1); }
          }
          @keyframes streak-rings {
            0% { transform: scale(0.8); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          @keyframes fire-flicker {
            0%, 100% { transform: translateY(0) scale(1); }
            25% { transform: translateY(-2px) scale(1.05); }
            75% { transform: translateY(1px) scale(0.95); }
          }
        `}</style>
        <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-red-950/40 rounded-2xl shadow-2xl border-2 border-orange-300 dark:border-orange-700 overflow-hidden">
          <Confetti />
          <div className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 h-2 shadow-sm" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-500/5 dark:from-yellow-400/10 dark:to-orange-500/10" />
          <div className="p-5 relative z-20">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="relative" style={{ animation: 'fire-flicker 1.5s ease-in-out infinite' }}>
                  <span className="text-4xl block">🔥</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-orange-400/20"
                  style={{ animation: 'streak-rings 2s ease-out infinite' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-orange-400/10"
                  style={{ animation: 'streak-rings 2s ease-out 0.6s infinite' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-orange-400 to-red-400 text-red-900 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                    🔥 Day Complete!
                  </span>
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400"
                    style={{ animation: 'streak-glow 2s ease-in-out infinite' }}>
                    STREAK
                  </span>
                </div>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-lg mt-1 leading-tight">
                  {streakCount === 1 ? 'First day done!' : `${streakCount}-Day Streak!`}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  You're on fire! Keep the momentum going! 🚀
                </p>
              </div>
              <button
                onClick={() => { setExiting(true); setTimeout(onDismiss, 400); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition shrink-0 relative z-30"
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

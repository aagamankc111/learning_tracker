import { useGamification } from '../../hooks/useGamification';

export default function DailyTracker({ userId, completed, total }) {
  const { stats, level, levelProgress, earnedAchievementIds, allAchievements, loading } = useGamification();

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs text-indigo-200 font-medium uppercase tracking-wide">Daily Overview</span>
          <h2 className="text-lg font-bold">{todayStr}</h2>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
          <span className="text-lg">⭐</span>
          <span className="font-bold">Lv.{level}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{total > 0 ? Math.round((completed / total) * 100) : 0}%</div>
          <div className="text-xs text-indigo-200 mt-0.5">Overall Progress</div>
          <div className="mt-1.5 bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-full rounded-full transition-all" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{stats?.current_streak || 0}</div>
          <div className="text-xs text-indigo-200 mt-0.5">Day Streak</div>
          {stats?.current_streak > 0 && (
            <div className="text-xs text-amber-300 mt-0.5">
              🔥 {stats.current_streak} day{(stats.current_streak || 0) !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{stats?.total_xp || 0}</div>
          <div className="text-xs text-indigo-200 mt-0.5">Total XP</div>
          <div className="mt-1.5 bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{earnedAchievementIds.size}/{allAchievements.length}</div>
          <div className="text-xs text-indigo-200 mt-0.5">Achievements</div>
          <div className="text-xs text-emerald-300 mt-0.5">
            {earnedAchievementIds.size > 0 ? '🏆 ' + earnedAchievementIds.size + ' earned' : 'Start learning!'}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useGamification } from '../../hooks/useGamification';
import { useDailyMotivation } from '../../hooks/useDailyMotivation';
import { useRank } from '../../hooks/useRank';
import { getRankForXp, getRankProgress, getNextRank } from '../../data/ranks';

export default function MiniMotivationBar({ compact = false }) {
  const { stats, level, earnedAchievementIds, allAchievements } = useGamification();
  const { streakMessage } = useDailyMotivation();
  const { rank } = useRank();

  const currentRank = rank || getRankForXp(stats?.total_xp || 0);
  const nextRank = getNextRank(currentRank);
  const progress = getRankProgress(stats?.total_xp || 0, currentRank);

  const nextAchievement = allAchievements
    .filter(a => !earnedAchievementIds.has(a.id))
    .sort((a, b) => {
      const aC = a.criteria?.count || 999;
      const bC = b.criteria?.count || 999;
      return aC - bC;
    })[0];

  return (
    <div className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl text-white shadow-lg ${compact ? 'p-3' : 'p-4'}`}>
      {compact ? (
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="text-sm">{currentRank.icon}</span>
            <span className="font-medium hidden sm:inline">{currentRank.title}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-300 font-bold">Lv.{level}</span>
            <span className="text-white/60">·</span>
            <span className="text-emerald-300">{stats?.current_streak || 0}🔥</span>
          </span>
          <span className="text-white/70 truncate flex-1 text-center hidden sm:block">
            {streakMessage?.split('.')[0]}
          </span>
          {nextRank && (
            <span className="text-white/50 shrink-0 hidden md:inline">
              {progress}% → {nextRank.icon}
            </span>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentRank.icon}</span>
              <div>
                <span className="font-bold text-sm">{currentRank.title}</span>
                <span className="text-white/60 text-xs ml-1">· Lv.{level}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="text-amber-300 font-bold">{stats?.total_xp || 0}</span>
                <span className="text-white/60">XP</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-300 font-bold">{stats?.current_streak || 0}</span>
                <span className="text-white/60">day streak</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-indigo-200 font-bold">{earnedAchievementIds.size}</span>
                <span className="text-white/60">achievements</span>
              </span>
            </div>
          </div>

          {streakMessage && (
            <p className="text-xs text-white/80 italic">{streakMessage}</p>
          )}

          {nextRank && (
            <div>
              <div className="flex items-center justify-between text-[10px] text-white/60 mb-1">
                <span>Progress to {nextRank.icon} {nextRank.title}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {nextAchievement && (
            <div className="flex items-center gap-2 text-xs text-white/70 bg-white/10 rounded-lg p-2">
              <span>🏆 Next: {nextAchievement.icon} {nextAchievement.name}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/40">+{nextAchievement.xp_reward} XP</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

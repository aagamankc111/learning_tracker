import { useGamification } from '../../hooks/useGamification';
import { useRank } from '../../hooks/useRank';
import { getRankForXp, getRankProgress } from '../../data/ranks';
import RankBadge from './RankBadge';

export default function GodTierDashboard() {
  const { stats, level, levelProgress, earnedAchievementIds, allAchievements, totalXp } = useGamification();
  const { rank, nextRank, rankProgress, milestoneMessage } = useRank();

  const currentRank = rank || getRankForXp(stats?.total_xp || 0);
  const progress = getRankProgress(stats?.total_xp || 0, currentRank);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-indigo-500/10 rounded-bl-full" />

      <div className="relative">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-0.5 bg-indigo-500/20 rounded-full text-xs text-indigo-300 font-medium">
                Rank Progression
              </span>
              <span className="inline-block px-2 py-0.5 bg-indigo-500/20 rounded-full text-xs text-indigo-300 font-medium">
                Level {level}
              </span>
            </div>
            <RankBadge rank={currentRank} rankProgress={progress} nextRank={nextRank} size="lg" />
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-gray-100">
              {stats?.total_xp || 0}
            </div>
            <div className="text-xs text-gray-400">Total XP</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats?.total_items_completed || 0} items · {earnedAchievementIds.size} achievements
            </div>
          </div>
        </div>

        {nextRank && (
          <div className="mt-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Progress to {nextRank.icon} {nextRank.title}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">{milestoneMessage?.message}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-indigo-400">{stats?.current_streak || 0}</div>
            <div className="text-[10px] text-gray-400">Day Streak</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-gray-300">{level}</div>
            <div className="text-[10px] text-gray-400">Level</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-gray-300">{earnedAchievementIds.size}</div>
            <div className="text-[10px] text-gray-400">Achievements</div>
          </div>
        </div>
      </div>
    </div>
  );
}

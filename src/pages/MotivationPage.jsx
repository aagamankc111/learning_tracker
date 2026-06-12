import { useState } from 'react';
import { useGamification } from '../hooks/useGamification';
import { useRank } from '../hooks/useRank';
import { useJourney } from '../hooks/useJourney';
import { useMetrics } from '../hooks/useMetrics';
import { useDailyMotivation } from '../hooks/useDailyMotivation';
import { getRankForXp, getRankProgress, RANK_TIERS, getRankMilestoneMessage } from '../data/ranks';
import RankBadge from '../components/Motivation/RankBadge';
import JourneyGraph from '../components/Motivation/JourneyGraph';
import MasteryHeatmap from '../components/Motivation/MasteryHeatmap';
import MetricsCard from '../components/Motivation/MetricsCard';
import { Link } from 'react-router-dom';
import FadeIn from '../components/common/FadeIn';

const COLOR_MAP = {
  slate: 'from-slate-500 to-slate-600', stone: 'from-stone-500 to-stone-600',
  blue: 'from-blue-500 to-blue-600', indigo: 'from-indigo-500 to-indigo-600',
  violet: 'from-violet-500 to-violet-600', amber: 'from-amber-500 to-amber-600',
  orange: 'from-orange-500 to-orange-600', red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
};

export default function MotivationPage() {
  const { stats, level, levelProgress, totalXp, earnedAchievementIds, allAchievements, userAchievements } = useGamification();
  const { rank, nextRank, rankHistory, milestoneMessage } = useRank();
  const { todaysQuote, aagamanMessage, streakMessage } = useDailyMotivation();
  const { journeyProgress } = useJourney();
  const { masteryScore, consistencyScore } = useMetrics();
  const [activeTab, setActiveTab] = useState('overview');

  const currentRank = rank || getRankForXp(stats?.total_xp || 0);
  const progress = getRankProgress(stats?.total_xp || 0, currentRank);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'ranks', label: 'Rank Progression', icon: '🏆' },
    { id: 'journey', label: 'Journey Map', icon: '🗺️' },
    { id: 'achievements', label: 'Achievements', icon: '🎖️' },
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">💪 Motivation System</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Journey to God Tier</h1>
          <p className="text-indigo-100 mt-1 text-sm max-w-2xl">
            Track your rank progression, journey milestones, and data-centric metrics.
            Every checkbox, every quiz, every review moves you closer to becoming a God Tier MLOps Architect.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">9 Ranks · Novice → God Tier</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">90-Day Journey</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Data-Driven Progress</span>
          </div>
        </div>
      </FadeIn>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700 dark:border-dark-600 bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Motivation Banner */}
          <FadeIn delay={50}>
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="bg-white/20 rounded-xl p-3 text-center min-w-[80px]">
                  <div className="text-2xl">💪</div>
                  <div className="text-[10px] text-white/70 mt-1">Aagaman</div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-white/80 italic leading-relaxed">
                    "{todaysQuote?.quote}"
                  </p>
                  <p className="text-xs text-white/50 mt-1">— {todaysQuote?.author}</p>
                  <div className="mt-3 bg-white/10 rounded-lg p-3">
                    <p className="text-sm font-medium">{aagamanMessage}</p>
                  </div>
                  {streakMessage && (
                    <div className="mt-2 bg-amber-500/20 rounded-lg px-3 py-1.5 text-xs text-amber-200">
                      {streakMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Current Rank + Stats */}
          <FadeIn delay={100}>
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <RankBadge rank={currentRank} rankProgress={progress} nextRank={nextRank} size="lg" />
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-indigo-400">{stats?.current_streak || 0}</div>
                    <div className="text-xs text-gray-400">Day Streak</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-300">{consistencyScore}%</div>
                    <div className="text-xs text-gray-400">Consistency</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-300">{masteryScore}%</div>
                    <div className="text-xs text-gray-400">Mastery</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-300">{journeyProgress}%</div>
                    <div className="text-xs text-gray-400">Journey</div>
                  </div>
                </div>
              </div>

              {nextRank && (
                <div className="mt-4 bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Next Rank: {nextRank.icon} {nextRank.title} ({nextRank.xpRequired.toLocaleString()} XP needed)</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{milestoneMessage?.message}</p>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Metrics */}
          <FadeIn delay={150}>
            <MetricsCard />
          </FadeIn>

          {/* Heatmap */}
          <FadeIn delay={200}>
            <MasteryHeatmap />
          </FadeIn>

          {/* Journey Progress */}
          <FadeIn delay={250}>
            <JourneyGraph />
          </FadeIn>
        </div>
      )}

      {/* Ranks Tab */}
      {activeTab === 'ranks' && (
        <FadeIn delay={50}>
          <div className="dark:bg-dark-800 dark:border-dark-700 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="dark:text-gray-100 text-xl font-bold text-gray-800 mb-2">🏆 Rank Progression System</h2>
            <p className="dark:text-gray-400 text-sm text-gray-500 mb-6">
              9 ranks from Novice to God Tier MLOps Architect. Earn XP by completing items, quizzes, reviews, and maintaining streaks.
            </p>
            <div className="space-y-4">
              {RANK_TIERS.map((tier, i) => {
                const isUnlocked = (stats?.total_xp || 0) >= tier.xpRequired;
                const isCurrent = currentRank.id === tier.id;
                const colors = COLOR_MAP[tier.color] || 'from-gray-500 to-gray-600';
                const milestoneMsg = getRankMilestoneMessage(tier.id);

                return (
                  <div
                    key={tier.id}
                    className={`rounded-xl border-2 transition-all p-5 ${
                      isCurrent
                        ? 'dark:bg-indigo-900/30 border-indigo-400 bg-indigo-50 shadow-md'
                        : isUnlocked
                        ? 'dark:border-dark-600 dark:bg-dark-700/50 border-gray-300 bg-gray-50'
                        : 'dark:border-dark-700 dark:bg-dark-700/50 border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>{tier.icon}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="dark:text-gray-100 font-bold text-gray-800 text-lg">{tier.title}</h3>
                            {isCurrent && (
                              <span className="px-2 py-0.5 dark:bg-indigo-900/40 dark:text-indigo-300 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                CURRENT
                              </span>
                            )}
                            {isUnlocked && !isCurrent && (
                              <span className="px-2 py-0.5 dark:bg-emerald-900/40 dark:text-emerald-300 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                UNLOCKED
                              </span>
                            )}
                          </div>
                          <p className="dark:text-gray-400 text-sm text-gray-500">{tier.subtitle}</p>
                          <p className="dark:text-gray-500 text-xs text-gray-400 mt-1">{tier.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="dark:text-gray-400 text-xs text-gray-500">
                              Requires: <strong>{tier.xpRequired.toLocaleString()} XP</strong>
                            </span>
                            <span className="dark:text-gray-400 text-xs text-gray-500">
                              Level: <strong>{tier.minLevel}+</strong>
                            </span>
                          </div>
                          {milestoneMsg && (
                            <div className="mt-2 dark:text-gray-400 text-xs text-gray-500 italic">
                              "{milestoneMsg.message}"
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {isUnlocked && (
                          <span className="text-2xl">✅</span>
                        )}
                        {!isUnlocked && (
                          <span className="dark:text-gray-500 text-2xl text-gray-300">🔒</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Journey Tab */}
      {activeTab === 'journey' && (
        <FadeIn delay={50}>
          <JourneyGraph compact={false} />
          <div className="mt-6">
            <MasteryHeatmap compact={false} />
          </div>
        </FadeIn>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <FadeIn delay={50}>
          <div className="dark:bg-dark-800 dark:border-dark-700 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="dark:text-gray-100 text-xl font-bold text-gray-800">🎖️ Achievements</h2>
              <span className="dark:text-gray-500 text-sm text-gray-400">{earnedAchievementIds.size} / {allAchievements.length} earned</span>
            </div>

            {allAchievements.length === 0 ? (
              <p className="dark:text-gray-500 text-sm text-gray-400">No achievements defined yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {allAchievements.map((ach) => {
                  const earned = earnedAchievementIds.has(ach.id);
                  const ua = userAchievements.find(u => u.achievement_id === ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={`rounded-xl border p-4 transition-all ${
                      earned
                        ? 'dark:border-amber-800 dark:bg-amber-900/20 border-amber-200 bg-amber-50 shadow-sm'
                        : 'dark:border-dark-700 dark:bg-dark-700/50 border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-2xl ${earned ? '' : 'grayscale'}`}>{ach.icon || '🏆'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="dark:text-gray-100 font-semibold text-gray-800 text-sm">{ach.name}</h3>
                            {earned && <span className="dark:text-emerald-400 text-xs text-emerald-600">✅</span>}
                          </div>
                          <p className="dark:text-gray-400 text-xs text-gray-500 mt-0.5">{ach.description}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-xs">
                            <span className="dark:text-amber-400 text-amber-600 font-medium">+{ach.xp_reward} XP</span>
                            {ua && (
                              <span className="dark:text-gray-500 text-gray-400">
                                · Earned {new Date(ua.earned_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* Quick Links */}
      <FadeIn delay={300}>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">🎯 Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <Link to="/week/1" className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition">
              <span className="font-bold text-indigo-300">📚 Continue Learning</span>
              <p className="text-gray-300 text-xs mt-1">Back to the daily curriculum</p>
            </Link>
            <Link to="/quiz" className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition">
              <span className="font-bold text-indigo-300">🧪 Take a Quiz</span>
              <p className="text-gray-300 text-xs mt-1">Test your knowledge for XP</p>
            </Link>
            <Link to="/reviews" className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition">
              <span className="font-bold text-indigo-300">🔄 Review Sessions</span>
              <p className="text-gray-300 text-xs mt-1">Spaced repetition for retention</p>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

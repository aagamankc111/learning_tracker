import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../hooks/useGamification';
import { useProgress } from '../hooks/useProgress';
import { useTopics } from '../hooks/useTopics';
import { useMetrics } from '../hooks/useMetrics';
import { useRank } from '../hooks/useRank';
import { useJourney } from '../hooks/useJourney';
import { fetchWeeklyLogs } from '../services/dailyTrackingService';
import FadeIn from '../components/common/FadeIn';
import MetricsCard from '../components/Motivation/MetricsCard';
import MasteryHeatmap from '../components/Motivation/MasteryHeatmap';
import JourneyGraph from '../components/Motivation/JourneyGraph';
import RankBadge from '../components/Motivation/RankBadge';
import { getRankForXp, getRankProgress } from '../data/ranks';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { stats, level, levelProgress, earnedAchievementIds, allAchievements, userAchievements, loading: gameloading } = useGamification();
  const { topics } = useTopics();
  const { loadProgress, getOverallProgress, getTopicProgress } = useProgress(user?.id);
  const { masteryScore, consistencyScore } = useMetrics();
  const { rank, nextRank } = useRank();
  const { journeyProgress } = useJourney();
  const [weeklyData, setWeeklyData] = useState([]);
  const [topicStats, setTopicStats] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) loadProgress();
  }, [user, loadProgress]);

  useEffect(() => {
    if (!user) return;
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 13);
    fetchWeeklyLogs(user.id, start.toISOString().split('T')[0], end.toISOString().split('T')[0])
      .then(setWeeklyData)
      .catch(() => setWeeklyData([]));
  }, [user]);

  useEffect(() => {
    if (!topics.length) return;
    const stats = topics.map((t) => {
      const subs = t.subtopics || [];
      const { completed, total, percent } = getTopicProgress(subs);
      return { name: t.name, completed, total, percent };
    });
    setTopicStats(stats);
  }, [topics, getTopicProgress]);

  const weekDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = weeklyData.find((w) => w.log_date === dateStr);
    return {
      day: DAYS[d.getDay()],
      date: d.getDate(),
      fullDate: dateStr,
      xp: log?.xp_earned || 0,
      items: log?.items_completed || 0,
      active: !!log,
    };
  });

  const maxXp = Math.max(...weekDays.map((d) => d.xp), 1);

  const totalItems = topics.reduce((s, t) => s + (t.subtopics?.length || 0), 0);
  const allSubtopics = topics.flatMap((t) => t.subtopics || []);
  const { completed, percent } = getOverallProgress(allSubtopics);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Insights</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Progress Analytics</h1>
          <p className="text-emerald-100 mt-1 text-sm">Track your learning trends, streaks, and topic mastery.</p>
        </div>
      </FadeIn>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'metrics', label: 'Data Metrics', icon: '📈' },
          { id: 'heatmap', label: 'Activity Heatmap', icon: '📅' },
          { id: 'journey', label: 'Journey Map', icon: '🗺️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700 dark:border-dark-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
      <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FadeIn delay={50}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 dark:bg-dark-800 dark:border-dark-700">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{level}</div>
            <div className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">Current Level</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2 dark:bg-dark-600">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${levelProgress}%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1 dark:text-gray-500">{stats?.total_xp || 0} total XP</div>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 dark:bg-dark-800 dark:border-dark-700">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats?.current_streak || 0}</div>
            <div className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">Day Streak</div>
            <div className="text-xs text-gray-400 mt-2 dark:text-gray-500">Best: {stats?.longest_streak || 0} days</div>
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 dark:bg-dark-800 dark:border-dark-700">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completed}/{totalItems}</div>
            <div className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">Items Completed</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2 dark:bg-dark-600">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 dark:bg-dark-800 dark:border-dark-700">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{earnedAchievementIds.size}</div>
            <div className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">Achievements Earned</div>
            <div className="text-xs text-gray-400 mt-2 dark:text-gray-500">Out of {allAchievements.length}</div>
          </div>
        </FadeIn>
      </div>

      {/* Weekly Activity Chart */}
      <FadeIn delay={250}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-dark-800 dark:border-dark-700">
          <h2 className="text-lg font-bold text-gray-800 mb-4 dark:text-gray-100">📊 Daily Activity (Last 14 Days)</h2>
          <div className="flex items-end gap-1.5 h-32">
            {weekDays.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="text-[10px] text-gray-400 mb-1 dark:text-gray-500">{d.xp > 0 ? d.xp : ''}</div>
                <div
                  className={`w-full rounded-t transition-all duration-500 ${d.active ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-100 dark:bg-dark-700'}`}
                  style={{ height: `${(d.xp / maxXp) * 100}%`, minHeight: d.active ? '4px' : '2px' }}
                  title={`${d.fullDate}: ${d.xp} XP, ${d.items} items`}
                />
                <div className={`text-[10px] mt-1 ${d.active ? 'text-gray-500 font-medium dark:text-gray-400' : 'text-gray-300'}`}>
                  {d.day}
                </div>
                <div className={`text-[9px] ${d.active ? 'text-gray-400 dark:text-gray-500' : 'text-gray-200'}`}>{d.date}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Topic Mastery */}
      <FadeIn delay={300}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-dark-800 dark:border-dark-700">
          <h2 className="text-lg font-bold text-gray-800 mb-4 dark:text-gray-100">📚 Topic Mastery</h2>
          <div className="space-y-3">
            {topicStats.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{t.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{t.completed}/{t.total} ({t.percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-dark-600">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${t.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Recent Achievements */}
      <FadeIn delay={350}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-dark-800 dark:border-dark-700">
          <h2 className="text-lg font-bold text-gray-800 mb-4 dark:text-gray-100">🏆 Recent Achievements</h2>
          {userAchievements.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No achievements yet. Keep learning to earn your first one!</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {userAchievements.slice(0, 6).map((ua) => (
                <div key={ua.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800">
                  <span className="text-2xl">{ua.achievement?.icon || '🏆'}</span>
                  <div>
                    <div className="font-medium text-sm text-gray-800 dark:text-gray-100">{ua.achievement?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{ua.achievement?.description}</div>
                    <div className="text-xs text-amber-600 mt-0.5 dark:text-amber-400">+{ua.achievement?.xp_reward || 0} XP</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Rank Badge */}
      <FadeIn delay={400}>
        <div className="flex justify-center">
          <RankBadge
            rank={rank || getRankForXp(stats?.total_xp || 0)}
            rankProgress={getRankProgress(stats?.total_xp || 0, rank || getRankForXp(0))}
            nextRank={nextRank}
            size="lg"
          />
        </div>
      </FadeIn>

      </>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <FadeIn delay={50}>
            <MetricsCard compact={false} />
          </FadeIn>
          <FadeIn delay={100}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-dark-800 dark:border-dark-700">
              <h2 className="text-lg font-bold text-gray-800 mb-4 dark:text-gray-100">📚 Topic Mastery</h2>
              <div className="space-y-3">
                {topicStats.map((t) => (
                  <div key={t.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-200">{t.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{t.completed}/{t.total} ({t.percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-dark-600">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${t.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">{masteryScore}%</div>
                  <div className="text-xs text-indigo-200 mt-1">Mastery Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{consistencyScore}%</div>
                  <div className="text-xs text-indigo-200 mt-1">Consistency Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{journeyProgress}%</div>
                  <div className="text-xs text-indigo-200 mt-1">Journey Progress</div>
                </div>
              </div>
              <p className="text-xs text-indigo-200 text-center mt-4">
                Data-driven metrics help you understand not just WHAT you're learning, but HOW EFFECTIVELY.
                Track your mastery, consistency, and overall journey progress.
              </p>
            </div>
          </FadeIn>
        </div>
      )}

      {activeTab === 'heatmap' && (
        <FadeIn delay={50}>
          <MasteryHeatmap compact={false} />
        </FadeIn>
      )}

      {activeTab === 'journey' && (
        <FadeIn delay={50}>
          <JourneyGraph compact={false} />
        </FadeIn>
      )}
    </div>
  );
}

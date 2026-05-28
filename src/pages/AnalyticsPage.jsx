import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../hooks/useGamification';
import { useProgress } from '../hooks/useProgress';
import { useTopics } from '../hooks/useTopics';
import { fetchWeeklyLogs } from '../services/dailyTrackingService';
import FadeIn from '../components/common/FadeIn';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { stats, level, levelProgress, earnedAchievementIds, allAchievements, userAchievements, loading: gameloading } = useGamification();
  const { topics } = useTopics();
  const { loadProgress, getOverallProgress, getTopicProgress } = useProgress(user?.id);
  const [weeklyData, setWeeklyData] = useState([]);
  const [topicStats, setTopicStats] = useState([]);

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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FadeIn delay={50}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="text-2xl font-bold text-indigo-600">{level}</div>
            <div className="text-xs text-gray-500 mt-0.5">Current Level</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${levelProgress}%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">{stats?.total_xp || 0} total XP</div>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="text-2xl font-bold text-amber-600">{stats?.current_streak || 0}</div>
            <div className="text-xs text-gray-500 mt-0.5">Day Streak</div>
            <div className="text-xs text-gray-400 mt-2">Best: {stats?.longest_streak || 0} days</div>
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="text-2xl font-bold text-emerald-600">{completed}/{totalItems}</div>
            <div className="text-xs text-gray-500 mt-0.5">Items Completed</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="text-2xl font-bold text-violet-600">{earnedAchievementIds.size}</div>
            <div className="text-xs text-gray-500 mt-0.5">Achievements Earned</div>
            <div className="text-xs text-gray-400 mt-2">Out of {allAchievements.length}</div>
          </div>
        </FadeIn>
      </div>

      {/* Weekly Activity Chart */}
      <FadeIn delay={250}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Daily Activity (Last 14 Days)</h2>
          <div className="flex items-end gap-1.5 h-32">
            {weekDays.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="text-[10px] text-gray-400 mb-1">{d.xp > 0 ? d.xp : ''}</div>
                <div
                  className={`w-full rounded-t transition-all duration-500 ${d.active ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-100'}`}
                  style={{ height: `${(d.xp / maxXp) * 100}%`, minHeight: d.active ? '4px' : '2px' }}
                  title={`${d.fullDate}: ${d.xp} XP, ${d.items} items`}
                />
                <div className={`text-[10px] mt-1 ${d.active ? 'text-gray-500 font-medium' : 'text-gray-300'}`}>
                  {d.day}
                </div>
                <div className={`text-[9px] ${d.active ? 'text-gray-400' : 'text-gray-200'}`}>{d.date}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Topic Mastery */}
      <FadeIn delay={300}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📚 Topic Mastery</h2>
          <div className="space-y-3">
            {topicStats.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{t.name}</span>
                  <span className="text-xs text-gray-400">{t.completed}/{t.total} ({t.percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 Recent Achievements</h2>
          {userAchievements.length === 0 ? (
            <p className="text-sm text-gray-400">No achievements yet. Keep learning to earn your first one!</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {userAchievements.slice(0, 6).map((ua) => (
                <div key={ua.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-2xl">{ua.achievement?.icon || '🏆'}</span>
                  <div>
                    <div className="font-medium text-sm text-gray-800">{ua.achievement?.name}</div>
                    <div className="text-xs text-gray-500">{ua.achievement?.description}</div>
                    <div className="text-xs text-amber-600 mt-0.5">+{ua.achievement?.xp_reward || 0} XP</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

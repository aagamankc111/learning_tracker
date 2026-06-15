import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { useDailyMotivation } from '../hooks/useDailyMotivation';
import curriculum from '../data/curriculum';

function StreakBadge({ days }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
      <span className="text-sm">🔥</span>
      <span className="text-xs font-medium text-accent">{days} day streak</span>
    </div>
  );
}

function StatCard({ label, value, sublabel }) {
  return (
    <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4">
      <div className="text-lg font-bold text-gray-100">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      {sublabel && <div className="text-[10px] text-gray-600 mt-0.5">{sublabel}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { progressMap, getOverallProgress, loading } = useProgress(user?.id);
  const { todaysQuote, aagamanMessage, streakMessage } = useDailyMotivation();

  const allSubtopics = useMemo(() => {
    const items = [];
    for (const week of curriculum.weeks) {
      for (const day of week.days) {
        for (const topic of day.topics) {
          items.push({ id: `${week.id}-${day.day}-${topic}`, title: topic, phase: week.id, day: day.day });
        }
      }
    }
    return items;
  }, []);

  const overall = useMemo(() => getOverallProgress(allSubtopics), [allSubtopics, getOverallProgress]);
  const firstIncomplete = useMemo(() => allSubtopics.find((s) => !progressMap[s.id]), [allSubtopics, progressMap]);
  const completedCount = useMemo(() => allSubtopics.filter((s) => progressMap[s.id]).length, [allSubtopics, progressMap]);

  const currentPhase = useMemo(() => {
    const idx = allSubtopics.findIndex((s) => !progressMap[s.id]);
    if (idx === -1) return null;
    return curriculum.weeks.find((w) => w.id === allSubtopics[idx].phase);
  }, [allSubtopics, progressMap]);

  const phaseProgress = useMemo(() => {
    return curriculum.weeks.map((w) => {
      const phaseTopics = allSubtopics.filter((s) => s.phase === w.id);
      const done = phaseTopics.filter((s) => progressMap[s.id]).length;
      return { ...w, done, total: phaseTopics.length, pct: phaseTopics.length > 0 ? Math.round((done / phaseTopics.length) * 100) : 0 };
    });
  }, [allSubtopics, progressMap]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}</h2>
          <p className="text-xs text-gray-500 mt-0.5">Here's your learning overview</p>
        </div>
        <StreakBadge days={7} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Topics Completed" value={completedCount} sublabel={`of ${allSubtopics.length}`} />
        <StatCard label="Overall Progress" value={`${overall.percent}%`} sublabel={`${overall.completed}/${overall.total}`} />
        <StatCard label="Current Phase" value={currentPhase ? `Phase ${currentPhase.id}` : 'Complete!'} sublabel={currentPhase?.title || ''} />
        <StatCard label="Quizzes Taken" value="0" sublabel="Start a quiz →" />
      </div>

      {/* Today's Motivation */}
      <div className="bg-gradient-to-r from-accent-dim/10 to-accent/5 border border-accent/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-accent/15 rounded-lg p-2 text-center min-w-[56px]">
            <div className="text-xl">💪</div>
            <div className="text-[9px] text-accent/70 mt-0.5">Aagaman</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">Today's Motivation</p>
            <p className="text-sm text-gray-100 italic leading-relaxed">
              &ldquo;{todaysQuote?.quote || 'Stay consistent. Every step counts.'}&rdquo;
            </p>
            <p className="text-xs text-gray-500 mt-0.5">&mdash; {todaysQuote?.author || 'You'}</p>
            {aagamanMessage && (
              <div className="mt-2 bg-accent/10 rounded-lg px-3 py-1.5">
                <p className="text-xs text-gray-300">{aagamanMessage}</p>
              </div>
            )}
            {streakMessage && (
              <div className="mt-1.5 text-xs text-accent/80">{streakMessage}</div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Overall Progress</span>
          <span className="text-xs text-accent font-mono">{overall.percent}%</span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${overall.percent}%` }} />
        </div>
      </div>

      {/* Phase progress */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Phase Progress</h3>
        <div className="grid gap-2">
          {phaseProgress.map((p) => (
            <Link key={p.id} to={`/phase/${p.id}`} className="group">
              <div className="bg-surface-card border border-white/[0.06] rounded-xl p-3 hover:border-accent/30 hover:bg-white/[0.02] transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{['🖥️', '☁️', '🤖', '🚀', '🔬', '📐', '🏭', '🧠', '🏆'][p.id - 1]}</span>
                    <span className="text-sm font-medium text-gray-200 group-hover:text-accent transition-colors">Phase {p.id}</span>
                    <span className="text-xs text-gray-500">{p.title}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{p.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-accent/60 rounded-full transition-all" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Continue learning */}
      {firstIncomplete && (
        <div className="bg-gradient-to-r from-accent-dim/20 to-accent/5 border border-accent/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-accent font-medium uppercase tracking-wider">Continue Learning</p>
              <p className="text-sm font-medium text-gray-100 mt-0.5">{firstIncomplete.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">Phase {firstIncomplete.phase} · Day {firstIncomplete.day}</p>
            </div>
            <Link
              to={`/phase/${firstIncomplete.phase}`}
              className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dim transition shadow-lg shadow-accent/20"
            >
              Resume →
            </Link>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="flex gap-2">
        <Link to="/quiz" className="flex-1 bg-surface-card border border-white/[0.06] rounded-xl p-3 text-center hover:border-accent/30 transition-all group">
          <span className="text-lg block mb-1">🎯</span>
          <span className="text-xs font-medium text-gray-400 group-hover:text-accent transition-colors">Practice Quiz</span>
        </Link>
        <Link to="/daily-review" className="flex-1 bg-surface-card border border-white/[0.06] rounded-xl p-3 text-center hover:border-accent/30 transition-all group">
          <span className="text-lg block mb-1">📝</span>
          <span className="text-xs font-medium text-gray-400 group-hover:text-accent transition-colors">Daily Review</span>
        </Link>
        <Link to="/journey" className="flex-1 bg-surface-card border border-white/[0.06] rounded-xl p-3 text-center hover:border-accent/30 transition-all group">
          <span className="text-lg block mb-1">🗺️</span>
          <span className="text-xs font-medium text-gray-400 group-hover:text-accent transition-colors">Your Journey</span>
        </Link>
      </div>
    </div>
  );
}

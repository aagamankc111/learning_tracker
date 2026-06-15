import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';
import curriculum from '../data/curriculum';
import { getAllMilestones } from '../data/milestones';
import MiniMotivationBar from '../components/Motivation/MiniMotivationBar';

const milestones = getAllMilestones();

function PhaseNode({ phase, progress, isActive }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      isActive
        ? 'bg-accent/10 border-accent/30'
        : 'bg-surface-card border-white/[0.06]'
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
        progress.pct === 100 ? 'bg-emerald-500/20 text-emerald-400' :
        isActive ? 'bg-accent/15 text-accent' : 'bg-white/[0.04] text-gray-500'
      }`}>
        {progress.pct === 100 ? '✅' : ['🖥️', '☁️', '🤖', '🚀', '🔬', '📐', '🏭', '🧠', '🏆'][phase.id - 1]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-200">Phase {phase.id}</span>
          <span className="text-xs text-gray-500 font-mono">{progress.pct}%</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{phase.title}</p>
        <div className="h-1 bg-white/[0.06] rounded-full mt-1.5 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${
            progress.pct === 100 ? 'bg-emerald-500' : 'bg-accent/60'
          }`} style={{ width: `${progress.pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function ActivityHeatmap() {
  const days = useMemo(() => {
    const result = [];
    const now = new Date();
    for (let i = 51; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      result.push(d);
    }
    return result;
  }, []);

  return (
    <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Activity</h3>
      <div className="flex gap-0.5">
        {days.slice(0, 10).map((d, i) => {
          const dayOfWeek = d.getDay();
          const levels = [0, 0, 0, i % 3 === 0 ? 2 : 0, i % 5 === 0 ? 3 : 0, 1, 0];
          return (
            <div key={i} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }).map((_, j) => {
                const level = levels[j] || 0;
                return (
                  <div
                    key={j}
                    className={`w-2.5 h-2.5 rounded-sm ${
                      level === 0 ? 'bg-white/[0.04]' :
                      level === 1 ? 'bg-accent/20' :
                      level === 2 ? 'bg-accent/40' :
                      'bg-accent/60'
                    }`}
                    title={`${d.toLocaleDateString()}`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-1 mt-2 justify-end">
        <span className="text-[10px] text-gray-600">Less</span>
        <div className="w-2.5 h-2.5 rounded-sm bg-white/[0.04]" />
        <div className="w-2.5 h-2.5 rounded-sm bg-accent/20" />
        <div className="w-2.5 h-2.5 rounded-sm bg-accent/40" />
        <div className="w-2.5 h-2.5 rounded-sm bg-accent/60" />
        <span className="text-[10px] text-gray-600">More</span>
      </div>
    </div>
  );
}

function AchievementCard({ icon, title, desc, earned }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      earned
        ? 'bg-accent/10 border-accent/20'
        : 'bg-surface-card border-white/[0.06] opacity-50'
    }`}>
      <span className="text-lg">{earned ? icon : '🔒'}</span>
      <div>
        <p className="text-sm font-medium text-gray-200">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

export default function JourneyHub() {
  const { user } = useAuth();
  const { progressMap, getOverallProgress } = useProgress(user?.id);

  const allSubtopics = useMemo(() => {
    const items = [];
    for (const week of curriculum.weeks) {
      for (const day of week.days) {
        for (const topic of day.topics) {
          items.push({ id: `${week.id}-${day.day}-${topic}`, title: topic, phase: week.id });
        }
      }
    }
    return items;
  }, []);

  const overall = useMemo(() => getOverallProgress(allSubtopics), [allSubtopics, getOverallProgress]);

  const phaseProgress = useMemo(() => {
    return curriculum.weeks.map((w) => {
      const phaseTopics = allSubtopics.filter((s) => s.phase === w.id);
      const done = phaseTopics.filter((s) => progressMap[s.id]).length;
      return { done, total: phaseTopics.length, pct: phaseTopics.length > 0 ? Math.round((done / phaseTopics.length) * 100) : 0 };
    });
  }, [allSubtopics, progressMap]);

  const activePhase = phaseProgress.findIndex((p) => p.pct < 100);

  const achievements = useMemo(() => {
    const completedCount = allSubtopics.filter((s) => progressMap[s.id]).length;
    return [
      { icon: '🌟', title: 'First Steps', desc: 'Complete 10 topics', earned: completedCount >= 10 },
      { icon: '🔥', title: 'Getting Serious', desc: 'Complete 50 topics', earned: completedCount >= 50 },
      { icon: '💪', title: 'Halfway There', desc: 'Complete 100 topics', earned: completedCount >= 100 },
      { icon: '🏆', title: 'Dedicated Learner', desc: 'Complete 200 topics', earned: completedCount >= 200 },
      { icon: '🎯', title: 'Quiz Master', desc: 'Score 100% on a quiz', earned: false },
      { icon: '📖', title: 'Consistent', desc: '7-day learning streak', earned: false },
    ];
  }, [allSubtopics, progressMap]);

  return (
    <div className="space-y-5">
      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4">
          <div className="text-lg font-bold text-gray-100">{overall.percent}%</div>
          <div className="text-xs text-gray-500">Overall Progress</div>
        </div>
        <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4">
          <div className="text-lg font-bold text-gray-100">{overall.completed}</div>
          <div className="text-xs text-gray-500">Topics Done</div>
        </div>
        <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4">
          <div className="text-lg font-bold text-gray-100">{overall.total - overall.completed}</div>
          <div className="text-xs text-gray-500">Remaining</div>
        </div>
        <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4">
          <div className="text-lg font-bold text-gray-100">{curriculum.weeks.length}</div>
          <div className="text-xs text-gray-500">Total Phases</div>
        </div>
      </div>

      <MiniMotivationBar compact />

      {/* Journey trail */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Learning Trail</h3>
        <div className="grid gap-2">
          {curriculum.weeks.map((w, i) => (
            <PhaseNode key={w.id} phase={w} progress={phaseProgress[i]} isActive={i === activePhase} />
          ))}
        </div>
      </div>

      {/* Activity heatmap + Achievements */}
      <div className="grid sm:grid-cols-2 gap-4">
        <ActivityHeatmap />
        <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Achievements</h3>
          <div className="space-y-2">
            {achievements.map((a, i) => (
              <AchievementCard key={i} {...a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

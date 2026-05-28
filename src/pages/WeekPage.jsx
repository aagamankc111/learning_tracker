import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import curriculum from '../data/curriculum';
import FadeIn from '../components/common/FadeIn';

const weekStyles = {
  indigo: {
    gradient: 'from-indigo-600 to-indigo-700', badge: 'bg-indigo-100 text-indigo-700',
    count: 'text-indigo-700', light: 'bg-indigo-50', ring: 'ring-indigo-500',
    btn: 'bg-indigo-600 hover:bg-indigo-700', accent: 'indigo',
  },
  emerald: {
    gradient: 'from-emerald-600 to-emerald-700', badge: 'bg-emerald-100 text-emerald-700',
    count: 'text-emerald-700', light: 'bg-emerald-50', ring: 'ring-emerald-500',
    btn: 'bg-emerald-600 hover:bg-emerald-700', accent: 'emerald',
  },
  violet: {
    gradient: 'from-violet-600 to-violet-700', badge: 'bg-violet-100 text-violet-700',
    count: 'text-violet-700', light: 'bg-violet-50', ring: 'ring-violet-500',
    btn: 'bg-violet-600 hover:bg-violet-700', accent: 'violet',
  },
  amber: {
    gradient: 'from-amber-600 to-amber-700', badge: 'bg-amber-100 text-amber-700',
    count: 'text-amber-700', light: 'bg-amber-50', ring: 'ring-amber-500',
    btn: 'bg-amber-600 hover:bg-amber-700', accent: 'amber',
  },
};

const STORAGE_PREFIX = 'wt_progress';

function getStorageKey(weekId, day) {
  return `${STORAGE_PREFIX}_week${weekId}_day${day}`;
}

export default function WeekPage() {
  const { weekId } = useParams();
  const week = curriculum.weeks.find((w) => w.id === Number(weekId));
  const [checkedMap, setCheckedMap] = useState({});
  const [syncing, setSyncing] = useState(false);

  // Load: try Supabase first, fall back to localStorage
  useEffect(() => {
    if (!week) return;

    async function load() {
      const map = {};

      const { data: { user } } = await supabase.auth.getSession();
      if (user) {
        const { data } = await supabase
          .from('daily_progress')
          .select('day, item_index, completed')
          .eq('user_id', user.id)
          .eq('week_number', week.id);

        if (data) {
          for (const row of data) {
            if (row.completed) {
              map[`${row.day}-${row.item_index}`] = true;
            }
          }
        }
      }

      // Merge with localStorage as fallback
      for (const day of week.days) {
        const stored = localStorage.getItem(getStorageKey(week.id, day.day));
        if (stored) {
          try {
            const local = JSON.parse(stored);
            for (const key of Object.keys(local)) {
              if (!(key in map)) {
                map[key] = local[key];
              }
            }
          } catch {}
        }
      }

      setCheckedMap(map);
    }

    load();
  }, [week?.id, week?.days]);

  const handleCheck = useCallback(async (day, index) => {
    const key = `${day.day}-${index}`;
    const newCompleted = !checkedMap[key];

    // Optimistic update
    setCheckedMap((prev) => ({ ...prev, [key]: newCompleted }));
    localStorage.setItem(
      getStorageKey(week.id, day.day),
      JSON.stringify({ ...checkedMap, [key]: newCompleted })
    );

    // Persist to Supabase
    const { data: { user } } = await supabase.auth.getSession();
    if (user) {
      try {
        await supabase.from('daily_progress').upsert(
          {
            user_id: user.id,
            week_number: week.id,
            day: day.day,
            item_index: index,
            completed: newCompleted,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id, week_number, day, item_index' }
        );
      } catch (err) {
        console.error('Failed to sync to Supabase:', err);
      }
    }
  }, [week?.id, checkedMap]);

  if (!week) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Week not found.</p>
        <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">← Back to Dashboard</Link>
      </div>
    );
  }

  const style = weekStyles[week.color];
  const totalItems = week.days.reduce((s, d) => s + d.reviewItems.length, 0);
  const checkedCount = week.days.reduce((s, d) => s + d.reviewItems.filter((_, i) => checkedMap[`${d.day}-${i}`]).length, 0);

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <FadeIn>
        <div className={`bg-gradient-to-r ${style.gradient} rounded-2xl p-6 sm:p-8 text-white shadow-xl`}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                  Week {week.id}
                </span>
                <span className="text-white/60 text-xs">
                  {checkedCount}/{totalItems} items checked
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">{week.title}</h1>
              <p className="text-white/80 mt-1 text-sm">{week.subtitle}</p>
              <p className="text-white/60 text-sm mt-2 max-w-xl">{week.description}</p>
            </div>
            <span className="text-3xl sm:text-4xl opacity-70">{['🖥️', '☁️', '🤖', '🚀'][week.id - 1]}</span>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: totalItems > 0 ? `${(checkedCount / totalItems) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-sm font-medium text-white">
                {totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link to={week.id < 4 ? `/week/${week.id + 1}` : '/projects'}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition text-white">
              {week.id < 4 ? 'Next Week →' : 'View Projects →'}
            </Link>
            <Link to="/daily-review"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition text-white border border-white/20">
              Daily Review
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Day-by-Day Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Daily Breakdown</h2>

        {week.days.map((day, i) => {
          const dayChecked = day.reviewItems.filter((_, j) => checkedMap[`${day.day}-${j}`]).length;
          const dayTotal = day.reviewItems.length;

          return (
            <FadeIn key={day.day} delay={i * 75}>
              <details className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden open:shadow-md transition-all">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition select-none list-none">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-9 h-9 rounded-lg ${style.light} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold ${style.count}`}>D{day.day}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{day.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span>{day.topics.join(' · ')}</span>
                        <span className="text-gray-300">|</span>
                        <span className={dayChecked === dayTotal && dayTotal > 0 ? 'text-emerald-500 font-medium' : ''}>
                          {dayChecked}/{dayTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </summary>

                <div className="px-5 pb-5 border-t border-gray-50">
                  {/* Key Concepts */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Concepts</p>
                    <div className={`p-3 rounded-lg ${style.light} text-sm text-gray-700 leading-relaxed`}>
                      {day.keyConcepts}
                    </div>
                  </div>

                  {/* Review Items */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Must-Know Checklist</p>
                    <div className="space-y-1.5">
                      {day.reviewItems.map((item, j) => {
                        const checked = checkedMap[`${day.day}-${j}`];
                        return (
                          <label
                            key={j}
                            className={`flex items-start gap-2.5 p-2 rounded-lg transition-all cursor-pointer group/check ${
                              checked ? 'bg-emerald-50/50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={!!checked}
                              onChange={() => handleCheck(day, j)}
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                            />
                            <span className={`text-sm transition-colors ${checked ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Commands */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Commands</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {day.keyCommands.map((cmd, j) => (
                        <div key={j} className="bg-gray-900 text-green-400 text-xs font-mono px-3 py-2 rounded-lg overflow-x-auto">
                          $ {cmd}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Idea */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mini Project</p>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                      {day.projectIdeas}
                    </div>
                  </div>
                </div>
              </details>
            </FadeIn>
          );
        })}
      </div>

      {/* Navigation between weeks */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div>
          {week.id > 1 ? (
            <Link to={`/week/${week.id - 1}`}
              className="text-sm text-gray-500 hover:text-indigo-600 font-medium transition flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50">
              ← Week {week.id - 1}
            </Link>
          ) : (
            <Link to="/"
              className="text-sm text-gray-500 hover:text-indigo-600 font-medium transition flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50">
              ← Dashboard
            </Link>
          )}
        </div>
        <div>
          {week.id < 4 ? (
            <Link to={`/week/${week.id + 1}`}
              className={`text-sm text-white font-medium px-4 py-2 rounded-lg transition shadow ${style.btn}`}>
              Week {week.id + 1} →
            </Link>
          ) : (
            <Link to="/projects"
              className={`text-sm text-white font-medium px-4 py-2 rounded-lg transition shadow ${style.btn}`}>
              View Projects →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

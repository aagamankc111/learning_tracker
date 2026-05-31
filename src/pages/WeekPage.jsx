import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import curriculum from '../data/curriculum';
import { hasEnrichment } from '../data/curriculum-enrichment';
import FadeIn from '../components/common/FadeIn';
import MiniMotivationBar from '../components/Motivation/MiniMotivationBar';
import { useNotifications } from '../context/NotificationContext';

const weekStyles = {
  indigo: {
    gradient: 'from-indigo-600 to-indigo-700', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    count: 'text-indigo-700', light: 'bg-indigo-50 dark:bg-indigo-900/20', ring: 'ring-indigo-500',
    btn: 'bg-indigo-600 hover:bg-indigo-700', accent: 'indigo',
  },
  emerald: {
    gradient: 'from-emerald-600 to-emerald-700', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    count: 'text-emerald-700', light: 'bg-emerald-50 dark:bg-emerald-900/20', ring: 'ring-emerald-500',
    btn: 'bg-emerald-600 hover:bg-emerald-700', accent: 'emerald',
  },
  violet: {
    gradient: 'from-violet-600 to-violet-700', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    count: 'text-violet-700', light: 'bg-violet-50 dark:bg-violet-900/20', ring: 'ring-violet-500',
    btn: 'bg-violet-600 hover:bg-violet-700', accent: 'violet',
  },
  amber: {
    gradient: 'from-amber-600 to-amber-700', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    count: 'text-amber-700', light: 'bg-amber-50 dark:bg-amber-900/20', ring: 'ring-amber-500',
    btn: 'bg-amber-600 hover:bg-amber-700', accent: 'amber',
  },
  cyan: {
    gradient: 'from-cyan-600 to-cyan-700', badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    count: 'text-cyan-700', light: 'bg-cyan-50 dark:bg-cyan-900/20', ring: 'ring-cyan-500',
    btn: 'bg-cyan-600 hover:bg-cyan-700', accent: 'cyan',
  },
  rose: {
    gradient: 'from-rose-600 to-rose-700', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    count: 'text-rose-700', light: 'bg-rose-50 dark:bg-rose-900/20', ring: 'ring-rose-500',
    btn: 'bg-rose-600 hover:bg-rose-700', accent: 'rose',
  },
  teal: {
    gradient: 'from-teal-600 to-teal-700', badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    count: 'text-teal-700', light: 'bg-teal-50 dark:bg-teal-900/20', ring: 'ring-teal-500',
    btn: 'bg-teal-600 hover:bg-teal-700', accent: 'teal',
  },
  pink: {
    gradient: 'from-pink-600 to-pink-700', badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    count: 'text-pink-700', light: 'bg-pink-50 dark:bg-pink-900/20', ring: 'ring-pink-500',
    btn: 'bg-pink-600 hover:bg-pink-700', accent: 'pink',
  },
  purple: {
    gradient: 'from-purple-600 to-purple-700', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    count: 'text-purple-700', light: 'bg-purple-50 dark:bg-purple-900/20', ring: 'ring-purple-500',
    btn: 'bg-purple-600 hover:bg-purple-700', accent: 'purple',
  },
};

const STORAGE_PREFIX = 'wt_progress';

function getStorageKey(weekId, day) {
  return `${STORAGE_PREFIX}_week${weekId}_day${day}`;
}

function updateLocalStorage(weekId, day, checkedMap) {
  const dayData = {};
  for (const [key, val] of Object.entries(checkedMap)) {
    if (key.startsWith(`${day}-`)) {
      dayData[key] = val;
    }
  }
  localStorage.setItem(
    getStorageKey(weekId, day),
    JSON.stringify(dayData)
  );
}

export default function WeekPage() {
  const { weekId } = useParams();
  const week = curriculum.weeks.find((w) => w.id === Number(weekId));
  const [checkedMap, setCheckedMap] = useState({});
  const [openDay, setOpenDay] = useState(null);
  const dayRefs = useRef({});

  useEffect(() => {
    if (!week) return;

    async function load() {
      const map = {};

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (user) {
          const { data, error } = await supabase
            .from('daily_progress')
            .select('day, item_index, completed')
            .eq('user_id', user.id)
            .eq('week_number', week.id);

          if (error) {
            console.error('Supabase load error:', error);
            throw error;
          }

          if (data) {
            for (const row of data) {
              if (row.completed) {
                map[`${row.day}-${row.item_index}`] = true;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Supabase load failed, using localStorage:', err.message);
      }

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

    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#day-')) {
        const dayNum = parseInt(hash.replace('#day-', ''), 10);
        if (!isNaN(dayNum)) {
          setOpenDay(dayNum);
          setTimeout(() => {
            const el = document.getElementById(`day-${dayNum}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [week?.id]);

  const checkedMapRef = useRef(checkedMap);
  checkedMapRef.current = checkedMap;

  const handleCheck = useCallback(async (day, index) => {
    const key = `${day.day}-${index}`;
    const currentMap = checkedMapRef.current;
    const newCompleted = !currentMap[key];

    setCheckedMap((prev) => {
      const updated = { ...prev, [key]: newCompleted };
      updateLocalStorage(week.id, day.day, updated);
      return updated;
    });

    if (newCompleted) {
      notify('xp', { xp: 5, reason: `Completed: ${day.reviewItems[index]}`, totalXp: '...' });
    }

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      try {
        const payload = {
          user_id: user.id,
          week_number: week.id,
          day: day.day,
          item_index: index,
          completed: newCompleted,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('daily_progress')
          .upsert(payload, { onConflict: 'user_id,week_number,day,item_index' });

        if (error) throw error;
      } catch (err) {
        console.error('Failed to sync to Supabase:', err);
        setCheckedMap((prev) => {
          const rolledBack = { ...prev, [key]: !newCompleted };
          updateLocalStorage(week.id, day.day, rolledBack);
          return rolledBack;
        });
      }
    }
  }, [week?.id]);

  if (!week) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Week not found.</p>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">← Back to Dashboard</Link>
      </div>
    );
  }

  const { notify } = useNotifications();
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
                  Phase {week.id}
                </span>
                <span className="text-white/60 text-xs">
                  {checkedCount}/{totalItems} items checked
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">{week.title}</h1>
              <p className="text-white/80 mt-1 text-sm">{week.subtitle}</p>
              <p className="text-white/60 text-sm mt-2 max-w-xl">{week.description}</p>
            </div>
            <span className="text-3xl sm:text-4xl opacity-70">{['🖥️', '☁️', '🤖', '🚀', '🔬', '📐', '🏭', '🧠', '🏆'][week.id - 1]}</span>
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
            <Link to={week.id < 9 ? `/week/${week.id + 1}` : '/projects'}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition text-white">
              {week.id < 9 ? 'Next Phase →' : 'View Projects →'}
            </Link>
            <Link to="/daily-review"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition text-white border border-white/20">
              Daily Review
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Mini Motivation Bar */}
      <FadeIn delay={80}>
        <MiniMotivationBar compact />
      </FadeIn>

      {/* Quick Day Navigation */}
      <div className="flex gap-1.5 flex-wrap">
        {week.days.map((day) => {
          const dayChecked = day.reviewItems.filter((_, j) => checkedMap[`${day.day}-${j}`]).length;
          const dayTotal = day.reviewItems.length;
          const done = dayChecked === dayTotal && dayTotal > 0;
          return (
            <button
              key={day.day}
              onClick={() => {
                setOpenDay(day.day);
                window.location.hash = `day-${day.day}`;
                const el = document.getElementById(`day-${day.day}`);
                if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                openDay === day.day
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-sm'
                  : done
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-dark-800 dark:text-gray-300 dark:border-dark-600 dark:hover:border-dark-500 dark:hover:bg-dark-700'
              }`}
              title={`${day.title} (${dayChecked}/${dayTotal})`}
            >
              D{day.day}
            </button>
          );
        })}
      </div>

      {/* Day-by-Day Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Daily Breakdown</h2>

        {week.days.map((day, i) => {
          const dayChecked = day.reviewItems.filter((_, j) => checkedMap[`${day.day}-${j}`]).length;
          const dayTotal = day.reviewItems.length;

          return (
            <FadeIn key={day.day} delay={i * 75}>
              <details
                id={`day-${day.day}`}
                ref={(el) => { dayRefs.current[day.day] = el; }}
                open={openDay === day.day}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden open:shadow-md transition-all dark:bg-dark-800 dark:border-dark-700"
                onToggle={(e) => {
                  if (e.target.open) setOpenDay(day.day);
                }}
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition select-none list-none">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-9 h-9 rounded-lg ${style.light} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold ${style.count}`}>D{day.day}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate">{day.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                          {day.topics.map((t) => {
                            const slug = t.toLowerCase().replace(/\s+/g, '-');
                            const hasEnr = hasEnrichment(day.day, t);
                            return (
                              <Link
                                key={t}
                                to={`/week/${week.id}/day/${day.day}/topic/${slug}`}
                                className={`transition ${hasEnr ? 'text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300' : 'text-gray-400 dark:text-gray-500'}`}
                                title={hasEnr ? 'View enrichment details' : 'No enrichment data'}
                              >
                                {t}{hasEnr ? ' 📖' : ''}
                              </Link>
                            );
                          })}
                        </span>
                        <span className="text-gray-300 dark:text-gray-500">|</span>
                        <span className={dayChecked === dayTotal && dayTotal > 0 ? 'text-emerald-500 font-medium' : ''}>
                          {dayChecked}/{dayTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </summary>

                <div className="px-5 pb-5 border-t border-gray-50 dark:border-dark-700/50">
                  {/* Key Concepts */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key Concepts</p>
                    <div className={`p-3 rounded-lg ${style.light} text-sm text-gray-700 dark:text-gray-200 leading-relaxed`}>
                      {day.keyConcepts}
                    </div>
                  </div>

                  {/* Review Items */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Must-Know Checklist</p>
                    <div className="space-y-1.5">
                      {day.reviewItems.map((item, j) => {
                        const checked = checkedMap[`${day.day}-${j}`];
                        return (
                          <label
                            key={j}
                            className={`flex items-start gap-2.5 p-2 rounded-lg transition-all cursor-pointer group/check ${
                              checked ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : 'hover:bg-gray-50 dark:hover:bg-dark-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={!!checked}
                              onChange={() => handleCheck(day, j)}
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer dark:text-emerald-400"
                            />
                            <span className={`text-sm transition-colors ${checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Commands */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key Commands</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {day.keyCommands.map((cmd, j) => (
                        <div key={j} className="bg-gray-900 text-green-400 text-xs font-mono px-3 py-2 rounded-lg overflow-x-auto dark:bg-dark-900 dark:text-green-300">
                          $ {cmd}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Idea */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Mini Project</p>
                    <div className="bg-gradient-to-r from-amber-50 dark:from-amber-900/20 to-orange-50 dark:to-dark-800 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-300">
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
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-dark-700">
        <div>
          {week.id > 1 ? (
            <Link to={`/week/${week.id - 1}`}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700">
              ← Phase {week.id - 1}
            </Link>
          ) : (
            <Link to="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700">
              ← Dashboard
            </Link>
          )}
        </div>
        <div>
          {week.id < 9 ? (
            <Link to={`/week/${week.id + 1}`}
              className={`text-sm text-white font-medium px-4 py-2 rounded-lg transition shadow ${style.btn}`}>
              Phase {week.id + 1} →
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

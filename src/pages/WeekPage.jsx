import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import curriculum from '../data/curriculum';
import { hasEnrichment } from '../data/curriculum-enrichment';
import FadeIn from '../components/common/FadeIn';
import MiniMotivationBar from '../components/Motivation/MiniMotivationBar';
import { useNotifications } from '../context/NotificationContext';
import { handleItemCheck } from '../services/progressUpdateService';

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
  const { notify } = useNotifications();

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
        if (newCompleted) {
          const dayTotal = day.reviewItems.length;
          const checkedBefore = day.reviewItems.filter((_, i) => currentMap[`${day.day}-${i}`]).length;
          const isDayComplete = (checkedBefore + 1) >= dayTotal && dayTotal > 0;

          const result = await handleItemCheck(user.id, week.id, day.day, index, true);

          if (isDayComplete && result?.current_streak > 0) {
            notify('streak', { streak: result.current_streak });
          }
        } else {
          const payload = {
            user_id: user.id, week_number: week.id, day: day.day,
            item_index: index, completed: false, updated_at: new Date().toISOString(),
          };
          const { error } = await supabase
            .from('daily_progress')
            .upsert(payload, { onConflict: 'user_id,week_number,day,item_index' });
          if (error) throw error;
        }
        window.dispatchEvent(new CustomEvent('progress-updated'));
      } catch (err) {
        console.error('Failed to sync to Supabase, progress kept in localStorage:', err);
      }
    }
  }, [week?.id, notify]);

  if (!week) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Week not found.</p>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">← Back to Dashboard</Link>
      </div>
    );
  }

  const totalItems = week.days.reduce((s, d) => s + d.reviewItems.length, 0);
  const checkedCount = week.days.reduce((s, d) => s + d.reviewItems.filter((_, i) => checkedMap[`${d.day}-${i}`]).length, 0);

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <FadeIn>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
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
                  ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
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
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">D{day.day}</span>
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
                        <span className={dayChecked === dayTotal && dayTotal > 0 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''}>
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
                    <pre className="p-4 rounded-lg bg-gray-900 dark:bg-black text-sm text-gray-100 dark:text-gray-200 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto border border-gray-700/50">
                      {day.keyConcepts}
                    </pre>
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
                              checked ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-dark-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={!!checked}
                              onChange={() => handleCheck(day, j)}
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer dark:text-indigo-400"
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
                    <pre className="p-4 rounded-lg bg-gray-900 dark:bg-black text-sm text-green-400 dark:text-green-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto border border-gray-700/50">
                      {day.projectIdeas}
                    </pre>
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
              className="text-sm text-white font-medium px-4 py-2 rounded-lg transition shadow bg-indigo-600 hover:bg-indigo-700">
              Phase {week.id + 1} →
            </Link>
          ) : (
            <Link to="/projects"
              className="text-sm text-white font-medium px-4 py-2 rounded-lg transition shadow bg-indigo-600 hover:bg-indigo-700">
              View Projects →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import curriculum from '../data/curriculum';
import { hasEnrichment } from '../data/curriculum-enrichment';
import { handleItemCheck } from '../services/progressUpdateService';

const STORAGE_PREFIX = 'wt_progress';

function getStorageKey(phaseId, day) {
  return `${STORAGE_PREFIX}_phase${phaseId}_day${day}`;
}

function updateLocalStorage(phaseId, day, checkedMap) {
  const dayData = {};
  for (const [key, val] of Object.entries(checkedMap)) {
    if (key.startsWith(`${day}-`)) dayData[key] = val;
  }
  localStorage.setItem(getStorageKey(phaseId, day), JSON.stringify(dayData));
}

export default function WeekPage() {
  const { phaseId } = useParams();
  const week = curriculum.weeks.find((w) => w.id === Number(phaseId));
  const [checkedMap, setCheckedMap] = useState({});
  const [openDay, setOpenDay] = useState(null);
  const dayRefs = useRef({});
  const checkedMapRef = useRef(checkedMap);
  checkedMapRef.current = checkedMap;

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
          if (!error && data) {
            for (const row of data) {
              if (row.completed) map[`${row.day}-${row.item_index}`] = true;
            }
          }
        }
      } catch (err) { console.warn('Supabase load failed:', err.message); }

      for (const day of week.days) {
        const stored = localStorage.getItem(getStorageKey(week.id, day.day));
        if (stored) {
          try {
            const local = JSON.parse(stored);
            for (const key of Object.keys(local)) {
              if (!(key in map)) map[key] = local[key];
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

  const handleCheck = useCallback(async (day, index) => {
    const key = `${day.day}-${index}`;
    const currentMap = checkedMapRef.current;
    const newCompleted = !currentMap[key];

    setCheckedMap((prev) => {
      const updated = { ...prev, [key]: newCompleted };
      updateLocalStorage(week.id, day.day, updated);
      return updated;
    });

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      try {
        await handleItemCheck(user.id, week.id, day.day, index, newCompleted);
        window.dispatchEvent(new CustomEvent('progress-updated'));
      } catch (err) {
        console.error('Failed to sync:', err);
      }
    }
  }, [week?.id]);

  if (!week) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Phase not found.</p>
        <Link to="/" className="text-accent hover:underline mt-2 inline-block text-sm">← Back to Dashboard</Link>
      </div>
    );
  }

  const totalItems = week.days.reduce((s, d) => s + d.reviewItems.length, 0);
  const checkedCount = week.days.reduce((s, d) => s + d.reviewItems.filter((_, i) => checkedMap[`${d.day}-${i}`]).length, 0);
  const phaseIcons = ['🖥️', '☁️', '🤖', '🚀', '🔬', '📐', '🏭', '🧠', '🏆'];

  return (
    <div className="space-y-5">
      {/* Phase Header */}
      <div className="bg-surface-card border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent">
                Phase {week.id}
              </span>
              <span className="text-gray-500 text-xs">
                {checkedCount}/{totalItems} items
              </span>
            </div>
            <h1 className="text-xl font-semibold text-gray-100">{week.title}</h1>
            <p className="text-gray-500 mt-0.5 text-sm">{week.subtitle}</p>
            <p className="text-gray-600 text-xs mt-2 max-w-xl">{week.description}</p>
          </div>
          <span className="text-2xl opacity-60">{phaseIcons[week.id - 1]}</span>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: totalItems > 0 ? `${(checkedCount / totalItems) * 100}%` : '0%' }} />
            </div>
            <span className="text-xs font-mono text-accent">
              {totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Link to={week.id < 9 ? `/phase/${week.id + 1}` : '/quiz'}
            className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dim transition">
            {week.id < 9 ? 'Next Phase →' : 'Take Quiz →'}
          </Link>
          <Link to="/daily-review"
            className="px-3 py-1.5 bg-white/[0.06] text-gray-300 rounded-lg text-xs font-medium hover:bg-white/[0.1] transition">
            Daily Review
          </Link>
        </div>
      </div>

      {/* Quick Day Navigation */}
      <div className="flex gap-1.5 flex-wrap">
        {week.days.map((day) => {
          const dayChecked = day.reviewItems.filter((_, j) => checkedMap[`${day.day}-${j}`]).length;
          const dayTotal = day.reviewItems.length;
          const done = dayChecked === dayTotal && dayTotal > 0;
          return (
            <button key={day.day} onClick={() => {
              setOpenDay(day.day);
              window.location.hash = `day-${day.day}`;
              const el = document.getElementById(`day-${day.day}`);
              if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                done
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : openDay === day.day
                  ? 'border-accent/30 bg-accent/10 text-accent'
                  : 'border-white/[0.06] bg-surface-card text-gray-500 hover:text-gray-300 hover:border-white/[0.12]'
              }`}>
              D{day.day}
            </button>
          );
        })}
      </div>

      {/* Day-by-Day Breakdown */}
      <div className="space-y-3">
        {week.days.map((day, i) => {
          const dayChecked = day.reviewItems.filter((_, j) => checkedMap[`${day.day}-${j}`]).length;
          const dayTotal = day.reviewItems.length;
          const dayDone = dayChecked === dayTotal && dayTotal > 0;

          return (
            <details key={day.day} id={`day-${day.day}`}
              ref={(el) => { dayRefs.current[day.day] = el; }}
              open={openDay === day.day}
              className="group bg-surface-card border border-white/[0.06] rounded-xl overflow-hidden open:border-accent/20 transition-all"
              onToggle={(e) => { if (e.target.open) setOpenDay(day.day); }}>
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition select-none list-none">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-accent">D{day.day}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-200 text-sm truncate">{day.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                        {day.topics.map((t) => {
                          const slug = t.toLowerCase().replace(/\s+/g, '-');
                          const hasEnr = hasEnrichment(day.day, t);
                          return (
                            <Link key={t}
                              to={`/phase/${week.id}/day/${day.day}/topic/${slug}`}
                              className={`transition ${dayDone ? 'text-emerald-400 hover:text-emerald-300 hover:underline' : hasEnr ? 'text-accent hover:text-accent-hover hover:underline' : 'text-gray-500'}`}>
                              {t}{hasEnr ? ' 📖' : ''}
                            </Link>
                          );
                        })}
                      </span>
                      <span className="text-gray-600">|</span>
                      <span className={dayDone ? 'text-emerald-400 font-medium' : ''}>
                        {dayChecked}/{dayTotal}
                      </span>
                    </div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-600 shrink-0 transition-transform duration-200 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </summary>

              <div className="px-4 pb-4 border-t border-white/[0.06]">
                <div className="mt-3 space-y-3">
                  {/* Key Concepts */}
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Concepts</p>
                    <div className="text-xs text-gray-400 leading-relaxed bg-surface/80 border border-white/[0.06] rounded-lg p-3 font-mono whitespace-pre-wrap">
                      {day.keyConcepts}
                    </div>
                  </div>

                  {/* Review Items */}
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Checklist</p>
                    <div className="space-y-1">
                      {day.reviewItems.map((item, j) => {
                        const checked = checkedMap[`${day.day}-${j}`];
                        return (
                          <label key={j}
                            className={`flex items-start gap-2.5 p-2 rounded-lg transition-all cursor-pointer ${
                              checked ? 'bg-accent/5' : 'hover:bg-white/[0.02]'
                            }`}>
                            <input type="checkbox" checked={!!checked} onChange={() => handleCheck(day, j)}
                              className="mt-0.5 h-3.5 w-3.5 rounded border-white/[0.12] bg-transparent accent-accent cursor-pointer" />
                            <span className={`text-xs transition-colors ${checked ? 'line-through text-gray-600' : 'text-gray-400'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Commands */}
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Commands</p>
                    <div className="grid sm:grid-cols-2 gap-1.5">
                      {day.keyCommands.map((cmd, j) => (
                        <pre key={j} className="bg-surface/80 border border-white/[0.06] text-gray-300 text-xs font-mono px-3 py-2 rounded-lg overflow-x-auto">
                          $ {cmd}
                        </pre>
                      ))}
                    </div>
                  </div>

                  {/* Project */}
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Project</p>
                    <div className="text-xs text-gray-400 leading-relaxed bg-surface/80 border border-white/[0.06] rounded-lg p-3 font-mono">
                      {day.projectIdeas}
                    </div>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
        <div>
          {week.id > 1 ? (
            <Link to={`/phase/${week.id - 1}`}
              className="text-xs text-gray-500 hover:text-accent transition flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/[0.04]">
              ← Phase {week.id - 1}
            </Link>
          ) : (
            <Link to="/"
              className="text-xs text-gray-500 hover:text-accent transition flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/[0.04]">
              ← Dashboard
            </Link>
          )}
        </div>
        <div>
          {week.id < 9 ? (
            <Link to={`/phase/${week.id + 1}`}
              className="text-xs text-white font-medium px-3 py-1.5 rounded-lg transition bg-accent hover:bg-accent-dim">
              Phase {week.id + 1} →
            </Link>
          ) : (
            <Link to="/quiz"
              className="text-xs text-white font-medium px-3 py-1.5 rounded-lg transition bg-accent hover:bg-accent-dim">
              Take Quiz →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

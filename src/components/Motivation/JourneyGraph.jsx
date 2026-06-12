import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJourney } from '../../hooks/useJourney';
import { useGamification } from '../../hooks/useGamification';
import curriculum from '../../data/curriculum';

function computePhaseItemTotals() {
  const arr = [];
  let running = 0;
  for (const week of curriculum.weeks) {
    const total = week.days.reduce((s, d) => s + d.reviewItems.length, 0);
    running += total;
    arr.push({ weekId: week.id, title: week.title, total, cumulative: running });
  }
  return arr;
}
const PHASE_ITEM_TOTALS = computePhaseItemTotals();
const TOTAL_ITEMS = PHASE_ITEM_TOTALS[PHASE_ITEM_TOTALS.length - 1].cumulative;

const PTS = [
  { x: 196, y: 565 }, { x: 196, y: 548 }, { x: 216, y: 538 }, { x: 296, y: 518 },
  { x: 348, y: 500 }, { x: 365, y: 482 }, { x: 320, y: 468 }, { x: 240, y: 460 },
  { x: 156, y: 448 }, { x: 116, y: 434 }, { x: 128, y: 420 }, { x: 230, y: 406 },
  { x: 340, y: 390 }, { x: 370, y: 370 }, { x: 340, y: 354 }, { x: 230, y: 340 },
  { x: 130, y: 324 }, { x: 90,  y: 306 }, { x: 120, y: 290 }, { x: 230, y: 274 },
  { x: 340, y: 256 }, { x: 370, y: 236 }, { x: 330, y: 220 }, { x: 230, y: 206 },
  { x: 140, y: 190 }, { x: 100, y: 172 }, { x: 130, y: 156 }, { x: 230, y: 142 },
  { x: 330, y: 124 }, { x: 350, y: 108 }, { x: 310, y: 94  }, { x: 230, y: 82  },
  { x: 170, y: 72  }, { x: 152, y: 58  }, { x: 180, y: 46  }, { x: 230, y: 38  },
  { x: 230, y: 26  },
];

const PHASE_WP_INDICES = [2, 7, 11, 15, 19, 23, 27, 31, 34];

const PHASE_COLORS = [
  { hex: '#6366f1' }, { hex: '#6366f1' }, { hex: '#6366f1' },
  { hex: '#6366f1' }, { hex: '#6366f1' }, { hex: '#6366f1' },
  { hex: '#6366f1' }, { hex: '#6366f1' }, { hex: '#6366f1' },
];

function catromSegment(p0, p1, p2, p3) {
  const t1x = (p2.x - p0.x) / 6;
  const t1y = (p2.y - p0.y) / 6;
  const t2x = (p3.x - p1.x) / 6;
  const t2y = (p3.y - p1.y) / 6;
  const cx1 = p1.x + t1x;
  const cy1 = p1.y + t1y;
  const cx2 = p2.x - t2x;
  const cy2 = p2.y - t2y;
  return { cx1, cy1, cx2, cy2 };
}

function buildPathD(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) return d + ` L ${pts[1].x} ${pts[1].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const seg = catromSegment(pts[i - 1], pts[i], pts[i + 1], pts[Math.min(i + 2, pts.length - 1)]);
    d += ` C ${seg.cx1} ${seg.cy1}, ${seg.cx2} ${seg.cy2}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

function getPointOnPath(pts, t) {
  if (t <= 0) return { x: pts[0].x, y: pts[0].y, angle: 0 };
  if (t >= 1) return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y, angle: 0 };
  const segs = pts.length - 2;
  const raw = t * segs;
  const i = Math.max(1, Math.min(Math.floor(raw) + 1, segs));
  const lt = raw - (i - 1);
  const p0 = pts[Math.max(0, i - 2)];
  const p1 = pts[i - 1];
  const p2 = pts[i];
  const p3 = pts[Math.min(i + 1, pts.length - 1)];
  const seg = catromSegment(p0, p1, p2, p3);
  const it = 1 - lt;
  const it2 = it * it;
  const it3 = it2 * it;
  const lt2 = lt * lt;
  const lt3 = lt2 * lt;
  const x = it3 * p1.x + 3 * it2 * lt * seg.cx1 + 3 * it * lt2 * seg.cx2 + lt3 * p2.x;
  const y = it3 * p1.y + 3 * it2 * lt * seg.cy1 + 3 * it * lt2 * seg.cy2 + lt3 * p2.y;
  const dx = 3 * it2 * (seg.cx1 - p1.x) + 6 * it * lt * (seg.cx2 - seg.cx1) + 3 * lt2 * (p2.x - seg.cx2);
  const dy = 3 * it2 * (seg.cy1 - p1.y) + 6 * it * lt * (seg.cy2 - seg.cy1) + 3 * lt2 * (p2.y - seg.cy2);
  return { x, y, angle: Math.atan2(dy, dx) * (180 / Math.PI) };
}

const SVG_W = 460;
const SVG_H = 580;

function HikerSVG({ x, y, angle }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 11} rx="8" ry="3" fill="rgba(0,0,0,0.18)" />
      <g transform={`rotate(${angle} ${x} ${y})`}>
        <animateTransform attributeName="transform" type="rotate" values={`${angle} ${x} ${y};${angle + 2} ${x} ${y};${angle} ${x} ${y};${angle - 2} ${x} ${y};${angle} ${x} ${y}`} dur="1.5s" repeatCount="indefinite" additive="replace" />
        <line x1={x - 2} y1={y + 3} x2={x - 5.5} y2={y + 14} stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
        <line x1={x + 2} y1={y + 3} x2={x + 5.5} y2={y + 14} stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
        <line x1={x + 2.5} y1={y - 1} x2={x + 11} y2={y + 14} stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
        <rect x={x - 5.5} y={y - 5.5} width="11" height="10" rx="3" fill="#4f46e5" stroke="#3730a3" strokeWidth="0.6" />
        <rect x={x + 5.5} y={y - 3} width="4.5" height="7.5" rx="1.5" fill="#dc2626" />
        <circle cx={x} cy={y - 10} r="5.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
        <path d={`M ${x - 6} ${y - 13} Q ${x} ${y - 20} ${x + 6} ${y - 13}`} fill="#ea580c" stroke="#c2410c" strokeWidth="0.5" />
      </g>
    </g>
  );
}

export default function JourneyGraph({ compact = false }) {
  const { currentDay, phases } = useJourney();
  const { stats } = useGamification();
  const totalXp = stats?.total_xp || 0;
  const completedItems = stats?.total_items_completed || 0;

  const [tooltip, setTooltip] = useState(null);

  const completionPct = useMemo(() => {
    return TOTAL_ITEMS > 0 ? Math.min(completedItems / TOTAL_ITEMS, 1) : 0;
  }, [completedItems]);

  const currentPhaseIdx = useMemo(() => {
    for (let i = 0; i < PHASE_ITEM_TOTALS.length; i++) {
      if (completedItems < PHASE_ITEM_TOTALS[i].cumulative) return i;
    }
    return PHASE_ITEM_TOTALS.length - 1;
  }, [completedItems]);

  const phaseProgresses = useMemo(() => {
    return PHASE_ITEM_TOTALS.map((p, i) => {
      const prev = i > 0 ? PHASE_ITEM_TOTALS[i - 1].cumulative : 0;
      const inPhase = Math.max(0, Math.min(completedItems - prev, p.total));
      return p.total > 0 ? (inPhase / p.total) * 100 : 0;
    });
  }, [completedItems]);

  const fullPath = useMemo(() => buildPathD(PTS), []);
  const completedPath = useMemo(() => {
    const cCount = Math.min(currentPhaseIdx + 2, PTS.length);
    return buildPathD(PTS.slice(0, cCount));
  }, [currentPhaseIdx]);

  const hikerPos = getPointOnPath(PTS, Math.max(completionPct, 0.001));

  const dayMarkers = useMemo(() => {
    const arr = [];
    for (let d = 10; d <= 90; d += 10) {
      const t = d / 90;
      arr.push({ day: d, t, pos: getPointOnPath(PTS, t) });
    }
    return arr;
  }, []);

  const GUARDRAIL_POSITIONS = [3, 9, 13, 17, 21, 25, 29].flatMap((i) => {
    const pts = [];
    for (let j = 0; j < 5; j++) {
      const t = (i + j * 0.8) / PTS.length;
      if (t < 1) pts.push(getPointOnPath(PTS, t));
    }
    return pts;
  });

  const handlePhaseHover = (e, idx) => {
    const svg = e.currentTarget.closest('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const info = PHASE_ITEM_TOTALS[idx];
    const prev = idx > 0 ? PHASE_ITEM_TOTALS[idx - 1].cumulative : 0;
    const done = Math.max(0, Math.min(completedItems - prev, info.total));
    setTooltip({
      x: Math.min(e.clientX - rect.left, rect.width - 10),
      y: Math.min(e.clientY - rect.top - 10, rect.height - 10),
      phase: `Phase ${idx + 1}`,
      title: info.title,
      items: `${done} / ${info.total} items`,
      pct: Math.round(phaseProgresses[idx]),
    });
  };

  return (
    <div className={`bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden ${compact ? 'p-3' : 'p-5'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className={`font-bold text-gray-800 dark:text-gray-100 ${compact ? 'text-sm' : 'text-base'}`}>🗺️ Learning Trail</h3>
          {!compact && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {completedItems} / {TOTAL_ITEMS} items · {Math.round(completionPct * 100)}% complete
            </p>
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-bold">{totalXp.toLocaleString()} XP</span>
            <span className="text-emerald-600 dark:text-emerald-400">{stats?.current_streak || 0}🔥</span>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <div className="relative" style={{ width: SVG_W, maxWidth: '100%' }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-auto select-none"
            style={{ aspectRatio: `${SVG_W}/${SVG_H}` }}
          >
            <defs>
              <linearGradient id="bgLight" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="30%" stopColor="#dbeafe" />
                <stop offset="65%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
              <linearGradient id="bgDark" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="35%" stopColor="#1e1b4b" />
                <stop offset="70%" stopColor="#172554" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="roadGlowGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="30%" stopColor="#facc15" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="asphaltGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="20%" stopColor="#3f3f46" />
                <stop offset="50%" stopColor="#52525b" />
                <stop offset="80%" stopColor="#3f3f46" />
                <stop offset="100%" stopColor="#27272a" />
              </linearGradient>
              <filter id="roadGlowInner">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="hikerGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <pattern id="roadTexture" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="0.5" fill="#a1a1aa" opacity="0.06" />
              </pattern>
            </defs>

            {/* Sky */}
            <rect width={SVG_W} height={SVG_H} fill="url(#bgLight)" rx="12" className="dark:hidden" />
            <rect width={SVG_W} height={SVG_H} fill="url(#bgDark)" rx="12" className="hidden dark:block" />

            {/* Ground terrain zones */}
            <ellipse cx="230" cy="570" rx="320" ry="130" className="fill-emerald-200/60 dark:fill-emerald-900/25" />
            <ellipse cx="230" cy="440" rx="290" ry="85" className="fill-emerald-300/35 dark:fill-emerald-800/20" />
            <ellipse cx="230" cy="320" rx="260" ry="70" className="fill-emerald-400/20 dark:fill-emerald-700/12" />
            <ellipse cx="230" cy="200" rx="220" ry="55" className="fill-emerald-500/10 dark:fill-emerald-600/8" />

            {/* Mountains */}
            <g className="dark:opacity-35">
              <path d="M -30 160 L 70 48 L 170 160 Z" className="fill-gray-300/55" />
              <path d="M 90 140 L 180 32 L 270 140 Z" className="fill-gray-300/65" />
              <path d="M 190 125 L 285 22 L 380 125 Z" className="fill-gray-300/50" />
              <path d="M 280 140 L 380 30 L 480 140 Z" className="fill-gray-300/60" />
              <path d="M 370 150 L 470 48 L 530 150 Z" className="fill-gray-300/45" />
              <path d="M 70 48 L 78 56 L 70 62 L 62 56 Z" className="fill-white/70" />
              <path d="M 180 32 L 188 40 L 180 46 L 172 40 Z" className="fill-white/80" />
              <path d="M 285 22 L 293 30 L 285 36 L 277 30 Z" className="fill-white/85" />
              <path d="M 380 30 L 388 38 L 380 44 L 372 38 Z" className="fill-white/80" />
            </g>

            {/* Contour lines */}
            <g opacity="0.3" className="dark:opacity-15">
              {[
                [0, 500, 150, 480, 240, 505, 460, 495],
                [0, 440, 190, 418, 290, 448, 460, 438],
                [0, 375, 170, 350, 270, 380, 460, 370],
                [0, 310, 160, 285, 260, 315, 460, 305],
                [0, 245, 180, 218, 280, 250, 460, 240],
                [0, 180, 140, 155, 240, 185, 460, 175],
              ].map((v, i) => (
                <path
                  key={`cl-${i}`}
                  d={`M ${v[0]} ${v[1]} Q ${v[2]} ${v[3]} ${v[4]} ${v[5]} T ${v[6]} ${v[7]}`}
                  className="stroke-emerald-400/40" fill="none" strokeWidth="0.7"
                />
              ))}
            </g>

            {/* Clouds */}
            <g opacity="0.3" className="dark:opacity-12">
              <ellipse cx="45" cy="65" rx="32" ry="10" fill="white" />
              <ellipse cx="28" cy="60" rx="20" ry="9" fill="white" />
              <ellipse cx="65" cy="62" rx="17" ry="8" fill="white" />
              <ellipse cx="315" cy="95" rx="38" ry="11" fill="white" />
              <ellipse cx="298" cy="90" rx="22" ry="9" fill="white" />
              <ellipse cx="338" cy="92" rx="18" ry="8" fill="white" />
              <ellipse cx="420" cy="70" rx="30" ry="9" fill="white" />
            </g>

            {/* Trees */}
            {[
              { x: 180, y: 505 }, { x: 410, y: 458 }, { x: 36, y: 416 },
              { x: 420, y: 356 }, { x: 32, y: 284 }, { x: 412, y: 222 },
              { x: 42, y: 164 }, { x: 390, y: 112 }, { x: 98, y: 78 },
            ].map((t, i) => (
              <g key={`t-${i}`} opacity="0.4" className="dark:opacity-18">
                <rect x={t.x} y={t.y} width="3" height="9" className="fill-amber-700/50" rx="1" />
                <circle cx={t.x + 1.5} cy={t.y - 3} r="8" className="fill-emerald-500/45" />
                <circle cx={t.x + 1.5} cy={t.y - 9} r="6.5" className="fill-emerald-500/55" />
                <circle cx={t.x + 1.5} cy={t.y - 14} r="5" className="fill-emerald-500/45" />
              </g>
            ))}

            {/* Bushes */}
            {[
              { x: 130, y: 540 }, { x: 380, y: 388 }, { x: 62, y: 326 },
              { x: 410, y: 278 }, { x: 50, y: 206 }, { x: 376, y: 142 },
              { x: 130, y: 96 },
            ].map((b, i) => (
              <ellipse key={`b-${i}`} cx={b.x} cy={b.y} rx="7" ry="3.5" className="fill-emerald-500/20 dark:fill-emerald-700/12" />
            ))}

            {/* Small rocks */}
            <g opacity="0.25" className="dark:opacity-12">
              <ellipse cx="380" cy="490" rx="4.5" ry="2.5" className="fill-gray-400" />
              <ellipse cx="72" cy="378" rx="4" ry="2" className="fill-gray-400" />
              <ellipse cx="400" cy="318" rx="3.5" ry="3" className="fill-gray-400" />
              <ellipse cx="62" cy="248" rx="5" ry="2.5" className="fill-gray-400" />
              <ellipse cx="410" cy="188" rx="3.5" ry="2" className="fill-gray-400" />
              <ellipse cx="68" cy="118" rx="4" ry="2" className="fill-gray-400" />
            </g>

            {/* === ROAD SHADOW === */}
            <path d={fullPath} stroke="rgba(0,0,0,0.15)" fill="none" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" className="dark:opacity-40" />

            {/* === ROAD BASE (yellow edge lines) === */}
            <path d={fullPath} stroke="#ca8a04" fill="none" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />

            {/* === ROAD SURFACE (asphalt on top, leaves 2px yellow edge) === */}
            <path d={fullPath} stroke="url(#asphaltGrad)" fill="none" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
            <path d={fullPath} stroke="#27272a" fill="none" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />

            {/* === ROAD CENTER LINE === */}
            <path d={fullPath} stroke="#a1a1aa" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 12" opacity="0.45" />

            {/* === GUARDRAILS on outer curves === */}
            {GUARDRAIL_POSITIONS.map((gp, i) => {
              const a = (gp.angle || 0) * (Math.PI / 180);
              const side = gp.x > 230 ? 1 : -1;
              const gx = gp.x + side * 14 * Math.sin(a);
              const gy = gp.y - side * 14 * Math.cos(a);
              return (
                <g key={`gr-${i}`} opacity="0.35" className="dark:opacity-15">
                  <rect x={gx - 1.5} y={gy - 4} width="3" height="8" rx="1" fill="#9ca3af" />
                  <rect x={gx - 2.5} y={gy - 5} width="5" height="2" rx="0.5" fill="#d1d5db" />
                </g>
              );
            })}

            {/* === COMPLETED ROAD GLOW === */}
            {currentPhaseIdx > 0 && (
              <>
                <path d={completedPath} stroke="url(#roadGlowGrad)" fill="none" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" className="transition-all duration-1000" />
                <path d={completedPath} stroke="url(#roadGlowGrad)" fill="none" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" filter="url(#roadGlowInner)" opacity="0.6" className="transition-all duration-1000" />
                <path d={completedPath} stroke="#fde047" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" className="transition-all duration-1000" />
              </>
            )}

            {/* Progress sparkle particles on completed road */}
            {currentPhaseIdx > 0 && Array.from({ length: 3 }).map((_, i) => {
              const sparkleT = Math.random() * (currentPhaseIdx / PHASE_ITEM_TOTALS.length) * 0.8;
              const sp = getPointOnPath(PTS, sparkleT);
              return (
                <circle key={`sp-${i}`} cx={sp.x} cy={sp.y} r="1.5" fill="#fde047" opacity="0.6">
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1.5 + Math.random()}s`} repeatCount="indefinite" />
                </circle>
              );
            })}

            {/* === DAY MARKERS === */}
            {dayMarkers.map((dm) => {
              const dayItemTarget = Math.round((dm.day / 90) * TOTAL_ITEMS);
              const isReached = completedItems >= dayItemTarget;
              const isFuture = dm.day > 80 && !isReached;
              return (
                <g key={`dm-${dm.day}`}>
                  <circle
                    cx={dm.pos.x} cy={dm.pos.y} r="3.5"
                    fill={isReached ? '#818cf8' : isFuture ? '#d1d5db' : '#e5e7eb'}
                    stroke={isReached ? '#6366f1' : '#9ca3af'}
                    strokeWidth="1"
                    className="dark:opacity-70"
                  />
                  {isReached && (
                    <circle cx={dm.pos.x} cy={dm.pos.y} r="5" fill="none" className="stroke-indigo-400/40" strokeWidth="1.5">
                      <animate attributeName="r" from="4" to="8" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text
                    x={dm.pos.x > 230 ? dm.pos.x + 9 : dm.pos.x - 9}
                    y={dm.pos.y + 1.5}
                    textAnchor={dm.pos.x > 230 ? 'start' : 'end'}
                    className={`text-[7px] font-semibold ${isReached ? 'fill-indigo-600 dark:fill-indigo-400' : 'fill-gray-400 dark:fill-gray-500'}`}
                    style={{ paintOrder: 'stroke', stroke: 'rgba(255,255,255,0.7)', strokeWidth: '2.5px', strokeLinecap: 'round', strokeLinejoin: 'round' }}
                  >
                    D{dm.day}
                  </text>
                </g>
              );
            })}

            {/* === PHASE NODES === */}
            {PHASE_WP_INDICES.map((wpIdx, i) => {
              const wp = PTS[wpIdx];
              const info = PHASE_ITEM_TOTALS[i];
              const isCompleted = completedItems >= info.cumulative;
              const isActive = currentPhaseIdx === i;
              const pct = phaseProgresses[i];
              const r = isActive ? 18 : 14;

              return (
                <g
                  key={`pn-${i}`}
                  className="transition-all duration-500 cursor-pointer"
                  onMouseEnter={(e) => handlePhaseHover(e, i)}
                  onMouseMove={(e) => {
                    if (!tooltip) return;
                    const svg = e.currentTarget.closest('svg');
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    setTooltip((prev) => prev ? { ...prev, x: Math.min(e.clientX - rect.left, rect.width - 10), y: Math.min(e.clientY - rect.top - 10, rect.height - 10) } : null);
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {isActive && (
                    <circle cx={wp.x} cy={wp.y} r={r + 7} fill="none" className="stroke-indigo-400/40 dark:stroke-indigo-500/40" strokeWidth="2">
                      <animate attributeName="r" from={r + 5} to={r + 15} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Road sign pole */}
                  <line x1={wp.x + 2} y1={wp.y - r - 2} x2={wp.x + 2} y2={wp.y - r - 26} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" opacity="0.5" />

                  {isCompleted ? (
                    <>
                      <circle cx={wp.x} cy={wp.y} r={r + 3} fill="#6366f1" stroke="#4f46e5" strokeWidth="1" />
                      <circle cx={wp.x} cy={wp.y} r={r} fill="#818cf8" filter="url(#nodeGlow)" />
                      <text x={wp.x} y={wp.y + 1} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">✓</text>
                      {/* Road sign */}
                      <rect x={wp.x - 12} y={wp.y - r - 24} width="28" height="14" rx="3" fill="#818cf8" opacity="0.9" />
                      <text x={wp.x} y={wp.y - r - 14} textAnchor="middle" className="text-[7px] fill-white font-bold">DONE</text>
                    </>
                  ) : isActive ? (
                    <>
                      <circle cx={wp.x} cy={wp.y} r={r + 3} fill="white" stroke="#6366f1" strokeWidth="2.5" />
                      <circle cx={wp.x} cy={wp.y} r={r} fill="#6366f1" filter="url(#nodeGlow)" />
                      <text x={wp.x} y={wp.y + 1} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="13" fontWeight="bold">{i + 1}</text>
                      {/* Active road sign */}
                      <rect x={wp.x - 16} y={wp.y - r - 24} width="36" height="14" rx="3" fill="#6366f1" opacity="0.9" />
                      <text x={wp.x} y={wp.y - r - 14} textAnchor="middle" className="text-[7px] fill-white font-bold">{Math.round(pct)}%</text>
                    </>
                  ) : (
                    <>
                      <circle cx={wp.x} cy={wp.y} r={r} className="fill-gray-200 dark:fill-dark-600" stroke="#d1d5db" strokeWidth="1.2" />
                      <text x={wp.x} y={wp.y + 1} textAnchor="middle" dominantBaseline="central" className="fill-gray-400 dark:fill-gray-500" fontSize="12" fontWeight="bold">{i + 1}</text>
                    </>
                  )}

                  {/* Phase label */}
                  {!compact && (
                    <text x={wp.x} y={wp.y + r + 13} textAnchor="middle" className={`text-[8px] font-bold ${
                      isCompleted ? 'fill-emerald-600 dark:fill-emerald-400' :
                      isActive ? 'fill-indigo-600 dark:fill-indigo-400' :
                      'fill-gray-400 dark:fill-gray-500'
                    }`}>
                      Phase {i + 1}
                    </text>
                  )}
                  <text x={wp.x} y={wp.y + r + (compact ? 10 : 22)} textAnchor="middle" className="text-[7px] fill-gray-400 dark:fill-gray-500">
                    {info.total} items
                  </text>

                  {/* Progress ring */}
                  {!isCompleted && pct > 0 && pct < 100 && (
                    <circle
                      cx={wp.x} cy={wp.y} r={r + 4}
                      fill="none" className="stroke-indigo-400 dark:stroke-indigo-500"
                      strokeWidth="2" strokeDasharray={`${(pct / 100) * 50} 50`}
                      transform={`rotate(-90 ${wp.x} ${wp.y})`}
                    />
                  )}
                </g>
              );
            })}

            {/* === HIKER === */}
            {completionPct < 1 && (
              <g filter="url(#hikerGlow)">
                <HikerSVG x={hikerPos.x} y={hikerPos.y} angle={hikerPos.angle} />
              </g>
            )}

            {/* Hiker info badge */}
            {completionPct < 1 && !compact && (
              <g>
                <rect
                  x={hikerPos.x > 230 ? hikerPos.x - 88 : hikerPos.x + 14}
                  y={hikerPos.y - 34}
                  width="78" height="20" rx="5"
                  fill="#1e1b4b" opacity="0.85"
                />
                <text
                  x={hikerPos.x > 230 ? hikerPos.x - 82 : hikerPos.x + 20}
                  y={hikerPos.y - 21}
                  className="text-[7.5px] fill-white font-bold"
                >
                  🚶 {completedItems}/{TOTAL_ITEMS}
                </text>
                <text
                  x={hikerPos.x > 210 ? hikerPos.x - 82 : hikerPos.x + 20}
                  y={hikerPos.y - 28}
                  className="text-[6px] fill-amber-300"
                >
                  {Math.round(completionPct * 100)}% complete
                </text>
              </g>
            )}

            {/* Summit flag */}
            <g>
              <line x1={PTS[34].x} y1={PTS[34].y - 10} x2={PTS[34].x} y2={PTS[34].y - 62} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.8" strokeDasharray="3 2" />
              <polygon
                points={`${PTS[34].x},${PTS[34].y - 62} ${PTS[34].x + 20},${PTS[34].y - 70} ${PTS[34].x},${PTS[34].y - 78}`}
                className={completionPct >= 1 ? 'fill-purple-500' : 'fill-gray-300 dark:fill-dark-500'}
              />
              {completionPct >= 1 && (
                <polygon
                  points={`${PTS[34].x},${PTS[34].y - 62} ${PTS[34].x + 20},${PTS[34].y - 70} ${PTS[34].x},${PTS[34].y - 78}`}
                  fill="#a855f7" filter="url(#nodeGlow)" opacity="0.6"
                />
              )}
              <text x={PTS[34].x + 24} y={PTS[34].y - 66}
                className={`text-[7px] font-bold ${completionPct >= 1 ? 'fill-purple-600 dark:fill-purple-400' : 'fill-gray-400 dark:fill-gray-500'}`}
              >
                SUMMIT
              </text>
              {completionPct >= 1 && (
                <text x={PTS[34].x} y={PTS[34].y - 90} textAnchor="middle" className="text-[11px] font-bold fill-amber-500">🎉</text>
              )}
            </g>

            {/* Elevation scale */}
            <g className="dark:opacity-60">
              {[
                { label: 'Summit', y: 30 },
                { label: 'Phase 9', y: 54 },
                { label: 'Phase 7', y: 100 },
                { label: 'Phase 5', y: 210 },
                { label: 'Phase 3', y: 340 },
                { label: 'Phase 1', y: 460 },
                { label: 'Start', y: 560 },
              ].map((e, i) => (
                <text key={`el-${i}`} x={SVG_W - 10} y={e.y} textAnchor="end" className="text-[6.5px] fill-gray-400 dark:fill-gray-500 font-medium tracking-tight"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(255,255,255,0.6)', strokeWidth: '2px' }}>
                  {e.label}
                </text>
              ))}
              <line x1={SVG_W - 26} y1={30} x2={SVG_W - 14} y2={30} className="stroke-gray-300 dark:stroke-dark-500" strokeWidth="0.5" />
              <line x1={SVG_W - 26} y1={560} x2={SVG_W - 14} y2={560} className="stroke-gray-300 dark:stroke-dark-500" strokeWidth="0.5" />
              <line x1={SVG_W - 22} y1={30} x2={SVG_W - 22} y2={560} className="stroke-gray-300 dark:stroke-dark-500" strokeWidth="0.5" strokeDasharray="2 3" />
            </g>

            {/* Progress bar at top-right */}
            {!compact && (
              <g transform={`translate(${SVG_W - 78}, 8)`}>
                <rect x="0" y="0" width="70" height="12" rx="6" className="fill-gray-200 dark:fill-dark-600" />
                <rect x="0" y="0" width={Math.round(completionPct * 70)} height="12" rx="6" className="fill-indigo-400 dark:fill-indigo-500" />
                <text x="35" y="9" textAnchor="middle" className="text-[7px] fill-gray-600 dark:fill-gray-200 font-bold">
                  {Math.round(completionPct * 100)}%
                </text>
              </g>
            )}

            {/* Legend */}
            <g transform={`translate(8, ${SVG_H - 15})`} className="dark:opacity-70">
              <rect x="-5" y="-8" width="138" height="18" rx="4" className="fill-white/75 dark:fill-dark-800/75" />
              <circle cx="4" cy="1" r="3.5" fill="#818cf8" stroke="#6366f1" strokeWidth="0.5" />
              <text x="10" y="4" className="text-[7px] fill-gray-500 dark:fill-gray-400 font-medium">Done</text>
              <circle cx="44" cy="1" r="3.5" fill="#6366f1" stroke="#white" strokeWidth="1" />
              <text x="50" y="4" className="text-[7px] fill-gray-500 dark:fill-gray-400 font-medium">Active</text>
              <circle cx="88" cy="1" r="3.5" className="fill-gray-200 dark:fill-dark-600" stroke="#d1d5db" strokeWidth="0.8" />
              <text x="94" y="4" className="text-[7px] fill-gray-500 dark:fill-gray-400 font-medium">Ahead</text>
            </g>
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute z-20 pointer-events-none bg-gray-900 dark:bg-dark-700 text-white px-3 py-2.5 rounded-lg shadow-xl border border-gray-700 dark:border-gray-600"
              style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
            >
              <div className="text-xs font-bold text-white">{tooltip.phase} — {tooltip.title.length > 24 ? tooltip.title.slice(0, 22) + '…' : tooltip.title}</div>
              <div className="text-[11px] text-gray-200 dark:text-gray-200 mt-0.5">{tooltip.items}</div>
              <div className="text-[11px] text-indigo-300">{Math.round(tooltip.pct)}% done</div>
              <div className="absolute w-2 h-2 bg-gray-900 dark:bg-dark-700 rotate-45 left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-gray-700 dark:border-gray-600" />
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <Link
          to="/motivation"
          className="mt-3 block text-center text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium py-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
        >
          Full Motivation Dashboard →
        </Link>
      )}
    </div>
  );
}

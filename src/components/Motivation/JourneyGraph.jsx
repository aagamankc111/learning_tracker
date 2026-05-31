import { useJourney } from '../../hooks/useJourney';
import { Link } from 'react-router-dom';
import { useGamification } from '../../hooks/useGamification';

// Winding trail waypoints (x, y) — a meandering path like a river
const TRAIL_WAYPOINTS = [
  { x: 120, y: 480 },   // Phase 1 — Start (bottom-leftish)
  { x: 300, y: 400 },   // Phase 2 — curves right and up
  { x: 100, y: 310 },   // Phase 3 — swings back left
  { x: 340, y: 220 },   // Phase 4 — crosses right
  { x: 80,  y: 150 },   // Phase 5 — back left, climbing
  { x: 310, y: 90 },    // Phase 6 — right again
  { x: 130, y: 50 },    // Phase 7 — left peak area
  { x: 300, y: 30 },    // Phase 8 — nearing summit
  { x: 200, y: 15 },    // Phase 9 — Summit!
];

const PHASE_COLORS_HEX = {
  indigo: '#6366f1', emerald: '#10b981', violet: '#8b5cf6',
  amber: '#f59e0b', rose: '#f43f5e', cyan: '#06b6d4',
  orange: '#f97316', pink: '#ec4899', purple: '#a855f7',
};

const PHASE_NAMES = {
  indigo: 'Phase 1', emerald: 'Phase 2', violet: 'Phase 3',
  amber: 'Phase 4', rose: 'Phase 5', cyan: 'Phase 6',
  orange: 'Phase 7', pink: 'Phase 8', purple: 'Phase 9',
};

const PHASE_COLORS = [
  { name: 'indigo', hex: '#6366f1', bg: 'bg-indigo-500', light: 'from-indigo-500 to-indigo-600' },
  { name: 'emerald', hex: '#10b981', bg: 'bg-emerald-500', light: 'from-emerald-500 to-emerald-600' },
  { name: 'violet', hex: '#8b5cf6', bg: 'bg-violet-500', light: 'from-violet-500 to-violet-600' },
  { name: 'amber', hex: '#f59e0b', bg: 'bg-amber-500', light: 'from-amber-500 to-amber-600' },
  { name: 'rose', hex: '#f43f5e', bg: 'bg-rose-500', light: 'from-rose-500 to-rose-600' },
  { name: 'cyan', hex: '#06b6d4', bg: 'bg-cyan-500', light: 'from-cyan-500 to-cyan-600' },
  { name: 'orange', hex: '#f97316', bg: 'bg-orange-500', light: 'from-orange-500 to-orange-600' },
  { name: 'pink', hex: '#ec4899', bg: 'bg-pink-500', light: 'from-pink-500 to-pink-600' },
  { name: 'purple', hex: '#a855f7', bg: 'bg-purple-500', light: 'from-purple-500 to-purple-600' },
];

function buildPathD(waypoints) {
  if (waypoints.length < 2) return '';
  let d = `M ${waypoints[0].x} ${waypoints[0].y}`;
  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    const cx1 = prev.x + (curr.x - prev.x) * 0.5;
    const cy1 = prev.y;
    const cx2 = curr.x - (curr.x - prev.x) * 0.5;
    const cy2 = curr.y;
    d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }
  return d;
}

const SVG_W = 400;
const SVG_H = 520;

export default function JourneyGraph({ compact = false }) {
  const { currentDay, currentPhase, journeyProgress, phases, getPhaseProgress } = useJourney();
  const { stats, level } = useGamification();
  const totalXp = stats?.total_xp || 0;

  const completedUntil = phases.findIndex((p) => {
    const endDay = Number(p.days.split('-')[1] || 90);
    return currentDay <= endDay;
  });
  const completedCount = completedUntil >= 0 ? completedUntil : phases.length;

  const fullPath = buildPathD(TRAIL_WAYPOINTS);
  const completedPath = buildPathD(TRAIL_WAYPOINTS.slice(0, Math.max(completedCount + 1, 1)));

  return (
    <div className={`bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={`font-bold text-gray-800 dark:text-gray-100 ${compact ? 'text-sm' : 'text-lg'}`}>
            🗺️ Trail Map
          </h3>
          {!compact && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Day {currentDay} of 90 · {journeyProgress}% complete
            </p>
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Lv.{level}</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{totalXp.toLocaleString()} XP</span>
            <span className="text-emerald-600 dark:text-emerald-400">{stats?.current_streak || 0}🔥</span>
          </div>
        )}
      </div>

      {/* The Map */}
      <div className="relative overflow-x-auto -mx-1">
        <div className="relative min-w-[320px]" style={{ maxWidth: SVG_W }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-auto"
            style={{ aspectRatio: `${SVG_W}/${SVG_H}` }}
          >
            <defs>
              <linearGradient id="trailGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="0.5" className="fill-gray-200 dark:fill-dark-600" />
              </pattern>
              <pattern id="gridLarge" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" className="fill-gray-300 dark:fill-dark-500" opacity="0.5" />
              </pattern>
            </defs>

            {/* Background grid / contour lines */}
            <rect width={SVG_W} height={SVG_H} className="fill-gray-50 dark:fill-dark-800/80" rx="12" />

            {/* Contour lines — terrain feel */}
            <path d="M 0 100 Q 100 80 200 110 T 400 90" className="stroke-gray-200 dark:stroke-dark-700" fill="none" strokeWidth="0.8" opacity="0.6" />
            <path d="M 0 160 Q 150 130 250 170 T 400 150" className="stroke-gray-200 dark:stroke-dark-700" fill="none" strokeWidth="0.8" opacity="0.5" />
            <path d="M 0 220 Q 120 190 220 230 T 400 210" className="stroke-gray-200 dark:stroke-dark-700" fill="none" strokeWidth="0.8" opacity="0.4" />
            <path d="M 0 280 Q 180 250 280 290 T 400 270" className="stroke-gray-200 dark:stroke-dark-700" fill="none" strokeWidth="0.8" opacity="0.3" />
            <path d="M 0 340 Q 140 310 240 350 T 400 330" className="stroke-gray-200 dark:stroke-dark-700" fill="none" strokeWidth="0.8" opacity="0.3" />
            <path d="M 0 400 Q 160 370 260 410 T 400 390" className="stroke-gray-200 dark:stroke-dark-700" fill="none" strokeWidth="0.8" opacity="0.2" />
            <path d="M 0 460 Q 100 440 200 470 T 400 450" className="stroke-gray-200 dark:stroke-dark-700" fill="none" strokeWidth="0.8" opacity="0.2" />

            {/* Mountain silhouettes in background */}
            <path d="M 0 100 L 40 30 L 80 100 Z" className="fill-gray-200/30 dark:fill-dark-600/20" />
            <path d="M 60 80 L 110 10 L 160 80 Z" className="fill-gray-200/40 dark:fill-dark-600/30" />
            <path d="M 280 60 L 330 15 L 380 60 Z" className="fill-gray-200/30 dark:fill-dark-600/20" />
            <path d="M 320 80 L 370 25 L 400 80 Z" className="fill-gray-200/20 dark:fill-dark-600/15" />

            {/* Trees — small decorative elements */}
            {[
              { x: 15, y: 130 }, { x: 55, y: 170 }, { x: 340, y: 260 },
              { x: 370, y: 340 }, { x: 25, y: 380 }, { x: 350, y: 450 },
              { x: 380, y: 480 }, { x: 10, y: 290 },
            ].map((t, i) => (
              <g key={`tree-${i}`} opacity="0.4">
                <rect x={t.x} y={t.y} width="2" height="6" className="fill-amber-700/40 dark:fill-amber-800/40" rx="1" />
                <circle cx={t.x + 1} cy={t.y - 2} r="5" className="fill-emerald-500/30 dark:fill-emerald-700/30" />
                <circle cx={t.x + 1} cy={t.y - 5} r="4" className="fill-emerald-500/40 dark:fill-emerald-700/40" />
              </g>
            ))}

            {/* River/water feature */}
            <path d="M 0 490 Q 60 485 120 490 T 250 485 T 400 490" className="stroke-cyan-300/30 dark:stroke-cyan-700/20" fill="none" strokeWidth="3" />

            {/* Full trail (dim/uncompleted portion) */}
            <path
              d={fullPath}
              className="stroke-gray-300 dark:stroke-dark-600"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 4"
            />

            {/* Completed trail (filled portion) */}
            {completedCount > 0 && (
              <path
                d={completedPath}
                stroke="url(#trailGrad)"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                className="transition-all duration-1000"
              />
            )}

            {/* Phase nodes */}
            {TRAIL_WAYPOINTS.map((wp, i) => {
              const colorInfo = PHASE_COLORS[i];
              const phase = phases[i];
              if (!phase) return null;
              const endDay = Number(phase.days.split('-')[1] || 90);
              const isCompleted = currentDay > endDay;
              const isActive = currentPhase?.id === phase.id;
              const phaseProgress = getPhaseProgress(phase.id);
              const nodeRadius = isActive ? 18 : 14;

              return (
                <g key={i} className="transition-all duration-500">
                  {/* Node outer glow for active */}
                  {isActive && (
                    <circle
                      cx={wp.x} cy={wp.y} r={nodeRadius + 6}
                      fill="none"
                      className="stroke-indigo-400/50 dark:stroke-indigo-500/50"
                      strokeWidth="2"
                      opacity="0.7"
                    >
                      <animate attributeName="r" from={nodeRadius + 4} to={nodeRadius + 10} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Node circle */}
                  <circle
                    cx={wp.x} cy={wp.y} r={nodeRadius}
                    className={`transition-all duration-500 ${
                      isCompleted
                        ? 'fill-emerald-500 stroke-white dark:stroke-dark-800'
                        : isActive
                        ? `fill-white stroke-2 ${colorInfo.bg.replace('bg-', 'stroke-')}`
                        : 'fill-gray-200 dark:fill-dark-600 stroke-gray-300 dark:stroke-dark-500'
                    }`}
                    strokeWidth={isActive ? 3 : 2}
                    filter={isActive ? 'url(#nodeGlow)' : undefined}
                  />

                  {/* Node icon/check */}
                  {isCompleted ? (
                    <text x={wp.x} y={wp.y + 1} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10" fontWeight="bold">
                      ✓
                    </text>
                  ) : (
                    <text x={wp.x} y={wp.y + 1} textAnchor="middle" dominantBaseline="central" className={isActive ? '' : 'fill-gray-400 dark:fill-gray-500'} fontSize="12">
                      {phase.icon}
                    </text>
                  )}

                  {/* Node label */}
                  <text
                    x={wp.x}
                    y={wp.y + nodeRadius + 14}
                    textAnchor="middle"
                    className={`text-[9px] font-semibold transition-all ${
                      isCompleted ? 'fill-emerald-600 dark:fill-emerald-400' :
                      isActive ? 'fill-indigo-600 dark:fill-indigo-400' :
                      'fill-gray-400 dark:fill-gray-500'
                    }`}
                  >
                    {phase.phase}
                  </text>

                  {/* Day range tag */}
                  <text
                    x={wp.x}
                    y={wp.y + nodeRadius + 25}
                    textAnchor="middle"
                    className="text-[7px] fill-gray-400 dark:fill-gray-500"
                  >
                    {phase.days}
                  </text>

                  {/* Title card — shown for active/completed phases, hidden for far-upcoming */}
                  {(isActive || (isCompleted && !compact)) && (
                    <g>
                      {/* Card background */}
                      <rect
                        x={wp.x > 200 ? wp.x - 130 : wp.x + nodeRadius + 8}
                        y={wp.y - 16}
                        width="120"
                        height={phase.milestones && !compact ? 38 : 22}
                        rx="6"
                        className={`fill-white dark:fill-dark-700 stroke-gray-200 dark:stroke-dark-600`}
                        strokeWidth="1"
                      />
                      {/* Card text */}
                      <text
                        x={wp.x > 200 ? wp.x - 124 : wp.x + nodeRadius + 14}
                        y={wp.y - 3}
                        className="text-[8px] fill-gray-800 dark:fill-gray-100 font-semibold"
                      >
                        {phase.title.length > 18 ? phase.title.slice(0, 16) + '…' : phase.title}
                      </text>
                      {phaseProgress > 0 && (
                        <text
                          x={wp.x > 200 ? wp.x - 124 : wp.x + nodeRadius + 14}
                          y={wp.y + 7}
                          className="text-[7px] fill-gray-400 dark:fill-gray-500"
                        >
                          {phaseProgress}% complete
                        </text>
                      )}
                    </g>
                  )}

                  {/* Small progress ring around node (for active/in-progress) */}
                  {!isCompleted && phaseProgress > 0 && phaseProgress < 100 && (
                    <circle
                      cx={wp.x} cy={wp.y} r={nodeRadius + 3}
                      fill="none"
                      className="stroke-amber-400 dark:stroke-amber-500"
                      strokeWidth="1.5"
                      strokeDasharray={`${(phaseProgress / 100) * 50} 50`}
                      transform={`rotate(-90 ${wp.x} ${wp.y})`}
                    />
                  )}

                  {/* Phase progress bar (below node when applicable) */}
                </g>
              );
            })}

            {/* "You are here" marker */}
            {currentDay <= 90 && currentDay > 0 && (() => {
              const segIndex = Math.min(completedCount, TRAIL_WAYPOINTS.length - 2);
              const segStart = TRAIL_WAYPOINTS[segIndex];
              const segEnd = TRAIL_WAYPOINTS[Math.min(segIndex + 1, TRAIL_WAYPOINTS.length - 1)];
              const phasePct = currentPhase ? (getPhaseProgress(currentPhase.id) / 100) : 0;
              const mx = segStart.x + (segEnd.x - segStart.x) * Math.min(phasePct, 1);
              const my = segStart.y + (segEnd.y - segStart.y) * Math.min(phasePct, 1);
              return (
                <g>
                  <circle cx={mx} cy={my} r="5" fill="white" className="stroke-indigo-500" strokeWidth="2.5" filter="url(#nodeGlow)">
                    <animate attributeName="r" from="4" to="6" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <text x={mx + 9} y={my - 5} className="text-[7px] fill-indigo-600 dark:fill-indigo-400 font-bold uppercase tracking-wider">
                    ● You are here
                  </text>
                </g>
              );
            })()}

            {/* Destination flag at the top */}
            <g>
              <line x1={TRAIL_WAYPOINTS[8].x} y1={TRAIL_WAYPOINTS[8].y - 18} x2={TRAIL_WAYPOINTS[8].x} y2={TRAIL_WAYPOINTS[8].y - 60} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" strokeDasharray="3 2" />
              <polygon
                points={`${TRAIL_WAYPOINTS[8].x},${TRAIL_WAYPOINTS[8].y - 60} ${TRAIL_WAYPOINTS[8].x + 20},${TRAIL_WAYPOINTS[8].y - 68} ${TRAIL_WAYPOINTS[8].x},${TRAIL_WAYPOINTS[8].y - 76}`}
                className={`${currentDay >= 90 ? 'fill-purple-500' : 'fill-gray-300 dark:fill-dark-500'}`}
              />
              <text x={TRAIL_WAYPOINTS[8].x + 24} y={TRAIL_WAYPOINTS[8].y - 64} className={`text-[8px] font-bold ${currentDay >= 90 ? 'fill-purple-600 dark:fill-purple-400' : 'fill-gray-400 dark:fill-gray-500'}`}>
                GOAL
              </text>
            </g>

            {/* Elevation markers on the right */}
            {[90, 60, 30, 0].map((e, i) => (
              <text key={`elev-${i}`} x={SVG_W - 12} y={20 + i * 30} textAnchor="end" className="text-[7px] fill-gray-300 dark:fill-dark-500 font-mono">
                {e === 90 ? 'Day 90' : e === 60 ? 'Day 60' : e === 30 ? 'Day 30' : 'Start'}
              </text>
            ))}
            <line x1={SVG_W - 30} y1={25} x2={SVG_W - 18} y2={25} className="stroke-gray-300 dark:stroke-dark-500" strokeWidth="0.5" />

            {/* Legend */}
            <g transform={`translate(8, ${SVG_H - 18})`}>
              <circle cx="0" cy="-2" r="3" className="fill-emerald-500" />
              <text x="7" y="1" className="text-[7px] fill-gray-400 dark:fill-gray-500">Done</text>
              <circle cx="40" cy="-2" r="3" className="fill-indigo-500" />
              <text x="47" y="1" className="text-[7px] fill-gray-400 dark:fill-gray-500">Active</text>
              <circle cx="80" cy="-2" r="3" className="fill-gray-300 dark:fill-dark-500" />
              <text x="87" y="1" className="text-[7px] fill-gray-400 dark:fill-gray-500">Upcoming</text>
            </g>
          </svg>
        </div>
      </div>

      {!compact && (
        <Link
          to="/motivation"
          className="mt-4 block text-center text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium py-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
        >
          View Full Motivation Dashboard →
        </Link>
      )}
    </div>
  );
}

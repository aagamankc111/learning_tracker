const COLOR_MAP = {
  slate: { bg: 'bg-slate-500', text: 'text-slate-700', light: 'bg-slate-50', border: 'border-slate-200', gradient: 'from-slate-500 to-slate-600', glow: 'rgba(100,116,139,0.3)' },
  stone: { bg: 'bg-stone-500', text: 'text-stone-700', light: 'bg-stone-50', border: 'border-stone-200', gradient: 'from-stone-500 to-stone-600', glow: 'rgba(120,113,108,0.3)' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600', glow: 'rgba(59,130,246,0.3)' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-700', light: 'bg-violet-50', border: 'border-violet-200', gradient: 'from-violet-500 to-violet-600', glow: 'rgba(139,92,246,0.3)' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200', gradient: 'from-amber-500 to-amber-600', glow: 'rgba(245,158,11,0.3)' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200', gradient: 'from-orange-500 to-orange-600', glow: 'rgba(249,115,22,0.3)' },
  red: { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-200', gradient: 'from-red-500 to-red-600', glow: 'rgba(239,68,68,0.3)' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600', glow: 'rgba(168,85,247,0.3)' },
};

export default function RankBadge({ rank, rankProgress, nextRank, size = 'md' }) {
  if (!rank) return null;

  const c = COLOR_MAP[rank.color] || COLOR_MAP.indigo;
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className={`inline-flex items-center gap-3 ${isLarge ? 'p-5' : isSmall ? 'p-2' : 'p-3'} rounded-xl bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all group`}>
      <div className={`${isLarge ? 'text-4xl w-16 h-16' : isSmall ? 'text-xl w-8 h-8' : 'text-3xl w-12 h-12'} flex items-center justify-center rounded-lg ${c.light} ${c.text}`}>
        {rank.icon}
      </div>
      <div>
        <div className={`font-bold ${isLarge ? 'text-xl' : isSmall ? 'text-xs' : 'text-sm'} ${c.text}`}>{rank.title}</div>
        <div className={`${isSmall ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400`}>{rank.subtitle}</div>
        {rankProgress !== undefined && nextRank && (
          <div className="flex items-center gap-2 mt-1">
            <div className="bg-gray-200 dark:bg-dark-600 rounded-full h-1.5 flex-1 min-w-[60px]">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${rankProgress}%` }} />
            </div>
            <span className={`text-[10px] text-gray-400 dark:text-gray-500`}>{rankProgress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

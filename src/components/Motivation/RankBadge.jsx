const COLOR_MAP = {
  slate: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  stone: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  blue: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  violet: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  amber: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  orange: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  red: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
  purple: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)' },
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
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all" style={{ width: `${rankProgress}%` }} />
            </div>
            <span className={`text-[10px] text-gray-400 dark:text-gray-500`}>{rankProgress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

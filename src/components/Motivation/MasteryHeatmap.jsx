import { useMetrics } from '../../hooks/useMetrics';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getIntensity(percent) {
  if (percent === 0) return 'bg-gray-100';
  if (percent < 25) return 'bg-emerald-100';
  if (percent < 50) return 'bg-emerald-300';
  if (percent < 75) return 'bg-emerald-500';
  return 'bg-emerald-600';
}

export default function MasteryHeatmap({ compact = false }) {
  const { weeklyLogs, consistencyScore } = useMetrics();

  const today = new Date();
  const grid = [];

  for (let i = 55; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = weeklyLogs.find(l => l.log_date === dateStr);
    const items = log?.items_completed || 0;
    const xp = log?.xp_earned || 0;
    grid.push({
      date: dateStr,
      day: d.getDate(),
      month: d.getMonth(),
      dayOfWeek: d.getDay(),
      items,
      xp,
      active: !!log,
    });
  }

  const weeks = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  const totalActive = grid.filter(g => g.active).length;

  return (
    <div className={`bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-gray-800 dark:text-gray-100 ${compact ? 'text-sm' : 'text-lg'}`}>
          📅 Learning Activity
        </h3>
        <div className="text-right">
          <div className={`font-bold text-emerald-600 dark:text-emerald-400 ${compact ? 'text-sm' : 'text-lg'}`}>{consistencyScore}%</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">Consistency</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm ${getIntensity(day.active ? (day.items * 25) : 0)} relative group cursor-pointer`}
                  title={`${day.date}: ${day.items} items, ${day.xp} XP`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                    <div className="bg-gray-900 dark:bg-dark-700 text-white dark:text-gray-100 text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                      {day.date}: {day.items} items, {day.xp} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-dark-600" />
          <div className="w-3 h-3 rounded-sm bg-emerald-100" />
          <div className="w-3 h-3 rounded-sm bg-emerald-300" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600" />
          <span>More</span>
        </div>
        <span>{totalActive} active days in last 8 weeks</span>
      </div>
    </div>
  );
}

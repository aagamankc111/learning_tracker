import { useMetrics } from '../../hooks/useMetrics';

const trendIcons = { increasing: '📈', decreasing: '📉', stable: '➡️' };
const trendColors = { increasing: 'text-emerald-600', decreasing: 'text-red-600', stable: 'text-gray-500' };

export default function MetricsCard({ compact = false }) {
  const { velocity, topicMastery, masteryScore, consistencyScore, velocityTrend } = useMetrics();

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
      <div className={`${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-gray-800 dark:text-gray-100 ${compact ? 'text-sm' : 'text-lg'}`}>
            📊 Data-Centric Metrics
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">Last 30 days</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-3 border border-gray-100 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mastery Score</span>
              <span className="text-emerald-500 text-xs">{trendIcons[velocityTrend.trend]}</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{masteryScore}%</div>
            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-1.5 mt-2">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${masteryScore}%` }} />
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              Topic mastery aggregate
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-3 border border-gray-100 dark:border-dark-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Consistency</span>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">{consistencyScore}%</div>
            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-1.5 mt-2">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${consistencyScore}%` }} />
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              {consistencyScore >= 80 ? 'Elite consistency 🔥' : consistencyScore >= 50 ? 'Building momentum 💪' : 'Getting started 🌱'}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-3 border border-gray-100 dark:border-dark-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Velocity</span>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
              {velocity?.itemsPerDay || 0}
              <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">/day</span>
            </div>
            <div className={`text-xs mt-1 ${trendColors[velocityTrend.trend]}`}>
              {trendIcons[velocityTrend.trend]} {velocityTrend.trend}
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              {velocity?.totalItems || 0} total items
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-3 border border-gray-100 dark:border-dark-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Time Invested</span>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
              {velocity?.totalMinutes || 0}
              <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">min</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {velocity?.minutesPerDay || 0} min/day avg
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              {velocity?.activeDays || 0} active days
            </div>
          </div>
        </div>

        {!compact && topicMastery && topicMastery.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-700">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Topic Breakdown</h4>
            <div className="grid sm:grid-cols-3 gap-2">
              {topicMastery.map(t => (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600 dark:text-gray-300 w-24 truncate">{t.name}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${t.percent}%` }}
                    />
                  </div>
                  <span className="text-gray-400 dark:text-gray-500 w-8 text-right">{t.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

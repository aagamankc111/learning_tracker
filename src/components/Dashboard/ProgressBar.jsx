import { clamp } from '../../utils/helpers';

export default function ProgressBar({ completed, total }) {
  const percent = total > 0 ? clamp(Math.round((completed / total) * 100), 0, 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-700">Overall Progress</h2>
        <span className="text-sm font-bold text-indigo-600">{completed} / {total} ({percent}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div className="progress-bar h-full bg-indigo-600 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

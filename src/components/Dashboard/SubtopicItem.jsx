import { memo } from 'react';

function SubtopicItem({ subtopic, isChecked, onToggle }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition ${isChecked ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggle(subtopic.id, !isChecked)}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
      />
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {subtopic.title}
        </div>
        {subtopic.description && (
          <div className={`text-xs mt-0.5 ${isChecked ? 'text-gray-300' : 'text-gray-500'}`}>
            {subtopic.description}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {subtopic.resource_url && (
          <a
            href={subtopic.resource_url}
            target="_blank" rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition px-2 py-1 rounded hover:bg-indigo-50"
          >
            Resource
          </a>
        )}
      </div>
    </div>
  );
}

export default memo(SubtopicItem);

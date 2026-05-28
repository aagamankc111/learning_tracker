import { useState, memo } from 'react';
import SubtopicItem from './SubtopicItem';

function TopicSection({ topic, progressMap, onToggle }) {
  const [open, setOpen] = useState(true);
  const subtopics = topic.subtopics || [];
  const completedCount = subtopics.filter((s) => progressMap[s.id] === true).length;
  const totalCount = subtopics.length;
  const topicPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="topic-section bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden fade-in">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-5 py-4 cursor-pointer hover:bg-gray-50 transition select-none text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <svg
            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-semibold text-gray-800 truncate">{topic.name}</span>
          <span className="text-xs text-gray-400 hidden sm:inline truncate">{topic.description || ''}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs font-medium text-gray-500">{completedCount}/{totalCount}</div>
          <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden hidden sm:block">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${topicPercent}%` }}></div>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4 space-y-2">
          {subtopics.map((sub) => (
            <SubtopicItem
              key={sub.id}
              subtopic={sub}
              isChecked={progressMap[sub.id] === true}
              onToggle={onToggle}
            />
          ))}
          {subtopics.length === 0 && (
            <p className="text-sm text-gray-400 py-2">No subtopics found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(TopicSection);

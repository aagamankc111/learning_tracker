import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTopics } from '../../hooks/useTopics';
import { useProgress } from '../../hooks/useProgress';
import Header from '../Layout/Header';
import ProgressBar from './ProgressBar';
import TopicSection from './TopicSection';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import Toast from '../common/Toast';

export default function Dashboard() {
  const { user } = useAuth();
  const { topics, loading: topicsLoading, error: topicsError, refetch } = useTopics();
  const {
    progressMap, loading: progressLoading,
    loadProgress, toggleProgress, getOverallProgress,
  } = useProgress(user?.id);

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const pendingRef = useRef({});

  useEffect(() => {
    if (user?.id) { loadProgress(); }
  }, [user?.id, loadProgress]);

  const allSubtopics = topics.flatMap((t) => t.subtopics || []);
  const { total, completed } = getOverallProgress(allSubtopics);

  const handleToggle = useCallback(async (subtopicId, completed) => {
    if (pendingRef.current[subtopicId]) return;
    pendingRef.current[subtopicId] = true;

    setToastVisible(false);

    try {
      await toggleProgress(subtopicId, completed);
      setToastMsg(completed ? 'Marked as learned' : 'Marked as not learned');
      setToastVisible(true);
    } finally {
      delete pendingRef.current[subtopicId];
    }
  }, [toggleProgress]);

  if (topicsLoading || progressLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header email={user?.email} />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <LoadingSpinner message="Loading your learning data..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header email={user?.email} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        <ErrorMessage message={topicsError} onRetry={refetch} />

        {!topicsError && topics.length === 0 && (
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
            No topics found. Make sure you have run the SQL schema in Supabase.
          </div>
        )}

        <ProgressBar completed={completed} total={total} />

        <div className="space-y-3">
          {topics.map((topic) => (
            <TopicSection
              key={topic.id}
              topic={topic}
              progressMap={progressMap}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </main>

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}

import { useState, useCallback, useRef } from 'react';
import { fetchUserProgress, upsertProgress } from '../services/progressService';
import { calculateProgress } from '../utils/helpers';

export function useProgress(userId) {
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const pendingRef = useRef({});

  const loadProgress = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchUserProgress(userId);
      const map = {};
      for (const p of data) {
        map[p.subtopic_id] = p.completed;
      }
      setProgressMap(map);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const toggleProgress = useCallback(async (subtopicId, completed) => {
    if (!userId) return;

    if (pendingRef.current[subtopicId]) return;
    pendingRef.current[subtopicId] = true;

    setProgressMap((prev) => ({ ...prev, [subtopicId]: completed }));

    try {
      await upsertProgress(userId, subtopicId, completed);
    } catch {
      setProgressMap((prev) => ({ ...prev, [subtopicId]: !completed }));
      throw new Error('Failed to save progress to cloud');
    } finally {
      delete pendingRef.current[subtopicId];
    }
  }, [userId]);

  const getOverallProgress = useCallback((allSubtopics) => {
    const total = allSubtopics.length;
    const completed = allSubtopics.filter((s) => progressMap[s.id] === true).length;
    return { total, completed, percent: calculateProgress(completed, total) };
  }, [progressMap]);

  const getTopicProgress = useCallback((subtopics) => {
    const total = subtopics.length;
    const completed = subtopics.filter((s) => progressMap[s.id] === true).length;
    return { total, completed, percent: calculateProgress(completed, total) };
  }, [progressMap]);

  return {
    progressMap,
    loading,
    loadProgress,
    toggleProgress,
    getOverallProgress,
    getTopicProgress,
  };
}

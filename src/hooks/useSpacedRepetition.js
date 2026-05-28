import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchDueReviews, fetchAllReviews, upsertReview, calculateNextReview,
} from '../services/spacedRepetitionService';

export function useSpacedRepetition() {
  const { user } = useAuth();
  const [dueReviews, setDueReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [due, all] = await Promise.all([
        fetchDueReviews(user.id),
        fetchAllReviews(user.id),
      ]);
      setDueReviews(due);
      setAllReviews(all);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const submitReview = useCallback(async (subtopicId, quality) => {
    if (!user) return;
    const existing = allReviews.find((r) => r.subtopic_id === subtopicId);
    const next = calculateNextReview(quality, existing);
    await upsertReview(user.id, subtopicId, next);
    await loadAll();
  }, [user, allReviews, loadAll]);

  const dueCount = dueReviews.length;
  const totalReviewCount = allReviews.length;

  return {
    dueReviews, allReviews, dueCount, totalReviewCount, loading,
    submitReview, refresh: loadAll,
  };
}

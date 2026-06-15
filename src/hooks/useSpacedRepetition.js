import { useState, useEffect, useCallback } from 'react';
import {
  fetchDueReviews, fetchAllReviews, upsertReview, calculateNextReview,
} from '../services/spacedRepetitionService';

export function useSpacedRepetition() {
  const [dueReviews, setDueReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [due, all] = await Promise.all([
        fetchDueReviews(),
        fetchAllReviews(),
      ]);
      setDueReviews(due);
      setAllReviews(all);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const submitReview = useCallback(async (questionId, quality) => {
    const existing = allReviews.find((r) => r.question?.id === questionId);
    const next = calculateNextReview(quality, existing);
    upsertReview(questionId, next);
    await loadAll();
  }, [allReviews, loadAll]);

  const addToReview = useCallback(async (questionId) => {
    const existing = allReviews.find((r) => r.question?.id === questionId);
    if (!existing) {
      const next = calculateNextReview(5, null);
      upsertReview(questionId, next);
      await loadAll();
    }
  }, [allReviews, loadAll]);

  return {
    dueReviews, allReviews, dueCount: dueReviews.length, totalReviewCount: allReviews.length, loading,
    submitReview, addToReview, refresh: loadAll,
  };
}

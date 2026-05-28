import { useState, useEffect, useCallback } from 'react';
import { fetchTopicsWithSubtopics } from '../services/topicsService';

export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTopicsWithSubtopics();
      setTopics(data);
    } catch (err) {
      setError(err.message || 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { topics, loading, error, refetch: load };
}

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchLearningVelocity,
  fetchTopicMastery,
  calculateMasteryScore,
  calculateConsistencyScore,
  calculateLearningVelocity,
} from '../services/metricsService';
import { fetchWeeklyLogs } from '../services/dailyTrackingService';

export function useMetrics() {
  const { user } = useAuth();
  const [velocity, setVelocity] = useState(null);
  const [topicMastery, setTopicMastery] = useState([]);
  const [masteryScore, setMasteryScore] = useState(0);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [v, tm] = await Promise.all([
        fetchLearningVelocity(user.id, 30),
        fetchTopicMastery(user.id),
      ]);

      setVelocity(v);
      setTopicMastery(tm);
      setMasteryScore(calculateMasteryScore(tm));

      const end = new Date();
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      const logs = await fetchWeeklyLogs(user.id, start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
      setWeeklyLogs(logs);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMetrics();
    const handler = () => loadMetrics();
    window.addEventListener('progress-updated', handler);
    return () => window.removeEventListener('progress-updated', handler);
  }, [loadMetrics]);

  const consistencyScore = calculateConsistencyScore(weeklyLogs);
  const velocityTrend = calculateLearningVelocity(weeklyLogs, 7);

  return {
    velocity,
    topicMastery,
    masteryScore,
    consistencyScore,
    velocityTrend,
    weeklyLogs,
    loading,
    refresh: loadMetrics,
  };
}

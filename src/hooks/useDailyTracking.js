import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDailyLog, upsertDailyLog, fetchWeeklyLogs } from '../services/dailyTrackingService';

export function useDailyTracking() {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState(null);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const loadToday = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchDailyLog(user.id, today);
      setTodayLog(data);
    } catch {
      setTodayLog(null);
    } finally {
      setLoading(false);
    }
  }, [user, today]);

  const loadWeek = useCallback(async () => {
    if (!user) return;
    const start = new Date();
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    try {
      const data = await fetchWeeklyLogs(
        user.id,
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );
      setWeeklyLogs(data);
    } catch {
      setWeeklyLogs([]);
    }
  }, [user]);

  useEffect(() => {
    loadToday();
    loadWeek();
  }, [loadToday, loadWeek]);

  const trackActivity = useCallback(async (itemsCompleted, xpEarned, minutesStudied) => {
    if (!user) return;
    try {
      const existing = todayLog || {};
      await upsertDailyLog(user.id, today, {
        items_completed: (existing.items_completed || 0) + itemsCompleted,
        xp_earned: (existing.xp_earned || 0) + xpEarned,
        minutes_studied: (existing.minutes_studied || 0) + (minutesStudied || 0),
      });
      await loadToday();
    } catch (err) {
      console.error('Failed to track activity:', err);
    }
  }, [user, today, todayLog, loadToday]);

  const todayItems = todayLog?.items_completed || 0;
  const todayXp = todayLog?.xp_earned || 0;
  const todayMinutes = todayLog?.minutes_studied || 0;

  return {
    todayItems, todayXp, todayMinutes,
    weeklyLogs, loading,
    trackActivity, refresh: loadToday,
  };
}

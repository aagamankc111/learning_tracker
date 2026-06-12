import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserStats, upsertUserStats,
  fetchAchievements, fetchUserAchievements, awardAchievement,
  calculateLevel,
} from '../services/gamificationService';
import { validateStreakOnLoad } from '../services/progressUpdateService';

export function useGamification() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef(stats);
  const allAchievementsRef = useRef(allAchievements);
  const userAchievementsRef = useRef(userAchievements);

  useEffect(() => { statsRef.current = stats; }, [stats]);
  useEffect(() => { allAchievementsRef.current = allAchievements; }, [allAchievements]);
  useEffect(() => { userAchievementsRef.current = userAchievements; }, [userAchievements]);

  const updateStats = useCallback(async (updates) => {
    if (!user) return;
    try {
      const newStats = { ...(statsRef.current || {}), ...updates };
      await upsertUserStats(user.id, newStats);
      setStats(newStats);
      statsRef.current = newStats;
    } catch (err) {
      console.error('Failed to update stats:', err);
    }
  }, [user]);

  const checkAndAward = useCallback(async (criteria) => {
    if (!user) return;
    const currentStats = statsRef.current;
    const currentAchievements = allAchievementsRef.current;
    const currentUserAchievements = userAchievementsRef.current;
    if (!currentStats) return;

    const earnedIds = new Set(currentUserAchievements.map((ua) => ua.achievement_id));
    const newlyEarned = [];

    for (const ach of currentAchievements) {
      if (earnedIds.has(ach.id)) continue;
      const c = ach.criteria;
      if (!c) continue;

      const parsedC = typeof c === 'string' ? JSON.parse(c) : c;

      let earned = false;
      if (parsedC.type === 'items_completed' && (currentStats?.total_items_completed || 0) >= parsedC.count) {
        earned = true;
      } else if (parsedC.type === 'streak' && (currentStats?.current_streak || 0) >= parsedC.days) {
        earned = true;
      } else if (parsedC.type === 'quizzes_taken' && (currentStats?.total_quizzes_taken || 0) >= parsedC.count) {
        earned = true;
      } else if (parsedC.type === 'quiz_perfect' && criteria?.quizPerfect) {
        earned = true;
      } else if (parsedC.type === 'total_xp' && (currentStats?.total_xp || 0) >= parsedC.count) {
        earned = true;
      }

      if (earned) {
        try {
          await awardAchievement(user.id, ach.id);
          const newUa = { achievement_id: ach.id, achievement: ach, earned_at: new Date().toISOString() };
          setUserAchievements((prev) => [...prev, newUa]);
          userAchievementsRef.current = [...userAchievementsRef.current, newUa];
          if (ach.xp_reward) {
            await updateStats({
              total_xp: (currentStats?.total_xp || 0) + ach.xp_reward,
            });
          }
          newlyEarned.push(ach);
        } catch (err) {
          console.error('Failed to award achievement:', err);
        }
      }
    }

    if (newlyEarned.length > 0) {
      window.dispatchEvent(new CustomEvent('achievement-earned', { detail: newlyEarned }));
    }
  }, [user, updateStats]);

  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let [s, a, ua] = await Promise.all([
        fetchUserStats(user.id),
        fetchAchievements(),
        fetchUserAchievements(user.id),
      ]);

      if (!s) {
        const { data: logs } = await supabase
          .from('daily_log')
          .select('items_completed, xp_earned')
          .eq('user_id', user.id);
        const totalItems = (logs || []).reduce((sum, l) => sum + (l.items_completed || 0), 0);
        const totalXp = (logs || []).reduce((sum, l) => sum + (l.xp_earned || 0), 0);
        if (totalItems > 0 || totalXp > 0) {
          const today = new Date().toISOString().split('T')[0];
          await upsertUserStats(user.id, {
            total_xp: totalXp,
            total_items_completed: totalItems,
            current_streak: 0,
            longest_streak: 0,
            last_active_date: today,
          });
          s = await fetchUserStats(user.id);
        }
      }

      setStats(s);
      setAllAchievements(a);
      setUserAchievements(ua);
      statsRef.current = s;
      allAchievementsRef.current = a;
      userAchievementsRef.current = ua;

      if (s?.last_active_date) {
        await validateStreakOnLoad(user.id);
        const refreshed = await fetchUserStats(user.id);
        setStats(refreshed);
        statsRef.current = refreshed;
        s = refreshed;
      }

      if (s) {
        await checkAndAward();
      }
    } catch (err) {
      console.error('Failed to load gamification data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, checkAndAward]);

  useEffect(() => {
    loadAll();
    const handler = () => loadAll();
    window.addEventListener('progress-updated', handler);
    return () => window.removeEventListener('progress-updated', handler);
  }, [loadAll]);

  useEffect(() => {
    if (stats && allAchievements.length > 0 && !loading) {
      checkAndAward();
    }
  }, [
    stats?.total_items_completed,
    stats?.current_streak,
    stats?.total_quizzes_taken,
  ]);

  useEffect(() => {
    const handler = () => checkAndAward({ quizPerfect: true });
    window.addEventListener('quiz-perfect', handler);
    return () => window.removeEventListener('quiz-perfect', handler);
  }, [checkAndAward]);

  const level = stats ? calculateLevel(stats.total_xp || 0) : 1;
  const xpForNextLevel = level * level * 100;
  const xpForCurrentLevel = (level - 1) * (level - 1) * 100;
  const currentLevelXp = (stats?.total_xp || 0) - xpForCurrentLevel;
  const levelProgress = xpForNextLevel > xpForCurrentLevel
    ? Math.round((currentLevelXp / (xpForNextLevel - xpForCurrentLevel)) * 100)
    : 0;

  const earnedAchievementIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  return {
    stats, level, levelProgress, currentLevelXp,
    xpForNextLevel, xpForCurrentLevel,
    allAchievements, userAchievements, earnedAchievementIds,
    loading,
    updateStats, checkAndAward, refresh: loadAll,
  };
}

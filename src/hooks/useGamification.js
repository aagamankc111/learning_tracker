import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserStats, upsertUserStats,
  fetchAchievements, fetchUserAchievements, awardAchievement,
  calculateLevel,
} from '../services/gamificationService';

export function useGamification() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [s, a, ua] = await Promise.all([
        fetchUserStats(user.id),
        fetchAchievements(),
        fetchUserAchievements(user.id),
      ]);
      setStats(s);
      setAllAchievements(a);
      setUserAchievements(ua);
    } catch (err) {
      console.error('Failed to load gamification data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const updateStats = useCallback(async (updates) => {
    if (!user) return;
    try {
      const newStats = { ...(stats || {}), ...updates };
      await upsertUserStats(user.id, newStats);
      setStats(newStats);
    } catch (err) {
      console.error('Failed to update stats:', err);
    }
  }, [user, stats]);

  const checkAndAward = useCallback(async (criteria) => {
    if (!user) return;
    const earnedIds = new Set(userAchievements.map((ua) => ua.achievement_id));

    for (const ach of allAchievements) {
      if (earnedIds.has(ach.id)) continue;
      const c = ach.criteria;
      if (!c) continue;

      let earned = false;
      if (c.type === 'items_completed' && (stats?.total_items_completed || 0) >= c.count) {
        earned = true;
      } else if (c.type === 'streak' && (stats?.current_streak || 0) >= c.days) {
        earned = true;
      } else if (c.type === 'quizzes_taken' && (stats?.total_quizzes_taken || 0) >= c.count) {
        earned = true;
      } else if (c.type === 'quiz_perfect' && criteria?.quizPerfect) {
        earned = true;
      }

      if (earned) {
        try {
          await awardAchievement(user.id, ach.id);
          setUserAchievements((prev) => [
            ...prev,
            { achievement_id: ach.id, achievement: ach, earned_at: new Date().toISOString() },
          ]);
          if (ach.xp_reward) {
            await updateStats({
              total_xp: (stats?.total_xp || 0) + ach.xp_reward,
            });
          }
        } catch (err) {
          console.error('Failed to award achievement:', err);
        }
      }
    }
  }, [user, allAchievements, userAchievements, stats, updateStats]);

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

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRankForXp, getNextRank, getRankProgress, getRankMilestoneMessage } from '../data/ranks';
import { recordRankAchievement, fetchRankHistory } from '../services/rankService';

export function useRank() {
  const { user } = useAuth();
  const [currentRank, setCurrentRank] = useState(null);
  const [rankHistory, setRankHistory] = useState([]);
  const [lastRankId, setLastRankId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRankData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const history = await fetchRankHistory(user.id);
      setRankHistory(history);

      const lastEntry = history[history.length - 1];
      if (lastEntry) {
        setLastRankId(lastEntry.rank_id);
      }
    } catch (err) {
      console.error('Failed to load rank data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadRankData();
    const handler = () => { if (user) loadRankData(); };
    window.addEventListener('progress-updated', handler);
    return () => window.removeEventListener('progress-updated', handler);
  }, [user, loadRankData]);

  const checkAndUpdateRank = useCallback(async (totalXp) => {
    if (!user) return;
    const newRank = getRankForXp(totalXp);

    if (newRank.id !== (lastRankId || 0)) {
      await recordRankAchievement(user.id, newRank.id, newRank.title, totalXp);
      setLastRankId(newRank.id);
      setRankHistory(prev => [...prev, {
        rank_id: newRank.id,
        rank_title: newRank.title,
        total_xp_at_rank: totalXp,
        achieved_at: new Date().toISOString(),
      }]);
    }

    setCurrentRank(newRank);
    return newRank;
  }, [user, lastRankId]);

  const refresh = useCallback(() => {
    loadRankData();
  }, [loadRankData]);

  const rank = currentRank || getRankForXp(0);
  const nextRank = getNextRank(rank);
  const rankProgress = 0;
  const milestoneMessage = getRankMilestoneMessage(rank.id);

  return {
    rank,
    nextRank,
    rankProgress,
    rankHistory,
    milestoneMessage,
    loading,
    checkAndUpdateRank,
    refresh,
    lastRankId,
  };
}

import { supabase } from '../config/supabase';
import { cacheData, getCachedData, isOnline } from './indexedDBService';

export async function fetchUserRank(userId) {
  try {
    if (isOnline()) {
      const { data, error } = await supabase
        .from('user_rank_history')
        .select('*')
        .eq('user_id', userId)
        .order('achieved_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        await cacheData('user_rank', { id: 'current', ...data });
      }
      return data;
    }

    const cached = await getCachedData('user_rank');
    return cached.find(r => r.id === 'current') || null;
  } catch (err) {
    console.error('fetchUserRank error:', err);
    return null;
  }
}

export async function recordRankAchievement(userId, rankId, rankTitle, totalXp) {
  const { error } = await supabase
    .from('user_rank_history')
    .insert({
      user_id: userId,
      rank_id: rankId,
      rank_title: rankTitle,
      total_xp_at_rank: totalXp,
    });

  if (error && error.code !== '23505') {
    console.error('recordRankAchievement error:', error);
  }
}

export async function fetchRankHistory(userId) {
  try {
    const { data, error } = await supabase
      .from('user_rank_history')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchRankHistory error:', err);
    return [];
  }
}

export async function recordDailySession(userId, sessionData) {
  const { error } = await supabase
    .from('user_daily_sessions')
    .insert({
      user_id: userId,
      ...sessionData,
    });

  if (error) console.error('recordDailySession error:', error);
}

export async function fetchRecentSessions(userId, limit = 7) {
  try {
    const { data, error } = await supabase
      .from('user_daily_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('session_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchRecentSessions error:', err);
    return [];
  }
}

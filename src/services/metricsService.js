import { supabase } from '../config/supabase';

export async function fetchLearningVelocity(userId, days = 30) {
  try {
    const start = new Date();
    start.setDate(start.getDate() - days);
    const startStr = start.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_log')
      .select('log_date, items_completed, minutes_studied, xp_earned')
      .eq('user_id', userId)
      .gte('log_date', startStr)
      .order('log_date', { ascending: true });

    if (error) throw error;

    const logs = data || [];
    const totalItems = logs.reduce((s, l) => s + (l.items_completed || 0), 0);
    const totalMinutes = logs.reduce((s, l) => s + (l.minutes_studied || 0), 0);
    const totalXp = logs.reduce((s, l) => s + (l.xp_earned || 0), 0);
    const activeDays = logs.filter(l => (l.items_completed || 0) > 0).length;
    const totalDays = days;

    return {
      itemsPerDay: totalDays > 0 ? (totalItems / totalDays).toFixed(1) : 0,
      minutesPerDay: totalDays > 0 ? (totalMinutes / totalDays).toFixed(1) : 0,
      xpPerDay: totalDays > 0 ? (totalXp / totalDays).toFixed(1) : 0,
      consistencyScore: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0,
      activeDays,
      totalDays,
      totalItems,
      totalMinutes,
      totalXp,
      rawData: logs,
    };
  } catch (err) {
    console.error('fetchLearningVelocity error:', err);
    return null;
  }
}

export async function fetchTopicMastery(userId) {
  try {
    const { data: topics, error: topicsErr } = await supabase
      .from('topics')
      .select('*, subtopics(*)')
      .order('display_order');

    if (topicsErr) throw topicsErr;

    const { data: progress, error: progErr } = await supabase
      .from('user_progress')
      .select('subtopic_id, completed')
      .eq('user_id', userId);

    if (progErr) throw progErr;

    const progressMap = {};
    if (progress) {
      for (const p of progress) {
        if (p.completed) progressMap[p.subtopic_id] = true;
      }
    }

    return (topics || []).map(topic => {
      const subs = topic.subtopics || [];
      const total = subs.length;
      const completed = subs.filter(s => progressMap[s.id]).length;
      return {
        id: topic.id,
        name: topic.name,
        total,
        completed,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  } catch (err) {
    console.error('fetchTopicMastery error:', err);
    return [];
  }
}

export function calculateMasteryScore(topicMastery) {
  if (!topicMastery || topicMastery.length === 0) return 0;
  const totalPercent = topicMastery.reduce((s, t) => s + t.percent, 0);
  const avgPercent = totalPercent / topicMastery.length;
  const completionRate = topicMastery.filter(t => t.percent >= 80).length / topicMastery.length;
  return Math.round((avgPercent * 0.6 + completionRate * 100 * 0.4));
}

export function calculateConsistencyScore(weeklyLogs) {
  if (!weeklyLogs || weeklyLogs.length === 0) return 0;
  const activeDays = weeklyLogs.filter(l => (l.items_completed || 0) > 0).length;
  return Math.round((activeDays / 7) * 100);
}

export function calculateLearningVelocity(dailyLogs, days = 7) {
  if (!dailyLogs || dailyLogs.length === 0) return { itemsPerDay: 0, trend: 'stable' };
  const total = dailyLogs.reduce((s, l) => s + (l.items_completed || 0), 0);
  const avg = days > 0 ? (total / days) : 0;

  const half = Math.floor(dailyLogs.length / 2);
  const firstHalf = dailyLogs.slice(0, half);
  const secondHalf = dailyLogs.slice(half);
  const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((s, l) => s + (l.items_completed || 0), 0) / firstHalf.length : 0;
  const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s, l) => s + (l.items_completed || 0), 0) / secondHalf.length : 0;

  let trend = 'stable';
  if (secondAvg > firstAvg * 1.2) trend = 'increasing';
  else if (secondAvg < firstAvg * 0.8) trend = 'decreasing';

  return { itemsPerDay: avg.toFixed(1), trend };
}

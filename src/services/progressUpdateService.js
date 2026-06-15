import { supabase } from '../config/supabase';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

async function calculateStreak(userId) {
  const start = new Date();
  start.setDate(start.getDate() - 90);
  const startStr = start.toISOString().split('T')[0];

  const { data: progressData } = await supabase
    .from('daily_progress')
    .select('week_number, day, completed, updated_at')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('updated_at', startStr);

  if (!progressData || progressData.length === 0) return 0;

  const dayCounts = {};
  for (const row of progressData) {
    const key = `${row.week_number}_${row.day}`;
    if (!dayCounts[key]) {
      dayCounts[key] = { count: 0, date: null };
    }
    dayCounts[key].count++;
    const rowDate = row.updated_at.split('T')[0];
    if (!dayCounts[key].date || rowDate > dayCounts[key].date) {
      dayCounts[key].date = rowDate;
    }
  }

  const completedDates = new Set();
  for (const [, info] of Object.entries(dayCounts)) {
    if (info.count >= 1 && info.date) {
      completedDates.add(info.date);
    }
  }

  if (completedDates.size === 0) return 0;

  let streak = 0;
  let missedDays = 0;
  const today = todayStr();

  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    if (completedDates.has(dateStr)) {
      streak++;
      missedDays = 0;
    } else {
      missedDays++;
      if (missedDays >= 1) break;
    }
  }

  return streak;
}

export async function handleItemCheck(userId, weekId, day, itemIndex, completed) {
  const now = new Date().toISOString();
  const today = todayStr();

  const payload = {
    user_id: userId,
    week_number: weekId,
    day: day,
    item_index: itemIndex,
    completed,
    updated_at: now,
  };

  const { error: dpErr } = await supabase
    .from('daily_progress')
    .upsert(payload, { onConflict: 'user_id,week_number,day,item_index' });
  if (dpErr) throw dpErr;

  if (!completed) return;

  const { data: existingLog } = await supabase
    .from('daily_log')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', today)
    .maybeSingle();

  const logUpdates = {
    items_completed: (existingLog?.items_completed || 0) + 1,
    xp_earned: (existingLog?.xp_earned || 0) + 5,
    minutes_studied: existingLog?.minutes_studied || 0,
  };

  const { error: dlErr } = await supabase
    .from('daily_log')
    .upsert(
      { user_id: userId, log_date: today, ...logUpdates },
      { onConflict: 'user_id,log_date' }
    );
  if (dlErr) throw dlErr;

  const streak = await calculateStreak(userId);

  const { data: existingStats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const statsUpdates = {
    total_xp: (existingStats?.total_xp || 0) + 5,
    total_items_completed: (existingStats?.total_items_completed || 0) + 1,
    current_streak: streak,
    longest_streak: Math.max(streak, existingStats?.longest_streak || 0),
    last_active_date: today,
    updated_at: now,
  };

  const { error: usErr } = await supabase
    .from('user_stats')
    .upsert(
      { user_id: userId, ...statsUpdates },
      { onConflict: 'user_id' }
    );
  if (usErr) throw usErr;

  return statsUpdates;
}

export async function validateStreakOnLoad(userId) {
  const { data: stats } = await supabase
    .from('user_stats')
    .select('current_streak, last_active_date')
    .eq('user_id', userId)
    .maybeSingle();

  if (!stats?.last_active_date) return;

  const today = todayStr();
  const lastActive = stats.last_active_date;

  if (lastActive < today) {
    const streak = await calculateStreak(userId);
    if (streak !== stats.current_streak) {
      await supabase
        .from('user_stats')
        .update({ current_streak: streak, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    }
  }
}

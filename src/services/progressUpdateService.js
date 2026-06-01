import { supabase } from '../config/supabase';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

async function calculateStreak(userId) {
  const start = new Date();
  start.setDate(start.getDate() - 90);
  const { data } = await supabase
    .from('daily_log')
    .select('log_date, items_completed')
    .eq('user_id', userId)
    .gte('log_date', start.toISOString().split('T')[0])
    .order('log_date', { ascending: false });
  if (!data) return 0;
  let streak = 0;
  let expected = todayStr();
  for (const log of data) {
    if (log.log_date === expected && (log.items_completed || 0) > 0) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().split('T')[0];
    } else if (log.log_date < expected) break;
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
    .single();

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
    .single();

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

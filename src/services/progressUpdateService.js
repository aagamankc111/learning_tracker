import { supabase } from '../config/supabase';
import { todayStr, localDateStr } from '../utils/helpers';

async function calculateStreak(userId) {
  const start = new Date();
  start.setDate(start.getDate() - 90);
  const startStr = localDateStr(start);

  const { data: logs } = await supabase
    .from('daily_log')
    .select('log_date, items_completed')
    .eq('user_id', userId)
    .gte('log_date', startStr);

  if (!logs || logs.length === 0) return 0;

  const completedDates = new Set(
    logs.filter(l => l.items_completed > 0).map(l => l.log_date)
  );

  if (completedDates.size === 0) return 0;

  let streak = 0;
  let missedDays = 0;

  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = localDateStr(d);

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

export async function syncPhaseProgress(userId, week, day, checkedMap) {
  const allChecked = day.reviewItems.length > 0 &&
    day.reviewItems.every((_, j) => checkedMap[`${day.day}-${j}`]);

  for (const topic of day.topics) {
    const subtopicId = `${week.id}-${day.day}-${topic}`;
    await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        subtopic_id: subtopicId,
        completed: allChecked,
        completed_at: allChecked ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,subtopic_id' });
  }
}

export { calculateStreak };

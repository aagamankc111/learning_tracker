import { supabase } from '../config/supabase';
import { cacheData, getCachedData, isOnline } from './indexedDBService';
import { todayStr } from '../utils/helpers';
import curriculum from '../data/curriculum';

export async function fetchUserProgress(userId) {
  try {
    const { data, error } = await supabase
      .from('daily_progress')
      .select('week_number, day, item_index, completed')
      .eq('user_id', userId);

    if (error) throw error;

    const dpMap = {};
    for (const row of data || []) {
      if (row.completed) dpMap[`${row.week_number}-${row.day}-${row.item_index}`] = true;
    }

    const result = [];
    for (const week of curriculum.weeks) {
      for (const day of week.days) {
        const allDone = day.reviewItems.length > 0 &&
          day.reviewItems.every((_, j) => dpMap[`${week.id}-${day.day}-${j}`]);
        for (const topic of day.topics) {
          const subtopicId = `${week.id}-${day.day}-${topic}`;
          result.push({ subtopic_id: subtopicId, completed: allDone });
        }
      }
    }

    cacheData('progress', result.map((r) => ({ id: r.subtopic_id, ...r })));
    return result;
  } catch (err) {
    console.error('fetchUserProgress error:', err);
    const cached = await getCachedData('progress');
    return cached.map((r) => ({ subtopic_id: r.id, completed: r.completed }));
  }
}

export async function upsertProgress(userId, subtopicId, completed) {
  const now = new Date().toISOString();
  const today = todayStr();

  await cacheData('progress', { id: subtopicId, subtopic_id: subtopicId, completed });

  if (!isOnline()) return;

  const [weekId, day, ...topicParts] = subtopicId.split('-');
  const topicStr = topicParts.join('-');

  for (const week of curriculum.weeks) {
    if (week.id !== Number(weekId)) continue;
    for (const d of week.days) {
      if (d.day !== Number(day)) continue;
      for (let j = 0; j < d.reviewItems.length; j++) {
        await supabase.from('daily_progress').upsert({
          user_id: userId,
          week_number: Number(weekId),
          day: Number(day),
          item_index: j,
          completed,
          updated_at: now,
        }, { onConflict: 'user_id,week_number,day,item_index' });
      }
    }
  }

  if (!completed) return;

  const { data: existingLog } = await supabase
    .from('daily_log')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', today)
    .maybeSingle();

  const { error: dlErr } = await supabase
    .from('daily_log')
    .upsert(
      {
        user_id: userId,
        log_date: today,
        items_completed: (existingLog?.items_completed || 0) + 1,
        xp_earned: (existingLog?.xp_earned || 0) + 5,
        minutes_studied: existingLog?.minutes_studied || 0,
      },
      { onConflict: 'user_id,log_date' }
    );
  if (dlErr) throw dlErr;

  window.dispatchEvent(new CustomEvent('progress-updated'));
}

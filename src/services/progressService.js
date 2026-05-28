import { supabase } from '../config/supabase';
import { cacheData, getCachedData, isOnline } from './indexedDBService';

export async function fetchUserProgress(userId) {
  try {
    if (isOnline()) {
      const { data, error } = await supabase
        .from('user_progress')
        .select('subtopic_id, completed')
        .eq('user_id', userId);

      if (error) throw error;

      const result = data || [];
      cacheData('progress', result.map((r) => ({ ...r, id: r.subtopic_id })));
      return result;
    }

    // Offline: use cached data
    const cached = await getCachedData('progress');
    return cached.map((r) => ({ subtopic_id: r.id, completed: r.completed }));
  } catch (err) {
    console.error('fetchUserProgress error:', err);
    const cached = await getCachedData('progress');
    return cached.map((r) => ({ subtopic_id: r.id, completed: r.completed }));
  }
}

export async function upsertProgress(userId, subtopicId, completed) {
  const now = new Date().toISOString();
  const payload = {
    user_id: userId,
    subtopic_id: subtopicId,
    completed,
    completed_at: completed ? now : null,
    updated_at: now,
  };

  // Cache locally for offline
  await cacheData('progress', { id: subtopicId, subtopic_id: subtopicId, completed });

  if (!isOnline()) return;

  const { error } = await supabase
    .from('user_progress')
    .upsert(payload, { onConflict: 'user_id,subtopic_id' });

  if (error) {
    console.error('user_progress upsert error:', error);
    throw error;
  }
}

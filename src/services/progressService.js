import { supabase } from '../config/supabase';

export async function fetchUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('subtopic_id, completed')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function upsertProgress(userId, subtopicId, completed) {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        subtopic_id: subtopicId,
        completed,
        completed_at: completed ? now : null,
        updated_at: now,
      },
      { onConflict: 'user_id, subtopic_id' }
    );

  if (error) throw error;
}

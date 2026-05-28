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
  const payload = {
    user_id: userId,
    subtopic_id: subtopicId,
    completed,
    completed_at: completed ? now : null,
    updated_at: now,
  };
  console.log('Upserting user_progress:', JSON.stringify(payload, null, 2));

  const { error } = await supabase
    .from('user_progress')
    .upsert(payload, { onConflict: 'user_id,subtopic_id' });

  if (error) {
    console.error('user_progress upsert error:', error);
    throw error;
  }
  console.log('user_progress upsert succeeded');
}

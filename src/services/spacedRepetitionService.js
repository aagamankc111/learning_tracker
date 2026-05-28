import { supabase } from '../config/supabase';

export async function fetchDueReviews(userId) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('spaced_repetition')
    .select('*, subtopic:subtopics(*)')
    .eq('user_id', userId)
    .lte('next_review_date', today)
    .order('next_review_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchAllReviews(userId) {
  const { data, error } = await supabase
    .from('spaced_repetition')
    .select('*, subtopic:subtopics(*)')
    .eq('user_id', userId)
    .order('next_review_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function upsertReview(userId, subtopicId, reviewData) {
  const { error } = await supabase
    .from('spaced_repetition')
    .upsert(
      { user_id: userId, subtopic_id: subtopicId, ...reviewData },
      { onConflict: 'user_id,subtopic_id' }
    );

  if (error) throw error;
}

export function calculateNextReview(quality, previousReview) {
  let { easeFactor = 2.5, intervalDays = 0, repetitions = 0 } = previousReview || {};

  const newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    ease_factor: newEaseFactor,
    interval_days: intervalDays,
    repetitions,
    next_review_date: nextDate.toISOString().split('T')[0],
    last_reviewed_at: new Date().toISOString(),
  };
}

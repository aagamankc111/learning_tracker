import { supabase } from '../config/supabase';

export async function fetchUserStats(userId) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertUserStats(userId, updates) {
  const { error } = await supabase
    .from('user_stats')
    .upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' });

  if (error) throw error;
}

export async function fetchAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('id');

  if (error) throw error;
  return data || [];
}

export async function fetchUserAchievements(userId) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievement:achievements(*)')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function awardAchievement(userId, achievementId) {
  const { error } = await supabase
    .from('user_achievements')
    .insert({ user_id: userId, achievement_id: achievementId });

  if (error && error.code !== '23505') throw error;
}

export function calculateLevel(totalXp) {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

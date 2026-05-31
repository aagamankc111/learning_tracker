import { supabase } from '../config/supabase';

export async function fetchDailyMotivation(userId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_motivation')
      .select('*')
      .eq('user_id', userId)
      .eq('motivation_date', today)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (err) {
    console.error('fetchDailyMotivation error:', err);
    return null;
  }
}

export async function saveDailyMotivation(userId, data) {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('daily_motivation')
    .upsert({
      user_id: userId,
      motivation_date: today,
      ...data,
    }, { onConflict: 'user_id,motivation_date' });

  if (error) console.error('saveDailyMotivation error:', error);
}

export async function fetchWeeklyReflection(userId) {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const startStr = weekAgo.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_log')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', startStr)
      .order('log_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchWeeklyReflection error:', err);
    return [];
  }
}

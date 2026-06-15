import { supabase } from '../config/supabase';
import { todayStr, localDateStr } from '../utils/helpers';

export async function fetchDailyMotivation(userId) {
  try {
    const today = todayStr();
    const { data, error } = await supabase
      .from('daily_motivation')
      .select('id,user_id,motivation_date,quote,quote_author,aagaman_message,feeling,created_at')
      .eq('user_id', userId)
      .eq('motivation_date', today)
      .maybeSingle();

    if (error && error.code === 'PGRST116') return null;
    if (error && error.statusCode === 406) return null;
    if (error) throw error;
    return data;
  } catch (err) {
    if (err.statusCode !== 406) console.warn('fetchDailyMotivation error:', err);
    return null;
  }
}

export async function saveDailyMotivation(userId, data) {
  const today = todayStr();
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
    const startStr = localDateStr(weekAgo);

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

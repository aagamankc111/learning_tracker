import { supabase } from '../config/supabase';

export async function fetchDailyLog(userId, date) {
  const { data, error } = await supabase
    .from('daily_log')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertDailyLog(userId, date, updates) {
  const payload = {
    user_id: userId,
    log_date: date,
    ...updates,
  };

  const { error } = await supabase
    .from('daily_log')
    .upsert(payload, { onConflict: 'user_id,log_date' });

  if (error) throw error;
}

export async function fetchWeeklyLogs(userId, startDate, endDate) {
  const { data, error } = await supabase
    .from('daily_log')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

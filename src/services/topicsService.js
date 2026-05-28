import { supabase } from '../config/supabase';

export async function fetchTopicsWithSubtopics() {
  const { data, error } = await supabase
    .from('topics')
    .select('*, subtopics(*)')
    .order('display_order', { ascending: true })
    .order('display_order', { ascending: true, foreignTable: 'subtopics' });

  if (error) throw error;
  return data || [];
}

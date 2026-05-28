import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://rxdzuhpaqrvxdezohgoa.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZHp1aHBhcXJ2eGRlem9oZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzA2NTksImV4cCI6MjA5NTU0NjY1OX0.xC8hTXflVP6CD0MuoNL1JmYE3t8D4z6-fma95IKcI38';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { getCurrentSession, onAuthStateChange } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await getCurrentSession();
      if (session?.access_token) {
        const { error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
        if (error) {
          await supabase.auth.signOut();
          setUser(null);
          setLoading(false);
          return;
        }
        const { data: { session: refreshed } } = await supabase.auth.getSession();
        setUser(refreshed?.user ?? null);
      }
      setLoading(false);
    })();

    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const value = { user, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

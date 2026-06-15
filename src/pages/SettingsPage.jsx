import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { clearCache } from '../services/indexedDBService';

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        enabled ? 'bg-accent' : 'bg-white/[0.1]'
      }`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-5' : ''
      }`} />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = async () => {
    if (!user || resetting) return;
    if (!window.confirm('This will permanently delete ALL your learning progress. Are you sure?')) return;
    setResetting(true);
    try {
      const uid = user.id;
      console.log('[Reset] Starting reset for user:', uid);

      const r1 = await supabase.from('daily_progress').delete().eq('user_id', uid);
      console.log('[Reset] daily_progress delete:', r1.status, r1.error || 'ok');

      const r2 = await supabase.from('daily_log').delete().eq('user_id', uid);
      console.log('[Reset] daily_log delete:', r2.status, r2.error || 'ok');

      const r3 = await supabase.from('user_stats').delete().eq('user_id', uid);
      console.log('[Reset] user_stats delete:', r3.status, r3.error || 'ok');

      const { error: insErr } = await supabase.from('user_stats').insert({
        user_id: uid,
        current_streak: 0, longest_streak: 0, total_xp: 0,
        total_items_completed: 0,
      });
      if (insErr) {
        console.error('[Reset] user_stats insert failed:', insErr);
        throw insErr;
      }
      console.log('[Reset] user_stats insert: ok');

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('wt_progress_')) localStorage.removeItem(key);
      }
      console.log('[Reset] localStorage cleared');

      await clearCache();
      console.log('[Reset] Cache cleared');

      setResetDone(true);

      setTimeout(() => {
        setResetDone(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('[Reset] FAILED:', err);
      alert('Reset failed: ' + err.message + ' (see console for details)');
      setResetting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h2 className="text-lg font-semibold text-gray-100">Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">Customize your experience</p>
      </div>

      {/* Profile */}
      <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </h3>
        <div className="text-xs text-gray-500">
          Signed in as <span className="text-gray-300 font-medium">{user?.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Active account
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          Preferences
        </h3>

        <SettingRow label="Dark Mode" desc="Toggle between dark and light themes">
          <Toggle enabled={theme === 'dark'} onChange={toggleTheme} />
        </SettingRow>

        <div className="border-t border-white/[0.06]" />

        <SettingRow label="Email Notifications" desc="Get notified about review reminders">
          <Toggle enabled={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
        </SettingRow>

        <div className="border-t border-white/[0.06]" />

        <SettingRow label="Compact View" desc="Show more content with less spacing">
          <Toggle enabled={compactView} onChange={() => setCompactView(!compactView)} />
        </SettingRow>
      </div>

      {/* About */}
      <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>
          About
        </h3>
        <div className="text-xs text-gray-500">LearnTrack v2.0</div>
        <div className="text-xs text-gray-500">DevOps & Cloud Learning Journey</div>
        <div className="text-xs text-gray-600 mt-1">Build for engineers who build the future.</div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface-card border border-red-500/20 rounded-xl p-4">
        <h3 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h3>
        <button onClick={handleReset} disabled={resetting}
          className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition disabled:opacity-50">
          {resetting ? 'Resetting...' : resetDone ? 'Done!' : 'Reset All Progress'}
        </button>
        <p className="text-[10px] text-gray-600 mt-2">This will permanently delete all your learning progress.</p>
      </div>
    </div>
  );
}

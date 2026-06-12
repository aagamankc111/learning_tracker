import { useState } from 'react';
import { useDailyMotivation } from '../../hooks/useDailyMotivation';

export default function MotivationBanner() {
  const { todaysQuote, aagamanMessage, streakMessage, logMotivation } = useDailyMotivation();
  const [dismissed, setDismissed] = useState(false);
  const [feeling, setFeeling] = useState(null);

  if (dismissed) return null;

  const handleFeeling = async (f) => {
    setFeeling(f);
    await logMotivation(f);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl overflow-hidden relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition text-lg"
      >
        ✕
      </button>

      <div className="flex items-start gap-4 flex-wrap">
        <div className="bg-white/20 rounded-xl p-3 text-center min-w-[80px]">
          <div className="text-2xl">💪</div>
          <div className="text-[10px] text-white/70 mt-1">Aagaman</div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <p className="text-sm text-white/80 italic leading-relaxed">
            "{todaysQuote?.quote}"
          </p>
          <p className="text-xs text-white/50 mt-1">— {todaysQuote?.author}</p>

          <div className="mt-3 bg-white/10 rounded-lg p-3">
            <p className="text-sm font-medium">{aagamanMessage}</p>
          </div>

          {streakMessage && (
            <div className="mt-2 bg-white/20 rounded-lg px-3 py-1.5 text-xs text-white">
              {streakMessage}
            </div>
          )}

          {!feeling && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-white/60">How are you feeling today?</span>
              {['🔥', '💪', '😌', '😴'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleFeeling(emoji)}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {feeling && (
            <div className="text-xs text-white mt-2">
              logged as feeling {feeling}. keep going!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

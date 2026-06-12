import { useState, useEffect } from 'react';
import { DAILY_MOTIVATIONAL_QUOTES, getAagamanMessage } from '../../data/ranks';

function getRandomQuote() {
  const idx = Math.floor(Math.random() * DAILY_MOTIVATIONAL_QUOTES.length);
  return DAILY_MOTIVATIONAL_QUOTES[idx];
}

export default function MotivationToast() {
  const [quote, setQuote] = useState(null);
  const [aagamanMessage, setAagamanMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuote(getRandomQuote());
      setAagamanMessage(getAagamanMessage());
      setVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible || !quote) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] max-w-sm animate-slide-up">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-2xl shadow-2xl p-5 pointer-events-auto border border-indigo-400/30">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition text-lg"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{quote.phaseIcon}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full">
            {quote.phase}
          </span>
          <span className="text-[10px] text-indigo-300/60 ml-auto">100-Day Challenge</span>
        </div>

        <div className="relative pl-3 border-l-2 border-indigo-300/40">
          <p className="text-base text-white/90 italic leading-relaxed font-medium">
            "{quote.quote}"
          </p>
          <p className="text-sm text-indigo-200/70 mt-1.5 font-medium">— {quote.author}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-indigo-200/80 leading-relaxed">
            💬 {aagamanMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

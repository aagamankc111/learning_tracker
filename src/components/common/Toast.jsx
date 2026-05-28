import { useState, useEffect, useCallback, useRef } from 'react';

export default function Toast({ message, duration = 2000, visible }) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (visible && message) {
      setIsVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsVisible(false), duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [message, duration, visible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm toast fade-in">
      {message}
    </div>
  );
}

import { createContext, useContext, useState, useCallback } from 'react';
import AchievementPopup from '../components/Motivation/AchievementPopup';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [queue, setQueue] = useState([]);

  const notify = useCallback((type, data) => {
    const id = Date.now() + Math.random();
    setQueue(prev => [...prev, { id, type, data }]);
  }, []);

  const dismiss = useCallback((id) => {
    setQueue(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {queue.map(n => (
          <div key={n.id} className="pointer-events-auto">
            <AchievementPopup
              type={n.type}
              data={n.data}
              onDismiss={() => dismiss(n.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

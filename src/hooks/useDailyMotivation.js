import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDailyQuote, getAagamanMessage } from '../data/ranks';
import { fetchDailyMotivation, saveDailyMotivation } from '../services/motivationService';
import { useGamification } from './useGamification';

export function useDailyMotivation() {
  const { user } = useAuth();
  const { stats } = useGamification();
  const [todaysQuote, setTodaysQuote] = useState(null);
  const [aagamanMessage, setAagamanMessage] = useState('');
  const [streakMessage, setStreakMessage] = useState('');
  const [motivationData, setMotivationData] = useState(null);

  const loadMotivation = useCallback(async () => {
    const quote = getDailyQuote();
    const message = getAagamanMessage();
    setTodaysQuote(quote);
    setAagamanMessage(message);

    if (user) {
      const saved = await fetchDailyMotivation(user.id);
      setMotivationData(saved);
    }

    if (stats?.current_streak >= 3 && stats?.current_streak < 7) {
      setStreakMessage(`🔥 ${stats.current_streak}-day streak! You're building momentum. Day 7 = unbreakable habit.`);
    } else if (stats?.current_streak >= 7 && stats?.current_streak < 14) {
      setStreakMessage(`🔥🔥 ${stats.current_streak}-day streak! Habits are forming. You're in the zone.`);
    } else if (stats?.current_streak >= 14 && stats?.current_streak < 30) {
      setStreakMessage(`🔥🔥🔥 ${stats.current_streak}-day streak! Elite consistency. Most people can't do this.`);
    } else if (stats?.current_streak >= 30) {
      setStreakMessage(`🏆 ${stats.current_streak}-day streak! You are UNSTOPPABLE. This is legendary.`);
    } else if (stats?.current_streak === 1) {
      setStreakMessage('🌟 Day 1! The most important step. Every streak starts with a single day.');
    } else if (stats?.current_streak === 2) {
      setStreakMessage('💪 Two days in a row! Consistency is building. Make it three.');
    } else {
      setStreakMessage('Start today. Even 15 minutes moves you forward. Consistency > Intensity.');
    }
  }, [user, stats]);

  useEffect(() => {
    loadMotivation();
  }, [loadMotivation]);

  const logMotivation = useCallback(async (feeling) => {
    if (!user) return;
    await saveDailyMotivation(user.id, {
      quote: todaysQuote?.quote || '',
      quote_author: todaysQuote?.author || '',
      aagaman_message: aagamanMessage,
      feeling,
    });
  }, [user, todaysQuote, aagamanMessage]);

  return {
    todaysQuote,
    aagamanMessage,
    streakMessage,
    motivationData,
    logMotivation,
    refresh: loadMotivation,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { useProgress } from './useProgress';
import { useTopics } from './useTopics';
import { useAuth } from '../context/AuthContext';
import { JOURNEY_MILESTONES, LONG_TERM_MILESTONES, getCurrentMilestone } from '../data/milestones';
import { fetchWeeklyLogs } from '../services/dailyTrackingService';

export function useJourney() {
  const { user } = useAuth();
  const { topics } = useTopics();
  const { progressMap } = useProgress(user?.id);
  const [weeklyData, setWeeklyData] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    if (!user) return;
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 30);
    fetchWeeklyLogs(user.id, start.toISOString().split('T')[0], end.toISOString().split('T')[0])
      .then(setWeeklyData)
      .catch(() => setWeeklyData([]));

    const daysSinceStart = Math.floor((Date.now() - new Date('2026-05-30').getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setCurrentDay(Math.min(90, Math.max(1, daysSinceStart)));
  }, [user]);

  const allSubtopics = topics.flatMap(t => t.subtopics || []);
  const completedCount = allSubtopics.filter(s => progressMap[s.id] === true).length;
  const totalCount = allSubtopics.length;
  const overallPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentPhase = getCurrentMilestone(currentDay);

  const getPhaseProgress = useCallback((phaseId) => {
    if (phaseId <= 4 && phaseId <= JOURNEY_MILESTONES.length) {
      const phase = JOURNEY_MILESTONES[phaseId - 1];
      return phase ? Math.min(100, Math.round((currentDay / parseInt(phase.days.split('-')[1])) * 100)) : 0;
    }
    return 0;
  }, [currentDay]);

  const journeyProgress = Math.min(100, Math.round((currentDay / 90) * 100));

  return {
    currentDay,
    currentPhase,
    journeyProgress,
    overallPercent,
    completedCount,
    totalCount,
    getPhaseProgress,
    phases: [...JOURNEY_MILESTONES, ...LONG_TERM_MILESTONES],
    weeklyData,
  };
}

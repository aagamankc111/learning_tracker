import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateQuizFromCurriculum, recordQuizAttempt, fetchQuizHistory } from '../services/quizService';

export function useQuiz() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);

  const startQuiz = useCallback((topic) => {
    const qs = generateQuizFromCurriculum(topic, 5);
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setFinished(false);
  }, []);

  const answerQuestion = useCallback((answer) => {
    const isCorrect = answer === questions[currentIndex]?.correctAnswer;
    const newAnswers = [...answers, { question: currentIndex, answer, isCorrect }];
    setAnswers(newAnswers);
    if (isCorrect) setScore((s) => s + 1);

    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      if (user) {
        recordQuizAttempt(user.id, 'topic_quiz', isCorrect ? score + 1 : score, questions.length);
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [questions, currentIndex, answers, score, user]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchQuizHistory(user.id);
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }, [user]);

  return {
    questions, currentIndex, currentQuestion: questions[currentIndex],
    score, answers, finished, history,
    totalQuestions: questions.length,
    startQuiz, answerQuestion, loadHistory,
  };
}

import { useState, useCallback, useRef } from 'react';
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
  const storedQuestionsRef = useRef([]);

  const startQuiz = useCallback((topic) => {
    const hasPrebuilt = topic._questions;
    if (hasPrebuilt) {
      storedQuestionsRef.current = hasPrebuilt;
      setQuestions(hasPrebuilt);
    } else {
      const qs = generateQuizFromCurriculum(topic, 5);
      storedQuestionsRef.current = qs;
      setQuestions(qs);
    }
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setFinished(false);
  }, []);

  const answerQuestion = useCallback((answer) => {
    const qs = storedQuestionsRef.current;
    if (!qs.length) return;

    const isCorrect = answer === qs[currentIndex]?.correctAnswer;
    const newAnswers = [...answers, { question: currentIndex, answer, isCorrect }];
    setAnswers(newAnswers);
    if (isCorrect) setScore((s) => s + 1);

    if (currentIndex + 1 >= qs.length) {
      setFinished(true);
      if (user) {
        recordQuizAttempt(
          user.id,
          'topic_quiz',
          isCorrect ? score + 1 : score,
          qs.length
        );
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, answers, score, user]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchQuizHistory(user.id);
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }, [user]);

  const qs = storedQuestionsRef.current;
  const currentQuestion = qs.length > 0 ? qs[currentIndex] : null;

  return {
    questions: qs,
    currentIndex,
    currentQuestion,
    score,
    answers,
    finished,
    history,
    totalQuestions: qs.length,
    startQuiz,
    answerQuestion,
    loadHistory,
  };
}

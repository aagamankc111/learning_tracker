import { supabase } from '../config/supabase';
import curriculum from '../data/curriculum';
import {
  QUIZ_BANK,
  getQuestionsByPhase,
  getQuestionsByDifficulty,
  getQuestionsByCategory,
  getRandomQuestions,
  getQuestionsForInterview,
} from '../data/quizData';

export async function fetchQuizQuestions(subtopicId) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('subtopic_id', subtopicId);

  if (error) throw error;
  return data || [];
}

export async function recordQuizAttempt(userId, quizType, score, totalQuestions) {
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_type: quizType,
      score,
      total_questions: totalQuestions,
    });

  if (error) throw error;
}

export async function fetchQuizHistory(userId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
}

export function generateQuiz(filters = {}, count = 10) {
  return getRandomQuestions(count, filters).map((q) => ({
    question: q.q,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: q.explanation,
    subtopicId: q.id,
    title: q.category,
    phase: q.phase,
    difficulty: q.difficulty,
    category: q.category,
    source: q.source || null,
  }));
}

export function getQuizStats() {
  const totalQuestions = QUIZ_BANK.length;
  const byPhase = {};
  const byDifficulty = {};
  const byCategory = {};

  for (const q of QUIZ_BANK) {
    byPhase[q.phase] = (byPhase[q.phase] || 0) + 1;
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
    byCategory[q.category] = (byCategory[q.category] || 0) + 1;
  }

  return {
    totalQuestions,
    byPhase,
    byDifficulty,
    byCategory,
    interviewQuestions: QUIZ_BANK.filter((q) =>
      ['interview', 'system-design', 'behavioral'].includes(q.category)
    ).length,
  };
}

const CATEGORY_LABELS = {
  conceptual: 'Conceptual',
  scenario: 'Scenario',
  interview: 'Interview',
  certification: 'Certification',
  'system-design': 'System Design',
  behavioral: 'Behavioral',
};

const CATEGORY_COLORS = {
  conceptual: 'bg-blue-100 text-blue-700',
  scenario: 'bg-amber-100 text-amber-700',
  interview: 'bg-violet-100 text-violet-700',
  certification: 'bg-emerald-100 text-emerald-700',
  'system-design': 'bg-rose-100 text-rose-700',
  behavioral: 'bg-cyan-100 text-cyan-700',
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export { CATEGORY_LABELS, CATEGORY_COLORS, DIFFICULTY_COLORS, QUIZ_BANK, getQuestionsForInterview };

export function generateQuizFromCurriculum(topic, count = 5) {
  const questions = [];
  const subtopics = topic.subtopics || [];
  const title = topic.title?.toLowerCase() || '';
  const phaseMatch = curriculum.weeks.find((w) =>
    title.includes(w.title.toLowerCase()) || title.includes(`week ${w.id}`)
  );
  const phaseId = phaseMatch?.id || null;

  const pool = phaseId
    ? QUIZ_BANK.filter((q) => q.phase === phaseId)
    : QUIZ_BANK;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (const q of shuffled) {
    if (questions.length >= count) break;
    questions.push({
      question: q.q,
      options: q.opts,
      correctAnswer: q.ans,
      explanation: q.explanation,
      subtopicId: q.id,
      title: q.category,
      phase: q.phase,
      difficulty: q.difficulty,
      category: q.category,
    });
  }

  while (questions.length < count) {
    const fallback = QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)];
    if (!questions.find((x) => x.question === fallback.q)) {
      questions.push({
        question: fallback.q,
        options: fallback.opts,
        correctAnswer: fallback.ans,
        explanation: fallback.explanation,
        subtopicId: fallback.id,
        title: fallback.category,
        phase: fallback.phase,
        difficulty: fallback.difficulty,
        category: fallback.category,
      });
    }
  }

  return questions;
}

export function generateRandomQuiz(count = 10) {
  const shuffled = [...QUIZ_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q) => ({
    question: q.q,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: q.explanation,
    subtopicId: q.id,
    title: 'Mixed Topics',
    phase: q.phase,
    difficulty: q.difficulty,
    category: q.category,
  }));
}

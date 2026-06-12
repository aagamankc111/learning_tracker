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

  const { data: stats } = await supabase
    .from('user_stats')
    .select('total_xp, total_quizzes_taken')
    .eq('user_id', userId)
    .maybeSingle();

  const quizXp = Math.round((score / totalQuestions) * 20);
  const { error: upsertError } = await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      total_quizzes_taken: (stats?.total_quizzes_taken || 0) + 1,
      total_xp: (stats?.total_xp || 0) + quizXp,
    }, { onConflict: 'user_id' });

  if (upsertError) throw upsertError;
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
  conceptual: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  scenario: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  interview: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  certification: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'system-design': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  behavioral: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
};

const DIFFICULTY_COLORS = {
  easy: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  medium: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  hard: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
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

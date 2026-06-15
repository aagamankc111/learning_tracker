import { QUIZ_BANK } from '../data/quizData';
import { todayStr, localDateStr } from '../utils/helpers';

const STORAGE_KEY = 'spaced_repetition';

function loadReviews() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveReviews(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function fetchDueReviews() {
  const reviews = loadReviews();
  const today = todayStr();
  const due = [];
  for (const [qid, data] of Object.entries(reviews)) {
    if (data.next_review_date <= today) {
      const question = QUIZ_BANK.find((q) => q.id === Number(qid));
      if (question) due.push({ ...data, question });
    }
  }
  return due.sort((a, b) => new Date(a.next_review_date) - new Date(b.next_review_date));
}

export function fetchAllReviews() {
  const reviews = loadReviews();
  const all = [];
  for (const [qid, data] of Object.entries(reviews)) {
    const question = QUIZ_BANK.find((q) => q.id === Number(qid));
    if (question) all.push({ ...data, question });
  }
  return all.sort((a, b) => new Date(a.next_review_date) - new Date(b.next_review_date));
}

export function upsertReview(questionId, reviewData) {
  const reviews = loadReviews();
  reviews[questionId] = { ...reviews[questionId], ...reviewData };
  saveReviews(reviews);
}

export function calculateNextReview(quality, previousReview) {
  let { easeFactor = 2.5, intervalDays = 0, repetitions = 0 } = previousReview || {};

  const newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    easeFactor: newEaseFactor,
    intervalDays,
    repetitions,
    nextReviewDate: localDateStr(nextDate),
    lastReviewedAt: new Date().toISOString(),
  };
}

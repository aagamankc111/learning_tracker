import { useState } from 'react';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import FadeIn from '../components/common/FadeIn';

const QUALITY_LABELS = [
  'Complete blackout',
  'Incorrect after recall',
  'Incorrect but familiar',
  'Correct with difficulty',
  'Correct after hesitation',
  'Perfect recall',
];

export default function ReviewsPage() {
  const { dueReviews, allReviews, dueCount, totalReviewCount, loading, submitReview, refresh } = useSpacedRepetition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);
  const [completing, setCompleting] = useState(false);

  const currentReview = dueReviews[currentIndex];

  const handleShowAnswer = () => setShowAnswer(true);

  const handleRate = async (quality) => {
    if (!currentReview) return;
    setCompleting(true);
    try {
      await submitReview(currentReview.subtopic_id, quality);
      if (currentIndex + 1 >= dueReviews.length) {
        setFinished(true);
      } else {
        setCurrentIndex((i) => i + 1);
        setShowAnswer(false);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setCompleting(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setFinished(false);
    refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Spaced Repetition</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Review Sessions</h1>
          <p className="text-blue-100 mt-1 text-sm">
            Anki-style spaced repetition. Review what you've learned at optimal intervals for long-term retention.
          </p>
          <div className="flex gap-3 mt-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">{dueCount} due now</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">{totalReviewCount} total tracked</span>
          </div>
        </div>
      </FadeIn>

      {dueReviews.length === 0 && !finished && (
        <FadeIn delay={100}>
          <div className="dark:bg-dark-800 dark:border-dark-700 bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="dark:text-gray-100 text-xl font-bold text-gray-800 mb-2">All caught up!</h2>
            <p className="dark:text-gray-400 text-gray-500 text-sm mb-4">No reviews due right now. Check back later or mark more topics for review.</p>
            <p className="dark:text-gray-500 text-xs text-gray-400">Tracked: {totalReviewCount} subtopics</p>
          </div>
        </FadeIn>
      )}

      {!finished && currentReview && (
        <FadeIn key={currentIndex}>
          <div className="dark:bg-dark-800 dark:border-dark-700 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="dark:text-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review {currentIndex + 1} of {dueReviews.length}
              </span>
              <span className="dark:text-blue-400 text-xs text-blue-600 font-medium">
                Due: {currentReview.next_review_date}
              </span>
            </div>
            <div className="w-full dark:bg-dark-600 bg-gray-200 rounded-full h-2 mb-6">
              <div className="h-full dark:bg-blue-600 bg-blue-500 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / dueReviews.length) * 100}%` }} />
            </div>

            <h3 className="dark:text-gray-100 text-lg font-semibold text-gray-800 mb-2">
              {currentReview.subtopic?.title || `Subtopic #${currentReview.subtopic_id}`}
            </h3>
            {currentReview.subtopic?.description && (
              <p className="dark:text-gray-400 text-sm text-gray-500 mb-4">{currentReview.subtopic.description}</p>
            )}

            {!showAnswer ? (
              <button
                onClick={handleShowAnswer}
                className="w-full py-3 dark:bg-blue-700 dark:hover:bg-blue-800 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Show Answer / Rate Recall
              </button>
            ) : (
              <div>
                <p className="dark:text-gray-200 text-sm font-medium text-gray-700 mb-3">How well did you remember?</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {QUALITY_LABELS.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => handleRate(i)}
                      disabled={completing}
                      className={`text-left p-3 rounded-lg border text-sm transition ${
                        i < 3
                          ? 'dark:border-red-800 dark:hover:bg-red-900/20 dark:text-red-300 border-red-200 hover:bg-red-50 text-red-700'
                          : i < 5
                          ? 'dark:border-amber-800 dark:hover:bg-amber-900/20 dark:text-amber-300 border-amber-200 hover:bg-amber-50 text-amber-700'
                          : 'dark:border-emerald-800 dark:hover:bg-emerald-900/20 dark:text-emerald-300 border-emerald-200 hover:bg-emerald-50 text-emerald-700'
                      } disabled:opacity-50`}
                    >
                      {i} — {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4 dark:text-gray-500 text-xs text-gray-400">
              <span>Repetitions: {currentReview.repetitions}</span>
              <span>·</span>
              <span>Interval: {currentReview.interval_days}d</span>
              <span>·</span>
              <span>Ease: {currentReview.ease_factor?.toFixed(2)}</span>
            </div>
          </div>
        </FadeIn>
      )}

      {finished && (
        <FadeIn delay={100}>
          <div className="dark:bg-dark-800 dark:border-dark-700 bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="dark:text-gray-100 text-xl font-bold text-gray-800 mb-2">Session Complete!</h2>
            <p className="dark:text-gray-400 text-gray-500 text-sm mb-4">You reviewed {dueReviews.length} items.</p>
            <button
              onClick={handleRestart}
              className="px-5 py-2 dark:bg-blue-700 dark:hover:bg-blue-800 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Refresh & Check Again
            </button>
          </div>
        </FadeIn>
      )}
    </div>
  );
}

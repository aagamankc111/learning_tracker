import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { QUIZ_BANK, getRandomQuestions, getQuestionsForInterview } from '../data/quizData';

const PHASES = [...new Set(QUIZ_BANK.map((q) => q.phase))].sort();
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const CATEGORIES = [...new Set(QUIZ_BANK.map((q) => q.category))];

const MODES = [
  { id: 'quiz', label: 'Quiz', icon: '🎯', desc: 'Pick a topic and test yourself' },
  { id: 'review', label: 'Spaced Review', icon: '🔄', desc: 'Smart review sessions based on recall' },
  { id: 'interview', label: 'Interview Prep', icon: '💼', desc: 'Real questions from top companies' },
];

function ProgressDot({ filled }) {
  return (
    <div className={`w-2 h-2 rounded-full transition-all ${
      filled ? 'bg-accent scale-100' : 'bg-white/[0.06] scale-75'
    }`} />
  );
}

function ChoiceButton({ label, index, state, onClick }) {
  const letters = ['A', 'B', 'C', 'D'];
  const borders = {
    default: 'border-white/[0.08] hover:border-accent/30 hover:bg-white/[0.03]',
    correct: 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30',
    wrong: 'border-red-500/50 bg-red-500/10 ring-1 ring-red-500/30',
    dimmed: 'border-white/[0.06] opacity-30',
  };

  return (
    <button onClick={onClick} disabled={state === 'dimmed' || state === 'correct' || state === 'wrong'}
      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 text-sm ${
        borders[state] || borders.default
      }`}>
      <span className="flex items-center gap-3">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
          state === 'correct' ? 'bg-emerald-500/20 text-emerald-300' :
          state === 'wrong' ? 'bg-red-500/20 text-red-300' :
          'bg-white/[0.06] text-gray-500'
        }`}>
          {letters[index]}
        </span>
        <span className={`leading-relaxed ${
          state === 'correct' ? 'text-emerald-200' :
          state === 'wrong' ? 'text-red-200' :
          'text-gray-300'
        }`}>
          {label}
        </span>
      </span>
    </button>
  );
}

export default function QuizEngine() {
  const { dueReviews, dueCount, submitReview, addToReview, refresh } = useSpacedRepetition();
  const [mode, setMode] = useState('quiz');
  const [filters, setFilters] = useState({ phase: '', difficulty: '', category: '', count: 10 });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentIndex];

  const startQuiz = useCallback(() => {
    setSelectedAnswer(null);
    setFinished(false);
    setScore(0);
    setAnswers([]);
    setCurrentIndex(0);

    let pool;
    if (mode === 'interview') {
      pool = getQuestionsForInterview();
    } else if (mode === 'review') {
      pool = dueReviews.map((r) => r.question).filter(Boolean);
    } else {
      const opts = {};
      if (filters.phase) opts.phase = Number(filters.phase);
      if (filters.difficulty) opts.difficulty = filters.difficulty;
      if (filters.category) opts.category = filters.category;
      pool = getRandomQuestions(filters.count, opts);
    }

    if (!pool || pool.length === 0) return;

    const qs = pool.map((q) => ({
      id: q.id,
      question: q.q,
      options: q.opts,
      correctAnswer: q.ans,
      explanation: q.explanation,
      source: q.source,
      difficulty: q.difficulty,
      phase: q.phase,
      category: q.category,
      code: q.code || null,
      output: q.output || null,
    }));

    setQuestions(qs.slice(0, Math.min(qs.length, filters.count || 50)));
  }, [mode, filters, dueReviews]);

  useEffect(() => {
    if (mode === 'review' && dueReviews.length > 0) startQuiz();
  }, [mode, dueReviews, startQuiz]);

  const handleAnswer = useCallback((opt) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(opt);
    const correct = opt === currentQuestion?.correctAnswer;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, correct }]);

    if (mode === 'review' && currentQuestion) {
      submitReview(currentQuestion.id, correct ? 4 : 2);
    } else if (currentQuestion) {
      addToReview(currentQuestion.id);
    }
  }, [selectedAnswer, currentQuestion, mode, submitReview, addToReview]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
  }, [currentIndex, questions]);

  const correctCount = useMemo(() => answers.filter((a) => a.correct).length, [answers]);
  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const getChoiceState = (opt) => {
    if (selectedAnswer === null) return 'default';
    if (opt === currentQuestion?.correctAnswer) return 'correct';
    if (opt === selectedAnswer) return 'wrong';
    return 'dimmed';
  };

  if (!questions.length && !finished) {
    return (
      <div className="space-y-5 max-w-2xl">
        <div className="text-center pb-2">
          <span className="text-3xl mb-2 block">📝</span>
          <h2 className="text-lg font-semibold text-gray-100">Quiz & Practice</h2>
          <p className="text-sm text-gray-500 mt-1">Choose a mode and test your knowledge</p>
        </div>

        <div className="grid gap-3">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                mode === m.id
                  ? 'bg-accent/[0.08] border-accent/30 ring-1 ring-accent/20'
                  : 'bg-surface-card border-white/[0.06] hover:border-accent/20 hover:bg-white/[0.02]'
              }`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{m.icon}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-200">{m.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                </div>
                {m.id === 'review' && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    dueCount > 0 ? 'bg-accent/15 text-accent' : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {dueCount} due
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {mode !== 'review' && (
          <div className="bg-surface-card border border-white/[0.06] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Filters</h3>
            <div className="flex flex-wrap gap-2">
              <select value={filters.phase} onChange={(e) => setFilters((f) => ({ ...f, phase: e.target.value }))}
                className="px-3 py-2 bg-surface border border-white/[0.08] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20">
                <option value="">All Phases</option>
                {PHASES.map((p) => (<option key={p} value={p}>Phase {p}</option>))}
              </select>
              <select value={filters.difficulty} onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
                className="px-3 py-2 bg-surface border border-white/[0.08] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20">
                <option value="">Any Difficulty</option>
                {DIFFICULTIES.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                className="px-3 py-2 bg-surface border border-white/[0.08] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20">
                <option value="">Any Category</option>
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <select value={filters.count} onChange={(e) => setFilters((f) => ({ ...f, count: Number(e.target.value) }))}
                className="px-3 py-2 bg-surface border border-white/[0.08] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20">
                {[5, 10, 15, 20, 30].map((n) => (<option key={n} value={n}>{n} questions</option>))}
              </select>
            </div>
            <button onClick={startQuiz}
              className="w-full py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dim transition shadow-lg shadow-accent/15">
              {mode === 'interview' ? 'Start Interview Prep' : 'Start Quiz'}
            </button>
          </div>
        )}

        {mode === 'review' && (
          <div className="bg-surface-card border border-white/[0.06] rounded-xl p-5 text-center space-y-3">
            {dueCount > 0 ? (
              <>
                <span className="text-2xl">🔄</span>
                <p className="text-sm text-gray-300">You have <strong className="text-accent">{dueCount}</strong> questions due for review</p>
                <button onClick={startQuiz}
                  className="px-6 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dim transition shadow-lg shadow-accent/15">
                  Start Review Session
                </button>
              </>
            ) : (
              <>
                <span className="text-3xl">🎉</span>
                <p className="text-sm text-gray-300">All caught up! No reviews due.</p>
                <p className="text-xs text-gray-500">Take a quiz to add items to your review queue.</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  if (currentQuestion && !finished) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">
              {String(currentIndex + 1).padStart(2, '0')}/{String(questions.length).padStart(2, '0')}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-400' :
              currentQuestion.difficulty === 'hard' ? 'bg-red-500/15 text-red-400' :
              'bg-amber-500/15 text-amber-400'
            }`}>
              {currentQuestion.difficulty}
            </span>
            {currentQuestion.category && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent">
                {currentQuestion.category}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-mono">{score}/{currentIndex}</span>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <ProgressDot key={i} filled={i <= currentIndex} />
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-surface-card border border-white/[0.08] rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-medium text-gray-100 leading-relaxed">{currentQuestion.question}</h3>

          {currentQuestion.code && (
            <pre className="mt-4 bg-surface/80 border border-white/[0.06] rounded-lg p-3 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto">
              <code>{currentQuestion.code}</code>
            </pre>
          )}

          <div className="mt-5 space-y-2.5">
            {currentQuestion.options.map((opt, i) => (
              <ChoiceButton key={i} label={opt} index={i}
                state={getChoiceState(opt)}
                onClick={() => handleAnswer(opt)} />
            ))}
          </div>

          {selectedAnswer && (
            <div className="mt-5 p-4 rounded-xl border transition-all animate-slide-up"
              style={{
                backgroundColor: selectedAnswer === currentQuestion.correctAnswer
                  ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                borderColor: selectedAnswer === currentQuestion.correctAnswer
                  ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
              }}>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">
                  {selectedAnswer === currentQuestion.correctAnswer ? '✅' : '❌'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? 'Correct!'
                      : `Not quite — ${currentQuestion.correctAnswer}`
                    }
                  </p>
                  {currentQuestion.explanation && (
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  )}
                  {currentQuestion.source && (
                    <p className="text-[10px] text-gray-600 mt-2 italic">
                      {currentQuestion.source}
                    </p>
                  )}
                  <button onClick={handleNext}
                    className="mt-3 px-4 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dim transition">
                    {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question →'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-md mx-auto animate-scale-in">
        <div className="bg-surface-card border border-white/[0.08] rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">
            {pct === 100 ? '🏆' : pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-xl font-semibold text-gray-100 mb-1">Complete!</h2>
          <p className="text-sm text-gray-400 mb-6">
            <strong className="text-accent text-lg">{correctCount}</strong>
            <span className="text-gray-500"> / {questions.length} correct</span>
          </p>

          <div className="h-2 bg-white/[0.06] rounded-full mb-6 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${
              pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-accent' : 'bg-amber-500'
            }`} style={{ width: `${pct}%` }} />
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-400">{correctCount}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Correct</div>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-xl font-bold text-red-400">{questions.length - correctCount}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Wrong</div>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{pct}%</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Score</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button onClick={() => { setQuestions([]); setFinished(false); refresh(); }}
              className="px-5 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dim transition shadow-lg shadow-accent/15">
              {mode === 'review' ? 'Finish' : 'Try Again'}
            </button>
            {mode !== 'review' && (
              <button onClick={() => { setQuestions([]); setFinished(false); setMode('review'); refresh(); }}
                className="px-5 py-2 bg-white/[0.06] text-gray-300 rounded-xl text-sm font-medium hover:bg-white/[0.1] transition">
                Start Spaced Review
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

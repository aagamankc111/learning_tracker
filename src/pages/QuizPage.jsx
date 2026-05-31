import { useState, useCallback } from 'react';
import { useTopics } from '../hooks/useTopics';
import { useQuiz } from '../hooks/useQuiz';
import {
  generateQuiz,
  generateRandomQuiz,
  getQuizStats,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  DIFFICULTY_COLORS,
  getQuestionsForInterview,
} from '../services/quizService';
import { getAllMilestones } from '../data/milestones';
import FadeIn from '../components/common/FadeIn';

const PHASES = getAllMilestones();

const DIFFICULTIES = [
  { value: '', label: 'Any Difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const CATEGORIES = [
  { value: '', label: 'Any Category' },
  { value: 'conceptual', label: 'Conceptual' },
  { value: 'scenario', label: 'Scenario' },
  { value: 'interview', label: 'Interview' },
  { value: 'certification', label: 'Certification' },
  { value: 'system-design', label: 'System Design' },
  { value: 'behavioral', label: 'Behavioral' },
];

const QUESTION_COUNTS = [5, 10, 15, 20, 30, 50];

export default function QuizPage() {
  const { topics } = useTopics();
  const {
    questions, currentIndex, currentQuestion, score, finished, totalQuestions,
    startQuiz, answerQuestion,
  } = useQuiz();
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState('standard');
  const [stats] = useState(getQuizStats);

  const buildFilters = useCallback(() => {
    const filters = {};
    if (selectedPhase) filters.phase = Number(selectedPhase);
    if (selectedDifficulty) filters.difficulty = selectedDifficulty;
    if (selectedCategory) filters.category = selectedCategory;
    return filters;
  }, [selectedPhase, selectedDifficulty, selectedCategory]);

  const handleStart = useCallback(() => {
    const filters = buildFilters();
    const useInterview = mode === 'interview';

    let qs;
    if (useInterview) {
      const pool = getQuestionsForInterview();
      const filtered = filters.phase
        ? pool.filter((q) => q.phase === Number(filters.phase))
        : pool;
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      qs = shuffled.slice(0, count).map((q) => ({
        question: q.q,
        options: q.opts,
        correctAnswer: q.ans,
        explanation: q.explanation,
        subtopicId: q.id,
        title: q.category,
        phase: q.phase,
        difficulty: q.difficulty,
        category: q.category,
        source: q.source,
      }));
    } else if (Object.keys(filters).length > 0) {
      qs = generateQuiz(filters, count);
    } else {
      qs = generateRandomQuiz(count);
    }

    startQuiz({
      subtopics: qs.map((q, i) => ({
        id: i,
        title: q.title,
        description: '',
      })),
      _questions: qs,
    });
  }, [buildFilters, mode, count, startQuiz]);

  const handleAnswer = useCallback((opt) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(opt);
    const correct = opt === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
  }, [selectedAnswer, currentQuestion]);

  const handleNext = useCallback(() => {
    const wasCorrect = selectedAnswer === currentQuestion?.correctAnswer;
    answerQuestion(wasCorrect ? currentQuestion.correctAnswer : 'wrong');
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [selectedAnswer, currentQuestion, answerQuestion]);

  const handleRetry = () => {
    setSelectedPhase('');
    setSelectedDifficulty('');
    setSelectedCategory('');
    setMode('standard');
  };

  if (!questions.length && !finished) {
    return (
      <div className="space-y-6">
        <FadeIn>
          <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Practice</span>
            <h1 className="text-2xl sm:text-3xl font-bold">Knowledge Quiz</h1>
            <p className="text-violet-100 mt-1 text-sm">
              {stats.totalQuestions}+ questions across all 9 phases. Industry interview questions, scenarios, and certification prep.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Conceptual</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Scenario</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Interview</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Certification</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs">System Design</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Behavioral</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-dark-800 dark:border-dark-700">
            <h2 className="text-lg font-bold text-gray-800 mb-4 dark:text-gray-100">Start a Quiz</h2>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-xs text-gray-500 font-medium mb-1 block dark:text-gray-400">Mode</label>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1 dark:bg-dark-700">
                    <button
                      onClick={() => setMode('standard')}
                      className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                        mode === 'standard' ? 'bg-white text-violet-700 shadow-sm dark:bg-dark-800' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setMode('interview')}
                      className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                        mode === 'interview' ? 'bg-white text-violet-700 shadow-sm dark:bg-dark-800' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      Interview Prep
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-3">
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-gray-200"
                >
                  <option value="">All Phases</option>
                  {PHASES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.icon} Phase {p.id} — {p.title}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-gray-200"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-gray-200"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>

                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-gray-200"
                >
                  {QUESTION_COUNTS.map((n) => (
                    <option key={n} value={n}>{n} questions</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleStart}
                className="px-6 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition shadow"
              >
                {mode === 'interview' ? '🎯 Start Interview Prep' : '🎲 Start Quiz'}
              </button>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 dark:bg-dark-800 dark:border-dark-700">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.totalQuestions}</div>
              <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">Total Questions</div>
              <div className="text-[10px] text-gray-400 mt-0.5 dark:text-gray-500">Across all 9 phases</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 dark:bg-dark-800 dark:border-dark-700">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.interviewQuestions}</div>
              <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">Interview Questions</div>
              <div className="text-[10px] text-gray-400 mt-0.5 dark:text-gray-500">Inc. system design & behavioral</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 dark:bg-dark-800 dark:border-dark-700">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.byCategory?.scenario || 0}+</div>
              <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">Scenario Questions</div>
              <div className="text-[10px] text-gray-400 mt-0.5 dark:text-gray-500">Real production situations</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 dark:bg-dark-800 dark:border-dark-700">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.byDifficulty?.hard || 0}</div>
              <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">Hard Questions</div>
              <div className="text-[10px] text-gray-400 mt-0.5 dark:text-gray-500">Challenge yourself</div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-dark-800 dark:border-dark-700">
            <h3 className="text-sm font-bold text-gray-800 mb-3 dark:text-gray-100">Questions by Phase</h3>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {PHASES.map((p) => (
                <div key={p.id} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-dark-700/50">
                  <div className="text-lg">{p.icon}</div>
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{stats.byPhase?.[p.id] || 0}</div>
                  <div className="text-[9px] text-gray-400 dark:text-gray-500">Phase {p.id}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  if (currentQuestion && !finished) {
    const catColor = CATEGORY_COLORS[currentQuestion.category] || 'bg-gray-100 text-gray-700';
    const diffColor = DIFFICULTY_COLORS[currentQuestion.difficulty] || 'bg-gray-100 text-gray-700';
    const phaseInfo = PHASES.find((p) => p.id === currentQuestion.phase);
    const showExplanation = selectedAnswer !== null;

    return (
      <FadeIn key={currentIndex}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-dark-800 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-medium dark:bg-violet-900/40 dark:text-violet-300">
                {score}/{currentIndex}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {phaseInfo && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium dark:bg-dark-700 dark:text-gray-300">
                  {phaseInfo.icon} Phase {currentQuestion.phase}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${catColor}`}>
                {CATEGORY_LABELS[currentQuestion.category] || currentQuestion.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${diffColor}`}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 dark:bg-dark-600">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-100">{currentQuestion.question}</h3>

          <div className="space-y-2">
            {currentQuestion.options.map((opt, i) => {
              let btnClass = 'border-gray-200 hover:border-violet-300 hover:bg-violet-50 dark:border-dark-600 dark:hover:border-violet-600 dark:hover:bg-violet-900/20';
              if (selectedAnswer !== null) {
                if (opt === currentQuestion.correctAnswer) {
                  btnClass = 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-300 dark:bg-emerald-900/20 dark:ring-emerald-600';
                } else if (opt === selectedAnswer && !isCorrect) {
                  btnClass = 'border-red-400 bg-red-50 ring-2 ring-red-300 dark:bg-red-900/20 dark:ring-red-600';
                } else {
                  btnClass = 'border-gray-200 opacity-50 dark:border-dark-700';
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-3 rounded-lg border transition text-sm text-gray-700 dark:text-gray-200 ${btnClass}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0 dark:bg-dark-700 dark:text-gray-400">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className={`mt-4 p-4 rounded-lg text-sm ${
              isCorrect
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
            }`}>
              <p className="font-medium mb-1">
                {isCorrect ? '✅ Correct!' : `❌ Incorrect. Answer: ${currentQuestion.correctAnswer}`}
              </p>
              {currentQuestion.explanation && (
                <p className="text-xs mt-1 opacity-80 leading-relaxed">{currentQuestion.explanation}</p>
              )}
              {currentQuestion.source && (
                <p className="text-[10px] mt-1 opacity-60 italic">Source: {currentQuestion.source}</p>
              )}
              <button
                onClick={handleNext}
                className="mt-3 px-4 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700 transition"
              >
                {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      </FadeIn>
    );
  }

  if (finished) {
    const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const correctCount = score;
    const wrongCount = totalQuestions - score;

    return (
      <FadeIn delay={100}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center dark:bg-dark-800 dark:border-dark-700">
          <div className="text-5xl mb-4">
            {pct === 100 ? '🎉' : pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">Quiz Complete!</h2>
          <p className="text-lg text-gray-600 mb-2 dark:text-gray-300">
            You scored <strong className="text-violet-600 dark:text-violet-400">{score}/{totalQuestions}</strong> ({pct}%)
          </p>
          <p className="text-sm text-gray-400 mb-4 dark:text-gray-500">
            {pct === 100 ? 'Perfect score! You\'re a master!' :
             pct >= 80 ? 'Excellent! Almost perfect!' :
             pct >= 60 ? 'Good job! Review the topics you missed.' :
             'Keep studying! Review the material and try again.'}
          </p>

          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Correct</div>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-dark-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500 dark:text-red-400">{wrongCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Wrong</div>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-dark-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{pct}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto mb-6 dark:bg-dark-600">
            <div
              className={`h-full rounded-full transition-all ${
                pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-violet-500' : 'bg-amber-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="px-5 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </FadeIn>
    );
  }

  return null;
}

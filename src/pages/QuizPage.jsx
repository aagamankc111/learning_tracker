import { useState, useCallback } from 'react';
import { useTopics } from '../hooks/useTopics';
import { useQuiz } from '../hooks/useQuiz';
import { generateRandomQuiz } from '../services/quizService';
import FadeIn from '../components/common/FadeIn';

export default function QuizPage() {
  const { topics } = useTopics();
  const {
    questions, currentIndex, currentQuestion, score, finished, totalQuestions,
    startQuiz, answerQuestion,
  } = useQuiz();
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [count, setCount] = useState(5);

  const handleStart = useCallback(() => {
    if (selectedTopicId === 'random') {
      const randomQs = generateRandomQuiz(count);
      startQuiz({ subtopics: randomQs.map((q, i) => ({ id: i, title: q.title, description: '' })) });
      return;
    }
    const topic = topics.find((t) => t.id === Number(selectedTopicId));
    if (topic) startQuiz(topic);
  }, [selectedTopicId, topics, startQuiz, count]);

  const handleAnswer = useCallback((opt) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(opt);
    const correct = opt === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    setTimeout(() => {
      answerQuestion(opt);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 800);
  }, [selectedAnswer, currentQuestion, answerQuestion]);

  const handleRetry = () => {
    setSelectedTopicId('');
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Practice</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Knowledge Quiz</h1>
          <p className="text-violet-100 mt-1 text-sm">
            80+ questions across all 9 topics. Test your understanding and reinforce what you've learned.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Multiple choice</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">True/False style</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Scenario based</span>
          </div>
        </div>
      </FadeIn>

      {!questions.length && !finished && (
        <FadeIn delay={100}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Start a Quiz</h2>
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                >
                  <option value="">Choose a topic...</option>
                  <option value="random">🎲 Random Mixed Topics</option>
                  <option disabled>──────────</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                </select>
              </div>
              <button
                onClick={handleStart}
                disabled={!selectedTopicId}
                className="px-6 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 shadow"
              >
                {selectedTopicId === 'random' ? '🎲 Start Random Quiz' : 'Start Quiz'}
              </button>
              <p className="text-xs text-gray-400">Questions are drawn from a bank of 80+ across all topics.</p>
            </div>
          </div>
        </FadeIn>
      )}

      {currentQuestion && !finished && (
        <FadeIn key={currentIndex}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-medium">
                  {score}/{currentIndex}
                </span>
              </div>
              <span className="text-xs text-gray-400">{currentQuestion.title}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>

            <div className="space-y-2">
              {currentQuestion.options.map((opt, i) => {
                let btnClass = 'border-gray-200 hover:border-violet-300 hover:bg-violet-50';
                if (selectedAnswer !== null) {
                  if (opt === currentQuestion.correctAnswer) {
                    btnClass = 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-300';
                  } else if (opt === selectedAnswer && !isCorrect) {
                    btnClass = 'border-red-400 bg-red-50 ring-2 ring-red-300';
                  } else {
                    btnClass = 'border-gray-200 opacity-50';
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-3 rounded-lg border transition text-sm text-gray-700 ${btnClass}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {isCorrect ? '✅ Correct!' : `❌ Incorrect. Answer: ${currentQuestion.correctAnswer}`}
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {finished && (
        <FadeIn delay={100}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-5xl mb-4">
              {score === totalQuestions ? '🎉' : score >= totalQuestions * 0.8 ? '🌟' : score >= totalQuestions * 0.6 ? '👍' : '💪'}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-lg text-gray-600 mb-2">
              You scored <strong className="text-violet-600">{score}/{totalQuestions}</strong>
              {' '}({totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%)
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {score === totalQuestions ? 'Perfect score! You\'re a master of this topic!' :
               score >= totalQuestions * 0.8 ? 'Excellent! Almost perfect!' :
               score >= totalQuestions * 0.6 ? 'Good job! Review the topics you missed.' :
               'Keep studying! Review the flashcards and try again.'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto mb-6">
              <div className={`h-full rounded-full transition-all ${
                score === totalQuestions ? 'bg-emerald-500' :
                score >= totalQuestions * 0.6 ? 'bg-violet-500' :
                'bg-amber-500'
              }`} style={{ width: `${totalQuestions > 0 ? (score / totalQuestions) * 100 : 0}%` }} />
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
      )}
    </div>
  );
}

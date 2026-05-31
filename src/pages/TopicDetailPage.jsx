import { useParams, Link, useNavigate } from 'react-router-dom';
import curriculum from '../data/curriculum';
import { getTopicEnrichment, hasEnrichment } from '../data/curriculum-enrichment';
import FadeIn from '../components/common/FadeIn';

const sectionStyles = {
  indigo: 'from-indigo-50 dark:from-indigo-900/30 dark:to-dark-800',
  emerald: 'from-emerald-50 dark:from-emerald-900/30 dark:to-dark-800',
  red: 'from-red-50 dark:from-red-900/30 dark:to-dark-800',
  amber: 'from-amber-50 dark:from-amber-900/30 dark:to-dark-800',
  violet: 'from-violet-50 dark:from-violet-900/30 dark:to-dark-800',
  teal: 'from-teal-50 dark:from-teal-900/30 dark:to-dark-800',
  purple: 'from-purple-50 dark:from-purple-900/30 dark:to-dark-800',
  cyan: 'from-cyan-50 dark:from-cyan-900/30 dark:to-dark-800',
  rose: 'from-rose-50 dark:from-rose-900/30 dark:to-dark-800',
  gray: 'from-gray-50 dark:from-gray-800/50 dark:to-dark-800',
};

function Section({ title, children, color = 'indigo' }) {
  if (!children) return null;
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
      <div className={`px-5 py-3 border-b border-gray-50 dark:border-dark-700/50 bg-gradient-to-r ${sectionStyles[color] || sectionStyles.indigo}`}>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{title}</h3>
      </div>
      <div className="p-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{children}</div>
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed mt-2">
      {children}
    </pre>
  );
}

export default function TopicDetailPage() {
  const { weekId, dayNumber, topicName } = useParams();
  const week = curriculum.weeks.find((w) => w.id === Number(weekId));
  const day = week?.days.find((d) => d.day === Number(dayNumber));
  const topic = day?.topics.find((t) => t.toLowerCase().replace(/\s+/g, '-') === topicName);
  const enrichment = getTopicEnrichment(Number(dayNumber), topic || topicName?.replace(/-/g, ' '));

  if (!week || !day || !topic) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Topic not found.</p>
        <Link to={weekId ? `/week/${weekId}` : '/'} className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-1.5 mb-3 text-xs flex-wrap">
            <Link to="/" className="text-indigo-300 hover:text-white transition">Home</Link>
            <span className="text-indigo-500 dark:text-indigo-400">/</span>
            <Link to={`/week/${week.id}`} className="text-indigo-300 hover:text-white transition">
              Phase {week.id}
            </Link>
            <span className="text-indigo-500 dark:text-indigo-400">/</span>
            <Link to={`/week/${week.id}#day-${day.day}`} className="text-indigo-300 hover:text-white transition">
              Day {day.day}
            </Link>
            <span className="text-indigo-500 dark:text-indigo-400">/</span>
            <span className="text-indigo-100 font-medium">{topic}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">{topic}</h1>
              <p className="text-indigo-200 text-sm mt-1">{day.title}</p>
            </div>
            <Link
              to={`/week/${week.id}#day-${day.day}`}
              className="shrink-0 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium text-white transition flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Day {day.day}
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Day Navigation Pills — link to checkables */}
      <div className="flex gap-1.5 flex-wrap">
        {week.days.map((d) => {
          const isCurrent = d.day === Number(dayNumber);
          return (
            <Link
              key={d.day}
              to={`/week/${week.id}#day-${d.day}`}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                isCurrent
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm'
                  : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
              title={d.title}
            >
              D{d.day}
            </Link>
          );
        })}
      </div>

      {!enrichment ? (
        <FadeIn>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center dark:bg-amber-900/20 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-300 font-medium">No enrichment data available for "{topic}" on Day {dayNumber}.</p>
          </div>
        </FadeIn>
      ) : (
        <>
          {enrichment.example && (
            <FadeIn>
              <Section title="Example" color="indigo">
                <p className="font-mono text-xs bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded inline-block mb-2">$ {enrichment.example.command}</p>
                <CodeBlock>{enrichment.example.output}</CodeBlock>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{enrichment.example.explanation}</p>
                {enrichment.example.productionMeaning && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300">
                    <strong>Production meaning:</strong> {enrichment.example.productionMeaning}
                  </div>
                )}
              </Section>
            </FadeIn>
          )}

          {enrichment.productionScenario && (
            <FadeIn>
              <Section title="Production Scenario" color="emerald">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 shrink-0">▶</span>
                  <p>{enrichment.productionScenario}</p>
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.failureScenario && (
            <FadeIn>
              <Section title="Failure Scenario" color="red">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-red-500 dark:text-red-400 mt-0.5 shrink-0">⚠</span>
                  <p>{enrichment.failureScenario.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {enrichment.failureScenario.severity && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      enrichment.failureScenario.severity === 'S1' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      enrichment.failureScenario.severity === 'S2' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {enrichment.failureScenario.severity}
                    </span>
                  )}
                  {enrichment.failureScenario.impact && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{enrichment.failureScenario.impact}</span>
                  )}
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.troubleshootingFlow && (
            <FadeIn>
              <Section title="Troubleshooting Flow" color="amber">
                <ol className="space-y-2">
                  {enrichment.troubleshootingFlow.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        step.startsWith('SYMPTOM') ? 'bg-red-500' :
                        step.startsWith('CHECK') ? 'bg-blue-500' :
                        step.startsWith('ROOT CAUSE') ? 'bg-amber-500' :
                        step.startsWith('FIX') ? 'bg-emerald-500' :
                        step.startsWith('PREVENTION') ? 'bg-indigo-500' :
                        'bg-gray-400'
                      }`}>{i + 1}</span>
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            </FadeIn>
          )}

          {enrichment.architectureView && (
            <FadeIn>
              <Section title="Architecture View" color="violet">
                <p>{enrichment.architectureView}</p>
              </Section>
            </FadeIn>
          )}

          {enrichment.lab && (
            <FadeIn>
              <Section title="Lab" color="teal">
                <p className="font-medium text-gray-800 dark:text-gray-100 mb-2">{enrichment.lab.description}</p>
                <ol className="space-y-1.5 mb-3">
                  {enrichment.lab.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="shrink-0 w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold dark:bg-teal-900/40 dark:text-teal-300">{i + 1}</span>
                      <span className="text-gray-600 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
                {enrichment.lab.expectedOutput && (
                  <div className="p-2 bg-teal-50 border border-teal-100 rounded text-xs text-teal-800 mb-2 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-300">
                    <strong>Expected output:</strong> {enrichment.lab.expectedOutput}
                  </div>
                )}
                {enrichment.lab.failureVariation && (
                  <div className="p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
                    <strong>Failure variation:</strong> {enrichment.lab.failureVariation}
                  </div>
                )}
              </Section>
            </FadeIn>
          )}

          {enrichment.interviewQuestions && (
            <FadeIn>
              <Section title="Interview Questions" color="purple">
                <div className="space-y-3">
                  {enrichment.interviewQuestions.conceptual && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Conceptual</p>
                      <ul className="space-y-1">
                        {enrichment.interviewQuestions.conceptual.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {enrichment.interviewQuestions.practical && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Practical</p>
                      <ul className="space-y-1">
                        {enrichment.interviewQuestions.practical.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {enrichment.interviewQuestions.scenario && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Scenario</p>
                      <ul className="space-y-1">
                        {enrichment.interviewQuestions.scenario.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {enrichment.interviewQuestions.senior && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Senior</p>
                      <ul className="space-y-1">
                        {enrichment.interviewQuestions.senior.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {enrichment.interviewQuestions.systemDesign && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">System Design</p>
                      <ul className="space-y-1">
                        {enrichment.interviewQuestions.systemDesign.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.industryExamples && (
            <FadeIn>
              <Section title="Industry Examples" color="cyan">
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(enrichment.industryExamples).map(([key, val]) => (
                    <div key={key} className={`p-3 rounded-lg border ${
                      key === 'startup' ? 'bg-gray-50 border-gray-200 dark:bg-dark-700/50 dark:border-dark-700' :
                      key === 'midSize' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                      key === 'enterprise' ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' :
                      'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
                    }`}>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${
                        key === 'startup' ? 'bg-gray-200 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300' :
                        key === 'midSize' ? 'bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                        key === 'enterprise' ? 'bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                        'bg-purple-200 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                      }`}>
                        {key === 'startup' ? 'Startup' : key === 'midSize' ? 'Mid-Size' : key === 'enterprise' ? 'Enterprise' : 'FAANG'}
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-200">{val}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.commonMistakes && (
            <FadeIn>
              <Section title="Common Mistakes" color="rose">
                <div className="space-y-2">
                  {enrichment.commonMistakes.map((m, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${
                      m.level === 'beginner' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' :
                      m.level === 'production' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                      'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800'
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-red-500 dark:text-red-400 mt-0.5 shrink-0">✗</span>
                        <div>
                          <p className="text-sm text-gray-800 dark:text-gray-100">{m.mistake}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              m.level === 'beginner' ? 'bg-orange-200 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                              m.level === 'production' ? 'bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                              'bg-rose-200 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                            }`}>{m.level}</span>
                            <span className="text-xs text-emerald-700 dark:text-emerald-400">→ {m.fix}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.bestPractices && (
            <FadeIn>
              <Section title="Best Practices" color="emerald">
                <div className="grid sm:grid-cols-2 gap-2">
                  {enrichment.bestPractices.map((bp, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${
                      bp.area === 'security' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' :
                      bp.area === 'performance' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' :
                      bp.area === 'reliability' ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' :
                      bp.area === 'cost' ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20' :
                      bp.area === 'monitoring' ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20' :
                      bp.area === 'testing' ? 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20' :
                      'border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-700/50'
                    }`}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mb-1 ${
                        bp.area === 'security' ? 'bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                        bp.area === 'performance' ? 'bg-green-200 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                        bp.area === 'reliability' ? 'bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                        bp.area === 'cost' ? 'bg-amber-200 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                        bp.area === 'monitoring' ? 'bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                        bp.area === 'testing' ? 'bg-purple-200 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                        'bg-gray-200 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300'
                      }`}>{bp.area}</span>
                      <p className="text-xs text-gray-700 dark:text-gray-200">{bp.practice}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.commandExpansions && (
            <FadeIn>
              <Section title="Command Expansions" color="gray">
                <div className="space-y-3">
                  {enrichment.commandExpansions.map((ce, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden dark:border-dark-700">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between dark:bg-dark-700/50 dark:border-dark-700">
                        <code className="text-xs font-mono text-indigo-700 font-medium">{ce.command}</code>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{ce.what}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <p className="text-xs text-gray-600 dark:text-gray-300"><strong>Why:</strong> {ce.why}</p>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Example:</p>
                          <CodeBlock>$ {ce.command}{ce.example ? `\n${ce.example}` : ''}</CodeBlock>
                        </div>
                        {ce.output && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Output:</p>
                            <CodeBlock>{ce.output}</CodeBlock>
                          </div>
                        )}
                        {ce.explanation && <p className="text-xs text-gray-600 dark:text-gray-300"><strong>Explanation:</strong> {ce.explanation}</p>}
                        {ce.failure && (
                          <div className="p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                            <strong>Failure mode:</strong> {ce.failure}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </FadeIn>
          )}
        </>
      )}

      <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-dark-700">
        <Link
          to={`/week/${week.id}#day-${day.day}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Day {day.day}
        </Link>
        <Link
          to={`/week/${week.id}`}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          All of Phase {week.id} →
        </Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import curriculum from '../data/curriculum';
import { getTopicEnrichment, hasEnrichment } from '../data/curriculum-enrichment';
import FadeIn from '../components/common/FadeIn';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-50 dark:border-dark-700/50 bg-gray-50 dark:bg-gray-800/30">
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

function ContentBlock({ children }) {
  return (
    <pre className="bg-gray-900 dark:bg-black text-gray-100 dark:text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre-wrap border border-gray-700/50 mt-1">
      {children}
    </pre>
  );
}

function getQuestionText(item) {
  return typeof item === 'string' ? item : item.q;
}

function getAnswer(item) {
  return typeof item === 'object' && item.a ? item.a : null;
}

function QuestionBlock({ item, index, isOpen, onToggle }) {
  const qText = getQuestionText(item);
  const answer = getAnswer(item);

  return (
    <div className="space-y-1">
      <pre className="text-sm text-gray-100 dark:text-gray-200 font-mono leading-relaxed whitespace-pre-wrap bg-gray-900 dark:bg-black p-3 rounded-lg border border-gray-700/50 overflow-x-auto flex items-start justify-between gap-2">
        <span>
          <span className="text-indigo-400">Q{index + 1}:</span> {qText}
        </span>
        {answer && (
          <button
            onClick={() => onToggle(index)}
            className="shrink-0 px-2 py-1 text-xs font-mono rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 transition border border-indigo-700/50"
          >
            {isOpen ? 'hide' : 'answer'}
          </button>
        )}
      </pre>
      {answer && isOpen && (
        <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap bg-gray-900 dark:bg-black p-3 rounded-lg border border-gray-700/50 overflow-x-auto ml-4">
          <span className="text-indigo-400">A{index + 1}:</span> {answer}
        </pre>
      )}
    </div>
  );
}

function QuestionCategory({ items, label }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{label}</p>
      <div className="space-y-1">
        {items.map((item, i) => (
          <QuestionBlock
            key={i}
            item={item}
            index={i}
            isOpen={openIndex === i}
            onToggle={(idx) => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
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
              <Section title="Example" >
                <p className="font-mono text-xs bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded inline-block mb-2">$ {enrichment.example.command}</p>
                <CodeBlock>{enrichment.example.output}</CodeBlock>
                <ContentBlock>{enrichment.example.explanation}</ContentBlock>
                {enrichment.example.productionMeaning && (
                  <pre className="mt-3 p-3 bg-gray-900 dark:bg-black border border-cyan-700/50 rounded-lg text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-cyan-300 dark:text-cyan-300">
                    <strong className="text-cyan-400"># Production meaning:</strong>{'\n'}{enrichment.example.productionMeaning}
                  </pre>
                )}
              </Section>
            </FadeIn>
          )}

          {enrichment.productionScenario && (
            <FadeIn>
              <Section title="Production Scenario" >
                <ContentBlock >{enrichment.productionScenario}</ContentBlock>
              </Section>
            </FadeIn>
          )}

          {enrichment.failureScenario && (
            <FadeIn>
              <Section title="Failure Scenario">
                <ContentBlock >{enrichment.failureScenario.description}</ContentBlock>
                <div className="flex flex-wrap gap-2 mt-3">
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
              <Section title="Troubleshooting Flow" >
                <div className="space-y-2">
                  {enrichment.troubleshootingFlow.map((step, i) => (
                    <pre key={i} className="flex items-start gap-2 p-3 bg-gray-900 dark:bg-black rounded-lg border border-gray-700/50 text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gray-500">{i + 1}</span>
                      <span className="flex-1 text-gray-300">{step}</span>
                    </pre>
                  ))}
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.architectureView && (
            <FadeIn>
              <Section title="Architecture View">
                <ContentBlock >{enrichment.architectureView}</ContentBlock>
              </Section>
            </FadeIn>
          )}

          {enrichment.lab && (
            <FadeIn>
              <Section title="Lab" >
                <ContentBlock >{enrichment.lab.description}</ContentBlock>
                <pre className="mt-3 bg-gray-900 dark:bg-black p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre-wrap border border-gray-700/50 text-gray-300">
                  {enrichment.lab.steps.map((s, i) => `# Step ${i + 1}: ${s}`).join('\n')}
                </pre>
                {enrichment.lab.expectedOutput && (
                  <pre className="mt-2 p-3 bg-gray-900 dark:bg-black border border-gray-700/50 rounded-lg text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-gray-300">
                    <strong className="text-gray-400"># Expected output:</strong>{'\n'}{enrichment.lab.expectedOutput}
                  </pre>
                )}
                {enrichment.lab.failureVariation && (
                  <pre className="mt-2 p-3 bg-gray-900 dark:bg-black border border-gray-700/50 rounded-lg text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-gray-300">
                    <strong className="text-gray-400"># Failure variation:</strong>{'\n'}{enrichment.lab.failureVariation}
                  </pre>
                )}
              </Section>
            </FadeIn>
          )}

          {enrichment.interviewQuestions && (
            <FadeIn>
              <Section title="Interview Questions" >
                <div className="space-y-3">
                  <QuestionCategory items={enrichment.interviewQuestions.conceptual} label="Conceptual" />
                  <QuestionCategory items={enrichment.interviewQuestions.practical} label="Practical" />
                  <QuestionCategory items={enrichment.interviewQuestions.scenario} label="Scenario" />
                  <QuestionCategory items={enrichment.interviewQuestions.senior} label="Senior" />
                  <QuestionCategory items={enrichment.interviewQuestions.systemDesign} label="System Design" />
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.industryExamples && (
            <FadeIn>
              <Section title="Industry Examples" >
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(enrichment.industryExamples).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-lg border bg-gray-50 dark:bg-dark-700/50 border-gray-200 dark:border-dark-700">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 bg-gray-200 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                        {key === 'startup' ? 'Startup' : key === 'midSize' ? 'Mid-Size' : key === 'enterprise' ? 'Enterprise' : 'FAANG'}
                      </span>
                      <pre className="text-xs text-gray-300 dark:text-gray-200 font-mono leading-relaxed whitespace-pre-wrap bg-gray-900 dark:bg-black p-2 rounded border border-gray-700/50">{val}</pre>
                    </div>
                  ))}
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.commonMistakes && (
            <FadeIn>
              <Section title="Common Mistakes" >
                <div className="space-y-2">
                  {enrichment.commonMistakes.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg border bg-gray-50 dark:bg-dark-700/50 border-gray-200 dark:border-dark-700">
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 dark:text-red-400 mt-0.5 shrink-0">✗</span>
                        <div className="flex-1">
                          <pre className="text-sm text-gray-100 dark:text-gray-100 font-mono leading-relaxed whitespace-pre-wrap bg-gray-900 dark:bg-black p-3 rounded-lg border border-gray-700/50">{m.mistake}</pre>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300">{m.level}</span>
                            <span className="text-xs text-green-400 font-mono">→ {m.fix}</span>
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
              <Section title="Best Practices" >
                <div className="grid sm:grid-cols-2 gap-2">
                  {enrichment.bestPractices.map((bp, i) => (
                    <div key={i} className="p-3 rounded-lg border border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-700/50">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mb-1 bg-gray-200 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300">{bp.area}</span>
                      <pre className="text-xs text-gray-300 dark:text-gray-200 font-mono leading-relaxed whitespace-pre-wrap bg-gray-900 dark:bg-black p-2 rounded border border-gray-700/50">{bp.practice}</pre>
                    </div>
                  ))}
                </div>
              </Section>
            </FadeIn>
          )}

          {enrichment.commandExpansions && (
            <FadeIn>
              <Section title="Command Expansions">
                <div className="space-y-3">
                  {enrichment.commandExpansions.map((ce, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden dark:border-dark-700">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between dark:bg-dark-700/50 dark:border-dark-700">
                        <code className="text-xs font-mono text-indigo-700 font-medium">{ce.command}</code>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{ce.what}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap bg-gray-900 dark:bg-black p-3 rounded-lg border border-gray-700/50">
                          <strong className="text-indigo-400"># Why:</strong>{'\n'}{ce.why}
                        </pre>
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
                        {ce.explanation && (
                          <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap bg-gray-900 dark:bg-black p-3 rounded-lg border border-gray-700/50">
                            <strong className="text-indigo-400"># Explanation:</strong>{'\n'}{ce.explanation}
                          </pre>
                        )}
                        {ce.failure && (
                          <pre className="p-3 bg-gray-900 dark:bg-black border border-red-700/50 rounded-lg text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-red-300">
                            <strong className="text-red-400"># Failure mode:</strong>{'\n'}{ce.failure}
                          </pre>
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

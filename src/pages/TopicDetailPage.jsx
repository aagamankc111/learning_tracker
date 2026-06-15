import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';
import { getTopicEnrichment } from '../data/curriculum-enrichment';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <div className="bg-surface-card border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <h3 className="font-medium text-gray-200 text-sm">{title}</h3>
      </div>
      <div className="p-4 text-sm text-gray-400 leading-relaxed">{children}</div>
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="bg-surface/80 border border-white/[0.06] text-gray-300 p-3 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed mt-2">
      {children}
    </pre>
  );
}

function ContentBlock({ children }) {
  return (
    <pre className="bg-surface/80 border border-white/[0.06] text-gray-300 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre-wrap mt-1">
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
      <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap bg-surface/80 p-3 rounded-lg border border-white/[0.06] overflow-x-auto flex items-start justify-between gap-2">
        <span><span className="text-accent">Q{index + 1}:</span> {qText}</span>
        {answer && (
          <button onClick={() => onToggle(index)}
            className="shrink-0 px-2 py-1 text-xs font-mono rounded bg-accent/15 text-accent hover:bg-accent/25 transition border border-accent/20">
            {isOpen ? 'hide' : 'answer'}
          </button>
        )}
      </pre>
      {answer && isOpen && (
        <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap bg-surface/80 p-3 rounded-lg border border-white/[0.06] overflow-x-auto ml-4">
          <span className="text-accent">A{index + 1}:</span> {answer}
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
      <p className="text-[10px] font-medium text-gray-500 uppercase mb-1">{label}</p>
      <div className="space-y-1">
        {items.map((item, i) => (
          <QuestionBlock key={i} item={item} index={i} isOpen={openIndex === i}
            onToggle={(idx) => setOpenIndex(openIndex === idx ? null : idx)} />
        ))}
      </div>
    </div>
  );
}

export default function TopicDetailPage() {
  const { phaseId, dayNumber, topicName } = useParams();
  const week = curriculum.weeks.find((w) => w.id === Number(phaseId));
  const day = week?.days.find((d) => d.day === Number(dayNumber));
  const topic = day?.topics.find((t) => t.toLowerCase().replace(/\s+/g, '-') === topicName);
  const enrichment = getTopicEnrichment(Number(dayNumber), topic || topicName?.replace(/-/g, ' '));

  const [dayProgress, setDayProgress] = useState({});
  useEffect(() => {
    if (!week) return;
    const progress = {};
    for (const d of week.days) {
      const stored = localStorage.getItem(`wt_progress_phase${week.id}_day${d.day}`);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          const checked = Object.values(data).filter(Boolean).length;
          progress[d.day] = checked === d.reviewItems.length && d.reviewItems.length > 0;
        } catch {}
      }
    }
    setDayProgress(progress);
  }, [week?.id]);

  if (!week || !day || !topic) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Topic not found.</p>
        <Link to={phaseId ? `/phase/${phaseId}` : '/'} className="text-accent hover:underline mt-2 inline-block text-sm">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-surface-card border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-center gap-1.5 mb-3 text-xs flex-wrap">
          <Link to="/" className="text-gray-500 hover:text-accent transition">Home</Link>
          <span className="text-gray-600">/</span>
          <Link to={`/phase/${week.id}`} className="text-gray-500 hover:text-accent transition">Phase {week.id}</Link>
          <span className="text-gray-600">/</span>
          <Link to={`/phase/${week.id}#day-${day.day}`} className="text-gray-500 hover:text-accent transition">Day {day.day}</Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-200 font-medium">{topic}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-gray-100">{topic}</h1>
            <p className="text-gray-500 text-sm mt-1">{day.title}</p>
          </div>
          <Link to={`/phase/${week.id}#day-${day.day}`}
            className="shrink-0 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg text-xs font-medium text-gray-300 transition flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Day {day.day}
          </Link>
        </div>
      </div>

      {/* Day Nav */}
      <div className="flex gap-1.5 flex-wrap">
        {week.days.map((d) => {
          const isCurrent = d.day === Number(dayNumber);
          const isDone = dayProgress[d.day];
          return (
            <Link key={d.day} to={`/phase/${week.id}#day-${d.day}`}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                isCurrent
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'bg-surface-card text-gray-500 border-white/[0.06] hover:text-gray-300 hover:border-white/[0.12]'
              }`}>
              D{d.day}
            </Link>
          );
        })}
      </div>

      {!enrichment ? (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-center">
          <p className="text-amber-300 font-medium text-sm">No enrichment data for "{topic}" on Day {dayNumber}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrichment.example && (
            <Section title="Example">
              <p className="font-mono text-xs bg-white/[0.04] px-2 py-1 rounded inline-block mb-2">$ {enrichment.example.command}</p>
              <CodeBlock>{enrichment.example.output}</CodeBlock>
              <ContentBlock>{enrichment.example.explanation}</ContentBlock>
              {enrichment.example.productionMeaning && (
                <pre className="mt-3 p-3 bg-surface/80 border border-accent/20 rounded-lg text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-accent">
                  <strong className="text-accent"># Production meaning:</strong>{'\n'}{enrichment.example.productionMeaning}
                </pre>
              )}
            </Section>
          )}

          {enrichment.productionScenario && (
            <Section title="Production Scenario">
              <ContentBlock>{enrichment.productionScenario}</ContentBlock>
            </Section>
          )}

          {enrichment.failureScenario && (
            <Section title="Failure Scenario">
              <ContentBlock>{enrichment.failureScenario.description}</ContentBlock>
              {enrichment.failureScenario.severity && (
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                  enrichment.failureScenario.severity === 'S1' ? 'bg-red-500/15 text-red-400' :
                  enrichment.failureScenario.severity === 'S2' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-yellow-500/15 text-yellow-400'
                }`}>
                  {enrichment.failureScenario.severity}
                </span>
              )}
            </Section>
          )}

          {enrichment.troubleshootingFlow && (
            <Section title="Troubleshooting Flow">
              <div className="space-y-2">
                {enrichment.troubleshootingFlow.map((step, i) => (
                  <pre key={i} className="flex items-start gap-2 p-3 bg-surface/80 border border-white/[0.06] rounded-lg text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                    <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 bg-white/[0.06]">{i + 1}</span>
                    <span className="flex-1 text-gray-300">{step}</span>
                  </pre>
                ))}
              </div>
            </Section>
          )}

          {enrichment.architectureView && (
            <Section title="Architecture View">
              <ContentBlock>{enrichment.architectureView}</ContentBlock>
            </Section>
          )}

          {enrichment.lab && (
            <Section title="Lab">
              <ContentBlock>{enrichment.lab.description}</ContentBlock>
              <pre className="mt-3 bg-surface/80 border border-white/[0.06] p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre-wrap text-gray-300">
                {enrichment.lab.steps.map((s, i) => `# Step ${i + 1}: ${s}`).join('\n')}
              </pre>
              {enrichment.lab.expectedOutput && (
                <pre className="mt-2 p-3 bg-surface/80 border border-white/[0.06] rounded-lg text-sm font-mono leading-relaxed overflow-x-auto text-gray-300">
                  <strong className="text-gray-500"># Expected output:</strong>{'\n'}{enrichment.lab.expectedOutput}
                </pre>
              )}
              {enrichment.lab.failureVariation && (
                <pre className="mt-2 p-3 bg-surface/80 border border-red-500/20 rounded-lg text-sm font-mono leading-relaxed overflow-x-auto text-red-300">
                  <strong className="text-red-400"># Failure variation:</strong>{'\n'}{enrichment.lab.failureVariation}
                </pre>
              )}
            </Section>
          )}

          {enrichment.interviewQuestions && (
            <Section title="Interview Questions">
              <div className="space-y-3">
                <QuestionCategory items={enrichment.interviewQuestions.conceptual} label="Conceptual" />
                <QuestionCategory items={enrichment.interviewQuestions.practical} label="Practical" />
                <QuestionCategory items={enrichment.interviewQuestions.scenario} label="Scenario" />
                <QuestionCategory items={enrichment.interviewQuestions.senior} label="Senior" />
                <QuestionCategory items={enrichment.interviewQuestions.systemDesign} label="System Design" />
              </div>
            </Section>
          )}

          {enrichment.industryExamples && (
            <Section title="Industry Examples">
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(enrichment.industryExamples).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-lg border bg-surface/80 border-white/[0.06]">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 bg-white/[0.06] text-gray-400">
                      {key === 'startup' ? 'Startup' : key === 'midSize' ? 'Mid-Size' : key === 'enterprise' ? 'Enterprise' : 'FAANG'}
                    </span>
                    <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap bg-surface/80 p-2 rounded border border-white/[0.06]">{val}</pre>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {enrichment.commonMistakes && (
            <Section title="Common Mistakes">
              <div className="space-y-2">
                {enrichment.commonMistakes.map((m, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-surface/80 border-white/[0.06]">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                      <div className="flex-1">
                        <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap bg-surface/80 p-3 rounded-lg border border-white/[0.06]">{m.mistake}</pre>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/[0.06] text-gray-400">{m.level}</span>
                          <span className="text-xs text-emerald-400 font-mono">→ {m.fix}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {enrichment.bestPractices && (
            <Section title="Best Practices">
              <div className="grid sm:grid-cols-2 gap-2">
                {enrichment.bestPractices.map((bp, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-surface/80 border-white/[0.06]">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mb-1 bg-white/[0.06] text-gray-400">{bp.area}</span>
                    <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap bg-surface/80 p-2 rounded border border-white/[0.06]">{bp.practice}</pre>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {enrichment.commandExpansions && (
            <Section title="Command Expansions">
              <div className="space-y-3">
                {enrichment.commandExpansions.map((ce, i) => (
                  <div key={i} className="border border-white/[0.06] rounded-lg overflow-hidden">
                    <div className="bg-white/[0.02] px-4 py-2 border-b border-white/[0.06] flex items-center justify-between">
                      <code className="text-xs font-mono text-accent font-medium">{ce.command}</code>
                      <span className="text-xs text-gray-500">{ce.what}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      <pre className="text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap bg-surface/80 p-3 rounded-lg border border-white/[0.06]">
                        <strong className="text-accent"># Why:</strong>{'\n'}{ce.why}
                      </pre>
                      {ce.example && <CodeBlock>$ {ce.command}{ce.example}</CodeBlock>}
                      {ce.output && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Output:</p>
                          <CodeBlock>{ce.output}</CodeBlock>
                        </div>
                      )}
                      {ce.explanation && (
                        <pre className="text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap bg-surface/80 p-3 rounded-lg border border-white/[0.06]">
                          <strong className="text-accent"># Explanation:</strong>{'\n'}{ce.explanation}
                        </pre>
                      )}
                      {ce.failure && (
                        <pre className="p-3 bg-surface/80 border border-red-500/20 rounded-lg text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-red-300">
                          <strong className="text-red-400"># Failure mode:</strong>{'\n'}{ce.failure}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <Link to={`/phase/${week.id}#day-${day.day}`}
          className="text-xs text-gray-500 hover:text-accent transition flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.04]">
          ← Back to Day {day.day}
        </Link>
        <Link to={`/phase/${week.id}`}
          className="text-xs text-gray-500 hover:text-accent transition">
          All of Phase {week.id} →
        </Link>
      </div>
    </div>
  );
}

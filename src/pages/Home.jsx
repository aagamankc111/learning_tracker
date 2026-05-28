import { Link } from 'react-router-dom';
import curriculum from '../data/curriculum';
import FadeIn from '../components/common/FadeIn';

const weekColors = {
  indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', ring: 'ring-indigo-500' },
  emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600', ring: 'ring-emerald-500' },
  violet: { bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', gradient: 'from-violet-500 to-violet-600', ring: 'ring-violet-500' },
  amber: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-500 to-amber-600', ring: 'ring-amber-500' },
};

export default function Home() {
  const totalDays = curriculum.weeks.reduce((sum, w) => sum + w.days.length, 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <FadeIn>
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                30-Day Intensive Program
              </span>
              <span className="inline-block px-3 py-1 bg-emerald-500/30 rounded-full text-xs font-medium">
                🎯 3:1 Demand Gap
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">AI Infrastructure & Cloud</h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Master Linux, Networking, Python, AWS, Docker, Kubernetes, MLOps, and Security.
              Build 3 production-grade portfolio projects. Job-ready in 30 days.
              <strong className="text-white block mt-1">MLOps is the #1 most wanted AI role in 2026 — $130K-$220K.</strong>
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/week/1" className="px-5 py-2.5 bg-white text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-50 transition shadow">
                Start Week 1 →
              </Link>
              <Link to="/industry-insights" className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition border border-white/20">
                📈 View Market Research
              </Link>
              <Link to="/daily-review" className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition border border-white/20">
                Daily Review
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '30', label: 'Days', desc: 'Intensive program', color: 'indigo' },
            { value: '4', label: 'Phases', desc: 'Structured roadmap', color: 'emerald' },
            { value: '3', label: 'Projects', desc: 'Portfolio ready', color: 'violet' },
            { value: '40+', label: 'Subtopics', desc: 'Detailed coverage', color: 'amber' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <div className={`text-3xl font-bold text-${s.color}-600`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{s.label}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Market Demand Banner */}
      <FadeIn delay={150}>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="bg-white/20 rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-3xl font-bold">3:1</div>
              <div className="text-xs text-white/80">Demand Gap</div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-lg font-bold">MLOps Engineer — Most Wanted AI Role 2026</h2>
              <p className="text-emerald-100 text-sm mt-1">
                Job postings grew <strong>10x in 5 years</strong>. Market projected to reach <strong>$15.7B by 2030</strong>.
                Average time-to-fill: <strong>45+ days</strong> — companies are desperate for qualified engineers.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">$130K-$175K Mid-Level</span>
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">$185K-$220K Senior</span>
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">$260K-$300K Total Comp</span>
              </div>
            </div>
            <Link to="/industry-insights" className="px-4 py-2 bg-white text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-50 transition shadow shrink-0">
              Full Analysis →
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Weekly Overview */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your 4-Week Roadmap</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {curriculum.weeks.map((week, i) => {
            const c = weekColors[week.color];
            return (
              <FadeIn key={week.id} delay={i * 100}>
                <Link to={`/week/${week.id}`} className="block group">
                  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
                    <div className={`${c.bg} h-2`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className={`inline-block px-2 py-0.5 ${c.light} ${c.text} text-xs font-medium rounded-full mb-2`}>
                            Week {week.id}
                          </span>
                          <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {week.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">{week.subtitle}</p>
                        </div>
                        <span className="text-2xl opacity-50">{['🖥️', '☁️', '🤖', '🚀'][i]}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{week.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{week.days.length} days</span>
                        <span className={`${c.text} font-medium group-hover:underline`}>
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Target Roles */}
      <FadeIn delay={400}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">🎯 Target Roles — Salary Data 2026</h2>
            <Link to="/industry-insights" className="text-xs text-indigo-600 hover:underline font-medium">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { role: 'MLOps Engineer', desc: 'Deploy, monitor, and scale AI models in production', salary: '$130K–$220K', demand: '🔥 3:1 Demand Gap', color: 'indigo' },
              { role: 'AI Infrastructure Engineer', desc: 'Build and maintain systems for AI workloads', salary: '$150K–$250K', demand: '🔥 Very High Demand', color: 'violet' },
              { role: 'Cloud DevOps (AI Focus)', desc: 'Automate infrastructure, CI/CD, cloud deployments', salary: '$120K–$180K', demand: '🔥 High Demand', color: 'emerald' },
            ].map((r) => (
              <div key={r.role} className={`p-4 rounded-lg bg-gradient-to-br from-${r.color}-50 to-white border border-${r.color}-100`}>
                <h3 className="font-bold text-gray-800 text-sm">{r.role}</h3>
                <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs font-bold text-${r.color}-600`}>{r.salary}</p>
                  <span className="text-xs text-emerald-600 font-medium">{r.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Quick Start Guide */}
      <FadeIn delay={500}>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">🎯 How This Works</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <span className="text-indigo-400 font-bold text-lg shrink-0">1</span>
              <div>
                <p className="font-medium">Follow the Daily Plan</p>
                <p className="text-gray-400 text-xs mt-0.5">Each day has subtopics, commands, and a mini project. Check them off as you go.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-400 font-bold text-lg shrink-0">2</span>
              <div>
                <p className="font-medium">Build Portfolio Projects</p>
                <p className="text-gray-400 text-xs mt-0.5">3 flagship projects that go on your resume. These are the projects that get you hired.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-400 font-bold text-lg shrink-0">3</span>
              <div>
                <p className="font-medium">Know the Market</p>
                <p className="text-gray-400 text-xs mt-0.5">Study the Industry Insights page. Know salaries, demand, skills needed. Interview confidently.</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

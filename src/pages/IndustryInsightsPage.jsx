import { industryInsights } from '../data/curriculum';
import FadeIn from '../components/common/FadeIn';

export default function IndustryInsightsPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Market Research 2026</span>
          <h1 className="text-2xl sm:text-3xl font-bold">AI Infrastructure Job Market</h1>
          <p className="text-white/80 mt-1 text-sm max-w-2xl">
            Real salary data, demand statistics, and skills analysis based on current job postings
            from OpenAI, Meta, Gartner, Prolific, Leidos, and 160+ AI companies.
          </p>
        </div>
      </FadeIn>

      {/* Demand Gap */}
      <FadeIn delay={100}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 text-center min-w-[140px] border border-red-100 dark:border-red-800">
              <div className="text-4xl font-bold text-red-600 dark:text-red-400">3:1</div>
              <div className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">Demand Gap</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">3 jobs : 1 candidate</div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{industryInsights.demandGap.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{industryInsights.demandGap.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Source: {industryInsights.demandGap.source}</p>

              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">10x</div>
                  <div className="text-xs text-green-600 dark:text-green-400">MLOps job postings growth (5 years)</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">$15.7B</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Global MLOps market by 2030</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-100 dark:border-orange-800">
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-300">45+ days</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Average time-to-fill MLOps roles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Salaries */}
      <FadeIn delay={200}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">💰 Salary Ranges 2026 (US Market)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-700">
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Salary Range</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Demand Level</th>
                </tr>
              </thead>
              <tbody>
                {industryInsights.salaryRanges.map((r) => (
                  <tr key={r.role} className="border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="py-2.5 font-medium text-gray-800 dark:text-gray-100">{r.role}</td>
                    <td className="py-2.5 text-gray-600 dark:text-gray-300">{r.range}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.demand === 'Critical' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                        r.demand === 'Very High' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' :
                        'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {r.demand}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Source: Glassdoor, ZipRecruiter, Kore1 Salary Guide 2026. Salaries vary by location and experience.
          </p>
        </div>
      </FadeIn>

      {/* Top Skills */}
      <FadeIn delay={300}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">⚡ Top Skills in Demand 2026</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Percentage indicates how frequently each skill appears in MLOps/AI Infrastructure job postings.
          </p>
          <div className="space-y-3">
            {industryInsights.topSkills.map((s) => (
              <div key={s.skill}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{s.skill}</span>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{s.weight}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${s.weight}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Growth Markets */}
      <FadeIn delay={400}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">📈 Fastest Growing Markets</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {industryInsights.growthMarkets.map((m) => (
              <div key={m.market} className="p-4 rounded-lg border border-gray-100 dark:border-dark-700 bg-gradient-to-br from-gray-50 dark:from-dark-700/50 to-white dark:to-dark-800 hover:shadow-sm transition">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{m.market}</h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{m.growth}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Roles: {m.roles}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Future Trends */}
      <FadeIn delay={500}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">🔮 Future-Proof Skills (2026-2030)</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {industryInsights.futureTrends.map((trend, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-indigo-50 dark:from-indigo-900/30 to-white dark:to-dark-800 border border-indigo-100 dark:border-indigo-800">
                <span className="text-lg shrink-0">🚀</span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{trend}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Emerging specialization with growing demand</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Certification Guide */}
      <FadeIn delay={600}>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">🎓 Certifications That Matter</h2>
          <p className="text-gray-400 text-xs mb-3">Projects beat certifications every time. But these add signal:</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">AWS</span>
              <p className="text-gray-300 text-xs mt-1">AWS Certified ML – Specialty or AWS Solutions Architect Associate</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">Kubernetes</span>
              <p className="text-gray-300 text-xs mt-1">CKA (Certified Kubernetes Administrator) — highly valued</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">Cloud</span>
              <p className="text-gray-300 text-xs mt-1">Google Professional ML Engineer or Azure AI Engineer</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 bg-white/5 rounded-lg p-3">
            💡 <strong className="text-gray-300">Advice from hiring managers:</strong> "Practical project experience outweighs certifications at most top employers."
          </div>
        </div>
      </FadeIn>

      {/* Final Advice */}
      <FadeIn delay={700}>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-2">🎯 Your Competitive Advantage</h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Most people build toy projects. You're building <strong>production-grade systems</strong> — RAG pipelines on Kubernetes,
            MLOps platforms with MLflow, AI security systems. Very few candidates can do all of this.
          </p>
          <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
            The 3:1 demand gap means the market is desperate for people like you.
            Complete the 30 days. Build the 3 projects. You'll be ready.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-indigo-200">
            <span className="bg-white/20 px-2 py-1 rounded">$130K - $220K</span>
            <span className="bg-white/20 px-2 py-1 rounded">3:1 Demand Gap</span>
            <span className="bg-white/20 px-2 py-1 rounded">Remote-Friendly</span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

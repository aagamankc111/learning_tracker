import { industryInsights } from '../data/curriculum';
import FadeIn from '../components/common/FadeIn';

export default function IndustryInsightsPage() {
  const d = industryInsights;

  return (
    <div className="space-y-6">

      {/* HERO */}
      <FadeIn>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Market Research 2026</span>
          <h1 className="text-2xl sm:text-3xl font-bold">AI Infrastructure & Cloud Job Market</h1>
          <p className="text-white/80 mt-1 text-sm max-w-2xl">
            {d.marketOverview.oneLine}
          </p>
        </div>
      </FadeIn>

      {/* MARKET OVERVIEW STATS */}
      <FadeIn delay={60}>
        <div className="grid sm:grid-cols-3 gap-3">
          {d.marketOverview.meta.map((m) => (
            <div key={m.label} className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{m.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{m.label}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{m.detail}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* THE BIFURCATION — THE KEY INSIGHT */}
      <FadeIn delay={100}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{d.marketOverview.bifurcation.headline}</h2>
          </div>
          <div className="space-y-2 mb-4">
            {d.marketOverview.bifurcation.description.map((p, i) => (
              <p key={i} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{p}</p>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {d.marketOverview.bifurcation.dataPoints.map((dp) => (
              <div key={dp.label} className="rounded-lg p-3 text-center border bg-gray-50 dark:bg-dark-700/50 border-gray-200 dark:border-dark-700">
                <div className="text-xl font-bold text-gray-700 dark:text-gray-300">{dp.value}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{dp.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Source: {d.marketOverview.bifurcation.source}</p>
        </div>
      </FadeIn>

      {/* DEMAND GAP — 1.6M vs 518K */}
      <FadeIn delay={140}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="bg-gray-50 dark:bg-dark-700/50 rounded-2xl p-5 text-center min-w-[140px] border border-gray-200 dark:border-dark-700">
              <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">3:1</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Demand Gap</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">1.6M roles : 518K candidates</div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{d.demandGap.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{d.demandGap.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Source: {d.demandGap.source}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-4 gap-3 mt-4">
            {d.demandGap.globalData.map((g) => (
              <div key={g.label} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center border border-indigo-100 dark:border-indigo-800">
                <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{g.value}</div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400">{g.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-dark-700/50 rounded-lg border border-gray-200 dark:border-dark-700 text-sm text-gray-700 dark:text-gray-300">
            <strong>⚠ Entry-Level Reality:</strong> {d.demandGap.entryLevelNote}
          </div>
        </div>
      </FadeIn>

      {/* LAYOFF REALITY */}
      <FadeIn delay={180}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📉</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{d.layoffReality.headline}</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{d.layoffReality.description}</p>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            {d.layoffReality.data.map((ld) => (
              <div key={ld.label} className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-3 border border-gray-100 dark:border-dark-700">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{ld.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{ld.label}</div>
                {ld.detail && <div className="text-[10px] text-gray-400 dark:text-gray-500">{ld.detail}</div>}
              </div>
            ))}
          </div>
          <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-lg border border-gray-200 dark:border-dark-700 text-sm text-gray-700 dark:text-gray-300">
            <strong>💡 Key Insight:</strong> {d.layoffReality.keyInsight}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Source: {d.layoffReality.source}</p>
        </div>
      </FadeIn>

      {/* SALARY TIERS */}
      <FadeIn delay={220}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <span className="text-lg">💰</span>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{d.salaryTiers.headline}</h2>
          <div className="space-y-2 mt-2 mb-4">
            {d.salaryTiers.description.map((p, i) => (
              <p key={i} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{p}</p>
            ))}
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300 pr-3">Tier</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300 pr-3">Total Comp</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300 pr-3">Companies</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Requirement</th>
                </tr>
              </thead>
              <tbody>
                {d.salaryTiers.tiers.map((t) => (
                  <tr key={t.tier} className="border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="py-2.5 font-medium text-gray-800 dark:text-gray-100 pr-3">{t.tier}</td>
                    <td className="py-2.5 text-indigo-600 dark:text-indigo-400 font-medium pr-3">{t.comp}</td>
                    <td className="py-2.5 text-gray-600 dark:text-gray-300 text-xs pr-3">{t.companies}</td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-400 text-xs">{t.requirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Premium */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800 mb-4">
            <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-200 mb-2">📊 AI Engineer Pay Premium Over Non-AI Peers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {d.salaryTiers.aiPremium.map((ap) => (
                <div key={ap.level} className="text-center p-2 bg-white dark:bg-dark-800/50 rounded">
                  <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{ap.premium}</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">{ap.level}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-2">{d.salaryTiers.premiumNote}</p>
          </div>

          {/* Robert Half comparison */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Range</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Midpoint</th>
                </tr>
              </thead>
              <tbody>
                {d.salaryTiers.roberHalfComparison.map((r) => (
                  <tr key={r.role} className="border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="py-2.5 font-medium text-gray-800 dark:text-gray-100">{r.role}</td>
                    <td className="py-2.5 text-gray-600 dark:text-gray-300">{r.range}</td>
                    <td className="py-2.5 text-indigo-600 dark:text-indigo-400 font-medium">{r.midpoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">Source: Robert Half 2026 Salary Guide, Levels.fyi Q3 2025, BLS OES May 2024</p>
        </div>
      </FadeIn>

      {/* DETAILED SALARIES */}
      <FadeIn delay={260}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">📋 Role-Specific Salary Ranges 2026 (US)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Salary Range</th>
                  <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Demand</th>
                </tr>
              </thead>
              <tbody>
                {d.salaryRanges.map((r) => (
                  <tr key={r.role} className="border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="py-2.5 font-medium text-gray-800 dark:text-gray-100">{r.role}</td>
                    <td className="py-2.5 text-gray-600 dark:text-gray-300">{r.range}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.demand === 'Critical' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                        r.demand === 'Very High' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                        r.demand === 'High' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
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
            Source: Glassdoor, Salary.com, Levels.fyi, Robert Half 2026. Varies by location and experience.
          </p>
        </div>
      </FadeIn>

      {/* TOP SKILLS */}
      <FadeIn delay={300}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">⚡ Skills in Demand 2026</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            % indicates how frequently each skill appears in MLOps/AI Infrastructure job postings.
          </p>
          <div className="space-y-3">
            {d.topSkills.map((s) => (
              <div key={s.skill}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{s.skill}</span>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{s.weight}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700" style={{ width: `${s.weight}%` }} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700/50 rounded-lg border border-gray-200 dark:border-dark-700">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">☠ What\'s Dying in DevOps / MLOps</h3>
            <ul className="space-y-1">
              {d.skillsDying.map((skill, i) => (
                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                  <span>•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeIn>

      {/* INTERVIEW PROCESS */}
      <FadeIn delay={340}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎤</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{d.interviewProcess.headline}</h2>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800 mb-4">
            <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium">
              💡 {d.interviewProcess.keyAdvice}
            </p>
          </div>

          <div className="space-y-3 mb-4">
            {d.interviewProcess.rounds.map((r) => (
              <div key={r.round} className="p-3 rounded-lg border border-gray-100 dark:border-dark-700 bg-gray-50 dark:bg-dark-700/50">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{r.round}</h3>
                  <span className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-dark-600 px-2 py-0.5 rounded">{r.type}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">🎯 MLOps-Specific Topics Tested</h3>
            <div className="space-y-1">
              {d.interviewProcess.mlopsSpecific.map((topic, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <span className="text-emerald-500 mt-0.5 shrink-0">▸</span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">🏗 Portfolio Projects That Get You Hired</h3>
            <div className="space-y-2">
              {d.interviewProcess.projectPortfolio.map((p) => (
                <div key={p.project} className="p-3 rounded-lg border border-gray-100 dark:border-dark-700">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100">{p.project}</h4>
                    <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono">{p.stack}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Shows: {p.demonstrates}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* GROWTH MARKETS */}
      <FadeIn delay={380}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">📈 Growth Markets & Fastest-Growing Occupations</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Markets by Growth</h3>
              <div className="space-y-2">
                {d.growthMarkets.map((m) => (
                  <div key={m.market} className="p-3 rounded-lg bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{m.market}</span>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">{m.growth}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Roles: {m.roles}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Fastest-Growing Occupations</h3>
              <div className="space-y-2">
                {d.fastestGrowingOccupations.map((o) => (
                  <div key={o.role} className="p-3 rounded-lg bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{o.role}</span>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{o.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">Source: CompTIA State of Tech Workforce 2026. 10-year projected growth vs US national average.</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* REMOTE WORK */}
      <FadeIn delay={420}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">🏠 Remote Work Reality 2026</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{d.remoteWork.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300 rounded-full text-xs font-medium">74% On-site</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300 rounded-full text-xs font-medium">18% Hybrid</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300 rounded-full text-xs font-medium">8% Fully Remote</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Source: Robert Half 2026 — Remote roles get 6-10x more applicants than on-site.</p>
        </div>
      </FadeIn>

      {/* FUTURE TRENDS */}
      <FadeIn delay={460}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">🔮 Future-Proof Skills (2026-2030)</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {d.futureTrends.map((trend, i) => (
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

      {/* CAREER STRATEGY */}
      <FadeIn delay={500}>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">🎯 {d.careerStrategy.headline}</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-amber-300">New to the field?</span>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">{d.careerStrategy.forNewcomers}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-emerald-300">Already experienced?</span>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">{d.careerStrategy.forSeniors}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">Coming from non-AI background?</span>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">{d.careerStrategy.forNonAIDevs}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* CERTIFICATIONS */}
      <FadeIn delay={540}>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">🎓 Certifications That Matter</h2>
          <p className="text-gray-400 text-xs mb-3">{d.certAdvice}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {d.certifications.map((c) => (
              <div key={c.cert} className="bg-white/10 rounded-lg p-3">
                <span className="font-bold text-indigo-300">{c.provider}</span>
                <p className="text-gray-300 text-xs mt-1">{c.cert}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* FINAL ADVICE */}
      <FadeIn delay={580}>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-2">🎯 Your Competitive Advantage</h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            The market is not one market. General tech is saturated. But AI infrastructure, MLOps, and cloud
            DevOps remain severely talent-starved — 1.6M open roles with only 518K qualified candidates.
            The 3:1 demand gap means companies are desperate for engineers who can build production-grade
            AI systems.
          </p>
          <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
            You don't need Leetcode. You need a portfolio that shows you can ship. This 90-day program builds
            exactly that — production Kubernetes clusters, RAG pipelines, MLOps platforms, and AI security systems.
            Very few candidates can do all of this.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-indigo-200">
            <span className="bg-white/20 px-2 py-1 rounded">$130K - $300K</span>
            <span className="bg-white/20 px-2 py-1 rounded">3:1 Demand Gap</span>
            <span className="bg-white/20 px-2 py-1 rounded">No Leetcode Interviews</span>
            <span className="bg-white/20 px-2 py-1 rounded">Portfolio > Certifications</span>
          </div>
        </div>
      </FadeIn>

      {/* SOURCES */}
      <FadeIn delay={620}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Data Sources</h3>
          <div className="grid sm:grid-cols-2 gap-1 text-[10px] text-gray-400 dark:text-gray-500">
            <span>• CompTIA State of Tech Workforce 2026</span>
            <span>• Indeed Hiring Lab (July 2025)</span>
            <span>• Stanford HAI AI Index 2026</span>
            <span>• LinkedIn Jobs on the Rise 2026</span>
            <span>• Robert Half 2026 Salary Guide</span>
            <span>• Levels.fyi AI Comp Trends Q3 2025</span>
            <span>• ManpowerGroup Global Talent Shortage 2026</span>
            <span>• Glassdoor / Salary.com / ZipRecruiter 2026</span>
            <span>• BLS Occupational Employment & Wage Statistics</span>
            <span>• TrueUp Layoffs Tracker (June 2026)</span>
            <span>• WEF Future of Jobs Report 2025</span>
            <span>• CloudDevOpsJobs.com Hiring Trends 2026</span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

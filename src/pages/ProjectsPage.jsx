import { majorProjects, industryInsights } from '../data/curriculum';
import FadeIn from '../components/common/FadeIn';

const difficultyColors = {
  Advanced: 'bg-violet-100 text-violet-700',
  'Intermediate-Advanced': 'bg-emerald-100 text-emerald-700',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Portfolio</span>
          <h1 className="text-2xl sm:text-3xl font-bold">3 Flagship Projects</h1>
          <p className="text-white/80 mt-1 text-sm max-w-2xl">
            These projects are based on real job postings from OpenAI, Meta, Gartner, and top AI companies.
            Each one demonstrates production-grade skills that employers actively look for.
            Build them in Week 4. <strong className="text-white">These are the projects that get you hired.</strong>
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Based on real job postings 2026</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">3:1 demand gap — be the 1</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-4 text-white shadow">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium">Employers don't care about your certificates. They care about what you've built.</p>
              <p className="text-indigo-200 text-xs mt-0.5">Deploy every project live. Write detailed READMEs. Record demo videos. Pin them on GitHub.</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="space-y-6">
        {majorProjects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 150}>
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[project.difficulty] || 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'}`}>
                        {project.difficulty}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{project.days}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{project.impact}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{project.title}</h2>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{project.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl block">{['🤖', '🏗️', '🔒'][i]}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{project.salary}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                      {t}
                    </span>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key Highlights</p>
                  <ul className="space-y-1.5">
                    {project.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Top Skills These Projects Build */}
      <FadeIn delay={500}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Skills These Projects Prove</h2>
          <div className="space-y-3">
            {industryInsights.topSkills.slice(0, 8).map((s) => (
              <div key={s.skill}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{s.skill}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{s.weight}% of top job postings</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${s.weight}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={600}>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">💡 Portfolio Tips That Work</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">1. Deploy everything live</span>
              <p className="text-gray-300 text-xs mt-1">A GitHub repo is proof of code. A live URL is proof of deployment. Both matter in interviews.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">2. Architecture diagrams in README</span>
              <p className="text-gray-300 text-xs mt-1">Show you can design systems. Draw.io or Excalidraw. Include them in every README.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">3. 2-minute demo video per project</span>
              <p className="text-gray-300 text-xs mt-1">Record a walkthrough showing the live app, architecture, and key features. Host on YouTube/Loom.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">4. Write a blog post about each</span>
              <p className="text-gray-300 text-xs mt-1">"Building a Production RAG Pipeline" — publish on LinkedIn + Dev.to. This is how you get noticed by recruiters.</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

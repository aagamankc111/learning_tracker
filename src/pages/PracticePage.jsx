import { practiceResources } from '../data/curriculum';
import FadeIn from '../components/common/FadeIn';
import MiniMotivationBar from '../components/Motivation/MiniMotivationBar';

const colorMap = {
  indigo: { gradient: 'from-indigo-500 to-indigo-600', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', hover: 'hover:border-indigo-200' },
  blue: { gradient: 'from-indigo-500 to-indigo-600', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', hover: 'hover:border-indigo-200' },
  yellow: { gradient: 'from-indigo-500 to-indigo-600', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', hover: 'hover:border-indigo-200' },
  orange: { gradient: 'from-indigo-500 to-indigo-600', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', hover: 'hover:border-indigo-200' },
  violet: { gradient: 'from-indigo-500 to-indigo-600', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', hover: 'hover:border-indigo-200' },
  red: { gradient: 'from-indigo-500 to-indigo-600', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', hover: 'hover:border-indigo-200' },
};

export default function PracticePage() {
  const categories = Object.entries(practiceResources);

  return (
    <div className="space-y-6">
      <FadeIn>
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Practice</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Practice Resources</h1>
          <p className="text-indigo-100 mt-1 text-sm max-w-2xl">
            The best free websites to practice each topic hands-on. Bookmark these — they're more valuable than any course.
            Every topic includes interactive labs, challenges, and real-world environments.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">All completely free</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">No account required for most</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Interactive hands-on learning</span>
          </div>
        </div>
      </FadeIn>

      <MiniMotivationBar compact />

      {categories.map(([key, cat], ci) => {
        const colors = colorMap[cat.color] || colorMap.indigo;
        return (
          <FadeIn key={key} delay={ci * 80}>
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
              <div className={`bg-gradient-to-r ${colors.gradient} px-5 py-4 text-white`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <h2 className="text-lg font-bold">{cat.title}</h2>
                </div>
              </div>
              <div className="p-5 grid gap-3 sm:grid-cols-2">
                {cat.sites.map((site, i) => (
                  <a
                    key={i}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-4 rounded-xl border border-gray-200 dark:border-dark-700 ${colors.hover} transition-all hover:shadow-md hover:-translate-y-0.5`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{site.name}</h3>
                          <svg className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{site.desc}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${ci % 2 === 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className="text-xs text-gray-400 dark:text-gray-500">Hands-on practice</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        );
      })}

      {/* Weekly Practice Tip */}
      <FadeIn delay={600}>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">💡 How to Use These Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">1. Daily Warm-up</span>
              <p className="text-gray-300 text-xs mt-1">Spend 15 minutes on an interactive challenge before deep work. OverTheWire Bandit or LeetCode daily.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">2. Topic Deep Dive</span>
              <p className="text-gray-300 text-xs mt-1">When studying a topic, go to the corresponding resource and complete 2-3 exercises. Apply immediately.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-bold text-indigo-300">3. Weekend CTF</span>
              <p className="text-gray-300 text-xs mt-1">Try a Capture The Flag challenge each weekend. picoCTF and TryHackMe consolidate everything you've learned.</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { dailyReviewEssentials, quickReferenceStatusCodes, quickReferencePorts, practiceResources } from '../data/curriculum';
import FadeIn from '../components/common/FadeIn';
import MiniMotivationBar from '../components/Motivation/MiniMotivationBar';

const categories = [
  { key: 'linux', label: 'Linux & Bash', icon: '🐧', color: 'indigo' },
  { key: 'networking', label: 'Networking', icon: '🌐', color: 'blue' },
  { key: 'python', label: 'Python', icon: '🐍', color: 'yellow' },
  { key: 'k8s', label: 'Kubernetes', icon: '☸️', color: 'blue' },
  { key: 'docker', label: 'Docker', icon: '🐳', color: 'blue' },
];

export default function DailyReviewPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Daily Practice</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Daily Review & Revision</h1>
          <p className="text-white/80 mt-1 text-sm max-w-xl">
            Review these commands and concepts every day. Repetition builds muscle memory.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/week/1" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition border border-white/20">
              Week 1 —
            </Link>
            <Link to="/week/2" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition border border-white/20">
              Week 2 —
            </Link>
            <Link to="/week/3" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition border border-white/20">
              Week 3 —
            </Link>
            <Link to="/week/4" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition border border-white/20">
              Week 4 —
            </Link>
            <Link to="/projects" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition border border-white/20">
              Projects
            </Link>
          </div>
        </div>
      </FadeIn>

      <MiniMotivationBar compact />

      {/* Commands by Category */}
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat, i) => {
          const items = dailyReviewEssentials[cat.key];
          if (!items) return null;
          return (
            <FadeIn key={cat.key} delay={i * 100}>
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-50 dark:border-dark-700/50 flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{cat.label}</h3>
                </div>
                <div className="p-4 space-y-2">
                  {items.map((item, j) => (
                    <div key={j} className="text-xs">
                      <pre className="bg-gray-900 dark:bg-black text-green-400 dark:text-green-300 px-3 py-2 rounded-lg font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto border border-gray-700/50">
$ {item.cmd}
                      </pre>
                      <pre className="text-gray-300 dark:text-gray-400 mt-1 px-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap bg-gray-900/50 dark:bg-black/50 p-1.5 rounded border border-gray-700/30"># {item.desc}</pre>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Quick References */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FadeIn delay={400}>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 dark:border-dark-700/50">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">🌐 HTTP Status Codes</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-1.5">
                {quickReferenceStatusCodes.map((s) => (
                  <div key={s.code} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-dark-700 text-xs">
                    <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      s.code < 300 ? 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300' :
                      s.code < 400 ? 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300' :
                      s.code < 500 ? 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300' :
                      'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300'
                    }`}>
                      {s.code}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={500}>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 dark:border-dark-700/50">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">🔌 Critical Ports</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-1.5">
                {quickReferencePorts.map((p) => (
                  <div key={p.port} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-dark-700 text-xs">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 w-10">{p.port}</span>
                    <span className="text-gray-700 dark:text-gray-200">{p.service}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-[10px]">{p.protocol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* OSI Model Quick Ref */}
      <FadeIn delay={600}>
<div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 dark:border-dark-700/50">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">📡 OSI Model — 7 Layers</h3>
          </div>
          <div className="p-4">
            <div className="grid sm:grid-cols-7 gap-2">
              {[
                { layer: 7, name: 'Application', example: 'HTTP, DNS, SSH', security: 'Injection attacks' },
                { layer: 6, name: 'Presentation', example: 'TLS, SSL', security: 'Encryption bypass' },
                { layer: 5, name: 'Session', example: 'NetBIOS, RPC', security: 'Session hijacking' },
                { layer: 4, name: 'Transport', example: 'TCP, UDP', security: 'Port scanning' },
                { layer: 3, name: 'Network', example: 'IP, ICMP', security: 'IP spoofing' },
                { layer: 2, name: 'Data Link', example: 'Ethernet, MAC', security: 'MAC flooding' },
                { layer: 1, name: 'Physical', example: 'Cables, Hubs', security: 'Physical access' },
              ].map((l) => (
                <div key={l.layer} className="bg-gradient-to-b from-gray-50 dark:from-dark-700/50 to-gray-100 dark:to-dark-700 rounded-lg p-3 text-center border border-gray-200 dark:border-dark-600">
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">L{l.layer}</div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{l.name}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{l.example}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">⚠ {l.security}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Practice Resources Quick Links */}
      <FadeIn delay={650}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50 dark:border-dark-700/50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">🎯 Practice Resources</h3>
            <Link to="/practice" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">View all →</Link>
          </div>
          <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {Object.entries(practiceResources).slice(0, 4).map(([key, cat]) => (
              <a key={key} href={cat.sites[0].url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition text-sm">
                <span>{cat.icon}</span>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{cat.title}</span>
                <span className="text-xs text-indigo-500 dark:text-indigo-400 ml-auto">Practice →</span>
              </a>
            ))}
          </div>
          <div className="px-5 py-2 border-t border-gray-50 dark:border-dark-700/50 bg-gray-50 dark:bg-dark-700 text-xs text-gray-400 dark:text-gray-500">
            🆕 New: OverTheWire Bandit for Linux, TryHackMe for Security, Play with K8s for Kubernetes
          </div>
        </div>
      </FadeIn>

      {/* Daily Study Routine */}
      <FadeIn delay={700}>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">⏰ Daily Study Routine</h2>
          <div className="grid sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-bold text-indigo-200 text-xs uppercase">Morning</div>
              <div className="font-medium mt-1">6-8 AM</div>
              <div className="text-indigo-100 text-xs mt-0.5">Deep work — hardest topic</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-bold text-indigo-200 text-xs uppercase">Midday</div>
              <div className="font-medium mt-1">9 AM-12 PM</div>
              <div className="text-indigo-100 text-xs mt-0.5">Hands-on coding + labs</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-bold text-indigo-200 text-xs uppercase">Afternoon</div>
              <div className="font-medium mt-1">1-6 PM</div>
              <div className="text-indigo-100 text-xs mt-0.5">Project building + practice</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-bold text-indigo-200 text-xs uppercase">Evening</div>
              <div className="font-medium mt-1">7-10 PM</div>
              <div className="text-indigo-100 text-xs mt-0.5">Review + GitHub + plan</div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

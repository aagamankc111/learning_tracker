import { Link } from 'react-router-dom';
import curriculum from '../data/curriculum';
import FadeIn from '../components/common/FadeIn';
import MotivationBanner from '../components/Motivation/MotivationBanner';
import JourneyGraph from '../components/Motivation/JourneyGraph';
import GodTierDashboard from '../components/Motivation/GodTierDashboard';
import MiniMotivationBar from '../components/Motivation/MiniMotivationBar';

const phaseIndices = { 1:0, 2:1, 3:2, 4:3, 5:4, 6:5, 7:6, 8:7, 9:8 };

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <FadeIn>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                90-Day MLOps Architect Program
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">AI Infrastructure & Cloud</h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
               Master Linux, Networking, Python, AWS, Docker, Kubernetes, MLOps, LLMs, and AI Security.
               Build 4 production-grade portfolio projects. Job-ready in 90 days.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/week/1" className="px-5 py-2.5 bg-white text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-50 transition shadow">
                Start Phase 1 →
              </Link>
              <Link to="/industry-insights" className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition border border-white/20">
                Market Research
              </Link>
              <Link to="/daily-review" className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition border border-white/20">
                Daily Review
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Mini Motivation Bar */}
      <FadeIn delay={80}>
        <MiniMotivationBar compact />
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '90', label: 'Days', desc: 'Intensive program' },
            { value: '9', label: 'Phases', desc: 'Structured roadmap' },
            { value: '4', label: 'Projects', desc: 'Portfolio ready' },
            { value: '90+', label: 'Subtopics', desc: 'Detailed coverage' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">{s.label}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Motivation Banner */}
      <FadeIn delay={100}>
        <MotivationBanner />
      </FadeIn>

      {/* God Tier Dashboard */}
      <FadeIn delay={120}>
        <GodTierDashboard />
      </FadeIn>

      {/* Journey Graph */}
      <FadeIn delay={140}>
        <JourneyGraph compact />
      </FadeIn>

      {/* Market Demand Banner */}
      <FadeIn delay={160}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-center min-w-[100px] border border-indigo-100 dark:border-indigo-800">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">1.6M</div>
              <div className="text-xs text-indigo-500 dark:text-indigo-400">Open AI Roles</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Only 518K candidates</div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">The Market Is NOT One Market</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                General SWE postings are down <strong className="text-gray-800 dark:text-gray-100">49%</strong> from 2020 — but ML engineer roles are up <strong className="text-indigo-600 dark:text-indigo-400">59%</strong>.
                Two markets running in opposite directions. AI infrastructure, MLOps, and cloud DevOps
                remain severely talent-starved with a <strong className="text-gray-800 dark:text-gray-100">3:1 demand gap</strong>.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Entry-level is competitive (73% drop in junior hiring). But engineers who can build production-grade
                AI systems have maximum leverage.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-700 rounded text-xs text-gray-600 dark:text-gray-300">$130K-$200K Enterprise</span>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-700 rounded text-xs text-gray-600 dark:text-gray-300">$350K-$600K Top-Tier AI</span>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-700 rounded text-xs text-gray-600 dark:text-gray-300">No Leetcode Interviews</span>
              </div>
            </div>
            <Link to="/industry-insights" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition shadow shrink-0">
              Full Analysis →
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Phase Overview */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your 9-Phase Roadmap (90 Days)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {curriculum.weeks.map((week, i) => (
            <FadeIn key={week.id} delay={i * 100}>
              <Link to={`/week/${week.id}`} className="block group">
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div className="bg-indigo-500 h-2" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full mb-2">
                          Phase {week.id}
                        </span>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">
                          {week.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{week.subtitle}</p>
                      </div>
                      <span className="text-2xl opacity-50">{['🖥️', '☁️', '🤖', '🚀', '🔬', '📐', '🏭', '🧠', '🏆'][i]}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{week.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 dark:text-gray-500">{week.days.length} days</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Working Backwards — The MLOps Stack */}
      <FadeIn delay={380}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔄</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Working Backwards from What You Know</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            You've used ChatGPT, Claude, or Gemini. That's your starting point. MLOps is everything
            <em> underneath</em> that chat interface that makes it work at scale. Here's how each phase
            of this program connects back to the AI app you already use:
          </p>
          <div className="space-y-3">
            {[
              { icon: '🧠', label: 'You know', title: 'An AI Model (GPT-5, Claude, Gemini)', desc: 'You\'ve talked to AI in ChatGPT. That\'s a deployed model in production.', phase: '' },
              { icon: '▸', label: 'Phase 1-2', title: 'Programming (Python & Linux)', desc: 'Behind that chat interface is Python code — TensorFlow, PyTorch, FastAPI. Understanding the dependencies, environment, and how the model is built is your first step.', phase: 'Linux, Python, Git' },
              { icon: '▸', label: 'Phase 2', title: 'Version Control (Git)', desc: 'Production models go through hundreds of experiments and revisions. Your team uses branches, tags, and PRs to manage changes to the model code and config.', phase: 'Git, GitHub, branching' },
              { icon: '▸', label: 'Phase 3', title: 'Cloud Computing (AWS)', desc: 'Your laptop can\'t serve millions of requests. Cloud gives you servers, storage, databases, and networking that scale up and down based on demand.', phase: 'AWS, EC2, S3, VPC' },
              { icon: '▸', label: 'Phase 4', title: 'Containerization (Docker & K8s)', desc: 'Python versions, CUDA drivers, library conflicts — models need a consistent environment everywhere. Containers bundle code + dependencies so it runs identically on your laptop and in production.', phase: 'Docker, Kubernetes' },
              { icon: '▸', label: 'Phase 5-6', title: 'CI/CD & Automation', desc: 'You don\'t SSH into servers to deploy. Pipelines automatically test, build, and deploy new model versions. GitOps means your infrastructure is declared in code.', phase: 'GitHub Actions, ArgoCD, Terraform' },
              { icon: '▸', label: 'Phase 7', title: 'Machine Learning & Data Engineering', desc: 'This is where intelligence actually takes shape. Training pipelines, feature extraction, model evaluation, hyperparameter tuning. Without quality data and proper training, the model is useless.', phase: 'MLflow, Kubeflow, feature stores' },
              { icon: '▸', label: 'Phase 8', title: 'LLMs & Monitoring', desc: 'Deploying and monitoring LLMs at scale — vLLM serving, RAG pipelines, drift detection, feedback loops. The model degrades silently over time if you don\'t monitor it.', phase: 'vLLM, RAG, Evidently AI' },
              { icon: '▸', label: 'Phase 9', title: 'Security & Capstone', desc: 'Guardrails, prompt injection defense, PII redaction. Then tie it all together in a production-grade capstone that proves you can ship.', phase: 'AI security, full platform' },
            ].map((step, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                step.icon === '🧠'
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700'
                  : 'bg-gray-50 dark:bg-dark-700/50 border-gray-100 dark:border-dark-700'
              }`}>
                {step.icon === '🧠' ? (
                  <span className="text-lg shrink-0 mt-0.5">🧠</span>
                ) : (
                  <span className="text-indigo-400 text-sm font-bold shrink-0 mt-0.5 w-4">▸</span>
                )}
                <div className="flex-1 min-w-0">
                  {step.label && <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500">{step.label}</span>}
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{step.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">{step.desc}</p>
                  {step.phase && <span className="inline-block mt-1 text-[10px] text-indigo-500 dark:text-indigo-400 font-medium">{step.phase}</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Bottom line: You already know the destination (AI chat apps). This program teaches you
            the stack underneath — one layer at a time, in the order that makes each one click.
          </p>
        </div>
      </FadeIn>

      {/* Target Roles */}
      <FadeIn delay={400}>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Target Roles — Salary Data 2026</h2>
            <Link to="/industry-insights" className="text-xs text-indigo-600 hover:underline font-medium">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'MLOps Engineer', desc: 'Deploy, monitor, and scale AI models in production', salary: '$130K–$250K', demand: '1.6M Open Roles' },
              { role: 'AI Infrastructure Engineer', desc: 'Build and maintain systems for AI workloads', salary: '$150K–$250K', demand: '3:1 Demand Gap' },
              { role: 'Cloud DevOps (AI Focus)', desc: 'Automate infrastructure, CI/CD, deployments', salary: '$120K–$180K', demand: 'General SWE -49%' },
              { role: 'LLM Infrastructure Engineer', desc: 'Design and deploy LLM serving at scale', salary: '$160K–$300K', demand: '+59% vs 2020' },
            ].map((r) => (
              <div key={r.role} className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50 border border-gray-100 dark:border-dark-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{r.role}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{r.salary}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{r.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Quick Start Guide */}
      <FadeIn delay={500}>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3">How This Works</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <span className="text-indigo-400 font-bold text-lg shrink-0">1</span>
              <div>
                <p className="font-medium">Follow the 90-Day Plan</p>
                <p className="text-gray-400 text-xs mt-0.5">Each day has topics, commands, and a mini project. Check them off as you go.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-400 font-bold text-lg shrink-0">2</span>
              <div>
                <p className="font-medium">Build Portfolio Projects</p>
                <p className="text-gray-400 text-xs mt-0.5">4 flagship projects that go on your resume. These get you hired.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-400 font-bold text-lg shrink-0">3</span>
              <div>
                <p className="font-medium">Know the Market</p>
                <p className="text-gray-400 text-xs mt-0.5">DevOps/MLOps interviews test system design, not Leetcode. Study the Industry Insights page for salaries, demand, and interview patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

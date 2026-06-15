const resources = [
  {
    icon: '📚',
    title: 'Cloud-DevOps Learning Resources',
    desc: 'A curated collection of the best free resources for learning Cloud and DevOps, from beginner to advanced — including tutorials, cheatsheets, and practice labs.',
    url: 'https://github.com/ahmedtariq01/Cloud-DevOps-Learning-Resources',
    tags: ['curated', 'beginner-friendly', 'comprehensive'],
  },
  {
    icon: '🏗️',
    title: 'System Design Primer',
    desc: 'Learn how to design large-scale systems with this organized collection covering scalability, caching, load balancing, databases, and more. Includes Anki flashcards for interview prep.',
    url: 'https://github.com/donnemartin/system-design-primer',
    tags: ['system-design', 'interview-prep', 'scalability'],
  },
  {
    icon: '⚡',
    title: 'DevOps Exercises',
    desc: 'Hands-on exercises covering Linux, Git, CI/CD, Kubernetes, Terraform, Ansible, Docker, monitoring, and more. Perfect for practicing real-world DevOps skills.',
    url: 'https://github.com/bregman-arie/devops-exercises',
    tags: ['hands-on', 'practice', 'challenges'],
  },
  {
    icon: '🛤️',
    title: 'Into the DevOps',
    desc: 'A complete guide for beginners stepping into the DevOps world — covering culture, tools, automation, and infrastructure with practical project walkthroughs.',
    url: 'https://github.com/NotHarshhaa/into-the-devops',
    tags: ['beginners', 'guide', 'projects'],
  },
  {
    icon: '🚀',
    title: 'DevOps Projects',
    desc: 'A collection of real-world DevOps and Cloud projects ranging from beginner to advanced, covering AWS, Kubernetes, Terraform, CI/CD, and more.',
    url: 'https://github.com/NotHarshhaa/DevOps-Projects',
    tags: ['projects', 'real-world', 'portfolio'],
  },
  {
    icon: '🔒',
    title: 'Cloud Native Security',
    desc: 'A comprehensive resource for hacking and securing cloud-native infrastructure — covering AWS, GCP, Azure, containers, and Kubernetes security best practices.',
    url: 'https://github.com/Hacking-the-Cloud/hackingthe.cloud',
    tags: ['security', 'cloud', 'pentesting'],
  },
  {
    icon: '🤖',
    title: 'MLOps Basics',
    desc: 'Learn the fundamentals of MLOps — from data pipelines and model training to deployment and monitoring. Covers tools like MLflow, Kubeflow, and Docker.',
    url: 'https://github.com/graviraja/MLOps-Basics',
    tags: ['mlops', 'machine-learning', 'pipelines'],
  },
  {
    icon: '🎯',
    title: 'DevOps Interview Guide',
    desc: 'A structured interview preparation guide covering DevOps concepts, scenario-based questions, and hands-on problem-solving for DevOps and SRE roles.',
    url: 'https://github.com/ramanagali/Interview_Guide',
    tags: ['interview', 'preparation', 'qa'],
  },
  {
    icon: '🗺️',
    title: 'DevOps Roadmap',
    desc: 'A step-by-step roadmap for learning DevOps — from version control and Linux basics to advanced Kubernetes and cloud-native architecture. Includes skill trees and learning paths.',
    url: 'https://github.com/milanm/DevOps-Roadmap',
    tags: ['roadmap', 'learning-path', 'structured'],
  },
];

function ResourceCard({ item, index }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-surface-card border border-white/[0.06] rounded-xl p-4 hover:border-accent/30 hover:bg-white/[0.02] transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-lg shrink-0 group-hover:bg-accent/20 transition-colors">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-200 group-hover:text-accent transition-colors truncate">
              {index + 1}. {item.title}
            </h3>
            <svg className="w-4 h-4 text-gray-600 group-hover:text-accent shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-accent/10 text-accent/80 text-[10px] rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function ResourcesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-100">Resources</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          9 GitHub repositories every DevOps beginner should bookmark
        </p>
      </div>

      <div className="grid gap-3">
        {resources.map((item, i) => (
          <ResourceCard key={i} item={item} index={i} />
        ))}
      </div>

      <div className="bg-surface-card border border-white/[0.06] rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500">
          Bookmark these resources to accelerate your DevOps &amp; Cloud learning journey.
        </p>
      </div>
    </div>
  );
}

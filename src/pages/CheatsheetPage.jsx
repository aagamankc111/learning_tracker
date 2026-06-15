const sections = [
  {
    title: 'SSH vs SSL (TLS)',
    icon: '🔐',
    items: [
      { label: 'SSH (Secure Shell)', desc: 'Remote server login · Port 22 · EC2/Linux access', code: 'ssh ubuntu@server-ip', note: 'Encrypted terminal session using key pairs (public/private)' },
      { label: 'SSL/TLS', desc: 'Secure HTTP (HTTPS) · Port 443 · APIs, websites', code: 'curl https://api.example.com', note: 'Encrypts web traffic using CA-signed certificates' },
    ],
  },
  {
    title: 'Conventional CI/CD vs K8s CI/CD',
    icon: '🚀',
    items: [
      { label: 'Conventional CI/CD', desc: 'Git → Jenkins → Build → Deploy to VM', code: ['scp app.py user@server:/app', 'ssh user@server "systemctl restart app"'], note: 'Manual scaling, hard rollback' },
      { label: 'Kubernetes CI/CD', desc: 'Git → CI → Docker build → Push → K8s deploy', code: ['kubectl apply -f deployment.yaml', 'kubectl rollout status deployment/api'], note: 'Auto scaling, rolling updates, easy rollback' },
    ],
  },
  {
    title: 'Dockerfile vs Docker Compose',
    icon: '🐳',
    items: [
      { label: 'Dockerfile (single container)', desc: 'Define one container image', code: ['FROM python:3.10', 'WORKDIR /app', 'COPY . .', 'RUN pip install -r requirements.txt', 'CMD ["python", "app.py"]', '', '# Build image', 'docker build -t myapp .'], note: 'Single service definition' },
      { label: 'Docker Compose (multi-container)', desc: 'Orchestrate multiple services', code: ['version: "3"', 'services:', '  api:', '    build: .', '    ports:', '      - "8000:8000"', '', '  db:', '    image: postgres', '    environment:', '      POSTGRES_PASSWORD: root', '', '# Run stack', 'docker compose up -d'], note: 'Multi-service orchestration' },
    ],
  },
  {
    title: 'K8s Operator vs Helm',
    icon: '☸️',
    items: [
      { label: 'Helm (package manager)', desc: 'Install, upgrade, uninstall charts', code: ['helm install myapp ./chart', 'helm upgrade myapp ./chart', 'helm uninstall myapp'], note: 'Package manager for K8s' },
      { label: 'Operator (automation controller)', desc: 'No direct CLI — runs inside cluster', code: null, note: 'Manages lifecycle automatically' },
    ],
  },
  {
    title: 'Internet Gateway vs NAT Gateway (AWS)',
    icon: '🌐',
    items: [
      { label: 'Internet Gateway (IGW)', desc: 'Public subnet — direct internet access', code: null, note: 'Bi-directional internet for public resources' },
      { label: 'NAT Gateway', desc: 'Private subnet — outbound only', code: null, note: 'Outbound internet from private subnets' },
    ],
    footnote: 'Public EC2 → IGW → Internet  |  Private EC2 → NAT → Internet (outbound only)',
  },
  {
    title: 'Ingress vs Gateway API (K8s)',
    icon: '🚪',
    items: [
      { label: 'Ingress (legacy)', desc: 'HTTP routing — /api → service', code: 'kubectl get ingress', note: 'Simple HTTP routing' },
      { label: 'Gateway API (modern)', desc: 'Multi-protocol, better scalability', code: 'kubectl get gateway', note: 'Standardized, role-oriented routing' },
    ],
  },
  {
    title: 'GitOps Push vs Pull',
    icon: '🔄',
    items: [
      { label: 'Push model', desc: 'CI/CD pipeline pushes to cluster', code: 'kubectl apply -f k8s.yaml', note: 'CI-driven deployment' },
      { label: 'Pull model', desc: 'Cluster pulls from Git automatically', code: null, note: 'ArgoCD / FluxCD — Git as single source of truth' },
    ],
  },
  {
    title: 'CloudFront Signed URL vs S3 Pre-signed URL',
    icon: '☁️',
    items: [
      { label: 'S3 Pre-signed URL', desc: 'Direct S3 access with expiry', code: 'aws s3 presign s3://bucket/file.txt', note: 'Direct object access' },
      { label: 'CloudFront Signed URL', desc: 'CDN delivery with global edge', code: null, note: 'Faster global delivery via CloudFront distribution' },
    ],
  },
  {
    title: 'HPA vs VPA vs KEDA',
    icon: '📈',
    items: [
      { label: 'HPA', desc: 'Horizontal — number of pods', code: 'kubectl autoscale deployment api --cpu-percent=70 --min=2 --max=10', note: 'Scales replicas based on CPU/memory' },
      { label: 'VPA', desc: 'Vertical — CPU/RAM per pod', code: null, note: 'Adjusts resource requests/limits per pod' },
      { label: 'KEDA', desc: 'Event-driven — based on queue events', code: null, note: 'Scales on Kafka, SQS, RabbitMQ events' },
    ],
  },
];

export default function CheatsheetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">DevOps & Cloud Cheatsheet</h2>
          <p className="text-xs text-gray-500 mt-0.5">SSH · SSL · CI/CD · Docker · K8s · AWS · GitOps · CDN · Autoscaling</p>
        </div>
      </div>

      {sections.map((section, i) => (
        <div key={i} className="bg-surface-card border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <span>{section.icon}</span>
              {section.title}
            </h3>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {section.items.map((item, j) => (
              <div key={j} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-gray-200">{item.label}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    {item.note && (
                      <p className="text-[11px] text-accent/70 mt-1 italic">{item.note}</p>
                    )}
                  </div>
                  {item.code && (
                    <div className="shrink-0 max-w-[320px] w-full">
                      <div className="bg-black/40 rounded-lg p-2.5 overflow-x-auto">
                        {Array.isArray(item.code) ? (
                          item.code.map((line, k) => (
                            <pre key={k} className={`text-[11px] font-mono leading-5 ${line.startsWith('#') ? 'text-gray-600' : line.match(/^(\s{4,}|docker|kubectl|helm|ssh|scp|curl|aws)/) ? 'text-emerald-300' : 'text-gray-300'}`}>{line}</pre>
                          ))
                        ) : (
                          <pre className="text-[11px] font-mono text-emerald-300 leading-5">{item.code}</pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {section.footnote && (
            <div className="px-4 py-2 bg-accent/5 border-t border-white/[0.06]">
              <p className="text-xs text-gray-400 font-mono">{section.footnote}</p>
            </div>
          )}
        </div>
      ))}

      {/* Final mindset */}
      <div className="bg-gradient-to-r from-accent-dim/10 to-accent/5 border border-accent/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🧠</span>
          <span className="text-sm font-medium text-gray-200">Final Mindset</span>
        </div>
        <p className="text-sm text-gray-100 font-medium">DevOps = systems thinking</p>
        <p className="text-xs text-gray-500 mt-1">
          Not tools, but patterns: Security (SSH, SSL, IAM) · Networking (IGW, NAT) · Deployment (CI/CD, GitOps) · Containers (Docker, K8s) · Scaling (HPA, VPA, KEDA) · Delivery (CDN, S3)
        </p>
      </div>
    </div>
  );
}

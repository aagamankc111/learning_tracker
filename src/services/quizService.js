import { supabase } from '../config/supabase';
import curriculum from '../data/curriculum';

export async function fetchQuizQuestions(subtopicId) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('subtopic_id', subtopicId);

  if (error) throw error;
  return data || [];
}

export async function recordQuizAttempt(userId, quizType, score, totalQuestions) {
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_type: quizType,
      score,
      total_questions: totalQuestions,
    });

  if (error) throw error;
}

export async function fetchQuizHistory(userId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
}

// Massive question bank — 80+ questions across all topics
const QUESTION_BANK = [
  // ===== LINUX & BASH (15 questions) =====
  // File system navigation
  { keywords: ['file system navigation', 'file system hierarchy', '/etc', '/var'], q: 'Which directory contains system configuration files?', opts: ['/etc', '/var', '/home', '/bin'], ans: '/etc' },
  { keywords: ['file system navigation', 'file system hierarchy', '/var'], q: 'Which directory stores variable data like logs?', opts: ['/var', '/etc', '/tmp', '/usr'], ans: '/var' },
  { keywords: ['file system navigation', 'file system hierarchy', '/proc'], q: 'Which virtual filesystem contains process information?', opts: ['/proc', '/sys', '/dev', '/run'], ans: '/proc' },
  // File operations
  { keywords: ['file operations', 'cp -r'], q: 'Which command copies files recursively?', opts: ['cp -r', 'mv', 'rsync -r', 'scp -r'], ans: 'cp -r' },
  { keywords: ['file operations', 'find'], q: 'Which command searches for files by name?', opts: ['find', 'grep', 'locate', 'which'], ans: 'find' },
  // Text processing
  { keywords: ['text processing', 'grep'], q: 'Which command searches for patterns in text files?', opts: ['grep', 'awk', 'sed', 'cut'], ans: 'grep' },
  { keywords: ['text processing', 'awk'], q: 'Which command is best for processing columnar data?', opts: ['awk', 'sed', 'grep', 'sort'], ans: 'awk' },
  { keywords: ['text processing', 'sed'], q: 'Which command performs stream editing (find & replace)?', opts: ['sed', 'awk', 'grep', 'tr'], ans: 'sed' },
  // Permissions
  { keywords: ['permissions', 'chmod'], q: 'What permission set does chmod 644 represent?', opts: ['rw-r--r--', 'rwxr-xr-x', 'rw-------', 'rwx------'], ans: 'rw-r--r--' },
  { keywords: ['permissions', 'umask'], q: 'A umask of 022 results in what default file permissions?', opts: ['644', '755', '600', '666'], ans: '644' },
  // Process management
  { keywords: ['process management', 'SIGTERM'], q: 'Which signal (kill command) performs a graceful process termination?', opts: ['SIGTERM (kill -15)', 'SIGKILL (kill -9)', 'SIGHUP (kill -1)', 'SIGINT (kill -2)'], ans: 'SIGTERM (kill -15)' },
  { keywords: ['process management', 'top'], q: 'Which command shows real-time system processes?', opts: ['top', 'ps', 'htop', 'both top and htop'], ans: 'both top and htop' },
  // Bash scripting
  { keywords: ['bash scripting', 'set -e'], q: 'What does "set -e" in a bash script do?', opts: ['Exit on error', 'Enable debug mode', 'Expand variables', 'Exit on undefined variables'], ans: 'Exit on error' },
  { keywords: ['bash scripting', 'trap'], q: 'Which bash command executes cleanup on script exit?', opts: ['trap', 'exit', 'cleanup', 'finally'], ans: 'trap' },
  { keywords: ['bash scripting', '$?'], q: 'Which variable holds the exit code of the last command?', opts: ['$?', '$!', '$@', '$$'], ans: '$?' },

  // ===== NETWORKING (15 questions) =====
  // OSI model
  { keywords: ['osi model layers', 'osi model'], q: 'At which OSI layer does TCP operate?', opts: ['Layer 4 — Transport', 'Layer 3 — Network', 'Layer 5 — Session', 'Layer 7 — Application'], ans: 'Layer 4 — Transport' },
  { keywords: ['osi model layers', 'osi model'], q: 'At which OSI layer does IP operate?', opts: ['Layer 3 — Network', 'Layer 2 — Data Link', 'Layer 4 — Transport', 'Layer 1 — Physical'], ans: 'Layer 3 — Network' },
  { keywords: ['osi model layers', 'osi model'], q: 'Which OSI layer handles encryption (TLS/SSL)?', opts: ['Layer 6 — Presentation', 'Layer 5 — Session', 'Layer 4 — Transport', 'Layer 7 — Application'], ans: 'Layer 6 — Presentation' },
  // TCP vs UDP
  { keywords: ['tcp vs udp', 'tcp'], q: 'What is the TCP 3-way handshake?', opts: ['SYN, SYN-ACK, ACK', 'SYN, ACK, SYN-ACK', 'ACK, SYN, ACK-SYN', 'SYN, SYN, ACK'], ans: 'SYN, SYN-ACK, ACK' },
  { keywords: ['tcp vs udp', 'udp'], q: 'Which protocol is connectionless and faster?', opts: ['UDP', 'TCP', 'IP', 'ICMP'], ans: 'UDP' },
  { keywords: ['tcp vs udp', 'udp'], q: 'Which application typically uses UDP?', opts: ['DNS query', 'HTTP request', 'SSH session', 'Email delivery'], ans: 'DNS query' },
  // DNS
  { keywords: ['dns', 'dns resolution'], q: 'Which DNS record maps a domain to an IPv6 address?', opts: ['AAAA', 'A', 'CNAME', 'PTR'], ans: 'AAAA' },
  { keywords: ['dns', 'dns resolution'], q: 'Which DNS record type creates an alias?', opts: ['CNAME', 'A', 'MX', 'NS'], ans: 'CNAME' },
  { keywords: ['dns', 'dns resolution'], q: 'What is the first step in DNS resolution?', opts: ['Browser/OS cache check', 'Query root server', 'Query TLD server', 'Query authoritative server'], ans: 'Browser/OS cache check' },
  // HTTP/HTTPS
  { keywords: ['http', 'https', 'status codes'], q: 'What does HTTP 429 mean?', opts: ['Too Many Requests', 'Unauthorized', 'Forbidden', 'Bad Request'], ans: 'Too Many Requests' },
  { keywords: ['http', 'https', 'status codes'], q: 'What does HTTP 502 mean?', opts: ['Bad Gateway', 'Service Unavailable', 'Gateway Timeout', 'Internal Server Error'], ans: 'Bad Gateway' },
  { keywords: ['http', 'https', 'status codes'], q: 'What does HTTP 201 indicate?', opts: ['Resource created', 'OK success', 'Accepted', 'No content'], ans: 'Resource created' },
  { keywords: ['http', 'https', 'tls'], q: 'Which step happens FIRST in a TLS 1.3 handshake?', opts: ['Client Hello', 'Server Hello', 'Certificate verification', 'Key exchange'], ans: 'Client Hello' },
  // Ports
  { keywords: ['ports', 'port'], q: 'Which port does Redis use by default?', opts: ['6379', '5432', '3306', '27017'], ans: '6379' },
  { keywords: ['ports', 'port'], q: 'Which port is used by the Kubernetes API server?', opts: ['6443', '443', '8080', '10250'], ans: '6443' },

  // ===== PYTHON (12 questions) =====
  { keywords: ['data structures', 'list', 'tuple'], q: 'What is the key difference between a list and a tuple?', opts: ['Mutable vs immutable', 'Ordered vs unordered', 'Hashable vs not', 'Dynamic vs static'], ans: 'Mutable vs immutable' },
  { keywords: ['data structures', 'dict', 'dictionary'], q: 'What is the time complexity of a dict lookup?', opts: ['O(1) average', 'O(n)', 'O(log n)', 'O(n^2)'], ans: 'O(1) average' },
  { keywords: ['data structures', 'set'], q: 'Which data structure is best for fast membership testing?', opts: ['Set', 'List', 'Tuple', 'Dictionary'], ans: 'Set' },
  { keywords: ['oop', 'inheritance', 'class'], q: 'Which method is called when an object is created?', opts: ['__init__', '__new__', '__call__', '__create__'], ans: '__init__' },
  { keywords: ['oop', 'static method'], q: 'Which decorator creates a method that doesn\'t access instance or class?', opts: ['@staticmethod', '@classmethod', '@property', '@abstractmethod'], ans: '@staticmethod' },
  { keywords: ['oop', 'property'], q: 'Which decorator creates a getter method?', opts: ['@property', '@getter', '@attribute', '@accessor'], ans: '@property' },
  { keywords: ['file handling', 'logging'], q: 'Which logging level represents the most severe events?', opts: ['CRITICAL', 'ERROR', 'WARNING', 'INFO'], ans: 'CRITICAL' },
  { keywords: ['file handling', 'logging'], q: 'Which logging level should be used for debugging information?', opts: ['DEBUG', 'INFO', 'WARNING', 'ERROR'], ans: 'DEBUG' },
  { keywords: ['api', 'fastapi'], q: 'Which library is commonly used with FastAPI for data validation?', opts: ['Pydantic', 'Marshmallow', 'Django Rest', 'Flask-RESTful'], ans: 'Pydantic' },
  { keywords: ['api', 'fastapi'], q: 'Which Python async server is FastAPI built on?', opts: ['Uvicorn', 'Gunicorn', 'Waitress', 'CherryPy'], ans: 'Uvicorn' },
  { keywords: ['automation', 'subprocess'], q: 'Which module runs system commands in Python?', opts: ['subprocess', 'os.system', 'sys', 'shutil'], ans: 'subprocess' },
  { keywords: ['automation', 'pathlib'], q: 'Which modern Python module handles file paths?', opts: ['pathlib', 'os.path', 'shutil', 'glob'], ans: 'pathlib' },

  // ===== GIT (8 questions) =====
  { keywords: ['basic git commands', 'git add'], q: 'Which command stages specific chunks of changes interactively?', opts: ['git add -p', 'git add .', 'git commit -a', 'git stash'], ans: 'git add -p' },
  { keywords: ['basic git commands', 'git log'], q: 'Which command shows a compact graph of commits?', opts: ['git log --oneline --graph --all', 'git log', 'git status', 'git blame'], ans: 'git log --oneline --graph --all' },
  { keywords: ['branching', 'git merge'], q: 'What does "git merge --no-ff" do?', opts: ['Forces a merge commit even for fast-forward', 'Squashes all changes', 'Cancels the merge', 'Rebases automatically'], ans: 'Forces a merge commit even for fast-forward' },
  { keywords: ['branching', 'git rebase'], q: 'What is the main benefit of rebasing?', opts: ['Cleaner linear history', 'Preserves branch history', 'Simpler conflict resolution', 'Works with all remotes'], ans: 'Cleaner linear history' },
  { keywords: ['branching', 'git rebase'], q: 'Which command squashes the last 3 commits?', opts: ['git rebase -i HEAD~3', 'git reset HEAD~3', 'git merge --squash', 'git commit --amend'], ans: 'git rebase -i HEAD~3' },
  { keywords: ['branching', 'conflict'], q: 'What markers indicate a merge conflict?', opts: ['<<<<<<<, =======, >>>>>>>', '=====, +++++, -----', '***, ===, ###', '<!--, -->'], ans: '<<<<<<<, =======, >>>>>>>' },
  { keywords: ['github actions', 'ci/cd'], q: 'Which keyword defines workflow dependencies in GitHub Actions?', opts: ['needs', 'depends', 'after', 'requires'], ans: 'needs' },
  { keywords: ['github actions', 'ci/cd'], q: 'Which key defines the trigger for a GitHub Actions workflow?', opts: ['on', 'trigger', 'when', 'if'], ans: 'on' },

  // ===== DOCKER (10 questions) =====
  { keywords: ['dockerfile', 'multi-stage'], q: 'What is the main benefit of multi-stage Docker builds?', opts: ['Smaller final image', 'Faster builds', 'Better security', 'All of the above'], ans: 'All of the above' },
  { keywords: ['dockerfile', 'healthcheck'], q: 'Which Dockerfile instruction checks container health?', opts: ['HEALTHCHECK', 'HEALTH', 'STATUS', 'CHECK'], ans: 'HEALTHCHECK' },
  { keywords: ['dockerfile', 'layer caching'], q: 'Which instruction order is fastest for Docker layer caching?', opts: ['FROM → WORKDIR → COPY package.json → RUN install → COPY .', 'FROM → COPY . → RUN install', 'FROM → RUN install → COPY .', 'FROM → COPY package.json → COPY . → RUN install'], ans: 'FROM → WORKDIR → COPY package.json → RUN install → COPY .' },
  { keywords: ['dockerfile', 'user'], q: 'Why should you use a non-root user in Docker?', opts: ['Security — reduces attack surface', 'Better performance', 'Required by Kubernetes', 'Faster builds'], ans: 'Security — reduces attack surface' },
  { keywords: ['docker compose', 'docker-compose'], q: 'Which Compose instruction ensures service startup order?', opts: ['depends_on with healthcheck', 'links', 'priority', 'start_order'], ans: 'depends_on with healthcheck' },
  { keywords: ['docker compose'], q: 'Which command stops Compose and removes volumes?', opts: ['docker compose down -v', 'docker compose stop', 'docker compose rm -v', 'docker compose down --rm'], ans: 'docker compose down -v' },
  { keywords: ['volumes', 'bind mounts'], q: 'What is the difference between a named volume and a bind mount?', opts: ['Volumes are managed by Docker, bind mounts map host paths', 'Bind mounts are faster', 'Volumes persist after container removal', 'No difference'], ans: 'Volumes are managed by Docker, bind mounts map host paths' },
  { keywords: ['volumes', 'docker compose'], q: 'Which keyword in Compose mounts files from the host?', opts: ['bind', 'volume', 'tmpfs', 'config'], ans: 'bind' },
  { keywords: ['docker compose', 'network'], q: 'Which Compose network type provides the best isolation?', opts: ['bridge', 'host', 'overlay', 'none'], ans: 'bridge' },
  { keywords: ['docker compose', 'env'], q: 'Which is the most secure way to pass secrets to containers?', opts: ['Secrets file', '.env file', 'Environment variables', 'Command line args'], ans: 'Secrets file' },

  // ===== KUBERNETES (12 questions) =====
  { keywords: ['pods & deployments', 'liveness'], q: 'Which probe checks if a container is still running?', opts: ['Liveness probe', 'Readiness probe', 'Startup probe', 'Health probe'], ans: 'Liveness probe' },
  { keywords: ['pods & deployments', 'rolling update'], q: 'In a rolling update, what does maxUnavailable=0 mean?', opts: ['No downtime allowed', 'Maximum pods unavailable', 'Zero pods allowed', 'Immediate update'], ans: 'No downtime allowed' },
  { keywords: ['pods & deployments', 'qos'], q: 'Which QoS class gets a pod when limits equal requests?', opts: ['Guaranteed', 'Burstable', 'BestEffort', 'Premium'], ans: 'Guaranteed' },
  { keywords: ['pods & deployments', 'hpa'], q: 'What does HPA stand for?', opts: ['Horizontal Pod Autoscaler', 'High Performance App', 'Hosted Pod Access', 'Hybrid Pod Architecture'], ans: 'Horizontal Pod Autoscaler' },
  { keywords: ['services & ingress', 'clusterip'], q: 'Which Service type is only reachable inside the cluster?', opts: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'], ans: 'ClusterIP' },
  { keywords: ['services & ingress', 'loadbalancer'], q: 'Which Service type creates an external load balancer?', opts: ['LoadBalancer', 'NodePort', 'ClusterIP', 'ExternalName'], ans: 'LoadBalancer' },
  { keywords: ['services & ingress', 'ingress'], q: 'Which Ingress annotation is needed for ALB on AWS EKS?', opts: ['kubernetes.io/ingress.class: alb', 'alb.ingress.class', 'aws-load-balancer', 'ingress-type: alb'], ans: 'kubernetes.io/ingress.class: alb' },
  { keywords: ['configmaps', 'secrets'], q: 'How should database passwords be stored in Kubernetes?', opts: ['Secrets', 'ConfigMaps', 'Environment variables', 'Directly in YAML'], ans: 'Secrets' },
  { keywords: ['configmaps', 'secrets'], q: 'What encoding does Kubernetes use for Secrets?', opts: ['Base64', 'Base32', 'Hex', 'Plain text'], ans: 'Base64' },
  { keywords: ['configmaps'], q: 'Can a ConfigMap be updated without restarting the pod?', opts: ['Only if mounted as a volume', 'Yes, always', 'No, never', 'Only if marked immutable'], ans: 'Only if mounted as a volume' },
  { keywords: ['eks', 'irsa'], q: 'What is IRSA in AWS EKS?', opts: ['IAM Roles for Service Accounts', 'Internal Routing Security Agent', 'Instance Role Service Account', 'Integrated Resource Scaling App'], ans: 'IAM Roles for Service Accounts' },
  { keywords: ['eks', 'karpenter'], q: 'Which tool provides faster node auto-scaling than Cluster Autoscaler?', opts: ['Karpenter', 'Kuberhealthy', 'Kubeflow', 'KubeEdge'], ans: 'Karpenter' },

  // ===== AWS (10 questions) =====
  { keywords: ['iam', 'policy'], q: 'Which IAM policy element specifies allowed actions?', opts: ['Action', 'Effect', 'Resource', 'Condition'], ans: 'Action' },
  { keywords: ['iam', 'role'], q: 'Which IAM entity is best for granting temporary permissions?', opts: ['Role', 'User', 'Group', 'Policy'], ans: 'Role' },
  { keywords: ['iam', 'mfa'], q: 'What security best practice is MOST important for root user?', opts: ['Enable MFA', 'Use strong password', 'Rotate keys', 'Limit IP access'], ans: 'Enable MFA' },
  { keywords: ['ec2', 'security groups'], q: 'Are security groups stateful or stateless?', opts: ['Stateful', 'Stateless', 'Both', 'Neither'], ans: 'Stateful' },
  { keywords: ['ec2', 'user data'], q: 'What is EC2 user data used for?', opts: ['Run scripts at instance launch', 'Store user information', 'Configure users', 'Set passwords'], ans: 'Run scripts at instance launch' },
  { keywords: ['s3', 'lifecycle'], q: 'Which S3 feature automatically moves objects to cheaper storage?', opts: ['Lifecycle policies', 'Intelligent tiering', 'Storage class analysis', 'Object expiration'], ans: 'Lifecycle policies' },
  { keywords: ['s3', 'versioning'], q: 'Which S3 feature protects against accidental deletion?', opts: ['Versioning', 'MFA delete', 'Lifecycle policies', 'Replication'], ans: 'Versioning' },
  { keywords: ['vpc', 'subnets'], q: 'What component allows private subnets to access the internet?', opts: ['NAT Gateway', 'Internet Gateway', 'Route Table', 'VPC Peering'], ans: 'NAT Gateway' },
  { keywords: ['vpc', 'subnets'], q: 'How many subnets should you create for high availability?', opts: ['At least 2 in different AZs', '1 in each AZ', 'As many as possible', 'Only 1'], ans: 'At least 2 in different AZs' },
  { keywords: ['vpc', 'peering'], q: 'What is VPC peering used for?', opts: ['Connect VPCs in same or different accounts', 'Connect to on-premises', 'Connect to internet', 'Connect to AWS services'], ans: 'Connect VPCs in same or different accounts' },

  // ===== MLOps & AI (12 questions) =====
  { keywords: ['embeddings', 'vector search', 'sentence transformers'], q: 'What is the typical dimension of a MiniLM embedding?', opts: ['384', '768', '1024', '1536'], ans: '384' },
  { keywords: ['embeddings', 'cosine similarity'], q: 'What values does cosine similarity range between?', opts: ['-1 to 1', '0 to 1', '0 to 100', '-100 to 100'], ans: '-1 to 1' },
  { keywords: ['vector databases', 'hnsw'], q: 'Which indexing method is most commonly used in vector DBs?', opts: ['HNSW', 'LSH', 'IVF', 'KD-tree'], ans: 'HNSW' },
  { keywords: ['vector databases', 'qdrant'], q: 'Which vector DB is optimized for high-performance ANN search?', opts: ['Qdrant', 'Pinecone', 'FAISS', 'Milvus'], ans: 'Qdrant' },
  { keywords: ['rag pipeline', 'rag'], q: 'What are the three steps of RAG?', opts: ['Retrieve, Augment, Generate', 'Read, Analyze, Generate', 'Search, Extract, Output', 'Index, Query, Respond'], ans: 'Retrieve, Augment, Generate' },
  { keywords: ['rag pipeline', 'chunking'], q: 'Why is chunking important in RAG?', opts: ['Limits context for LLM relevance', 'Increases search speed', 'Reduces storage', 'Improves embedding quality'], ans: 'Limits context for LLM relevance' },
  { keywords: ['rag pipeline', 'hallucination'], q: 'How can RAG reduce LLM hallucinations?', opts: ['Ground responses in retrieved context', 'Use a smaller model', 'Increase temperature', 'Add more layers'], ans: 'Ground responses in retrieved context' },
  { keywords: ['model tracking', 'mlflow'], q: 'Which MLflow component stores model versions and stages?', opts: ['Model Registry', 'Tracking Server', 'Artifact Store', 'Experiment UI'], ans: 'Model Registry' },
  { keywords: ['model tracking', 'mlflow'], q: 'What does MLflow Tracking record?', opts: ['Parameters, metrics, artifacts', 'Only model files', 'Only training code', 'Only deployment config'], ans: 'Parameters, metrics, artifacts' },
  { keywords: ['model tracking', 'mlflow'], q: 'Which stage in MLflow Registry is for testing?', opts: ['Staging', 'Production', 'Archived', 'Development'], ans: 'Staging' },
  { keywords: ['vllm', 'llm serving'], q: 'What technique does vLLM use for efficient LLM serving?', opts: ['PagedAttention', 'Continuous batching', 'Quantization', 'All of the above'], ans: 'All of the above' },
  { keywords: ['transformers', 'attention'], q: 'What mechanism allows transformers to process long-range dependencies?', opts: ['Self-attention', 'Convolution', 'Recurrence', 'Pooling'], ans: 'Self-attention' },

  // ===== SECURITY (10 questions) =====
  { keywords: ['jwt', 'authentication'], q: 'What is signed in a JWT?', opts: ['Header + Payload', 'Only the payload', 'Only the header', 'The entire token'], ans: 'Header + Payload' },
  { keywords: ['jwt', 'refresh token'], q: 'Why are refresh tokens used?', opts: ['To get new access tokens without re-login', 'To revoke user sessions', 'To verify email', 'To encrypt data'], ans: 'To get new access tokens without re-login' },
  { keywords: ['jwt', 'expiration'], q: 'What happens when a JWT expires?', opts: ['Server rejects it', 'Client auto-refreshes', 'Token becomes invalid', 'All of the above'], ans: 'All of the above' },
  { keywords: ['rate limiting', 'token bucket'], q: 'Which rate limiting strategy allows short bursts of traffic?', opts: ['Token bucket', 'Fixed window', 'Sliding window', 'Leaky bucket'], ans: 'Token bucket' },
  { keywords: ['rate limiting', 'redis'], q: 'Why is Redis good for rate limiting?', opts: ['Fast in-memory operations', 'Built-in rate limiting', 'Distributed by default', 'Automatic expiry'], ans: 'Fast in-memory operations' },
  { keywords: ['prompt injection', 'guardrails'], q: 'What is prompt injection?', opts: ['Malicious input to override LLM instructions', 'A SQL injection variant', 'A type of DDoS attack', 'A phishing technique'], ans: 'Malicious input to override LLM instructions' },
  { keywords: ['prompt injection', 'sanitization'], q: 'Which defense helps prevent prompt injection?', opts: ['Input sanitization + output validation', 'Encrypting prompts', 'Blocking all user input', 'Using larger models'], ans: 'Input sanitization + output validation' },
  { keywords: ['rate limiting', '429'], q: 'What HTTP status code indicates rate limiting?', opts: ['429', '401', '403', '503'], ans: '429' },
  { keywords: ['security', 'pii'], q: 'What does PII refer to?', opts: ['Personally Identifiable Information', 'Public IP Identifier', 'Private Internet Interface', 'Protocol Interaction Index'], ans: 'Personally Identifiable Information' },
  { keywords: ['security', 'zero trust'], q: 'What is the core principle of zero trust security?', opts: ['Never trust, always verify', 'Trust but verify', 'Trust everyone inside network', 'Monitor everything'], ans: 'Never trust, always verify' },
];

// Generate quiz questions from curriculum data
export function generateQuizFromCurriculum(topic, count = 5) {
  const questions = [];
  const subtopics = topic.subtopics || [];

  for (const sub of subtopics) {
    if (questions.length >= count) break;
    const q = generateQuestionForSubtopic(sub);
    if (q) questions.push(q);
  }

  // Fill remaining with random questions from the bank
  while (questions.length < count) {
    const randQ = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
    if (!questions.find((q) => q.question === randQ.q)) {
      questions.push({
        question: randQ.q,
        options: randQ.opts,
        correctAnswer: randQ.ans,
        subtopicId: 0,
        title: 'General Knowledge',
      });
    }
  }

  return questions;
}

// Generate random quiz across all topics
export function generateRandomQuiz(count = 10) {
  const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q) => ({
    question: q.q,
    options: q.opts,
    correctAnswer: q.ans,
    subtopicId: 0,
    title: 'Mixed Topics',
  }));
}

function generateQuestionForSubtopic(sub) {
  const title = sub.title.toLowerCase();
  const desc = (sub.description || '').toLowerCase();

  for (const q of QUESTION_BANK) {
    for (const kw of q.keywords) {
      if (title.includes(kw) || desc.includes(kw)) {
        return {
          question: q.q,
          options: q.opts,
          correctAnswer: q.ans,
          subtopicId: sub.id,
          title: sub.title,
        };
      }
    }
  }

  // Generic fallback
  return {
    question: `What is the main concept of "${sub.title}"?`,
    options: [
      `A core ${sub.title} concept`,
      'An unrelated concept',
      'A different technology',
      'None of the above',
    ],
    correctAnswer: `A core ${sub.title} concept`,
    subtopicId: sub.id,
    title: sub.title,
  };
}

import { useState, useMemo } from 'react';

function QuickRefCard({ title, items, renderItem }) {
  return (
    <div className="bg-surface-card border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/[0.06]">
        <h3 className="text-sm font-medium text-gray-200">{title}</h3>
      </div>
      <div className="p-3 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="text-xs">
            {renderItem ? renderItem(item, i) : (
              <div className="flex items-center gap-2 p-1.5 rounded hover:bg-white/[0.02]">
                <span className="font-mono font-medium text-accent px-1.5 py-0.5 rounded bg-accent/10">{item.code || item.port || item.label}</span>
                <span className="text-gray-400">{item.desc || item.service || item.label}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LinesRenderer({ lines }) {
  return (
    <div className="space-y-0.5 font-mono text-xs">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        if (line.trim().startsWith('#')) {
          const isHeader = line.startsWith('# ---') || line.startsWith('# =====');
          return (
            <div key={i} className={`${isHeader && i > 0 ? 'pt-2 ' : ''}${isHeader ? 'text-gray-400 font-semibold pb-1' : 'text-gray-600'}`}>
              {line}
            </div>
          );
        }
        const match = line.match(/^(.+?)\s+#\s+(.+)/);
        if (match) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-accent shrink-0">{match[1]}</span>
              <span className="text-gray-500"># {match[2]}</span>
            </div>
          );
        }
        return <span key={i} className="text-gray-300 block">{line}</span>;
      })}
    </div>
  );
}

const cheatsheets = [
  { id: 'linux', icon: '🐧', title: 'Linux Commands', lines: [
    '# --- FILE & DIRECTORY ---',
    'ls -lah              # List all files with details',
    'cd /path             # Change directory',
    'pwd                  # Print working directory',
    'mkdir -p dir         # Create directory (parent too)',
    'rm -rf dir           # Remove directory forcefully',
    'cp -r src dest       # Copy recursively',
    'mv src dest          # Move or rename',
    'touch file           # Create empty file',
    'cat file             # View file content',
    'less file            # Scrollable file view',
    'head -n 5 file       # First 5 lines',
    'tail -f file         # Follow file (logs)',
    'history              # Command history',
    'clear                # Clear terminal',
    'man command          # Manual page',
    'which python3        # Locate command binary',
    '',
    '# --- FILE PERMISSIONS ---',
    'chmod 755 file.sh    # rwxr-xr-x',
    'chmod -R 755 dir     # Recursive',
    'chown user:group f   # Change owner',
    'umask 022            # Default permissions',
    '',
    '# --- PROCESSES ---',
    'ps aux               # All processes',
    'ps -ef | grep nginx  # Find specific process',
    'top                  # Live processes',
    'htop                 # Interactive top',
    'kill -9 PID          # Force kill',
    'pkill -f name        # Kill by name pattern',
    'pgrep process        # Find PID of process',
    'jobs; bg %1; fg %1   # Background/foreground',
    'nice -n 10 cmd       # Run with low priority',
    '',
    '# --- STORAGE ---',
    'df -h                # Disk free (human)',
    'du -sh dir           # Directory size',
    'lsblk                # Block devices',
    'fdisk -l             # Disk partitions',
    'mount /dev/sdb1 /mnt # Mount device',
    'free -h              # Memory usage',
    'swapon --show        # Swap usage',
    '',
    '# --- ARCHIVES ---',
    'tar -czf a.tar.gz dir    # Create tar.gz',
    'tar -xzf a.tar.gz        # Extract tar.gz',
    'zip -r f.zip dir         # Create zip',
    'unzip f.zip              # Extract zip',
    'gzip file; gunzip f.gz   # Compress/decompress',
    '',
    '# --- SSH ---',
    'ssh user@server          # Connect',
    'ssh -p 2222 user@host    # Custom port',
    'scp file user@host:/p    # Copy TO server',
    'scp user@host:/p/file .  # Copy FROM server',
    'ssh-keygen -t rsa -b 4096  # Generate key',
    'ssh-copy-id user@host    # Copy public key',
    "",
    '# --- CRON ---',
    'crontab -e               # Edit crontab',
    'crontab -l               # List crontab',
    "# 0 0 * * * /script.sh   # Daily midnight",
    "# */5 * * * * /script.sh  # Every 5 min",
    "# 0 9 * * 1 /script.sh    # Mon 9 AM",
    '',
    '# --- PACKAGE MANAGER ---',
    'apt update && apt upgrade -y    # Debian/Ubuntu',
    'apt install nginx               # Install package',
    'yum install nginx               # RHEL/CentOS',
    'dnf install nginx               # Fedora/RHEL 8+',
  ]},
  { id: 'networking', icon: '🌐', title: 'Networking Commands', lines: [
    '# --- CONNECTIVITY ---',
    'ip a                    # Show IP addresses',
    'ip route                # Show routing table',
    'ping -c 4 google.com   # Test connectivity',
    'traceroute google.com   # Trace path',
    'mtr google.com          # Continuous trace + ping',
    'hostname                # Show hostname',
    '',
    '# --- DNS ---',
    'nslookup example.com    # DNS lookup',
    'dig example.com +trace  # Full DNS trace',
    'whois example.com       # Domain info',
    'cat /etc/hosts          # Static host mapping',
    '',
    '# --- PORTS & LISTENING ---',
    'ss -tulpn               # Listening ports (modern)',
    'netstat -tulpn          # Listening ports (legacy)',
    'lsof -i :8080           # Process on port 8080',
    'nc -zv host 443         # Test if port open',
    'telnet host 443         # Test port (older)',
    'nmap -p 1-1000 host     # Scan ports',
    '',
    '# --- HTTP ---',
    'curl -I https://api.example.com  # Headers only',
    'curl -X POST -H "Content-Type: application/json" -d \'{"k":"v"}\' URL  # POST JSON',
    'curl -v https://example.com       # Verbose (all headers)',
    'wget https://example.com/file     # Download file',
    '',
    '# --- NETWORK CONFIG ---',
    'ifconfig                # Interface config (older)',
    'ipconfig                # Windows network config',
    'arp -a                  # ARP table',
  ]},
  { id: 'docker', icon: '🐳', title: 'Docker Commands', lines: [
    '# --- CONTAINER MANAGEMENT ---',
    'docker --version                 # Check version',
    'docker info                      # Docker daemon info',
    'docker ps                        # Running containers',
    'docker ps -a                     # All containers',
    'docker start <id>                # Start container',
    'docker stop <id>                 # Stop container',
    'docker restart <id>              # Restart container',
    'docker rm <id>                   # Remove container',
    'docker rm -f <id>                # Force remove',
    'docker logs <id>                 # View logs',
    'docker logs -f <id>              # Follow logs live',
    '',
    '# --- IMAGE MANAGEMENT ---',
    'docker images                    # List images',
    'docker pull <image>              # Pull image',
    'docker rmi <id>                  # Remove image',
    'docker build -t name:tag .       # Build image',
    'docker tag <id> repo/name:tag    # Tag image',
    'docker push repo/name:tag        # Push to registry',
    "docker history <image>           # Image layers",
    '',
    '# --- RUNNING CONTAINERS ---',
    'docker run <image>               # Run (foreground)',
    'docker run -d <image>            # Run (detached)',
    'docker run -it <image> bash      # Interactive shell',
    'docker run -d -p 8080:80 <image> # Port mapping',
    'docker run -v /host:/cont <image> # Volume mount',
    'docker run --rm <image>          # Auto-remove on exit',
    '',
    '# --- EXEC & DEBUG ---',
    'docker exec -it <id> bash        # Shell into container',
    'docker exec -it <id> sh          # Shell (alpine)',
    'docker inspect <id>              # Full container info',
    'docker stats                     # Live resource usage',
    'docker cp file <id>:/path        # Copy to container',
    'docker cp <id>:/path/file .      # Copy from container',
    '',
    '# --- NETWORKS & VOLUMES ---',
    'docker network ls                # List networks',
    'docker network inspect <name>    # Inspect network',
    'docker network create mynet      # Create network',
    'docker volume ls                 # List volumes',
    'docker volume inspect <name>     # Inspect volume',
    '',
    '# --- CLEANUP ---',
    'docker container prune           # Remove stopped containers',
    'docker image prune               # Remove unused images',
    'docker system prune -a           # Remove all unused',
    '',
    '# --- DOCKER COMPOSE ---',
    'docker compose up -d             # Start services',
    'docker compose ps                # List services',
    'docker compose logs -f           # Follow all logs',
    'docker compose restart           # Restart services',
    'docker compose stop              # Stop services',
    'docker compose down              # Stop & remove',
    'docker compose up -d --force-recreate  # Recreate',
  ]},
  { id: 'k8s', icon: '☸️', title: 'Kubernetes', lines: [
    '# --- CLUSTER INFO ---',
    'kubectl cluster-info           # Cluster info',
    'kubectl get nodes              # List nodes',
    'kubectl top nodes              # Node resource usage',
    'kubectl describe node <name>   # Node details',
    '',
    '# --- PODS ---',
    'kubectl get pods               # List pods',
    'kubectl get pods -n ns         # Pods in namespace',
    'kubectl get pods -w            # Watch pods',
    'kubectl describe pod <name>    # Pod details',
    'kubectl logs <pod>             # View logs',
    'kubectl logs -f <pod>          # Follow logs',
    'kubectl exec -it <pod> -- bash # Shell into pod',
    'kubectl delete pod <name>      # Delete pod',
    '',
    '# --- DEPLOYMENTS ---',
    'kubectl get deployments        # List deployments',
    'kubectl describe deployment <name>  # Details',
    'kubectl apply -f deploy.yaml   # Create/update',
    'kubectl delete -f deploy.yaml  # Delete from file',
    'kubectl scale deploy <name> --replicas=5  # Scale',
    'kubectl rollout status deploy <name>  # Rollout status',
    'kubectl rollout undo deploy <name>     # Rollback',
    '',
    '# --- SERVICES ---',
    'kubectl get svc                # List services',
    'kubectl expose deploy <n> --port=80 --type=ClusterIP  # Expose',
    'kubectl describe svc <name>    # Service details',
    'kubectl port-forward svc/<n> 8080:80  # Port forward',
    '',
    '# --- CONFIG ---',
    'kubectl get configmap          # List ConfigMaps',
    'kubectl get secret             # List Secrets',
    'kubectl create configmap <n> --from-literal=key=val',
    'kubectl create secret generic <n> --from-literal=pass=xyz',
    '',
    '# --- NAMESPACES ---',
    'kubectl get namespaces         # List namespaces',
    'kubectl create ns <name>       # Create namespace',
    'kubectl config set-context --current --namespace=ns  # Switch ns',
    '',
    '# --- RESOURCES ---',
    'kubectl get all                # All resources',
    'kubectl get events             # Cluster events',
    'kubectl api-resources          # All resource types',
    'kubectl explain <resource>     # Documentation',
    '',
    '# --- INGRESS ---',
    'kubectl get ingress            # List ingresses',
    'kubectl describe ingress <n>   # Ingress details',
    '',
    '# --- STORAGE ---',
    'kubectl get pv                 # PersistentVolumes',
    'kubectl get pvc                # PVCs',
    'kubectl get storageclass       # StorageClasses',
  ]},
  { id: 'python', icon: '🐍', title: 'Python', lines: [
    '# --- BASICS ---',
    'print("Hello World")         # Print',
    'type(var)                    # Check type',
    'len(list)                    # Length',
    'help(str)                    # Documentation',
    'dir(object)                  # List methods',
    '',
    '# --- DATA STRUCTURES ---',
    'lst = [1, 2, 3]              # List',
    'lst.append(4)                # Add item',
    'lst.pop()                    # Remove last',
    'lst.sort()                   # Sort',
    '[x*x for x in range(10)]     # List comprehension',
    'd = {"key": "value"}         # Dict',
    'd.get("key")                 # Safe get',
    'd.keys(); d.values()         # Keys and values',
    's = {1, 2, 3}                # Set (unique)',
    't = (1, 2, 3)                # Tuple (immutable)',
    '',
    '# --- FUNCTIONS ---',
    'def add(a, b): return a + b  # Define function',
    'lambda x: x * x              # Lambda (inline)',
    'result = add(5, 3)           # Call function',
    '',
    '# --- CONTROL FLOW ---',
    'if x > 10:                   # If condition',
    'for i in range(5): print(i)  # For loop',
    'while x > 0: x -= 1          # While loop',
    'try: except: finally:        # Error handling',
    '',
    '# --- FILE I/O ---',
    'with open("f.txt", "w") as f: f.write("text")',
    'with open("f.txt", "r") as f: content = f.read()',
    '',
    '# --- JSON ---',
    'import json',
    'json_str = json.dumps({"a": 1})   # dict -> JSON',
    'parsed = json.loads(json_str)     # JSON -> dict',
    '',
    '# --- REQUESTS ---',
    'import requests',
    'r = requests.get("https://api.github.com")',
    'r.status_code, r.json()',
    'r = requests.post("https://httpbin.org/post", json={"k": "v"})',
    '',
    '# --- ENV VARS ---',
    'import os',
    'db_url = os.getenv("DB_URL", "default")',
    '',
    '# --- LOGGING ---',
    'import logging',
    'logging.basicConfig(level=logging.INFO)',
    'logging.info("Started"); logging.error("Failed")',
    '',
    '# --- SUBPROCESS (DEVOPS) ---',
    'import subprocess',
    'subprocess.run(["ls", "-lah"])',
    'output = subprocess.check_output(["whoami"])',
    '',
    '# --- PATH ---',
    'from pathlib import Path',
    'p = Path("/tmp/log.txt"); p.write_text("hello")',
    'p.read_text()',
    '',
    '# --- ASYNC ---',
    'import asyncio',
    'async def task(): await asyncio.sleep(1); return "done"',
    '',
    '# --- FASTAPI PATTERN ---',
    'from fastapi import FastAPI',
    'app = FastAPI()',
    '@app.get("/health")',
    'def health(): return {"status": "ok"}',
  ]},
  { id: 'git', icon: '🔀', title: 'Git & CI/CD', lines: [
    '# --- GIT BASICS ---',
    'git init                          # Init repo',
    'git clone <url>                   # Clone repo',
    'git add .                         # Stage all',
    'git commit -m "msg"               # Commit',
    'git push origin main              # Push',
    'git pull origin main              # Pull',
    'git status                        # Status',
    'git log --oneline --graph --all   # History',
    'git diff                          # Unstaged changes',
    '',
    '# --- BRANCHING ---',
    'git branch                        # List branches',
    'git checkout -b feature           # Create & switch',
    'git merge feature                 # Merge branch',
    'git rebase main                   # Rebase onto main',
    'git branch -d feature             # Delete branch',
    '',
    '# --- REMOTE ---',
    'git remote add origin <url>       # Add remote',
    'git remote -v                     # List remotes',
    'git fetch origin                  # Fetch remote',
    '',
    '# --- FIXES ---',
    'git reset --hard HEAD             # Discard all changes',
    'git reset --soft HEAD~1           # Undo last commit (keep changes)',
    'git stash                         # Save work temporarily',
    'git stash pop                     # Restore stashed work',
    'git cherry-pick <hash>            # Apply specific commit',
    'git rebase -i HEAD~3              # Interactive rebase',
    '',
    '# --- GITHUB ACTIONS ---',
    '# .github/workflows/ci.yml',
    'name: CI',
    'on: [push]',
    'jobs:',
    '  build:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v3',
    '      - uses: actions/setup-python@v4',
    '        with: { python-version: "3.10" }',
    '      - run: pip install -r requirements.txt',
    '      - run: pytest',
    '',
    '# --- JENKINS PIPELINE ---',
    'pipeline {',
    '  agent any',
    '  stages {',
    '    stage("Checkout") { steps { git url: "..." } }',
    '    stage("Build") { steps { sh "docker build -t app ." } }',
    '    stage("Deploy") { steps { sh "docker run -d -p 8000:8000 app" } }',
    '  }',
    '}',
    '',
    '# --- GITLAB CI ---',
    '# .gitlab-ci.yml',
    'stages: [build, test, deploy]',
    'build: { stage: build, script: "pip install -r req.txt" }',
    'test: { stage: test, script: "pytest" }',
    'deploy: { stage: deploy, script: "docker build -t app . && docker run -d -p 8000:8000 app" }',
  ]},
  { id: 'terraform', icon: '🏗️', title: 'Terraform', lines: [
    '# --- COMMANDS ---',
    'terraform -v                  # Version',
    'terraform init                # Init (download providers)',
    'terraform fmt                 # Format code',
    'terraform validate            # Validate syntax',
    'terraform plan                # Show execution plan',
    'terraform apply               # Apply changes',
    'terraform destroy             # Destroy all infra',
    'terraform show                # Show state',
    'terraform state list          # List resources in state',
    'terraform import <addr> <id>  # Import existing',
    'terraform workspace new dev   # New workspace',
    'terraform workspace select dev',
    '',
    '# --- PROVIDER EXAMPLE ---',
    'provider "aws" {',
    '  region = "us-east-1"',
    '}',
    '',
    'resource "aws_s3_bucket" "b" {',
    '  bucket = "my-devops-bucket"',
    '}',
    '',
    '# --- OUTPUTS ---',
    'output "bucket_name" {',
    '  value = aws_s3_bucket.b.bucket',
    '}',
    '',
    '# --- REMOTE STATE ---',
    'terraform {',
    '  backend "s3" {',
    '    bucket = "tf-state"',
    '    key    = "dev/terraform.tfstate"',
    '    region = "us-east-1"',
    '  }',
    '}',
    '',
    '# --- REAL FLOW ---',
    '# 1. Write .tf files -> 2. terraform init',
    '# 3. terraform plan -> 4. terraform apply',
  ]},
  { id: 'aws', icon: '☁️', title: 'AWS CLI & Architecture', lines: [
    '# --- AWS CLI BASICS ---',
    'aws configure                       # Setup credentials',
    'aws sts get-caller-identity         # Who am I?',
    '',
    '# --- S3 ---',
    'aws s3 ls                           # List buckets',
    'aws s3 mb s3://bucket-name          # Create bucket',
    'aws s3 cp file.txt s3://bucket/     # Upload file',
    'aws s3 cp s3://bucket/file.txt .    # Download file',
    'aws s3 sync ./data s3://bucket/data # Sync directory',
    '',
    '# --- EC2 ---',
    'aws ec2 describe-instances          # List instances',
    'aws ec2 start-instances --instance-ids i-123',
    'aws ec2 stop-instances --instance-ids i-123',
    '',
    '# --- IAM ---',
    'aws iam list-users                  # List users',
    'aws iam list-roles                  # List roles',
    'aws iam list-policies               # List policies',
    '',
    '# --- ECR / EKS ---',
    'aws ecr get-login-password          # ECR login',
    'aws ecr create-repository --repository-name my-app',
    'aws eks list-clusters               # List clusters',
    'aws eks describe-cluster --name <name>',
    '',
    '# --- LAMBDA ---',
    'aws lambda list-functions           # List functions',
    'aws lambda invoke --function-name fn out.json',
    '',
    '# --- CLOUDWATCH ---',
    'aws logs describe-log-groups        # List log groups',
    'aws logs tail /aws/lambda/fn        # Tail logs',
    '',
    '# --- ARCHITECTURE DIAGRAM ---',
    'User -> Route53 -> CloudFront -> ALB',
    '  -> ECS/EKS (FastAPI + ML)',
    '  -> RDS (SQL) / DynamoDB (NoSQL)',
    '  -> ElastiCache (Redis)',
    '  -> S3 (artifacts, models, logs)',
    '  -> SQS/SNS (async messaging)',
    '  -> CloudWatch (monitoring + alerts)',
    '',
    '# --- VPC STRUCTURE ---',
    'Internet Gateway -> Public Subnets',
    '  (ALB, Bastion, NAT Gateway)',
    'Private Subnets -> (ECS/EKS, RDS)',
    'Security Groups -> per-service firewall',
  ]},
  { id: 'observability', icon: '📊', title: 'Observability', lines: [
    '# --- LINUX MONITORING ---',
    'top                      # CPU + Memory live',
    'htop                     # Better top (interactive)',
    'free -h                  # Memory usage',
    'df -h                    # Disk usage',
    'uptime                   # System load + uptime',
    'dmesg | less             # Kernel logs',
    '',
    '# --- DOCKER MONITORING ---',
    'docker stats             # Live container resources',
    'docker inspect <id>      # Full container metadata',
    'docker events            # Real-time daemon events',
    '',
    '# --- KUBERNETES MONITORING ---',
    'kubectl top pods         # Pod CPU/Memory',
    'kubectl top nodes        # Node CPU/Memory',
    'kubectl get events       # Cluster events',
    'kubectl describe pod <n> # Detailed pod status',
    '',
    '# --- PROMETHEUS ---',
    '# PromQL examples:',
    'rate(http_requests_total[5m])        # Request rate',
    'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) by (le)  # p99 latency',
    'avg(cpu_usage{service="api"}) by (pod)  # CPU by pod',
    '',
    '# --- LOGGING ---',
    'journalctl -xe                       # System logs',
    'journalctl -u nginx -f               # Follow service logs',
    'tail -f /var/log/syslog              # Live syslog',
    'grep -r "ERROR" /var/log/            # Search logs',
    '',
    '# --- PRODUCTION STACK ---',
    'Logs    -> Loki / ELK',
    'Metrics -> Prometheus',
    'Alerts  -> Alertmanager',
    'Dashboards -> Grafana',
    'Traces  -> OpenTelemetry / Jaeger',
  ]},
  { id: 'system-design', icon: '🧠', title: 'System Design', lines: [
    '# --- BASIC FLOW ---',
    'User -> DNS (Route53)',
    '  -> CDN (CloudFront)',
    '  -> Load Balancer (ALB/Nginx)',
    '  -> API Layer (FastAPI)',
    '  -> Cache (Redis)',
    '  -> Database (PostgreSQL)',
    '  -> Async Queue (Kafka/SQS)',
    '  -> Workers (Celery/K8s Pods)',
    '',
    '# --- SCALING PATTERNS ---',
    'Horizontal:   add more servers',
    'Vertical:     increase CPU/RAM',
    'Auto Scaling: based on CPU/requests',
    '',
    '# --- DATABASES ---',
    'SQL:    PostgreSQL (structured, ACID)',
    'NoSQL:  MongoDB (flexible), DynamoDB (managed)',
    'Cache:  Redis (in-memory, fast)',
    'Search: Elasticsearch (full-text)',
    '',
    '# --- LOAD BALANCING ---',
    'Round Robin, Least Connections, IP Hash',
    'Tools: AWS ALB/NLB, Nginx, HAProxy',
    '',
    '# --- CACHING ---',
    'Browser Cache -> CDN -> App Cache (Redis)',
    'cache_key = "user:123"',
    'if cache.exists(key): return cache.get(key)',
    '',
    '# --- MICROSERVICES ---',
    'auth-service, user-service, ml-service',
    'Communication: REST, gRPC, Kafka',
    '',
    '# --- HIGH AVAILABILITY ---',
    'Multi-AZ, Failover, Health Checks',
    'Auto Restart, Circuit Breaker',
    '',
    '# --- ML API ARCHITECTURE ---',
    'Request -> FastAPI -> Redis Cache (check)',
    '  -> if miss -> ML Model (GPU)',
    '  -> store in cache -> return response',
    '',
    '# --- FAILURE HANDLING ---',
    'Retries (exponential backoff)',
    'Circuit breaker (stop calling failing service)',
    'Fallback responses (degrade gracefully)',
    'Queue buffering (handle spikes)',
  ]},
  { id: 'fastapi', icon: '⚡', title: 'FastAPI (DevOps/MLOps)', lines: [
    '# --- BASIC APP ---',
    'from fastapi import FastAPI              # Import framework',
    'app = FastAPI()                           # Create instance',
    '@app.get("/")                             # Route decorator',
    'def home(): return {"message": "OK"}      # JSON response',
    '',
    '# --- RUN SERVER ---',
    'uvicorn main:app --reload                 # Dev with hot reload',
    'uvicorn main:app --host 0.0.0.0 --port 8000  # Production bind',
    'gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4  # Multi-worker prod',
    '',
    '# --- PATH / QUERY PARAMS ---',
    '@app.get("/users/{user_id}")              # Path param',
    'def get_user(user_id: int): ...           # Auto-validated type',
    '@app.get("/search")                       # Query params',
    'def search(q: str, limit: int = 10): ...  # Default value',
    '',
    '# --- REQUEST BODY (Pydantic) ---',
    'from pydantic import BaseModel',
    'class Item(BaseModel):',
    '  name: str                               # Required field',
    '  price: float = 0.0                      # Optional with default',
    '@app.post("/item")                        # POST endpoint',
    'def create(item: Item): return item       # Auto-validated',
    '',
    '# --- RESPONSE MODEL ---',
    '@app.post("/item", response_model=Item)   # Filter output fields',
    'def create(item: Item): return item       # Hides internal fields',
    '',
    '# --- ERROR HANDLING ---',
    'from fastapi import HTTPException',
    '@app.get("/item/{id}")',
    'def get_item(id: int):',
    '  if id != 1: raise HTTPException(status_code=404, detail="Not found")',
    '  return {"id": id}',
    '',
    '# --- DI DEPENDENCY INJECTION ---',
    'from fastapi import Depends',
    'def verify_token(): return {"user": "devops"}',
    '@app.get("/me")',
    'def me(data=Depends(verify_token)): return data  # Injected',
    '',
    '# --- MIDDLEWARE ---',
    '@app.middleware("http")',
    'async def add_time(request, call_next):',
    '  start = time.time()',
    '  response = await call_next(request)',
    '  response.headers["X-Time"] = str(time.time() - start)',
    '  return response',
    '',
    '# --- CORS ---',
    'from fastapi.middleware.cors import CORSMiddleware',
    'app.add_middleware(CORSMiddleware,',
    '  allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])',
    '',
    '# --- BACKGROUND TASKS ---',
    'from fastapi import BackgroundTasks',
    'def send_email(msg: str): print(msg)',
    '@app.post("/notify")',
    'async def notify(bg: BackgroundTasks):',
    '  bg.add_task(send_email, "sent")           # Fire & forget',
    '  return {"status": "queued"}',
    '',
    '# --- FILE UPLOAD ---',
    'from fastapi import UploadFile, File',
    '@app.post("/upload")',
    'async def upload(file: UploadFile = File(...)):',
    '  content = await file.read()',
    '  return {"filename": file.filename, "size": len(content)}',
    '',
    '# --- ROUTER SPLIT ---',
    'from fastapi import APIRouter',
    'router = APIRouter(prefix="/api", tags=["health"])',
    '@router.get("/health")',
    'def health(): return {"status": "ok"}',
    'app.include_router(router)',
    '',
    '# --- DB SESSION PATTERN ---',
    'from sqlalchemy.ext.asyncio import AsyncSession  # Async DB',
    'async def get_db():                              # Generator dep',
    '  async with Session() as session:',
    '    yield session                                 # Cleanup auto',
    '@app.get("/users")',
    'async def get_users(db: AsyncSession = Depends(get_db)):',
    '  result = await db.execute(select(User))',
    '  return result.scalars().all()',
    '',
    '# --- PRODUCTION STRUCTURE ---',
    '# app/',
    '#  ├── main.py              # App entry + middleware',
    '#  ├── config.py            # Settings (pydantic-settings)',
    '#  ├── routers/             # Route modules',
    '#  ├── models/              # SQLAlchemy models',
    '#  ├── schemas/             # Pydantic request/response',
    '#  ├── services/            # Business logic',
    '#  └── db.py                # Session + engine setup',
    '',
    '# --- REAL FLOW ---',
    '# Client → FastAPI → Pydantic validation',
    '#   → Middleware (auth/CORS/logging)',
    '#   → Router → Service → DB/Cache/ML',
    '#   → Response Model → JSON',
  ]},
];

const resources = [
  { icon: '📚', title: 'Cloud-DevOps Learning Resources', url: 'https://lnkd.in/d2hARXA7' },
  { icon: '🏗️', title: 'System Design Primer', url: 'https://lnkd.in/dM4WuQd7' },
  { icon: '💪', title: 'DevOps Exercises', url: 'https://lnkd.in/dGjJ9twm' },
  { icon: '🚀', title: 'Into the DevOps', url: 'https://lnkd.in/dSEXqRrw' },
  { icon: '📦', title: 'DevOps Projects', url: 'https://lnkd.in/dF-nCcUS' },
  { icon: '🔒', title: 'Cloud Native Security', url: 'https://lnkd.in/dCZ_EC98' },
  { icon: '🤖', title: 'MLOps Basics', url: 'https://lnkd.in/dSjE3gtx' },
  { icon: '💼', title: 'DevOps Interview Guide', url: 'https://lnkd.in/dR9eGD38' },
  { icon: '🗺️', title: 'DevOps Roadmap', url: 'https://lnkd.in/d9paw_bN' },
];

export default function DailyReviewPage() {
  const [activeTab, setActiveTab] = useState('commands');
  const [search, setSearch] = useState('');
  const [selectedSheet, setSelectedSheet] = useState(cheatsheets[0]?.id || '');

  const filteredCheatsheets = useMemo(() => {
    if (!search.trim()) return cheatsheets;
    const q = search.toLowerCase();
    return cheatsheets.filter((cs) =>
      cs.title.toLowerCase().includes(q) ||
      cs.lines.some((l) => l.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-100">Daily Review</h2>
        <p className="text-xs text-gray-500 mt-0.5">Everything you need — commands, references, and cheat sheets</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-card border border-white/[0.06] rounded-lg p-1 w-fit flex-wrap">
        {[
          { id: 'commands', label: 'Commands' },
          { id: 'references', label: 'References' },
          { id: 'cheatsheets', label: 'Cheat Sheets' },
          { id: 'resources', label: '📚 Resources' },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              activeTab === t.id ? 'bg-accent/15 text-accent' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'commands' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { key: 'linux', icon: '🐧', label: 'Linux & Bash', items: ['ls -la', 'grep -r', 'chmod 755', 'ps aux', 'df -h', 'free -h', 'tar -czf', 'systemctl status'] },
            { key: 'networking', icon: '🌐', label: 'Networking', items: ['ip a', 'ping', 'ss -tulpn', 'curl -I', 'dig +trace', 'nc -zv', 'nslookup', 'traceroute'] },
            { key: 'docker', icon: '🐳', label: 'Docker', items: ['docker ps', 'docker build', 'docker run -d -p', 'docker exec -it', 'docker logs -f', 'docker compose up', 'docker system prune', 'docker inspect'] },
            { key: 'k8s', icon: '☸️', label: 'Kubernetes', items: ['kubectl get pods', 'kubectl logs -f', 'kubectl exec -it', 'kubectl apply -f', 'kubectl describe', 'kubectl port-forward', 'kubectl rollout', 'helm install'] },
            { key: 'git', icon: '🔀', label: 'Git', items: ['git add .', 'git commit -m', 'git push', 'git checkout -b', 'git merge', 'git rebase', 'git stash', 'git log --oneline'] },
            { key: 'python', icon: '🐍', label: 'Python', items: ['print()', 'import requests', 'os.getenv()', 'json.dumps()', 'logging.info()', 'subprocess.run()', 'Path().write_text()', 'FastAPI()'] },
          ].map((cat, i) => (
            <div key={cat.key} className="bg-surface-card border border-white/[0.06] rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
                <span className="text-sm">{cat.icon}</span>
                <h3 className="text-sm font-medium text-gray-200">{cat.label}</h3>
              </div>
              <div className="p-3 grid grid-cols-2 gap-1">
                {cat.items.map((cmd, j) => (
                  <pre key={j} className="bg-surface/80 border border-white/[0.06] text-gray-300 px-2 py-1.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                    $ {cmd}
                  </pre>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'references' && (
        <div className="grid gap-4 sm:grid-cols-2 animate-fade-in">
          <QuickRefCard title="🌐 HTTP Status Codes"
            items={[
              { code: '200', label: 'OK' }, { code: '201', label: 'Created' },
              { code: '301', label: 'Moved' }, { code: '400', label: 'Bad Request' },
              { code: '401', label: 'Unauthorized' }, { code: '403', label: 'Forbidden' },
              { code: '404', label: 'Not Found' }, { code: '429', label: 'Rate Limited' },
              { code: '500', label: 'Internal Error' }, { code: '502', label: 'Bad Gateway' },
              { code: '503', label: 'Unavailable' }, { code: '504', label: 'Gateway Timeout' },
            ]}
            renderItem={(item) => (
              <div className="flex items-center gap-2 p-1 rounded hover:bg-white/[0.02]">
                <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  item.code < 300 ? 'bg-emerald-500/15 text-emerald-400' :
                  item.code < 400 ? 'bg-amber-500/15 text-amber-400' :
                  item.code < 500 ? 'bg-red-500/15 text-red-400' :
                  'bg-red-500/25 text-red-300'
                }`}>{item.code}</span>
                <span className="text-gray-400 text-[11px]">{item.label}</span>
              </div>
            )}
          />

          <QuickRefCard title="🔌 Essential Ports"
            items={[
              { port: '22', service: 'SSH', protocol: 'TCP' },
              { port: '80', service: 'HTTP', protocol: 'TCP' },
              { port: '443', service: 'HTTPS', protocol: 'TCP' },
              { port: '53', service: 'DNS', protocol: 'UDP/TCP' },
              { port: '5432', service: 'PostgreSQL', protocol: 'TCP' },
              { port: '6379', service: 'Redis', protocol: 'TCP' },
              { port: '27017', service: 'MongoDB', protocol: 'TCP' },
              { port: '8080', service: 'HTTP Alt', protocol: 'TCP' },
              { port: '5000', service: 'ML API', protocol: 'TCP' },
              { port: '3000', service: 'Dev Server', protocol: 'TCP' },
              { port: '9090', service: 'Prometheus', protocol: 'TCP' },
              { port: '4318', service: 'OpenTelemetry', protocol: 'TCP' },
            ]}
            renderItem={(item) => (
              <div className="flex items-center gap-2 p-1 rounded hover:bg-white/[0.02]">
                <span className="font-mono font-bold text-accent w-10 text-[11px]">{item.port}</span>
                <span className="text-gray-400 text-[11px]">{item.service}</span>
                <span className="text-gray-600 text-[10px] ml-auto">{item.protocol}</span>
              </div>
            )}
          />

          <QuickRefCard title="⚡ Git Config"
            items={[
              { label: 'git config --global user.name "Name"' },
              { label: 'git config --global user.email "e@mail.com"' },
              { label: 'git config --global init.defaultBranch main' },
              { label: '~/.ssh/id_rsa — private key (600)' },
              { label: '~/.ssh/id_rsa.pub — public key' },
              { label: '~/.ssh/authorized_keys — allow list' },
              { label: '~/.ssh/known_hosts — verified hosts' },
            ]}
            renderItem={(item) => (
              <div className="font-mono text-gray-400 text-[11px] p-1">{item.label}</div>
            )}
          />

          <QuickRefCard title="📁 Important Linux Paths"
            items={[
              { label: '/etc — system config files' },
              { label: '/var/log — log files' },
              { label: '/var/lib — persistent app data' },
              { label: '/home — user home directories' },
              { label: '/tmp — temporary files (cleared on reboot)' },
              { label: '/proc — process & kernel info (virtual)' },
              { label: '/etc/nginx/ — nginx config' },
              { label: '/etc/systemd/system/ — custom services' },
              { label: '/var/lib/docker — Docker data' },
              { label: '/etc/kubernetes — K8s config' },
            ]}
            renderItem={(item) => (
              <div className="flex items-center gap-2 p-1 rounded hover:bg-white/[0.02]">
                <span className="text-gray-400 text-[11px]">{item.label}</span>
              </div>
            )}
          />

          <div className="sm:col-span-2 bg-surface-card border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/[0.06]">
              <h3 className="text-sm font-medium text-gray-200">📡 OSI Model — 7 Layers</h3>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-7 gap-2">
                {[
                  { layer: 7, name: 'Application', example: 'HTTP, DNS, SSH' },
                  { layer: 6, name: 'Presentation', example: 'TLS, SSL' },
                  { layer: 5, name: 'Session', example: 'RPC, NetBIOS' },
                  { layer: 4, name: 'Transport', example: 'TCP, UDP' },
                  { layer: 3, name: 'Network', example: 'IP, ICMP' },
                  { layer: 2, name: 'Data Link', example: 'Ethernet, MAC' },
                  { layer: 1, name: 'Physical', example: 'Cables, Hubs' },
                ].map((l) => (
                  <div key={l.layer} className="bg-white/[0.03] rounded-lg p-2 text-center border border-white/[0.06]">
                    <div className="text-lg font-bold text-accent">L{l.layer}</div>
                    <div className="text-xs font-medium text-gray-200 mt-0.5">{l.name}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{l.example}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cheatsheets' && (
        <div className="flex flex-col lg:flex-row gap-4 animate-fade-in">
          {/* Sidebar */}
          <div className="w-full lg:w-56 shrink-0 space-y-2">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cheat sheets..." autoFocus
              className="w-full px-3 py-2 bg-surface-card border border-white/[0.08] rounded-xl text-sm text-gray-300 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 placeholder-gray-600" />
            <div className="space-y-1 max-h-[40vh] lg:max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
              {filteredCheatsheets.length > 0 ? filteredCheatsheets.map((cs) => (
                <button key={cs.id} onClick={() => { setSelectedSheet(cs.id); setSearch(''); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 transition-all ${
                    selectedSheet === cs.id
                      ? 'bg-accent/15 text-accent border border-accent/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent'
                  }`}>
                  <span className="text-base">{cs.icon}</span>
                  <span className="truncate font-medium">{cs.title}</span>
                </button>
              )) : (
                <div className="text-xs text-gray-600 text-center py-8">No cheat sheets found</div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {filteredCheatsheets.filter(c => c.id === selectedSheet).map(cs => (
              <div key={cs.id} className="bg-surface-card border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2.5 sticky top-0 bg-surface-card z-10">
                  <span className="text-lg">{cs.icon}</span>
                  <h3 className="text-sm font-semibold text-gray-200">{cs.title}</h3>
                </div>
                <div className="p-4">
                  <LinesRenderer lines={cs.lines} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gradient-to-r from-accent-dim/20 to-accent/5 border border-accent/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-100 mb-1">9 GitHub Repos Every DevOps Beginner Should Bookmark</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              When people ask where to start with DevOps, these are the practical, free resources
              that will save you hours of guesswork. If you're serious about Cloud & DevOps,
              this list is your starting point.
            </p>
          </div>

          <div className="grid gap-2">
            {resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-surface-card border border-white/[0.06] rounded-xl hover:border-accent/30 hover:bg-white/[0.02] transition-all group">
                <span className="text-lg">{r.icon}</span>
                <span className="flex-1 text-sm text-gray-200 group-hover:text-accent transition-colors">
                  {r.title}
                </span>
                <span className="text-gray-600 text-xs">#{i + 1} →</span>
              </a>
            ))}
          </div>

          <p className="text-xs text-gray-600 italic text-center pt-2">
            Save this. Share it with someone who's just getting started.
          </p>
        </div>
      )}
    </div>
  );
}

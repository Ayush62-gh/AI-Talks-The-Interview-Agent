import type { AIProvider, AIQuestion, AIEvaluation, AIFeedback } from './ai.provider.js';
import { AI_COHORT_CURRICULUM, CurriculumTopic } from '../config/curriculum.js';

interface QuestionItem {
  text: string;
  topic: string;
  day: number;
  module: string;
  difficulty: 'easy' | 'medium' | 'hard';
  keyConcepts: string[];
}

// Ground questions directly in the 31-Day AI Cohort Curriculum
const cohortQuestionBank: QuestionItem[] = AI_COHORT_CURRICULUM.map((item) => {
  let qText = '';
  switch (item.day) {
    case 1:
      qText = 'Can you explain the difference between tokens and characters in LLMs, and how Byte-Pair Encoding (BPE) impacts tokenization?';
      break;
    case 2:
      qText = 'How do System Instructions differ from User Prompts, and how do you enforce strict persona steering in production?';
      break;
    case 3:
      qText = 'What is the difference between Few-Shot Prompting and Chain-of-Thought (CoT) reasoning, and when would you combine them?';
      break;
    case 4:
      qText = 'How do you guarantee valid JSON output from an LLM using schemas (Pydantic / Zod) or native JSON Mode?';
      break;
    case 5:
      qText = 'How do context window limits affect multi-turn chat applications, and what strategies prevent state truncation?';
      break;
    case 6:
      qText = 'Explain dense vector embeddings. How does cosine similarity measure semantic relevance between document chunks?';
      break;
    case 7:
      qText = 'What is an Approximate Nearest Neighbor (ANN) index like HNSW in Vector Databases (Pinecone/Chroma/Qdrant), and why is it faster than brute-force search?';
      break;
    case 8:
      qText = 'What are the trade-offs between fixed-size chunking with overlap versus semantic chunking in document ingestion?';
      break;
    case 9:
      qText = 'Compare Dense Retrieval (embeddings) with Sparse Retrieval (BM25). What are the strengths of each approach?';
      break;
    case 10:
      qText = 'How does Hybrid Search combine dense vector search and BM25 using Reciprocal Rank Fusion (RRF)?';
      break;
    case 11:
      qText = 'Why is payload metadata filtering essential during vector retrieval, and how does pre-filtering differ from post-filtering?';
      break;
    case 12:
      qText = 'Explain Advanced RAG techniques like Query Expansion and Hypothetical Document Embeddings (HyDE). How do they improve retrieval recall?';
      break;
    case 13:
      qText = 'Why do we place a Cross-Encoder Reranker after initial vector retrieval, and how does it improve context precision?';
      break;
    case 14:
      qText = 'How do evaluation frameworks like Ragas measure Context Precision, Faithfulness, and Answer Relevance to detect hallucinations?';
      break;
    case 15:
      qText = 'Compare Fine-Tuning with RAG. When should an enterprise fine-tune a model versus implementing a RAG pipeline?';
      break;
    case 16:
      qText = 'Explain the ReAct (Reasoning + Acting) agent pattern. How does the thought-action-observation loop operate?';
      break;
    case 17:
      qText = 'How does native LLM Function Calling work under the hood, and how does the model select which tool to execute?';
      break;
    case 18:
      qText = 'What is the difference between working memory, short-term conversational context, and long-term agentic memory?';
      break;
    case 19:
      qText = 'How do multi-agent systems coordinate task execution using supervisor agents and specialist worker agents?';
      break;
    case 20:
      qText = 'How do you design Human-in-the-Loop approval breakpoints before an AI agent executes high-risk actions?';
      break;
    case 21:
      qText = 'How does graph-based state management (e.g. LangGraph) ensure deterministic agent execution and state persistence?';
      break;
    case 22:
      qText = 'How does an autonomous agent detect tool execution errors and perform self-reflection or fallback recovery loops?';
      break;
    case 23:
      qText = 'What is the Model Context Protocol (MCP), and how does it standardize client-server AI system integrations?';
      break;
    case 24:
      qText = 'How do you implement an MCP Server to safely expose custom database tools and command handlers to AI clients?';
      break;
    case 25:
      qText = 'How does MCP expose dynamic resources via URIs and prompt templates to AI client applications?';
      break;
    case 26:
      qText = 'What security considerations apply to MCP transports (stdio vs SSE), and how do you handle authentication?';
      break;
    case 27:
      qText = 'How does MCP enable multi-server interoperability where an LLM client queries disparate external data sources?';
      break;
    case 28:
      qText = 'Compare high-throughput LLM serving engines like vLLM and Ollama. How does PagedAttention optimize memory usage?';
      break;
    case 29:
      qText = 'How do you protect production AI systems against Indirect Prompt Injection using Guardrails and Output Filters?';
      break;
    case 30:
      qText = 'How do observability platforms like LangSmith or OpenTelemetry trace multi-step LLM calls, latency, and token costs?';
      break;
    case 31:
      qText = 'Walk through an end-to-end evaluation strategy for certifying an AI engineering candidate or production system.';
      break;
    default:
      qText = `Explain key principles of ${item.topic} in production AI applications.`;
  }

  return {
    text: qText,
    topic: item.topic,
    day: item.day,
    module: item.module,
    difficulty: item.difficulty,
    keyConcepts: item.keyConcepts,
  };
});

const javaBackendQuestionBank: QuestionItem[] = [
  { day: 1, topic: 'Java JVM Internals', module: 'Java Core', difficulty: 'easy', text: 'Can you explain how Java Garbage Collection works in the JVM, and the difference between Heap and Stack memory?', keyConcepts: ['jvm', 'garbage collection', 'heap', 'stack', 'memory'] },
  { day: 2, topic: 'HashMap Internals', module: 'Java Core', difficulty: 'easy', text: 'How does HashMap work internally in Java? What happens when two keys produce the same hash bucket collision?', keyConcepts: ['hashmap', 'hashing', 'bucket', 'collision', 'hashcode', 'equals'] },
  { day: 3, topic: 'Concurrency & Threads', module: 'Java Core', difficulty: 'medium', text: 'Explain thread safety in Java. How does the synchronized keyword differ from volatile and AtomicInteger?', keyConcepts: ['concurrency', 'thread', 'synchronized', 'volatile', 'atomic'] },
  { day: 4, topic: 'Spring Boot Dependency Injection', module: 'Spring Boot', difficulty: 'easy', text: 'What is Dependency Injection in Spring Boot? Why is Constructor Injection generally preferred over Field Injection (@Autowired)?', keyConcepts: ['spring boot', 'dependency injection', 'ioc', 'bean', 'autowired', 'constructor'] },
  { day: 5, topic: 'REST API Design & Error Handling', module: 'Spring MVC', difficulty: 'medium', text: 'How do you design REST APIs in Spring Boot and handle global exceptions using @ControllerAdvice and ResponseEntity?', keyConcepts: ['rest api', 'spring mvc', 'controller', 'exception', 'responseentity'] },
  { day: 6, topic: 'JPA & Hibernate Performance', module: 'Data Persistence', difficulty: 'hard', text: 'What is the N+1 select problem in JPA/Hibernate, and how do you resolve it using JOIN FETCH or Entity Graphs?', keyConcepts: ['jpa', 'hibernate', 'n+1', 'fetch', 'lazy', 'eager'] },
  { day: 7, topic: 'Database Transactions & ACID', module: 'Data Persistence', difficulty: 'hard', text: 'Explain Spring @Transactional propagation and isolation levels. How do you prevent dirty reads and phantom reads?', keyConcepts: ['transactional', 'acid', 'isolation level', 'propagation', 'dirty read'] },
  { day: 8, topic: 'Microservices & Distributed Caching', module: 'Microservices', difficulty: 'hard', text: 'How do you implement distributed caching with Redis in Spring Boot microservices to reduce database load and maintain idempotency?', keyConcepts: ['redis', 'microservices', 'caching', 'idempotency', 'distributed'] },
  { day: 9, topic: 'Java 21 Virtual Threads', module: 'Java Core', difficulty: 'medium', text: 'What are Virtual Threads (Project Loom) in Java 21, and how do they differ from traditional OS platform threads?', keyConcepts: ['virtual threads', 'loom', 'concurrency', 'platform threads', 'throughput'] },
  { day: 10, topic: 'Kafka Event Streaming', module: 'Distributed Systems', difficulty: 'hard', text: 'How do you design idempotent Kafka consumers in Java and handle message partitioning and consumer offset commits?', keyConcepts: ['kafka', 'messaging', 'idempotency', 'partition', 'consumer'] },
  { day: 11, topic: 'Spring Security & JWT', module: 'Security', difficulty: 'medium', text: 'How does Spring Security filter chain process authentication using JWT tokens, and how do you secure endpoints based on roles?', keyConcepts: ['spring security', 'jwt', 'authentication', 'authorization', 'filter'] },
  { day: 12, topic: 'Database Indexing & Query Optimization', module: 'Databases', difficulty: 'medium', text: 'How do B-Tree composite indexes speed up SQL queries in relational databases, and what causes index scan degradation?', keyConcepts: ['index', 'sql', 'b-tree', 'query optimization', 'database'] },
  { day: 13, topic: 'Reactive Java & WebFlux', module: 'Reactive Frameworks', difficulty: 'hard', text: 'Compare Spring WebFlux reactive programming (Mono/Flux) with traditional synchronous Spring MVC thread-per-request model.', keyConcepts: ['webflux', 'reactive', 'mono', 'flux', 'non-blocking'] },
  { day: 14, topic: 'API Gateway & Rate Limiting', module: 'System Design', difficulty: 'medium', text: 'How do you implement rate limiting in a Java microservices API Gateway using the Token Bucket algorithm?', keyConcepts: ['api gateway', 'rate limiting', 'token bucket', 'microservices', 'throttling'] },
  { day: 15, topic: 'Testing with Testcontainers', module: 'Testing', difficulty: 'easy', text: 'How do you write integration tests in Spring Boot using Testcontainers with real PostgreSQL or Redis instances?', keyConcepts: ['testcontainers', 'junit', 'mockito', 'integration testing', 'spring boot'] },
];

const frontendQuestionBank: QuestionItem[] = [
  { day: 1, topic: 'JS Event Loop & Async', module: 'Frontend Core', difficulty: 'easy', text: 'Explain the JavaScript Event Loop, Call Stack, and Microtask queue (Promises) versus Macrotask queue (setTimeout).', keyConcepts: ['event loop', 'async', 'promise', 'microtask', 'call stack'] },
  { day: 2, topic: 'React Virtual DOM', module: 'React Internals', difficulty: 'easy', text: 'How does the React Virtual DOM work under the hood, and how does reconciliation/diffing optimize browser renders?', keyConcepts: ['virtual dom', 'reconciliation', 'diffing', 'fiber', 'render'] },
  { day: 3, topic: 'React Hooks & Memoization', module: 'React Hooks', difficulty: 'medium', text: 'How do useEffect, useMemo, and useCallback work? When should you avoid over-using memoization in React?', keyConcepts: ['useeffect', 'usememo', 'usecallback', 'hooks', 'memoization'] },
  { day: 4, topic: 'State Management (Context/Redux)', module: 'State Architecture', difficulty: 'medium', text: 'Compare Context API with Redux Toolkit / Zustand. What are the trade-offs regarding component re-renders?', keyConcepts: ['state management', 'context api', 'redux', 'zustand', 're-render'] },
  { day: 5, topic: 'Browser Rendering Pipeline', module: 'Performance', difficulty: 'hard', text: 'Walk through the browser rendering pipeline (DOM, CSSOM, Render Tree, Layout, Paint). What triggers reflow versus repaint?', keyConcepts: ['rendering pipeline', 'reflow', 'repaint', 'dom', 'cssom'] },
  { day: 6, topic: 'Bundlers (Vite vs Webpack)', module: 'Tooling', difficulty: 'hard', text: 'How do modern bundlers like Vite use native ES modules and perform tree shaking, code splitting, and dynamic imports?', keyConcepts: ['vite', 'webpack', 'tree shaking', 'code splitting', 'bundle'] },
  { day: 7, topic: 'TypeScript Advanced Types', module: 'TypeScript', difficulty: 'medium', text: 'Explain TypeScript Generics, Discriminated Unions, and utility types like Partial, Record, and Pick.', keyConcepts: ['typescript', 'generics', 'discriminated unions', 'type safety', 'utility types'] },
  { day: 8, topic: 'Browser Security (CORS & XSS)', module: 'Security', difficulty: 'medium', text: 'How do CORS preflight requests work, and how do you protect web applications against Cross-Site Scripting (XSS)?', keyConcepts: ['cors', 'xss', 'security', 'preflight', 'sanitization'] },
  { day: 9, topic: 'Core Web Vitals & Performance', module: 'Performance', difficulty: 'hard', text: 'How do you optimize Core Web Vitals such as Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)?', keyConcepts: ['core web vitals', 'lcp', 'cls', 'performance', 'optimization'] },
  { day: 10, topic: 'Next.js & Server Components', module: 'React Frameworks', difficulty: 'hard', text: 'What is the architecture of React Server Components (RSC) in Next.js, and how does SSR differ from SSG and ISR?', keyConcepts: ['next.js', 'rsc', 'ssr', 'ssg', 'server components'] },
  { day: 11, topic: 'WebSockets & Real-time UI', module: 'Web APIs', difficulty: 'medium', text: 'Compare WebSockets with Server-Sent Events (SSE) for real-time dashboard updates, and how do you handle reconnection loops?', keyConcepts: ['websockets', 'sse', 'real-time', 'eventsource', 'reconnection'] },
  { day: 12, topic: 'Micro-frontends Architecture', module: 'Architecture', difficulty: 'hard', text: 'How does Webpack Module Federation enable micro-frontend architecture while isolating component state?', keyConcepts: ['micro-frontends', 'module federation', 'architecture', 'state isolation'] },
  { day: 13, topic: 'Web Accessibility (WCAG & ARIA)', module: 'Accessibility', difficulty: 'easy', text: 'How do ARIA roles, live regions, and keyboard focus management ensure WCAG 2.1 accessibility in complex React web apps?', keyConcepts: ['accessibility', 'wcag', 'aria', 'focus', 'keyboard'] },
  { day: 14, topic: 'Progressive Web Apps (PWAs)', module: 'Web APIs', difficulty: 'medium', text: 'How do Service Workers and the Cache Storage API enable offline functionality and caching in Progressive Web Apps?', keyConcepts: ['service worker', 'pwa', 'cache storage', 'offline', 'progressive'] },
  { day: 15, topic: 'Frontend Automated Testing', module: 'Testing', difficulty: 'easy', text: 'Compare user-event testing with React Testing Library against end-to-end browser automation with Playwright.', keyConcepts: ['react testing library', 'playwright', 'e2e', 'unit test', 'frontend testing'] },
];

const dataAnalystQuestionBank: QuestionItem[] = [
  { day: 1, topic: 'SQL Joins & Aggregations', module: 'SQL Analytics', difficulty: 'easy', text: 'Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN in SQL, and how GROUP BY filters with HAVING.', keyConcepts: ['sql', 'join', 'group by', 'having', 'aggregate'] },
  { day: 2, topic: 'SQL Window Functions', module: 'SQL Analytics', difficulty: 'medium', text: 'How do SQL Window Functions like ROW_NUMBER(), RANK(), and DENSE_RANK() work with OVER (PARTITION BY)?', keyConcepts: ['window function', 'rank', 'dense_rank', 'partition by', 'over'] },
  { day: 3, topic: 'Pandas Data Wrangling', module: 'Python Data', difficulty: 'medium', text: 'How do you handle missing values, group data, and perform pivot operations efficiently in Python Pandas DataFrames?', keyConcepts: ['pandas', 'dataframe', 'fillna', 'groupby', 'pivot'] },
  { day: 4, topic: 'Statistical Analysis', module: 'Statistics', difficulty: 'hard', text: 'What is a p-value in statistical hypothesis testing, and how do you determine statistical significance during A/B testing?', keyConcepts: ['statistics', 'p-value', 'hypothesis testing', 'a/b testing', 'correlation'] },
  { day: 5, topic: 'Data Warehousing Schemas', module: 'Data Modeling', difficulty: 'medium', text: 'Explain Star Schema versus Snowflake Schema in data warehousing. What are Fact tables and Dimension tables?', keyConcepts: ['star schema', 'snowflake schema', 'fact table', 'dimension table', 'data warehouse'] },
  { day: 6, topic: 'Data Cleaning & Outlier Detection', module: 'Data Wrangling', difficulty: 'easy', text: 'How do you detect and handle outliers in analytical datasets using Z-score or Interquartile Range (IQR)?', keyConcepts: ['outliers', 'z-score', 'iqr', 'data cleaning', 'data quality'] },
  { day: 7, topic: 'Time-Series Analysis', module: 'Analytics', difficulty: 'hard', text: 'How do you compute rolling moving averages and decompose seasonality trends in time-series business datasets?', keyConcepts: ['time-series', 'moving average', 'seasonality', 'trend', 'analytics'] },
  { day: 8, topic: 'Data Visualization Principles', module: 'Visualization', difficulty: 'easy', text: 'How do you select the appropriate chart type (bar, line, scatter, heatmap) to present insights effectively to business stakeholders?', keyConcepts: ['visualization', 'charts', 'tableau', 'powerbi', 'reporting'] },
  { day: 9, topic: 'Cohort & Retention Analytics', module: 'Business Metrics', difficulty: 'medium', text: 'How do you structure a cohort analysis matrix to calculate user retention rate, churn rate, and Customer Lifetime Value (LTV)?', keyConcepts: ['cohort', 'retention', 'churn', 'ltv', 'metrics'] },
  { day: 10, topic: 'CTEs vs Subqueries', module: 'SQL Analytics', difficulty: 'medium', text: 'Compare Common Table Expressions (CTEs) with subqueries in SQL. When do CTEs improve query readability and performance?', keyConcepts: ['cte', 'subquery', 'sql optimization', 'with clause', 'readability'] },
  { day: 11, topic: 'Python Data Visualization', module: 'Python Data', difficulty: 'easy', text: 'How do you build clear, interactive statistical plots using Python libraries like Seaborn and Plotly?', keyConcepts: ['seaborn', 'plotly', 'matplotlib', 'visualization', 'python'] },
  { day: 12, topic: 'ETL Pipeline Fundamentals', module: 'Data Engineering', difficulty: 'medium', text: 'What are the main stages of an ETL (Extract, Transform, Load) pipeline, and how do you enforce data quality checks?', keyConcepts: ['etl', 'pipeline', 'data validation', 'transformation', 'data quality'] },
  { day: 13, topic: 'A/B Testing Sample Size', module: 'Statistics', difficulty: 'hard', text: 'How do Statistical Power, Minimum Detectable Effect (MDE), and Significance Level (Alpha) determine required sample size in A/B tests?', keyConcepts: ['sample size', 'statistical power', 'mde', 'alpha', 'a/b test'] },
  { day: 14, topic: 'SQL Execution Plans', module: 'Database Tuning', difficulty: 'hard', text: 'How do you read an EXPLAIN query plan in SQL to identify full table scans, unindexed joins, and sorting bottlenecks?', keyConcepts: ['explain', 'execution plan', 'index scan', 'table scan', 'sql tuning'] },
  { day: 15, topic: 'Communicating Data Insights', module: 'Strategy', difficulty: 'easy', text: 'How do you translate complex statistical analysis into actionable business recommendations for non-technical executives?', keyConcepts: ['storytelling', 'executive presentation', 'insights', 'business metrics', 'strategy'] },
];

const devopsQuestionBank: QuestionItem[] = [
  { day: 1, topic: 'Docker Containerization', module: 'Containers', difficulty: 'easy', text: 'What is the difference between Docker images and containers, and how do multi-stage Docker builds reduce image size?', keyConcepts: ['docker', 'container', 'dockerfile', 'multi-stage', 'image'] },
  { day: 2, topic: 'Kubernetes Orchestration', module: 'Orchestration', difficulty: 'medium', text: 'Explain Kubernetes Pods, Deployments, and Services. How does Ingress route traffic to backend pods?', keyConcepts: ['kubernetes', 'k8s', 'pod', 'deployment', 'service'] },
  { day: 3, topic: 'CI/CD & Zero-Downtime Rollouts', module: 'CI/CD Pipelines', difficulty: 'hard', text: 'How do you design an automated CI/CD pipeline using Canary or Blue-Green deployment strategies for zero downtime?', keyConcepts: ['ci/cd', 'canary', 'blue-green', 'pipeline', 'automation'] },
  { day: 4, topic: 'Infrastructure as Code (Terraform)', module: 'IaC', difficulty: 'medium', text: 'How do Terraform remote state, state locking (DynamoDB), and modular infrastructure prevent drift in cloud environments?', keyConcepts: ['terraform', 'iac', 'remote state', 'state locking', 'infrastructure'] },
  { day: 5, topic: 'Prometheus & Grafana Monitoring', module: 'Observability', difficulty: 'medium', text: 'How does Prometheus scrape metrics from endpoints, and how do you configure Grafana alerts for high CPU or memory usage?', keyConcepts: ['prometheus', 'grafana', 'metrics', 'alerting', 'monitoring'] },
  { day: 6, topic: 'Cloud IAM & Least Privilege', module: 'Security', difficulty: 'easy', text: 'How do you enforce the principle of least privilege using IAM roles, policies, and service accounts in AWS or GCP?', keyConcepts: ['iam', 'cloud security', 'least privilege', 'aws', 'roles'] },
  { day: 7, topic: 'Centralized Logging (ELK Stack)', module: 'Observability', difficulty: 'medium', text: 'How do Filebeat and Logstash collect, parse, and forward application logs into Elasticsearch and Kibana dashboards?', keyConcepts: ['elk', 'logging', 'logstash', 'elasticsearch', 'kibana'] },
  { day: 8, topic: 'GitOps with ArgoCD', module: 'CD Systems', difficulty: 'hard', text: 'What is GitOps, and how does ArgoCD continuously synchronize Kubernetes cluster state with a Git configuration repository?', keyConcepts: ['gitops', 'argocd', 'kubernetes', 'continuous delivery', 'git'] },
  { day: 9, topic: 'Secrets Management (Vault)', module: 'Security', difficulty: 'hard', text: 'How does HashiCorp Vault manage dynamic secrets and database credentials for Kubernetes pods securely?', keyConcepts: ['vault', 'secrets', 'hashicorp', 'encryption', 'security'] },
  { day: 10, topic: 'SRE & Error Budgets', module: 'SRE', difficulty: 'medium', text: 'Explain the relationship between Service Level Indicators (SLIs), Service Level Objectives (SLOs), and Error Budgets.', keyConcepts: ['sre', 'slo', 'sli', 'error budget', 'reliability'] },
  { day: 11, topic: 'Load Balancing & TLS', module: 'Networking', difficulty: 'easy', text: 'How do Layer 4 and Layer 7 load balancers differ, and how do you configure SSL/TLS termination at the ingress controller?', keyConcepts: ['load balancer', 'tls', 'ssl', 'layer 7', 'ingress'] },
  { day: 12, topic: 'Service Mesh (Istio)', module: 'Service Mesh', difficulty: 'hard', text: 'How does a Service Mesh like Istio use sidecar proxies (Envoy) to enforce mutual TLS (mTLS) and traffic splitting?', keyConcepts: ['istio', 'service mesh', 'envoy', 'mtls', 'sidecar'] },
  { day: 13, topic: 'Serverless DevOps Automation', module: 'Cloud', difficulty: 'medium', text: 'How do you automate event-driven serverless deployments using AWS Lambda and CloudWatch Event Rules?', keyConcepts: ['serverless', 'lambda', 'aws', 'automation', 'cloudwatch'] },
  { day: 14, topic: 'Ansible Configuration Management', module: 'Configuration', difficulty: 'easy', text: 'What is idempotency in Ansible playbooks, and how does Ansible configure servers without requiring client agents?', keyConcepts: ['ansible', 'playbook', 'idempotent', 'agentless', 'configuration'] },
  { day: 15, topic: 'Disaster Recovery & RTO/RPO', module: 'Reliability', difficulty: 'hard', text: 'Define Recovery Time Objective (RTO) and Recovery Point Objective (RPO). How do you test multi-region failover strategies?', keyConcepts: ['rto', 'rpo', 'disaster recovery', 'failover', 'backup'] },
];

const softwareEngineerQuestionBank: QuestionItem[] = [
  { day: 1, topic: 'Data Structures & Complexity', module: 'CS Core', difficulty: 'easy', text: 'Compare the time and space complexity of Hash Tables versus Balanced Binary Search Trees (AVL / Red-Black Trees).', keyConcepts: ['hash table', 'binary tree', 'complexity', 'big o', 'data structures'] },
  { day: 2, topic: 'SOLID Design Principles', module: 'Software Design', difficulty: 'easy', text: 'Walk through the SOLID design principles. How does Dependency Inversion (DIP) decouple high-level modules from low-level details?', keyConcepts: ['solid', 'dependency inversion', 'oop', 'design principles', 'clean code'] },
  { day: 3, topic: 'System Design & Scalability', module: 'System Design', difficulty: 'medium', text: 'How do you approach scaling a monolithic web service horizontally using load balancers, caching, and database read replicas?', keyConcepts: ['system design', 'scalability', 'load balancer', 'caching', 'horizontal scaling'] },
  { day: 4, topic: 'SQL vs NoSQL Trade-offs', module: 'Databases', difficulty: 'medium', text: 'What are the architectural trade-offs between Relational SQL databases (ACID) and NoSQL databases (BASE / Eventual Consistency)?', keyConcepts: ['sql', 'nosql', 'acid', 'base', 'eventual consistency'] },
  { day: 5, topic: 'API Design (REST vs gRPC vs GraphQL)', module: 'API Architecture', difficulty: 'medium', text: 'Compare REST, GraphQL, and gRPC. When would you choose gRPC over REST for high-performance internal microservices?', keyConcepts: ['rest', 'grpc', 'graphql', 'api design', 'protobuf'] },
  { day: 6, topic: 'Concurrency & Deadlocks', module: 'Concurrency', difficulty: 'hard', text: 'What are the four necessary conditions for a deadlock in concurrent software, and how do lock-free atomic operations prevent them?', keyConcepts: ['deadlock', 'concurrency', 'mutex', 'lock-free', 'atomic'] },
  { day: 7, topic: 'CAP Theorem & Distributed Systems', module: 'Distributed Systems', difficulty: 'hard', text: 'Explain the CAP Theorem. Why can a distributed network system only choose two between Consistency, Availability, and Partition Tolerance?', keyConcepts: ['cap theorem', 'distributed systems', 'consistency', 'availability', 'partition'] },
  { day: 8, topic: 'Software Design Patterns', module: 'Design Patterns', difficulty: 'medium', text: 'Explain the Factory, Strategy, and Observer design patterns. Give a real-world software engineering example for one of them.', keyConcepts: ['design patterns', 'factory', 'strategy', 'observer', 'architecture'] },
  { day: 9, topic: 'Code Refactoring & Tech Debt', module: 'Clean Code', difficulty: 'easy', text: 'How do you identify code smells and refactor legacy functions while maintaining high test coverage and zero regression?', keyConcepts: ['refactoring', 'code smell', 'tech debt', 'clean code', 'testing'] },
  { day: 10, topic: 'Testing Pyramid', module: 'Testing', difficulty: 'easy', text: 'Explain the Testing Pyramid (Unit tests, Integration tests, End-to-End tests). Why should unit tests form the widest base?', keyConcepts: ['testing pyramid', 'unit testing', 'integration testing', 'e2e', 'quality'] },
  { day: 11, topic: 'Microservices Communication', module: 'Architecture', difficulty: 'medium', text: 'Compare synchronous REST HTTP calls with asynchronous message queues (RabbitMQ/Kafka) for inter-service communication.', keyConcepts: ['microservices', 'messaging', 'async', 'sync', 'rabbitmq'] },
  { day: 12, topic: 'Software Security & OWASP', module: 'Security', difficulty: 'medium', text: 'What are SQL Injection and Cross-Site Scripting (XSS), and how do parameterization and output encoding prevent them?', keyConcepts: ['owasp', 'sql injection', 'xss', 'security', 'sanitization'] },
  { day: 13, topic: 'Caching Strategies & Eviction', module: 'Caching', difficulty: 'medium', text: 'Compare Cache-Aside, Write-Through, and Write-Back caching strategies. How does LRU (Least Recently Used) eviction operate?', keyConcepts: ['cache-aside', 'write-through', 'lru', 'caching', 'eviction'] },
  { day: 14, topic: 'Event-Driven Architecture', module: 'Distributed Systems', difficulty: 'hard', text: 'How do Event Sourcing and CQRS (Command Query Responsibility Segregation) maintain consistency in event-driven systems?', keyConcepts: ['event sourcing', 'cqrs', 'event-driven', 'architecture', 'consistency'] },
  { day: 15, topic: 'Code Reviews & API Versioning', module: 'Engineering Culture', difficulty: 'easy', text: 'How do you conduct constructive code reviews and manage semantic API versioning (SemVer) without breaking existing consumers?', keyConcepts: ['code review', 'semver', 'api versioning', 'backward compatibility', 'collaboration'] },
];

function isQuestionDuplicateOrSimilar(newText: string, askedQuestions: string[]): boolean {
  if (!askedQuestions || askedQuestions.length === 0) return false;
  const cleanNew = newText.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const wordsNew = new Set(cleanNew.split(/\s+/).filter((w) => w.length > 3));

  for (const asked of askedQuestions) {
    const cleanAsked = asked.toLowerCase().replace(/[^\w\s]/g, '').trim();
    if (cleanAsked === cleanNew || cleanAsked.includes(cleanNew) || cleanNew.includes(cleanAsked)) {
      return true;
    }
    const wordsAsked = new Set(cleanAsked.split(/\s+/).filter((w) => w.length > 3));
    if (wordsAsked.size === 0 || wordsNew.size === 0) continue;
    let common = 0;
    wordsNew.forEach((w) => {
      if (wordsAsked.has(w)) common++;
    });
    const similarity = common / Math.max(wordsNew.size, wordsAsked.size);
    if (similarity >= 0.60) {
      return true;
    }
  }
  return false;
}

function getAdaptiveQuestion(context: Record<string, any>): AIQuestion {
  const idx = (context.progress ?? 0) + 1;
  const historyMsgs = Array.isArray(context.history) ? context.history : [];
  const candidateMsgs = historyMsgs.filter((m: any) => m.sender === 'candidate');
  const askedQuestions: string[] = Array.isArray(context.askedQuestions) ? context.askedQuestions : [];
  const prevEval = context.previousEvaluation ?? null;
  const role = String(context.candidate?.role ?? 'AI Engineer');
  const expLevel = String(context.candidate?.experienceLevel ?? 'Junior');

  let targetDifficulty: 'easy' | 'medium' | 'hard' = expLevel === 'Fresher' ? 'easy' : expLevel === 'Senior' ? 'hard' : 'medium';

  if (prevEval) {
    const prevScore = Number(prevEval.correctness ?? prevEval.score ?? 70);
    if (prevScore < 50) {
      targetDifficulty = 'easy';
    } else if (prevScore >= 80) {
      targetDifficulty = 'hard';
    }
  }

  let roleBank = cohortQuestionBank;
  if (role === 'Java Backend Developer') {
    roleBank = javaBackendQuestionBank;
  } else if (role === 'Frontend Developer') {
    roleBank = frontendQuestionBank;
  } else if (role === 'Data Analyst') {
    roleBank = dataAnalystQuestionBank;
  } else if (role === 'DevOps Engineer') {
    roleBank = devopsQuestionBank;
  } else if (role === 'Backend Developer' || role === 'Full Stack Developer' || role === 'Software Engineer') {
    roleBank = softwareEngineerQuestionBank;
  }

  // Filter out any questions that match or are similar to previously asked questions
  let candidates = roleBank.filter((q) => q.difficulty === targetDifficulty && !isQuestionDuplicateOrSimilar(q.text, askedQuestions));
  if (candidates.length === 0) {
    candidates = roleBank.filter((q) => !isQuestionDuplicateOrSimilar(q.text, askedQuestions));
  }
  if (candidates.length === 0) {
    candidates = roleBank;
  }

  const chosen = candidates[(idx - 1) % candidates.length] || candidates[0];
  let questionText = chosen.text;

  // Add professional interviewer contextual acknowledgement if candidate answered previously
  if (candidateMsgs.length > 0 && prevEval) {
    const lastAnswer = String(candidateMsgs[candidateMsgs.length - 1].text ?? '').toLowerCase();
    const matchedConcept = chosen.keyConcepts.find((c) => lastAnswer.includes(c)) || chosen.keyConcepts[0] || 'the concepts';
    const prevScore = Number(prevEval.correctness ?? prevEval.score ?? 70);

    const correctPhrases = [
      `Spot on! You correctly explained the core principles of ${matchedConcept}. Let's build on that: ${chosen.text}`,
      `Excellent technical breakdown of ${matchedConcept}. To take it one level deeper: ${chosen.text}`,
      `That's technically accurate regarding ${matchedConcept}. Let me ask an architectural follow-up: ${chosen.text}`,
      `Great explanation covering ${matchedConcept}. Now let's examine an important production trade-off: ${chosen.text}`,
      `Very clear answer regarding ${matchedConcept}. How would you handle this next scenario: ${chosen.text}`,
      `Solid points on ${matchedConcept}. Let me test a deeper scenario: ${chosen.text}`,
    ];

    const partialPhrases = [
      `That's a good foundation regarding ${matchedConcept}. To make the technical details precise: ${chosen.text}`,
      `You touched on ${matchedConcept}, but missed key operational trade-offs. Let me ask: ${chosen.text}`,
      `Partially correct on ${matchedConcept}. Let me clarify with a targeted follow-up question: ${chosen.text}`,
    ];

    const incorrectPhrases = [
      `I see. Let's revisit fundamental concepts regarding ${matchedConcept}. Consider this scenario: ${chosen.text}`,
      `Not quite. Let's break down the underlying mechanism of ${matchedConcept}: ${chosen.text}`,
    ];

    if (prevScore >= 75) {
      questionText = correctPhrases[idx % correctPhrases.length];
    } else if (prevScore >= 50) {
      questionText = partialPhrases[idx % partialPhrases.length];
    } else {
      questionText = incorrectPhrases[idx % incorrectPhrases.length];
    }
  }

  return {
    questionId: `q-cohort-day${chosen.day}-${Date.now()}`,
    text: questionText,
    topic: chosen.topic,
    difficulty: chosen.difficulty,
    sourceDay: chosen.day,
    sourceModule: chosen.module,
    sourceTopic: chosen.topic,
  } as any;
}

// Detect meaningless, time-pass, filler, or prompt injection responses
function isMeaninglessOrInjection(text: string): { isBad: boolean; reason: string } {
  const clean = text.trim().toLowerCase();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;

  // Anti-Gaming / Prompt Injection Check
  const injectionPatterns = [
    /ignore (previous|all) (instructions|rules)/i,
    /give (me|10|100|full) (marks|points|score|10\/10)/i,
    /override (system|prompt|evaluator)/i,
    /grade (this|me) (as|with) 100/i,
    /bypass (interview|security)/i,
  ];

  if (injectionPatterns.some((pattern) => pattern.test(clean))) {
    return { isBad: true, reason: 'Prompt manipulation / instruction override attempt detected' };
  }

  // Obvious filler / time-pass / single meaningless words
  const meaninglessExact = new Set(['asdf', 'asdfghjkl', 'hello', 'hi', 'ok', 'okay', 'yes', 'no', 'test', 'idk', "i don't know", 'dunno', 'whatever', 'abcd', '123', '12345']);
  if (meaninglessExact.has(clean)) {
    return { isBad: true, reason: 'Time-pass filler or non-technical response' };
  }

  // Very short response without any technical term
  if (wordCount < 3 && clean.length < 12) {
    const commonValidShorts = ['bpe', 'rag', 'mcp', 'hyde', 'rrf', 'vllm', 'ann', 'hnsw', 'bm25', 'zod', 'cot', 'lora', 'json', 'stdio', 'sse', 'jvm', 'jpa', 'dom'];
    if (!commonValidShorts.some((short) => clean.includes(short))) {
      return { isBad: true, reason: 'Extremely brief non-technical answer' };
    }
  }

  // Repeated single character or single word (e.g., "aaaaa" or "test test test")
  const uniqueChars = new Set(clean.replace(/\s+/g, ''));
  if (clean.length > 5 && uniqueChars.size <= 2) {
    return { isBad: true, reason: 'Repeated character pattern detected' };
  }

  return { isBad: false, reason: '' };
}

export default function createMockProvider(): AIProvider {
  return {
    async generateQuestion(context) {
      return getAdaptiveQuestion(context);
    },

    async evaluateAnswer(context) {
      const answerText = String(context.answer ?? '').trim();
      const questionText = String(context.question?.text ?? '').toLowerCase();
      const difficulty = (context.currentDifficulty as 'easy' | 'medium' | 'hard') || 'medium';
      const difficultyWeight = difficulty === 'easy' ? 1.0 : difficulty === 'hard' ? 1.25 : 1.1;
      const wordCount = answerText.split(/\s+/).filter(Boolean).length;

      // 1. Strict Meaningless & Anti-Gaming Check
      const badCheck = isMeaninglessOrInjection(answerText);
      if (badCheck.isBad) {
        const accuracy = 0;
        const relevance = 0;
        const depth = 0;
        const clarity = 2;
        const baseScore = (accuracy * 0.50) + (relevance * 0.20) + (depth * 0.20) + (clarity * 0.10);
        const weightedScore = baseScore * difficultyWeight;

        return {
          correctness: Math.round(baseScore * 10),
          relevance: Math.round(relevance * 10),
          technicalDepth: Math.round(depth * 10),
          communication: Math.round(clarity * 10),
          strengths: [],
          weaknesses: [`Evaluation Failed: ${badCheck.reason}. Response provided zero technical substance.`],
          missingConcepts: ['Valid technical explanation addressing the question prompt'],
          assessment: `ZERO ACCURACY: ${badCheck.reason}. Candidate answer failed technical evaluation guidelines.`,
        };
      }

      // 2. Identify Question-Specific Key Technical Concepts
      const currentQuestionItem = cohortQuestionBank.concat(javaBackendQuestionBank, frontendQuestionBank, dataAnalystQuestionBank, devopsQuestionBank, softwareEngineerQuestionBank).find((q) => questionText.includes(q.topic.toLowerCase()) || questionText.includes(q.text.toLowerCase().slice(0, 30)));
      const requiredConcepts = currentQuestionItem?.keyConcepts ?? ['system', 'architecture', 'data', 'rag', 'vector', 'model', 'agent', 'mcp', 'context', 'token'];

      const lowerAnswer = answerText.toLowerCase();
      const matchedConcepts = requiredConcepts.filter((concept) => lowerAnswer.includes(concept));

      let accuracy = 0; // 0-10
      let relevance = 0; // 0-10
      let depth = 0; // 0-10
      let clarity = 0; // 0-10

      if (matchedConcepts.length === 0) {
        accuracy = 1.5;
        relevance = 2.0;
        depth = 1.0;
        clarity = Math.min(5, wordCount);
      } else {
        accuracy = Math.min(10, 6.5 + matchedConcepts.length * 1.2 + Math.min(1, wordCount * 0.05));
        relevance = Math.min(10, 7.5 + matchedConcepts.length * 0.8);
        depth = Math.min(10, 5.5 + matchedConcepts.length * 1.2 + Math.min(2, wordCount * 0.05));
        clarity = Math.min(10, 7.0 + Math.min(2.5, wordCount * 0.1));
      }

      const baseScore = (accuracy * 0.50) + (relevance * 0.20) + (depth * 0.20) + (clarity * 0.10);
      const isCorrect = accuracy >= 7.0;
      const isPartial = accuracy >= 5.0 && accuracy < 7.0;

      const strengths = matchedConcepts.length > 0
        ? [`Correctly explained key technical concepts: ${matchedConcepts.join(', ')}`]
        : ['Provided readable text structure'];

      const weaknesses = isCorrect
        ? []
        : matchedConcepts.length === 0
        ? [`Answer lacked required technical concepts (${requiredConcepts.slice(0, 3).join(', ')})`]
        : [`Answer could elaborate deeper on production trade-offs`];

      const missingConcepts = isCorrect
        ? []
        : requiredConcepts.filter((c) => !matchedConcepts.includes(c));

      let assessmentText = `Correct answer (Accuracy: ${accuracy.toFixed(1)}/10). Candidate demonstrated solid understanding of ${matchedConcepts.join(', ')}.`;
      if (isPartial) {
        assessmentText = `Partially correct (Accuracy: ${accuracy.toFixed(1)}/10). Candidate addressed ${matchedConcepts.join(', ')}, but missed ${missingConcepts.join(', ')}.`;
      } else if (!isCorrect && !isPartial) {
        assessmentText = `Incorrect response (Accuracy: ${accuracy.toFixed(1)}/10). Answer failed to address required technical concepts (${requiredConcepts.join(', ')}).`;
      }

      return {
        correctness: Math.round(baseScore * 10),
        relevance: Math.round(relevance * 10),
        technicalDepth: Math.round(depth * 10),
        communication: Math.round(clarity * 10),
        strengths,
        weaknesses,
        missingConcepts,
        assessment: assessmentText,
      };
    },

    async generateFeedback(context) {
      const evaluations: any[] = context.evaluations || [];
      const history = context.history || [];
      const candidateMsgs = history.filter((m: any) => m.sender === 'candidate');

      let sumWeighted = 0;
      let sumWeights = 0;
      let sumAcc = 0;
      let sumRel = 0;
      let sumDep = 0;
      let sumCla = 0;

      if (evaluations.length > 0) {
        evaluations.forEach((e) => {
          const acc = e.accuracy ?? (e.correctness ? e.correctness / 10 : 5);
          const rel = e.relevance ?? 5;
          const dep = e.technicalDepth ?? e.depth ?? 5;
          const cla = e.communication ?? e.clarity ?? 5;
          const w = e.difficultyWeight ?? (e.difficulty === 'easy' ? 1.0 : e.difficulty === 'hard' ? 1.25 : 1.1);

          const bScore = (acc * 0.50) + (rel * 0.20) + (dep * 0.20) + (cla * 0.10);
          const wScore = bScore * w;

          sumAcc += acc;
          sumRel += rel;
          sumDep += dep;
          sumCla += cla;
          sumWeighted += wScore;
          sumWeights += w;
        });
      }

      const totalQ = evaluations.length || candidateMsgs.length || 1;
      const finalScore10 = sumWeights > 0 ? sumWeighted / sumWeights : 0;
      const finalScore = Math.max(0, Math.min(100, Math.round(finalScore10 * 10)));

      const avgAccuracy = Number((sumAcc / totalQ).toFixed(1));
      const avgClarity = Number((sumCla / totalQ).toFixed(1));
      const avgDepth = Number((sumDep / totalQ).toFixed(1));
      const role = context.candidate?.role ?? 'AI Engineer';

      const allStrengths = Array.from(new Set(evaluations.flatMap((e) => e.strengths || []))).filter(Boolean);
      const allWeaknesses = Array.from(new Set(evaluations.flatMap((e) => e.weaknesses || []))).filter(Boolean);

      return {
        overallScore: finalScore,
        technicalScore: Math.round(avgAccuracy * 10),
        communicationScore: Math.round(avgClarity * 10),
        problemSolvingScore: Math.round(avgDepth * 10),
        strengths: allStrengths.length > 0 ? allStrengths : ['Completed technical interview session'],
        weaknesses: allWeaknesses.length > 0 ? allWeaknesses : ['Could elaborate deeper on architectural trade-offs'],
        improvementAreas: ['Review role-specific technical domain topics', 'Provide deeper technical reasoning'],
        recommendedTopics: [role, 'System Architecture'],
        summary: `Assessment Report for ${role}: Candidate evaluated across ${totalQ} questions. Final Score: ${finalScore}/100. ${
          finalScore >= 70
            ? 'Candidate demonstrated solid technical understanding across target domain topics.'
            : 'Candidate submitted incomplete or inaccurate responses.'
        }`,
      };
    },
  };
}

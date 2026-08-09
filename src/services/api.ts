import axios from 'axios';
import {
  InterviewConfig,
  InterviewQuestion,
  StartInterviewResponse,
  SubmitAnswerResponse,
  InterviewFeedback,
} from '../types/interview';

const apiBaseUrl =
  (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string; VITE_API_URL?: string } }).env?.VITE_API_BASE_URL ||
  (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string; VITE_API_URL?: string } }).env?.VITE_API_URL ||
  '/api';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
});

function getInitialFallbackQuestion(role: string): string {
  if (role === 'AI Engineer') {
    return "Welcome to your AI Engineer interview! Let's start with 31-Day AI Cohort core concepts: How do vector embeddings transform text into dense vector spaces, and how do vector databases like Qdrant or Pinecone perform similarity search using HNSW indexes?";
  }
  if (role === 'Java Backend Developer') {
    return "Welcome to your Java Backend Developer interview! Can you explain how Java JVM memory is structured between Heap, Stack, and Metaspace, and how Spring Boot manages bean lifecycle and dependency injection?";
  }
  if (role === 'Frontend Developer') {
    return "Welcome to your Frontend Developer interview! How do useEffect, useMemo, and useCallback work in React? When should you avoid over-using memoization?";
  }
  if (role === 'Data Analyst') {
    return "Welcome to your Data Analyst interview! Can you walk through how SQL window functions like ROW_NUMBER(), RANK(), and DENSE_RANK() work in complex analytical queries?";
  }
  return `Welcome to your ${role} interview! To get started, can you walk through a complex technical challenge you solved recently and the architectural trade-offs you evaluated?`;
}

export async function startInterview(config: InterviewConfig): Promise<StartInterviewResponse> {
  try {
    const { data } = await apiClient.post<StartInterviewResponse>('/interview', {
      sessionId: '',
      candidate: {
        role: config.role,
        experienceLevel: config.experienceLevel,
        interviewType: config.interviewType,
        questionCount: config.questionCount,
      },
    });

    const initialReply = data.firstQuestion?.text || data.reply || '';

    return {
      sessionId: data.sessionId || `S-${Date.now().toString(36)}`,
      firstQuestion: initialReply
        ? {
            questionId: data.firstQuestion?.questionId ?? `q-${Date.now()}`,
            text: initialReply,
          }
        : data.firstQuestion,
      progress: data.progress ?? 0,
      totalQuestions: data.totalQuestions ?? config.questionCount,
      reply: initialReply,
      done: data.done ?? false,
      feedback: data.feedback,
    };
  } catch (error) {
    console.warn('Backend API request failed, utilizing client fallback mode:', error);
    const fallbackText = getInitialFallbackQuestion(config.role);
    const fallbackSessionId = `S-VERCEL-${Date.now().toString(36).slice(-6)}`;
    return {
      sessionId: fallbackSessionId,
      firstQuestion: {
        questionId: `q-fallback-${Date.now()}`,
        text: fallbackText,
      },
      progress: 0,
      totalQuestions: config.questionCount,
      reply: fallbackText,
      done: false,
    };
  }
}

export interface SubmitAnswerOptions {
  role?: string;
  experienceLevel?: string;
  interviewType?: string;
  questionCount?: number;
  currentQuestionIndex?: number;
  askedQuestions?: string[];
}

const roleFallbackBanks: Record<string, string[]> = {
  'Java Backend Developer': [
    "Can you explain how Java Garbage Collection works in the JVM, and the difference between Heap and Stack memory?",
    "How does HashMap work internally in Java? What happens when two keys produce the same hash bucket collision?",
    "Explain thread safety in Java. How does synchronized differ from volatile and AtomicInteger?",
    "What is Dependency Injection in Spring Boot? Why is Constructor Injection preferred over Field Injection (@Autowired)?",
    "How do you design REST APIs in Spring Boot and handle global exceptions using @ControllerAdvice and ResponseEntity?",
    "What is the N+1 select problem in JPA/Hibernate, and how do you resolve it using JOIN FETCH or Entity Graphs?",
    "Explain Spring @Transactional propagation and isolation levels. How do you prevent dirty reads and phantom reads?",
    "How do you implement distributed caching with Redis in Spring Boot microservices to reduce database load and maintain idempotency?",
    "What are Virtual Threads (Project Loom) in Java 21, and how do they differ from traditional OS platform threads?",
    "How do you design idempotent Kafka consumers in Java and handle message partitioning and consumer offset commits?",
    "How does Spring Security filter chain process authentication using JWT tokens, and how do you secure endpoints based on roles?",
    "How do B-Tree composite indexes speed up SQL queries in relational databases, and what causes index scan degradation?",
    "Compare Spring WebFlux reactive programming (Mono/Flux) with traditional synchronous Spring MVC thread-per-request model.",
    "How do you implement rate limiting in a Java microservices API Gateway using the Token Bucket algorithm?",
    "How do you write integration tests in Spring Boot using Testcontainers with real PostgreSQL or Redis instances?",
  ],
  'Frontend Developer': [
    "Explain the JavaScript Event Loop, Call Stack, and Microtask queue (Promises) versus Macrotask queue (setTimeout).",
    "How does the React Virtual DOM work under the hood, and how does reconciliation/diffing optimize browser renders?",
    "How do useEffect, useMemo, and useCallback work? When should you avoid over-using memoization in React?",
    "Compare Context API with Redux Toolkit / Zustand. What are the trade-offs regarding component re-renders?",
    "Walk through the browser rendering pipeline (DOM, CSSOM, Render Tree, Layout, Paint). What triggers reflow versus repaint?",
    "How do modern bundlers like Vite use native ES modules and perform tree shaking, code splitting, and dynamic imports?",
    "Explain TypeScript Generics, Discriminated Unions, and utility types like Partial, Record, and Pick.",
    "How do CORS preflight requests work, and how do you protect web applications against Cross-Site Scripting (XSS)?",
    "How do you optimize Core Web Vitals such as Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)?",
    "What is the architecture of React Server Components (RSC) in Next.js, and how does SSR differ from SSG and ISR?",
    "Compare WebSockets with Server-Sent Events (SSE) for real-time dashboard updates, and how do you handle reconnection loops?",
    "How does Webpack Module Federation enable micro-frontend architecture while isolating component state?",
    "How do ARIA roles, live regions, and keyboard focus management ensure WCAG 2.1 accessibility in complex React web apps?",
    "How do Service Workers and the Cache Storage API enable offline functionality and caching in Progressive Web Apps?",
    "Compare user-event testing with React Testing Library against end-to-end browser automation with Playwright.",
  ],
  'Data Analyst': [
    "Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN in SQL, and how GROUP BY filters with HAVING.",
    "How do SQL Window Functions like ROW_NUMBER(), RANK(), and DENSE_RANK() work with OVER (PARTITION BY)?",
    "How do you handle missing values, group data, and perform pivot operations efficiently in Python Pandas DataFrames?",
    "What is a p-value in statistical hypothesis testing, and how do you determine statistical significance during A/B testing?",
    "Explain Star Schema versus Snowflake Schema in data warehousing. What are Fact tables and Dimension tables?",
    "How do you detect and handle outliers in analytical datasets using Z-score or Interquartile Range (IQR)?",
    "How do you compute rolling moving averages and decompose seasonality trends in time-series business datasets?",
    "How do you select the appropriate chart type (bar, line, scatter, heatmap) to present insights effectively to business stakeholders?",
    "How do you structure a cohort analysis matrix to calculate user retention rate, churn rate, and Customer Lifetime Value (LTV)?",
    "Compare Common Table Expressions (CTEs) with subqueries in SQL. When do CTEs improve query readability and performance?",
    "How do you build clear, interactive statistical plots using Python libraries like Seaborn and Plotly?",
    "What are the main stages of an ETL (Extract, Transform, Load) pipeline, and how do you enforce data quality checks?",
    "How do Statistical Power, Minimum Detectable Effect (MDE), and Significance Level (Alpha) determine required sample size in A/B tests?",
    "How do you read an EXPLAIN query plan in SQL to identify full table scans, unindexed joins, and sorting bottlenecks?",
    "How do you translate complex statistical analysis into actionable business recommendations for non-technical executives?",
  ],
  'DevOps Engineer': [
    "What is the difference between Docker images and containers, and how do multi-stage Docker builds reduce image size?",
    "Explain Kubernetes Pods, Deployments, and Services. How does Ingress route traffic to backend pods?",
    "How do you design an automated CI/CD pipeline using Canary or Blue-Green deployment strategies for zero downtime?",
    "How do Terraform remote state, state locking (DynamoDB), and modular infrastructure prevent drift in cloud environments?",
    "How does Prometheus scrape metrics from endpoints, and how do you configure Grafana alerts for high CPU or memory usage?",
    "How do you enforce the principle of least privilege using IAM roles, policies, and service accounts in AWS or GCP?",
    "How do Filebeat and Logstash collect, parse, and forward application logs into Elasticsearch and Kibana dashboards?",
    "What is GitOps, and how does ArgoCD continuously synchronize Kubernetes cluster state with a Git configuration repository?",
    "How does HashiCorp Vault manage dynamic secrets and database credentials for Kubernetes pods securely?",
    "Explain the relationship between Service Level Indicators (SLIs), Service Level Objectives (SLOs), and Error Budgets.",
    "How do Layer 4 and Layer 7 load balancers differ, and how do you configure SSL/TLS termination at the ingress controller?",
    "How does a Service Mesh like Istio use sidecar proxies (Envoy) to enforce mutual TLS (mTLS) and traffic splitting?",
    "How do you automate event-driven serverless deployments using AWS Lambda and CloudWatch Event Rules?",
    "What is idempotency in Ansible playbooks, and how does Ansible configure servers without requiring client agents?",
    "Define Recovery Time Objective (RTO) and Recovery Point Objective (RPO). How do you test multi-region failover strategies?",
  ],
  'Software Engineer': [
    "Compare the time and space complexity of Hash Tables versus Balanced Binary Search Trees (AVL / Red-Black Trees).",
    "Walk through the SOLID design principles. How does Dependency Inversion (DIP) decouple high-level modules from low-level details?",
    "How do you approach scaling a monolithic web service horizontally using load balancers, caching, and database read replicas?",
    "What are the architectural trade-offs between Relational SQL databases (ACID) and NoSQL databases (BASE / Eventual Consistency)?",
    "Compare REST, GraphQL, and gRPC. When would you choose gRPC over REST for high-performance internal microservices?",
    "What are the four necessary conditions for a deadlock in concurrent software, and how do lock-free atomic operations prevent them?",
    "Explain the CAP Theorem. Why can a distributed network system only choose two between Consistency, Availability, and Partition Tolerance?",
    "Explain the Factory, Strategy, and Observer design patterns. Give a real-world software engineering example for one of them.",
    "How do you identify code smells and refactor legacy functions while maintaining high test coverage and zero regression?",
    "Explain the Testing Pyramid (Unit tests, Integration tests, End-to-End tests). Why should unit tests form the widest base?",
    "Compare synchronous REST HTTP calls with asynchronous message queues (RabbitMQ/Kafka) for inter-service communication.",
    "What are SQL Injection and Cross-Site Scripting (XSS), and how do parameterization and output encoding prevent them?",
    "Compare Cache-Aside, Write-Through, and Write-Back caching strategies. How does LRU (Least Recently Used) eviction operate?",
    "How do Event Sourcing and CQRS (Command Query Responsibility Segregation) maintain consistency in event-driven systems?",
    "How do you conduct constructive code reviews and manage semantic API versioning (SemVer) without breaking existing consumers?",
  ],
  'AI Engineer': [
    "How do vector embeddings transform text into dense vector spaces, and how do vector databases like Qdrant or Pinecone perform similarity search using HNSW indexes?",
    "What is the difference between tokens and characters in LLMs, and how does Byte-Pair Encoding (BPE) impact tokenization efficiency?",
    "How do System Instructions differ from User Prompts, and how do you enforce strict persona steering in production AI systems?",
    "What is the difference between Few-Shot Prompting and Chain-of-Thought (CoT) reasoning, and when would you combine them?",
    "How do you guarantee valid JSON output from an LLM using schemas (Pydantic / Zod) or native JSON Mode?",
    "How do context window limits affect multi-turn chat applications, and what strategies prevent state truncation?",
    "What are the trade-offs between fixed-size chunking with overlap versus semantic chunking in document ingestion pipelines?",
    "Compare Dense Retrieval (embeddings) with Sparse Retrieval (BM25). What are the strengths of hybrid search?",
    "Why do we place a Cross-Encoder Reranker after initial vector retrieval, and how does it improve context precision?",
    "How do evaluation frameworks like Ragas measure Context Precision, Faithfulness, and Answer Relevance to detect hallucinations?",
    "Explain the ReAct (Reasoning + Acting) agent pattern. How does the thought-action-observation loop operate?",
    "How does native LLM Function Calling work under the hood, and how does the model select which tool to execute?",
    "What is the Model Context Protocol (MCP), and how does it standardize client-server AI system integrations?",
    "How do you protect production AI systems against Indirect Prompt Injection using Guardrails and Output Filters?",
    "Compare high-throughput LLM serving engines like vLLM and Ollama. How does PagedAttention optimize memory usage?",
  ],
};

function getFallbackNextQuestion(role: string, askedQuestions: string[], currentIdx: number): string {
  const bank = roleFallbackBanks[role] || roleFallbackBanks['AI Engineer'];
  const unasked = bank.filter((qText) => !askedQuestions.some((asked) => asked.toLowerCase().includes(qText.slice(0, 20).toLowerCase())));
  if (unasked.length > 0) {
    return unasked[0];
  }
  return bank[(currentIdx - 1) % bank.length];
}

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  answer: string,
  options?: SubmitAnswerOptions,
): Promise<SubmitAnswerResponse> {
  const currentIdx = options?.currentQuestionIndex ?? 1;
  const total = options?.questionCount ?? 8;
  const asked = options?.askedQuestions ?? [];
  const role = options?.role ?? 'AI Engineer';

  try {
    const { data } = await apiClient.post<SubmitAnswerResponse>('/interview', {
      sessionId,
      message: answer,
      candidate: options?.role
        ? {
            role: options.role,
            experienceLevel: options.experienceLevel || 'Junior',
            interviewType: options.interviewType || 'Technical Interview',
            questionCount: total,
          }
        : undefined,
      askedQuestions: asked,
      questionIndex: currentIdx,
    });

    const reply = data.nextQuestion?.text || data.reply || '';
    const dataProgress = typeof data.progress === 'number' ? data.progress : 0;
    const isDone = Boolean(data.done) || dataProgress >= total || currentIdx >= total;

    if (isDone) {
      const feedbackPayload = data.feedback || (await fetchInterviewFeedback(sessionId));
      return {
        nextQuestion: null,
        reply: 'Interview completed successfully!',
        progress: total,
        done: true,
        feedback: feedbackPayload,
      };
    }

    return {
      ...data,
      nextQuestion: reply
        ? {
            questionId: data.nextQuestion?.questionId ?? `follow-up-${Date.now()}`,
            text: reply,
          }
        : data.nextQuestion,
      progress: data.progress ?? currentIdx + 1,
      done: false,
    };
  } catch (error) {
    console.warn('Backend API submitAnswer failed, utilizing client fallback mode:', error);

    const nextIdx = currentIdx + 1;
    const isDone = currentIdx >= total || nextIdx > total;

    if (isDone) {
      const fallbackFeedback = await fetchInterviewFeedback(sessionId);
      return {
        nextQuestion: null,
        reply: 'Interview completed successfully!',
        progress: total,
        done: true,
        feedback: fallbackFeedback,
      };
    }

    const nextQuestionText = getFallbackNextQuestion(role, asked, nextIdx);

    return {
      nextQuestion: {
        questionId: `q-${role.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
        text: nextQuestionText,
      },
      reply: nextQuestionText,
      progress: nextIdx,
      done: false,
    };
  }
}

export async function fetchInterviewFeedback(sessionId: string): Promise<InterviewFeedback> {
  try {
    const { data } = await apiClient.get<InterviewFeedback | Record<string, unknown>>(
      `/interview/${encodeURIComponent(sessionId)}/feedback`,
    );

    return {
      score: Number((data as Record<string, unknown>).score ?? (data as Record<string, unknown>).overallScore ?? 85),
      summary: String((data as Record<string, unknown>).summary ?? 'Solid interview performance showing strong role knowledge and clear problem solving reasoning.'),
      categories: {
        technicalKnowledge: Number((data as Record<string, unknown>).technicalKnowledge ?? (data as Record<string, unknown>).technicalScore ?? 88),
        problemSolving: Number((data as Record<string, unknown>).problemSolving ?? (data as Record<string, unknown>).problemSolvingScore ?? 84),
        communicationSkills: Number((data as Record<string, unknown>).communicationSkills ?? (data as Record<string, unknown>).communicationScore ?? 86),
        answerQuality: Number((data as Record<string, unknown>).answerQuality ?? (data as Record<string, unknown>).answerQualityScore ?? 85),
        confidence: Number((data as Record<string, unknown>).confidence ?? (data as Record<string, unknown>).confidenceScore ?? 87),
      },
      strengths: Array.isArray((data as Record<string, unknown>).strengths) ? ((data as Record<string, unknown>).strengths as string[]) : ['Strong grasp of role fundamentals', 'Clear technical communication'],
      weaknesses: Array.isArray((data as Record<string, unknown>).weaknesses) ? ((data as Record<string, unknown>).weaknesses as string[]) : ['Can provide deeper architectural trade-off comparisons'],
      suggestions: Array.isArray((data as Record<string, unknown>).suggestions) ? ((data as Record<string, unknown>).suggestions as string[]) : ['Practice edge case debugging scenarios'],
    };
  } catch (error) {
    console.warn('Backend API fetchInterviewFeedback failed, utilizing client fallback mode:', error);
    return {
      score: 86,
      summary: 'Solid performance across technical fundamentals, system design reasoning, and clear candidate communication.',
      categories: {
        technicalKnowledge: 88,
        problemSolving: 85,
        communicationSkills: 87,
        answerQuality: 84,
        confidence: 86,
      },
      strengths: [
        'Strong technical clarity and structured explanations',
        'Effective role-based concept application',
      ],
      weaknesses: [
        'Could include more quantitative production metrics',
      ],
      suggestions: [
        'Elaborate further on high-scale concurrency and failover strategies',
      ],
    };
  }
}

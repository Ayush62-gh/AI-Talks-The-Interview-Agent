import axios from 'axios';
import {
  InterviewConfig,
  InterviewQuestion,
  StartInterviewResponse,
  SubmitAnswerResponse,
  InterviewFeedback,
  PerformanceCategory,
  QuestionEvaluationDetail,
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
  } catch (error: any) {
    const serverMessage = error.response?.data?.error?.message || error.response?.data?.error || error.message;
    throw new Error(serverMessage || 'AI Service Unavailable. Unable to start interview session.');
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
    "Retrieval-Augmented Generation (RAG): How do dense vector embeddings and sparse retrieval (BM25) combine in Hybrid Search using Reciprocal Rank Fusion (RRF) to improve context retrieval recall?",
    "Retrieval-Augmented Generation (RAG): How does placing a Cross-Encoder Reranker after initial vector retrieval improve context precision and reduce LLM hallucinations?",
    "Vector Databases: How does an Approximate Nearest Neighbor (ANN) index like HNSW optimize vector similarity search in Vector Databases (Pinecone/Qdrant/Chroma), and how does pre-filtering payload metadata operate?",
    "Vector Databases: Compare cosine similarity, dot product, and Euclidean distance metric choices when storing dense document embeddings in Vector Databases.",
    "Prompt Engineering: What is the difference between Few-Shot Prompting and Chain-of-Thought (CoT) reasoning, and how do you guarantee structured JSON outputs using schema validation (Pydantic / Zod)?",
    "Prompt Engineering: How do System Instructions differ from User Prompts, and how do you enforce strict persona steering and output guardrails in production LLMs?",
    "Agentic AI: Explain the ReAct (Reasoning + Acting) agent pattern. How does the thought-action-observation loop operate in autonomous agentic workflows?",
    "Agentic AI: How does native LLM Function Calling work under the hood, and how do stateful graph frameworks (LangGraph) manage agent state persistence and human-in-the-loop approvals?",
    "Model Context Protocol (MCP): What is the Model Context Protocol (MCP), and how does it standardize client-server communication between LLM applications and external tools or resource servers?",
    "Model Context Protocol (MCP): How do you design and secure an MCP Server using stdio or SSE transports to safely expose custom database tools and command handlers to AI clients?",
    "AI Deployment: Compare high-throughput LLM serving engines like vLLM and Ollama. How does PagedAttention optimize GPU memory allocation during batch inference?",
    "AI Deployment: What techniques optimize LLM inference latency in production, such as speculative decoding, prompt caching, and model quantization (LoRA, QLoRA, GGUF)?",
    "Production AI Systems: How do evaluation frameworks like Ragas measure Context Precision, Faithfulness, and Answer Relevance to evaluate production RAG systems?",
    "Production AI Systems: How do you protect production AI applications against Indirect Prompt Injection attacks using input sanitization, NeMo Guardrails, and real-time output filtering?",
  ],
};

export interface DetailedEvaluationResult {
  accuracy: number; // 0-10
  relevance: number; // 0-10
  depth: number; // 0-10
  clarity: number; // 0-10
  baseScore: number; // (Accuracy * 0.5) + (Relevance * 0.2) + (Depth * 0.2) + (Clarity * 0.1)
  difficultyWeight: number; // 1.0, 1.1, 1.25
  weightedScore: number; // baseScore * difficultyWeight
  score: number; // 0-100
  feedbackText: string;
  isWrong: boolean;
}

export function evaluateAnswerQuality(
  questionText: string,
  answerText: string,
  role: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
): DetailedEvaluationResult {
  const clean = (answerText || '').trim().toLowerCase();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const difficultyWeight = difficulty === 'easy' ? 1.0 : difficulty === 'hard' ? 1.25 : 1.1;

  // 1. Anti-gaming / Filler / Empty / Nonsense check
  const fillerWords = new Set(['idk', "i don't know", 'dunno', 'test', 'asdf', 'asdfghjkl', 'whatever', 'abcd', '123', 'hello', 'hi', 'ok', 'okay', 'yes', 'no']);
  if (clean.length === 0 || fillerWords.has(clean) || (wordCount < 3 && !clean.includes('rag') && !clean.includes('sql') && !clean.includes('jvm') && !clean.includes('mcp') && !clean.includes('api'))) {
    const accuracy = 0.5;
    const relevance = 1.0;
    const depth = 0.5;
    const clarity = Math.min(4, wordCount * 1.5);
    const baseScore = (accuracy * 0.50) + (relevance * 0.20) + (depth * 0.20) + (clarity * 0.10);
    const weightedScore = baseScore * difficultyWeight;
    return {
      accuracy,
      relevance,
      depth,
      clarity,
      baseScore: Number(baseScore.toFixed(2)),
      difficultyWeight,
      weightedScore: Number(weightedScore.toFixed(2)),
      score: Math.round(baseScore * 10),
      isWrong: true,
      feedbackText: 'Answer was incorrect or contained non-technical filler text.',
    };
  }

  // 2. Anti-prompt injection check
  if (/ignore (previous|all) (instructions|rules)/i.test(clean) || /give (me|100) (marks|points|score)/i.test(clean)) {
    const accuracy = 0;
    const relevance = 0;
    const depth = 0;
    const clarity = 2;
    const baseScore = (accuracy * 0.50) + (relevance * 0.20) + (depth * 0.20) + (clarity * 0.10);
    const weightedScore = baseScore * difficultyWeight;
    return {
      accuracy,
      relevance,
      depth,
      clarity,
      baseScore: Number(baseScore.toFixed(2)),
      difficultyWeight,
      weightedScore: Number(weightedScore.toFixed(2)),
      score: Math.round(baseScore * 10),
      isWrong: true,
      feedbackText: 'Prompt override attempt detected. Score penalized.',
    };
  }

  // 3. Technical keyword extraction based on question and role
  const keyTermsMap: Record<string, string[]> = {
    'rag': ['vector', 'embedding', 'retrieval', 'chunk', 'search', 'context', 'document', 'rrf', 'bm25', 'rerank', 'hybrid', 'fusion'],
    'vector': ['hnsw', 'ann', 'distance', 'cosine', 'similarity', 'index', 'pinecone', 'qdrant', 'chroma', 'embedding', 'filter'],
    'prompt': ['instruction', 'schema', 'pydantic', 'zod', 'few-shot', 'chain-of-thought', 'cot', 'system', 'json', 'persona', 'guardrail'],
    'agent': ['react', 'tool', 'action', 'observation', 'loop', 'langgraph', 'state', 'function calling', 'agentic', 'workflow', 'memory'],
    'mcp': ['protocol', 'server', 'client', 'stdio', 'sse', 'uri', 'tool', 'resource', 'prompt', 'integration'],
    'deployment': ['vllm', 'ollama', 'pagedattention', 'quantization', 'lora', 'gguf', 'inference', 'latency', 'speculative', 'gpu'],
    'production': ['ragas', 'faithfulness', 'precision', 'relevance', 'hallucination', 'guardrail', 'injection', 'eval', 'nemo', 'filter'],
    'java': ['jvm', 'heap', 'stack', 'garbage collection', 'hashmap', 'synchronized', 'spring', 'jpa', 'hibernate', 'transactional', 'virtual thread', 'kafka'],
    'frontend': ['event loop', 'virtual dom', 'reconciliation', 'hooks', 'state', 'vite', 'webpack', 'typescript', 'cors', 'xss', 'lcp', 'rsc', 'next.js'],
    'data analyst': ['sql', 'join', 'group by', 'window function', 'row_number', 'pandas', 'p-value', 'star schema', 'outlier', 'cohort', 'cte'],
    'devops': ['docker', 'kubernetes', 'k8s', 'pod', 'ci/cd', 'canary', 'terraform', 'prometheus', 'grafana', 'iam', 'argocd', 'vault', 'sre'],
    'software engineer': ['complexity', 'big o', 'solid', 'scalability', 'sql', 'nosql', 'rest', 'grpc', 'cap theorem', 'pattern', 'testing', 'caching'],
  };

  const lowerQ = (questionText || '').toLowerCase();
  let targetKeywords: string[] = ['technical', 'system', 'architecture', 'design', 'implementation'];
  for (const [key, keywords] of Object.entries(keyTermsMap)) {
    if (lowerQ.includes(key) || role.toLowerCase().includes(key)) {
      targetKeywords = targetKeywords.concat(keywords);
    }
  }

  const matchedKeywords = targetKeywords.filter((word) => clean.includes(word));
  const uniqueMatches = Array.from(new Set(matchedKeywords));

  let accuracy = 0; // 0-10
  let relevance = 0; // 0-10
  let depth = 0; // 0-10
  let clarity = 0; // 0-10

  if (uniqueMatches.length === 0) {
    accuracy = 2.0;
    relevance = 3.0;
    depth = 1.5;
    clarity = Math.min(6, wordCount * 0.5);
  } else if (uniqueMatches.length === 1 && wordCount < 10) {
    accuracy = 5.5;
    relevance = 6.5;
    depth = 4.5;
    clarity = 7.0;
  } else {
    accuracy = Math.min(10, 6.8 + uniqueMatches.length * 1.0 + Math.min(1, wordCount * 0.05));
    relevance = Math.min(10, 7.5 + uniqueMatches.length * 0.8);
    depth = Math.min(10, 5.8 + uniqueMatches.length * 1.1 + Math.min(2, wordCount * 0.05));
    clarity = Math.min(10, 7.5 + Math.min(2.5, wordCount * 0.1));
  }

  const baseScore = (accuracy * 0.50) + (relevance * 0.20) + (depth * 0.20) + (clarity * 0.10);
  const weightedScore = baseScore * difficultyWeight;
  const isWrong = accuracy < 5.0;

  return {
    accuracy: Number(accuracy.toFixed(1)),
    relevance: Number(relevance.toFixed(1)),
    depth: Number(depth.toFixed(1)),
    clarity: Number(clarity.toFixed(1)),
    baseScore: Number(baseScore.toFixed(2)),
    difficultyWeight,
    weightedScore: Number(weightedScore.toFixed(2)),
    score: Math.round(baseScore * 10),
    isWrong,
    feedbackText: isWrong
      ? 'Answer lacked required technical terminology for this specific question.'
      : `Good technical explanation covering ${uniqueMatches.slice(0, 3).join(', ')}.`,
  };
}

function getFallbackNextQuestion(role: string, askedQuestions: string[], currentIdx: number): string {
  const bank = roleFallbackBanks[role] || roleFallbackBanks['AI Engineer'];
  const unasked = bank.filter((qText) => !askedQuestions.some((asked) => asked.toLowerCase().includes(qText.slice(0, 20).toLowerCase())));
  if (unasked.length > 0) {
    return unasked[0];
  }
  return bank[(currentIdx - 1) % bank.length];
}

export function generateDynamicFeedbackFromSession(roleName: string = 'AI Engineer'): InterviewFeedback {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('aiInterviewFullSession') : null;
    if (raw) {
      const s = JSON.parse(raw);
      const questions: any[] = s.questions || [];
      const answers: Record<string, string> = s.answers || {};

      let sumWeighted = 0;
      let sumWeights = 0;
      let sumAcc = 0;
      let sumRel = 0;
      let sumDep = 0;
      let sumCla = 0;
      let evaluatedCount = 0;

      const questionEvaluations: QuestionEvaluationDetail[] = [];
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const coveredTopics: string[] = [];
      const strongTopics: string[] = [];
      const weakTopics: string[] = [];

      questions.forEach((q) => {
        const ans = answers[q.id] || q.answer || '';
        const topicName = q.topic || 'Role Fundamentals';
        if (!coveredTopics.includes(topicName)) coveredTopics.push(topicName);

        if (ans) {
          const evalRes = evaluateAnswerQuality(q.question || '', ans, roleName, 'medium');
          sumWeighted += evalRes.weightedScore;
          sumWeights += evalRes.difficultyWeight;
          sumAcc += evalRes.accuracy;
          sumRel += evalRes.relevance;
          sumDep += evalRes.depth;
          sumCla += evalRes.clarity;
          evaluatedCount++;

          questionEvaluations.push({
            questionId: q.id,
            questionText: q.question || '',
            answerText: ans,
            topic: topicName,
            difficulty: 'medium',
            difficultyWeight: evalRes.difficultyWeight,
            accuracy: evalRes.accuracy,
            relevance: evalRes.relevance,
            depth: evalRes.depth,
            clarity: evalRes.clarity,
            baseScore: evalRes.baseScore,
            weightedScore: evalRes.weightedScore,
            assessment: evalRes.feedbackText,
            strengths: evalRes.isWrong ? [] : [`Understands ${topicName}`],
            weaknesses: evalRes.isWrong ? [`Needs improvement on ${topicName}`] : [],
            missingConcepts: evalRes.isWrong ? [topicName] : [],
          });

          if (evalRes.isWrong) {
            weaknesses.push(`Struggled with ${q.question?.slice(0, 35)}...`);
            if (!weakTopics.includes(topicName)) weakTopics.push(topicName);
          } else {
            strengths.push(`Good grasp on ${q.question?.slice(0, 35)}...`);
            if (!strongTopics.includes(topicName)) strongTopics.push(topicName);
          }
        }
      });

      if (evaluatedCount > 0 && sumWeights > 0) {
        const finalScore10 = sumWeighted / sumWeights;
        const finalScore = Math.max(0, Math.min(100, Math.round(finalScore10 * 10)));

        let performanceCategory: PerformanceCategory = 'Needs Improvement';
        if (finalScore >= 90) performanceCategory = 'Exceptional';
        else if (finalScore >= 80) performanceCategory = 'Strong';
        else if (finalScore >= 70) performanceCategory = 'Good';
        else if (finalScore >= 60) performanceCategory = 'Average';
        else if (finalScore >= 50) performanceCategory = 'Needs Improvement';
        else performanceCategory = 'Weak';

        const avgAccuracy = Number((sumAcc / evaluatedCount).toFixed(1));
        const avgRelevance = Number((sumRel / evaluatedCount).toFixed(1));
        const avgDepth = Number((sumDep / evaluatedCount).toFixed(1));
        const avgClarity = Number((sumCla / evaluatedCount).toFixed(1));

        const curriculumCoverage = [
          { area: 'RAG & Retrieval (Days 8–15)', covered: true, dayCount: 4, daysList: [8, 9, 10, 13] },
          { area: 'Vector Databases (Days 6–7)', covered: true, dayCount: 2, daysList: [6, 7] },
          { area: 'Prompt Engineering (Days 1–5)', covered: true, dayCount: 3, daysList: [1, 2, 4] },
          { area: 'Agentic AI & Memory (Days 16–22)', covered: true, dayCount: 3, daysList: [16, 17, 21] },
          { area: 'Model Context Protocol (Days 23–27)', covered: true, dayCount: 2, daysList: [23, 24] },
          { area: 'Production AI & Deployment (Days 28–31)', covered: true, dayCount: 2, daysList: [28, 29] },
        ];

        return {
          score: finalScore,
          finalScore,
          performanceCategory,
          summary: `31-Day AI Cohort Assessment Report: Evaluated ${evaluatedCount} technical questions across 6 curriculum modules. Final Score: ${finalScore}/100 (${performanceCategory}). Accuracy: ${avgAccuracy}/10, Relevance: ${avgRelevance}/10, Depth: ${avgDepth}/10, Clarity: ${avgClarity}/10. ${
            finalScore >= 70
              ? 'Candidate demonstrated solid technical understanding across target AI Cohort topics.'
              : 'Candidate submitted incomplete or inaccurate responses across several questions.'
          }`,
          categories: {
            technicalKnowledge: Math.round(avgAccuracy * 10),
            problemSolving: Math.round(avgDepth * 10),
            communicationSkills: Math.round(avgClarity * 10),
            answerQuality: Math.round(avgRelevance * 10),
            confidence: Math.round(finalScore),
          },
          metrics: {
            totalQuestions: s.questionCount || evaluatedCount,
            answeredQuestions: evaluatedCount,
            coveredDaysCount: 6,
            coveredDaysList: [1, 4, 7, 8, 13, 16, 23, 28],
            averageAccuracy: avgAccuracy,
            averageRelevance: avgRelevance,
            averageDepth: avgDepth,
            averageClarity: avgClarity,
            sumWeightedScores: Number(sumWeighted.toFixed(2)),
            sumDifficultyWeights: Number(sumWeights.toFixed(2)),
          },
          questionEvaluations,
          curriculumCoverage,
          coveredTopics,
          strongTopics,
          weakTopics,
          strengths: strengths.length > 0 ? Array.from(new Set(strengths)).slice(0, 4) : ['Attempted all interview questions'],
          weaknesses: weaknesses.length > 0 ? Array.from(new Set(weaknesses)).slice(0, 4) : ['Could provide deeper architectural depth'],
          suggestions: [
            'Review 31-Day AI Cohort curriculum modules (RAG, Vector Search, MCP, Agentic Workflows)',
            'Focus on technical accuracy and providing concrete reasoning in explanations',
          ],
        };
      }
    }
  } catch (err) {
    console.warn('Error calculating session feedback:', err);
  }

  return {
    score: 35,
    finalScore: 35,
    performanceCategory: 'Weak',
    summary: 'Incomplete or unverified response data. Candidate requires further technical review.',
    categories: {
      technicalKnowledge: 35,
      problemSolving: 30,
      communicationSkills: 40,
      answerQuality: 35,
      confidence: 35,
    },
    metrics: {
      totalQuestions: 1,
      answeredQuestions: 0,
      averageAccuracy: 3.5,
      averageRelevance: 3.5,
      averageDepth: 3.0,
      averageClarity: 4.0,
      sumWeightedScores: 3.5,
      sumDifficultyWeights: 1.0,
    },
    strengths: ['Started session setup'],
    weaknesses: ['Did not complete sufficient verified technical answers'],
    suggestions: ['Complete all questions with detailed technical answers'],
  };
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
      const feedbackPayload = data.feedback || generateDynamicFeedbackFromSession(role);
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
  } catch (error: any) {
    const serverMessage = error.response?.data?.error?.message || error.response?.data?.error || error.message;
    throw new Error(serverMessage || 'AI Service Unavailable. Unable to submit answer.');
  }
}

export async function fetchInterviewFeedback(sessionId: string): Promise<InterviewFeedback> {
  try {
    const { data } = await apiClient.get<InterviewFeedback | Record<string, unknown>>(
      `/interview/${encodeURIComponent(sessionId)}/feedback`,
    );

    return {
      score: Number((data as Record<string, unknown>).score ?? (data as Record<string, unknown>).overallScore ?? 50),
      summary: String((data as Record<string, unknown>).summary ?? 'Interview assessment report.'),
      categories: {
        technicalKnowledge: Number((data as Record<string, unknown>).technicalKnowledge ?? (data as Record<string, unknown>).technicalScore ?? 50),
        problemSolving: Number((data as Record<string, unknown>).problemSolving ?? (data as Record<string, unknown>).problemSolvingScore ?? 50),
        communicationSkills: Number((data as Record<string, unknown>).communicationSkills ?? (data as Record<string, unknown>).communicationScore ?? 50),
        answerQuality: Number((data as Record<string, unknown>).answerQuality ?? (data as Record<string, unknown>).answerQualityScore ?? 50),
        confidence: Number((data as Record<string, unknown>).confidence ?? (data as Record<string, unknown>).confidenceScore ?? 50),
      },
      strengths: Array.isArray((data as Record<string, unknown>).strengths) ? ((data as Record<string, unknown>).strengths as string[]) : ['Role technical concepts'],
      weaknesses: Array.isArray((data as Record<string, unknown>).weaknesses) ? ((data as Record<string, unknown>).weaknesses as string[]) : ['Architectural trade-offs'],
      suggestions: Array.isArray((data as Record<string, unknown>).suggestions) ? ((data as Record<string, unknown>).suggestions as string[]) : ['Review core domain topics'],
    };
  } catch (error: any) {
    const serverMessage = error.response?.data?.error?.message || error.response?.data?.error || error.message;
    throw new Error(serverMessage || 'AI Feedback Unavailable.');
  }
}

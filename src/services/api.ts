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

export function evaluateAnswerQuality(questionText: string, answerText: string, role: string): { score: number; feedbackText: string; isWrong: boolean } {
  const clean = (answerText || '').trim().toLowerCase();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;

  // 1. Anti-gaming / Filler / Empty / Nonsense check
  const fillerWords = new Set(['idk', "i don't know", 'dunno', 'test', 'asdf', 'asdfghjkl', 'whatever', 'abcd', '123', 'hello', 'hi', 'ok', 'okay', 'yes', 'no']);
  if (clean.length === 0 || fillerWords.has(clean) || (wordCount < 3 && !clean.includes('rag') && !clean.includes('sql') && !clean.includes('jvm') && !clean.includes('mcp') && !clean.includes('api'))) {
    return {
      score: 15,
      isWrong: true,
      feedbackText: 'Answer was incorrect or contained non-technical filler text.',
    };
  }

  // 2. Anti-prompt injection check
  if (/ignore (previous|all) (instructions|rules)/i.test(clean) || /give (me|100) (marks|points|score)/i.test(clean)) {
    return {
      score: 10,
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

  if (uniqueMatches.length === 0) {
    return {
      score: 25,
      isWrong: true,
      feedbackText: 'Answer lacked required technical terminology for this specific question.',
    };
  }

  if (uniqueMatches.length === 1 && wordCount < 10) {
    return {
      score: 55,
      isWrong: false,
      feedbackText: `Partially correct. Mentioned ${uniqueMatches[0]}, but missing architectural details.`,
    };
  }

  const calculatedScore = Math.min(96, Math.max(75, 70 + uniqueMatches.length * 6 + Math.min(10, wordCount)));
  return {
    score: calculatedScore,
    isWrong: false,
    feedbackText: `Excellent explanation covering ${uniqueMatches.slice(0, 3).join(', ')}.`,
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

      let totalScore = 0;
      let evaluatedCount = 0;
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      questions.forEach((q) => {
        const ans = answers[q.id] || q.answer || '';
        if (ans) {
          const evalRes = evaluateAnswerQuality(q.question || '', ans, roleName);
          totalScore += evalRes.score;
          evaluatedCount++;
          if (evalRes.isWrong) {
            weaknesses.push(`Struggled with ${q.question?.slice(0, 40)}...`);
          } else {
            strengths.push(`Good technical knowledge on ${q.question?.slice(0, 40)}...`);
          }
        }
      });

      if (evaluatedCount > 0) {
        const finalScore = Math.round(totalScore / s.questionCount || evaluatedCount);
        const techScore = Math.min(100, Math.max(10, finalScore + 2));
        const probScore = Math.min(100, Math.max(10, finalScore - 2));
        const commScore = Math.min(100, Math.max(10, finalScore + 1));

        return {
          score: finalScore,
          summary:
            finalScore >= 75
              ? `Strong Interview Performance (${finalScore}/100): Candidate demonstrated solid technical understanding across target role domains.`
              : finalScore >= 50
              ? `Average Interview Performance (${finalScore}/100): Candidate showed basic familiarity with role concepts but missed advanced architectural trade-offs.`
              : `Needs Improvement (${finalScore}/100): Candidate submitted multiple incorrect, filler, or unverified responses across technical questions.`,
          categories: {
            technicalKnowledge: techScore,
            problemSolving: probScore,
            communicationSkills: commScore,
            answerQuality: finalScore,
            confidence: finalScore,
          },
          strengths: strengths.length > 0 ? Array.from(new Set(strengths)).slice(0, 4) : ['Attempted all interview questions'],
          weaknesses: weaknesses.length > 0 ? Array.from(new Set(weaknesses)).slice(0, 4) : ['Could provide deeper architectural depth'],
          suggestions: [
            `Review core ${roleName} technical concepts and production patterns`,
            'Practice structured technical reasoning with concrete architectural examples',
          ],
        };
      }
    }
  } catch (err) {
    console.warn('Error calculating session feedback:', err);
  }

  return {
    score: 45,
    summary: 'Incomplete or unverified response data. Candidate requires further technical review.',
    categories: {
      technicalKnowledge: 45,
      problemSolving: 40,
      communicationSkills: 50,
      answerQuality: 45,
      confidence: 45,
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
  } catch (error) {
    console.warn('Backend API submitAnswer failed, utilizing client fallback mode:', error);

    const nextIdx = currentIdx + 1;
    const isDone = currentIdx >= total || nextIdx > total;

    if (isDone) {
      const fallbackFeedback = generateDynamicFeedbackFromSession(role);
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
  } catch (error) {
    console.warn('Backend API fetchInterviewFeedback failed, utilizing dynamic session score:', error);
    return generateDynamicFeedbackFromSession();
  }
}

export interface DomainProfile {
  selectedRole: string;
  coreTopics: string[];
  secondaryTopics: string[];
  optionalTopics: string[];
  forbiddenTopics: string[];
  progression: string[];
}

export const DOMAIN_PROFILES: Record<string, DomainProfile> = {
  'AI Engineer': {
    selectedRole: 'AI Engineer',
    coreTopics: [
      'Retrieval-Augmented Generation (RAG)',
      'Vector Databases',
      'Prompt Engineering',
      'Agentic AI',
      'Model Context Protocol (MCP)',
      'AI Deployment',
      'Production AI Systems',
    ],
    secondaryTopics: [
      'LLM Fundamentals & Tokenization',
      'Embeddings & Dense Vectors',
      'Transformer Architecture Basics',
      'LoRA & Model Fine-Tuning',
      'Structured Outputs & JSON Mode',
      'Function Calling',
    ],
    optionalTopics: [
      'AI Cost Optimization',
      'Multi-Modal Models',
    ],
    forbiddenTopics: [
      'React', 'React Hooks', 'JSX', 'CSS', 'HTML', 'DOM', 'Virtual DOM',
      'Frontend Component Design', 'Frontend State Management', 'UI/UX',
      'Tailwind', 'Browser Rendering', 'Spring Boot Dependency Injection',
      'Java HashMap Internals', 'JPA Hibernate Performance',
    ],
    progression: [
      'LLM Fundamentals & Tokenization',
      'Prompt Engineering',
      'Embeddings & Dense Vectors',
      'Retrieval-Augmented Generation (RAG)',
      'Vector Databases',
      'RAG Reranking & Cross-Encoders',
      'RAG Evaluation Frameworks',
      'Agentic AI',
      'Model Context Protocol (MCP)',
      'AI Deployment',
      'Production AI Systems',
    ],
  },
  'Backend Developer': {
    selectedRole: 'Backend Developer',
    coreTopics: [
      'REST API Design & Error Handling',
      'SQL & Relational Database Design',
      'Database Transactions & ACID',
      'JPA & Hibernate ORM',
      'Spring Boot Architecture',
      'Microservices & Distributed Systems',
      'Distributed Caching & Redis',
      'Message Queues & Event Streaming',
      'Java Concurrency & Threads',
      'Authentication, Authorization & JWT',
    ],
    secondaryTopics: [
      'Docker Containerization',
      'System Scalability & Idempotency',
      'Unit & Integration Testing',
    ],
    optionalTopics: ['gRPC Protocols', 'Reactive WebFlux'],
    forbiddenTopics: [
      'RAG', 'Vector Databases', 'Prompt Engineering', 'Agentic AI', 'MCP',
      'React', 'React Hooks', 'JSX', 'CSS', 'HTML', 'Virtual DOM',
    ],
    progression: [
      'Java Core & Memory Management',
      'HashMap & Data Structures',
      'Concurrency & Multithreading',
      'Spring Boot Dependency Injection',
      'REST API Design & Error Handling',
      'SQL, Indexing & Transactions',
      'JPA & Hibernate Performance',
      'Microservices & Redis Caching',
      'Message Queues (Kafka/RabbitMQ)',
      'Security, JWT & OAuth2',
      'System Design & Scalability',
    ],
  },
  'Java Backend Developer': {
    selectedRole: 'Java Backend Developer',
    coreTopics: [
      'JVM Internals & Memory Management',
      'Java Concurrency & Threads',
      'Spring Boot Dependency Injection',
      'REST API Design & Error Handling',
      'JPA & Hibernate ORM',
      'SQL & Database Transactions',
      'Microservices & Distributed Caching',
      'Kafka Event Streaming',
      'Spring Security & JWT',
    ],
    secondaryTopics: [
      'Virtual Threads (Project Loom)',
      'Testcontainers Integration Testing',
      'Docker Containerization',
    ],
    optionalTopics: ['Spring WebFlux'],
    forbiddenTopics: [
      'RAG', 'Vector Databases', 'Prompt Engineering', 'Agentic AI', 'MCP',
      'React', 'React Hooks', 'JSX', 'CSS', 'HTML', 'Virtual DOM',
    ],
    progression: [
      'JVM Internals & Garbage Collection',
      'HashMap Internals & Hashing',
      'Java Concurrency & Multithreading',
      'Spring Boot Dependency Injection',
      'REST API Design & Global Exceptions',
      'SQL Indexing & Transactions',
      'JPA & Hibernate N+1 Problem',
      'Microservices & Redis Caching',
      'Virtual Threads (Project Loom)',
      'Kafka Event Streaming & Idempotency',
      'Spring Security & JWT Filters',
    ],
  },
  'Frontend Developer': {
    selectedRole: 'Frontend Developer',
    coreTopics: [
      'JavaScript Event Loop & Microtasks',
      'React Virtual DOM & Reconciliation',
      'React Hooks & Memoization',
      'State Management (Context/Redux/Zustand)',
      'Browser Rendering Pipeline & Repaint/Reflow',
      'Bundlers (Vite/Webpack) & Code Splitting',
      'TypeScript Advanced Types & Generics',
      'Browser Security (CORS/XSS/CSP)',
      'Core Web Vitals & Performance',
      'Next.js & Server Components (RSC)',
    ],
    secondaryTopics: [
      'WebSockets & Real-time UI',
      'Web Accessibility (WCAG & ARIA)',
      'Progressive Web Apps (PWAs)',
      'Frontend Testing (RTL & Playwright)',
    ],
    optionalTopics: ['Micro-frontends & Module Federation'],
    forbiddenTopics: [
      'RAG', 'Vector Databases', 'Prompt Engineering', 'Agentic AI', 'MCP',
      'Spring Boot', 'JVM Garbage Collection', 'JPA Hibernate', 'SQL Window Functions',
    ],
    progression: [
      'JavaScript Event Loop & Async',
      'React Virtual DOM & Reconciliation',
      'React Hooks & Memoization',
      'State Management Patterns',
      'Browser Rendering Pipeline',
      'Bundlers (Vite vs Webpack)',
      'TypeScript Advanced Types',
      'Browser Security & CORS',
      'Core Web Vitals & Performance',
      'Next.js & Server Components',
      'Frontend Testing & Quality',
    ],
  },
  'Full Stack Developer': {
    selectedRole: 'Full Stack Developer',
    coreTopics: [
      'React Component Architecture & State',
      'REST API Design & Microservices',
      'SQL & Database Data Modeling',
      'Authentication & Authorization (JWT/OAuth)',
      'System Design & Integration',
      'Web Performance & Caching',
      'CI/CD & Cloud Deployment',
    ],
    secondaryTopics: [
      'TypeScript Full Stack Types',
      'Docker Containerization',
    ],
    optionalTopics: ['Serverless Functions'],
    forbiddenTopics: [
      'RAG', 'Vector Databases', 'Prompt Engineering', 'Agentic AI', 'MCP',
    ],
    progression: [
      'Frontend State & Component Design',
      'REST API & Backend Controllers',
      'Database Schema & SQL Optimization',
      'Authentication & Security',
      'Full Stack System Integration',
      'Caching & Deployment Pipelines',
    ],
  },
};

export function getDomainProfile(role: string): DomainProfile {
  return (
    DOMAIN_PROFILES[role] ||
    (role.includes('Backend')
      ? DOMAIN_PROFILES['Backend Developer']
      : role.includes('Frontend')
      ? DOMAIN_PROFILES['Frontend Developer']
      : DOMAIN_PROFILES['AI Engineer'])
  );
}

export function computeDomainRelevanceScore(questionText: string, role: string): number {
  const profile = getDomainProfile(role);
  const lowerQ = questionText.toLowerCase();

  // Check forbidden topics
  for (const forbidden of profile.forbiddenTopics) {
    if (lowerQ.includes(forbidden.toLowerCase())) {
      return 1;
    }
  }

  // Check core topics
  for (const core of profile.coreTopics) {
    const coreWords = core.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (coreWords.some((w) => lowerQ.includes(w))) {
      return 10;
    }
  }

  // Check secondary topics
  for (const secondary of profile.secondaryTopics) {
    const secWords = secondary.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (secWords.some((w) => lowerQ.includes(w))) {
      return 8;
    }
  }

  return 4;
}

export interface CurriculumTopic {
  day: number;
  topic: string;
  module: string;
  difficulty: 'easy' | 'medium' | 'hard';
  focus: string;
  keyConcepts: string[];
}

export interface CurriculumArea {
  area: string;
  focus: string;
  difficulty: 'easy' | 'medium' | 'hard';
  day?: number;
  module?: string;
}

export const AI_COHORT_CURRICULUM: CurriculumTopic[] = [
  // Module 1: AI Foundations & Prompt Engineering (Days 1–7)
  { day: 1, topic: 'LLM Architecture & Tokenization', module: 'AI Foundations', difficulty: 'easy', focus: 'Tokens, Context Windows, BPE', keyConcepts: ['tokenization', 'tokens', 'bpe', 'transformer', 'context window', 'attention'] },
  { day: 2, topic: 'System Instructions & Role Prompting', module: 'AI Foundations', difficulty: 'easy', focus: 'System Prompts, System Directives, Persona', keyConcepts: ['system prompt', 'instructions', 'persona', 'role', 'steering', 'formatting'] },
  { day: 3, topic: 'Few-Shot Prompting & Chain-of-Thought', module: 'AI Foundations', difficulty: 'easy', focus: 'In-Context Examples, CoT Reasoning', keyConcepts: ['few-shot', 'chain of thought', 'cot', 'examples', 'reasoning', 'step-by-step'] },
  { day: 4, topic: 'Structured Data Output & JSON Enforcement', module: 'AI Foundations', difficulty: 'medium', focus: 'JSON Mode, Pydantic, Zod Schemas', keyConcepts: ['structured output', 'json mode', 'schema', 'zod', 'pydantic', 'parsing'] },
  { day: 5, topic: 'Context Windows & Multi-Turn State', module: 'AI Foundations', difficulty: 'medium', focus: 'Window Truncation, History Summarization', keyConcepts: ['context window', 'multi-turn', 'truncation', 'summarization', 'chat history'] },
  { day: 6, topic: 'Embeddings & Vector Representations', module: 'AI Foundations', difficulty: 'medium', focus: 'Dense Vectors, Embedding Models, Similarity', keyConcepts: ['embeddings', 'dense vectors', 'cosine similarity', 'dot product', 'dimensions'] },
  { day: 7, topic: 'Vector Databases & Similarity Search', module: 'AI Foundations', difficulty: 'medium', focus: 'ANN, HNSW, Pinecone, ChromaDB, Qdrant', keyConcepts: ['vector db', 'hnsw', 'ann', 'chroma', 'pinecone', 'similarity search', 'indexing'] },

  // Module 2: RAG & Knowledge Retrieval (Days 8–15)
  { day: 8, topic: 'Chunking Strategies & Ingestion', module: 'RAG & Retrieval', difficulty: 'medium', focus: 'Semantic Chunking, Fixed Size, Overlap', keyConcepts: ['chunking', 'overlap', 'semantic chunking', 'fixed size', 'ingestion', 'tokens'] },
  { day: 9, topic: 'Dense Retrieval vs Sparse Retrieval', module: 'RAG & Retrieval', difficulty: 'medium', focus: 'BM25, Hybrid Search, Keyword vs Vector', keyConcepts: ['dense retrieval', 'sparse retrieval', 'bm25', 'keyword search', 'lexical'] },
  { day: 10, topic: 'Hybrid Search & Reciprocal Rank Fusion', module: 'RAG & Retrieval', difficulty: 'hard', focus: 'RRF, Score Merging, Lexical + Vector', keyConcepts: ['hybrid search', 'rrf', 'reciprocal rank fusion', 'ranking', 'scoring'] },
  { day: 11, topic: 'Document Ingestion & Metadata Filtering', module: 'RAG & Retrieval', difficulty: 'medium', focus: 'Metadata Tags, Filters, Structured Search', keyConcepts: ['metadata filtering', 'ingestion', 'payload filters', 'tags', 'structured search'] },
  { day: 12, topic: 'Advanced RAG: Query Expansion & HyDE', module: 'RAG & Retrieval', difficulty: 'hard', focus: 'HyDE, Multi-Query, Query Rewriting', keyConcepts: ['advanced rag', 'hyde', 'query expansion', 'query rewriting', 'hypothetical document'] },
  { day: 13, topic: 'RAG Reranking & Cross-Encoders', module: 'RAG & Retrieval', difficulty: 'hard', focus: 'Cross-Encoders, Cohere Rerank, Precision', keyConcepts: ['reranking', 'cross-encoder', 'precision', 'relevance score', 'cohere rerank'] },
  { day: 14, topic: 'RAG Evaluation Frameworks', module: 'RAG & Retrieval', difficulty: 'hard', focus: 'Ragas, Context Precision, Faithfulness', keyConcepts: ['ragas', 'evaluation', 'context precision', 'faithfulness', 'hallucination'] },
  { day: 15, topic: 'Fine-Tuning vs RAG Trade-offs', module: 'RAG & Retrieval', difficulty: 'hard', focus: 'Parametric Knowledge vs In-Context Retrieval', keyConcepts: ['fine-tuning', 'rag tradeoffs', 'parametric knowledge', 'lora', 'domain adaptation'] },

  // Module 3: Agentic AI & Memory Systems (Days 16–22)
  { day: 16, topic: 'Agent Architectures & ReAct Pattern', module: 'Agentic AI', difficulty: 'medium', focus: 'Reasoning + Acting, Loop Execution', keyConcepts: ['agent architecture', 'react pattern', 'reasoning', 'action loop', 'thought'] },
  { day: 17, topic: 'Tool Use & Function Calling', module: 'Agentic AI', difficulty: 'medium', focus: 'Function Definitions, Tool Routing, Exec', keyConcepts: ['tool use', 'function calling', 'tool execution', 'json args', 'tool output'] },
  { day: 18, topic: 'Agentic Memory & Epistemic State', module: 'Agentic AI', difficulty: 'hard', focus: 'Short-Term, Long-Term, Working Memory', keyConcepts: ['agentic memory', 'working memory', 'short term', 'long term', 'epistemic'] },
  { day: 19, topic: 'Multi-Agent Systems & Collaboration', module: 'Agentic AI', difficulty: 'hard', focus: 'Supervisor Agents, Specialist Agents', keyConcepts: ['multi-agent', 'collaboration', 'supervisor', 'delegation', 'specialist'] },
  { day: 20, topic: 'Human-in-the-Loop & Interactive Agents', module: 'Agentic AI', difficulty: 'medium', focus: 'Approval Steps, Breakpoints, Guidance', keyConcepts: ['human in the loop', 'approval', 'interactivity', 'breakpoints', 'steering'] },
  { day: 21, topic: 'Agent State Management & Workflows', module: 'Agentic AI', difficulty: 'hard', focus: 'LangGraph, Directed Graphs, State Persistence', keyConcepts: ['state management', 'langgraph', 'state machine', 'directed graph', 'checkpoints'] },
  { day: 22, topic: 'Autonomous Error Recovery & Self-Correction', module: 'Agentic AI', difficulty: 'hard', focus: 'Self-Reflection, Exception Handling, Retries', keyConcepts: ['error recovery', 'self-correction', 'reflection', 'retry loop', 'fallback'] },

  // Module 4: Model Context Protocol (MCP) & System Integration (Days 23–27)
  { day: 23, topic: 'Model Context Protocol (MCP) Core Concepts', module: 'Model Context Protocol', difficulty: 'hard', focus: 'MCP Standard, Client-Server Protocol', keyConcepts: ['mcp', 'model context protocol', 'protocol', 'mcp server', 'mcp client'] },
  { day: 24, topic: 'MCP Server Implementation & Tools', module: 'Model Context Protocol', difficulty: 'hard', focus: 'Exposing Tools, Command Handlers', keyConcepts: ['mcp server', 'tool handlers', 'rpc', 'json-rpc', 'mcp tools'] },
  { day: 25, topic: 'MCP Resources & Dynamic Schemas', module: 'Model Context Protocol', difficulty: 'hard', focus: 'Resource URIs, Data Schemas, Prompts', keyConcepts: ['mcp resources', 'resource uris', 'prompts', 'dynamic schemas', 'mcp data'] },
  { day: 26, topic: 'MCP Security & Transport Layer', module: 'Model Context Protocol', difficulty: 'hard', focus: 'stdio, SSE, Auth Controls, Transport', keyConcepts: ['mcp security', 'stdio transport', 'sse', 'authentication', 'permissions'] },
  { day: 27, topic: 'System Interoperability & Integration', module: 'Model Context Protocol', difficulty: 'medium', focus: 'Client Integration, Multi-Server Bridges', keyConcepts: ['interoperability', 'multi-server', 'integration', 'bridges', 'client connection'] },

  // Module 5: Production AI Systems & Deployment (Days 28–31)
  { day: 28, topic: 'LLM Serving & Local Inference Engines', module: 'Production AI', difficulty: 'medium', focus: 'vLLM, Ollama, Serving Frameworks, Quantization', keyConcepts: ['vllm', 'ollama', 'serving', 'quantization', 'inference engine', 'gguf'] },
  { day: 29, topic: 'AI Security: Prompt Injection & Guardrails', module: 'Production AI', difficulty: 'hard', focus: 'Jailbreaks, Output Filtering, Guardrails AI', keyConcepts: ['prompt injection', 'guardrails', 'jailbreak', 'output filtering', 'ai security'] },
  { day: 30, topic: 'Observability, Tracing & Cost Optimization', module: 'Production AI', difficulty: 'hard', focus: 'LangSmith, OpenTelemetry, Token Tracking', keyConcepts: ['observability', 'tracing', 'langsmith', 'opentelemetry', 'cost optimization', 'latency'] },
  { day: 31, topic: 'Production AI System Evaluation & Hiring Roadmap', module: 'Production AI', difficulty: 'hard', focus: 'End-to-End System Benchmark & Scorecards', keyConcepts: ['evaluations', 'benchmarking', 'scorecards', 'production readiness', 'hiring roadmap'] },
];

export const ROLE_SPECIFIC_TOPICS: Record<string, CurriculumTopic[]> = {
  'Java Backend Developer': [
    { day: 1, topic: 'Java Core & JVM Internals', module: 'Java Backend', difficulty: 'easy', focus: 'Memory Management, Garbage Collection, Heap/Stack', keyConcepts: ['jvm', 'garbage collection', 'heap', 'stack', 'memory', 'jdk', 'jre'] },
    { day: 2, topic: 'HashMap Internals & Hashing Collisions', module: 'Java Backend', difficulty: 'easy', focus: 'HashMap, Bucket Index, Collisions, Treeify', keyConcepts: ['hashmap', 'hashing', 'bucket', 'collision', 'equals', 'hashcode', 'entry'] },
    { day: 3, topic: 'Java Concurrency & Thread Safety', module: 'Java Backend', difficulty: 'medium', focus: 'Multithreading, Synchronized, Volatile, ExecutorService', keyConcepts: ['concurrency', 'thread', 'synchronized', 'volatile', 'executorservice', 'deadlock', 'atomic'] },
    { day: 4, topic: 'Spring Boot Dependency Injection', module: 'Java Backend', difficulty: 'easy', focus: 'IoC Container, Constructor Injection vs Field Injection', keyConcepts: ['spring boot', 'dependency injection', 'ioc', 'bean', 'autowired', 'constructor'] },
    { day: 5, topic: 'REST API Design & Error Handling', module: 'Java Backend', difficulty: 'medium', focus: 'Controller, ResponseEntity, ExceptionHandler, DTOs', keyConcepts: ['rest api', 'spring mvc', 'controller', 'exceptionhandler', 'responseentity', 'http status'] },
    { day: 6, topic: 'JPA & Hibernate Performance Tuning', module: 'Java Backend', difficulty: 'hard', focus: 'N+1 Problem, Lazy Loading, Query Caching', keyConcepts: ['jpa', 'hibernate', 'n+1', 'lazy loading', 'eager', 'entitymanager', 'jpql'] },
    { day: 7, topic: 'Database Transactions & ACID Isolation', module: 'Java Backend', difficulty: 'hard', focus: 'Transactional Annotation, Propagation, Isolation Levels', keyConcepts: ['transactional', 'acid', 'isolation level', 'propagation', 'rollback', 'dirty read'] },
    { day: 8, topic: 'Microservices & Distributed Caching', module: 'Java Backend', difficulty: 'hard', focus: 'Redis Caching, Idempotency, Circuit Breakers', keyConcepts: ['redis', 'microservices', 'caching', 'resilience4j', 'circuit breaker', 'idempotency'] },
  ],
  'Frontend Developer': [
    { day: 1, topic: 'JavaScript Async Event Loop & Microtasks', module: 'Frontend Core', difficulty: 'easy', focus: 'Event Loop, Promises, Async/Await, Microtask Queue', keyConcepts: ['event loop', 'async', 'await', 'promise', 'microtask', 'call stack', 'callback'] },
    { day: 2, topic: 'React Virtual DOM & Reconciliation', module: 'Frontend Core', difficulty: 'easy', focus: 'Virtual DOM, Fiber Architecture, Diffing Algorithm', keyConcepts: ['virtual dom', 'reconciliation', 'diffing', 'fiber', 'render', 'props', 'state'] },
    { day: 3, topic: 'React Hooks & Performance Optimization', module: 'Frontend Core', difficulty: 'medium', focus: 'useEffect, useMemo, useCallback, Dependency Arrays', keyConcepts: ['useeffect', 'usememo', 'usecallback', 'hooks', 'memoization', 're-render'] },
    { day: 4, topic: 'State Management Patterns (Context/Redux)', module: 'Frontend Core', difficulty: 'medium', focus: 'Context API, Redux Toolkit, Zustand, Flux', keyConcepts: ['state management', 'context api', 'redux', 'zustand', 'store', 'action', 'reducer'] },
    { day: 5, topic: 'Browser Rendering Pipeline & Repaint/Reflow', module: 'Frontend Core', difficulty: 'hard', focus: 'DOM, CSSOM, Render Tree, Layout Reflow, Compositing', keyConcepts: ['rendering pipeline', 'reflow', 'repaint', 'compositing', 'dom', 'cssom', 'performance'] },
    { day: 6, topic: 'Modern Bundlers (Vite vs Webpack)', module: 'Frontend Core', difficulty: 'hard', focus: 'Code Splitting, Tree Shaking, Dynamic Imports', keyConcepts: ['vite', 'webpack', 'tree shaking', 'code splitting', 'bundle', 'esbuild'] },
  ],
  'Data Analyst': [
    { day: 1, topic: 'SQL Queries, Joins & Aggregations', module: 'Data Analytics', difficulty: 'easy', focus: 'SELECT, INNER/LEFT JOIN, GROUP BY, HAVING', keyConcepts: ['sql', 'join', 'group by', 'having', 'aggregate', 'where', 'select'] },
    { day: 2, topic: 'SQL Window Functions & Subqueries', module: 'Data Analytics', difficulty: 'medium', focus: 'ROW_NUMBER, RANK, DENSE_RANK, OVER Partition', keyConcepts: ['window function', 'rank', 'dense_rank', 'partition by', 'lead', 'lag', 'subquery'] },
    { day: 3, topic: 'Data Wrangling with Python & Pandas', module: 'Data Analytics', difficulty: 'medium', focus: 'DataFrame, Missing Values, Groupby, Pivot Tables', keyConcepts: ['pandas', 'dataframe', 'fillna', 'groupby', 'pivot', 'numpy', 'data cleaning'] },
    { day: 4, topic: 'Statistical Analysis & Hypothesis Testing', module: 'Data Analytics', difficulty: 'hard', focus: 'Mean, Median, Standard Deviation, P-Value, T-Test', keyConcepts: ['statistics', 'hypothesis testing', 'p-value', 't-test', 'correlation', 'std dev'] },
  ],
  'DevOps Engineer': [
    { day: 1, topic: 'Docker Containerization & Multi-Stage Builds', module: 'DevOps & Infra', difficulty: 'easy', focus: 'Dockerfiles, Images vs Containers, Layers', keyConcepts: ['docker', 'container', 'dockerfile', 'multi-stage', 'image', 'volume'] },
    { day: 2, topic: 'Kubernetes Orchestration & Deployments', module: 'DevOps & Infra', difficulty: 'medium', focus: 'Pods, Services, Deployments, Ingress, ConfigMaps', keyConcepts: ['kubernetes', 'k8s', 'pod', 'deployment', 'service', 'ingress', 'configmap'] },
    { day: 3, topic: 'CI/CD Pipelines & Zero-Downtime Rollouts', module: 'DevOps & Infra', difficulty: 'hard', focus: 'GitHub Actions, Blue-Green, Canary Deployments', keyConcepts: ['ci/cd', 'github actions', 'canary', 'blue-green', 'pipeline', 'automation'] },
  ],
};

export function getCurriculumAreas(candidate: Record<string, any> = {}): CurriculumArea[] {
  const role = String(candidate.role ?? 'AI Engineer');
  const experienceLevel = String(candidate.experienceLevel ?? 'Junior');
  const targetDifficulty: 'easy' | 'medium' | 'hard' =
    experienceLevel === 'Fresher' ? 'easy' : experienceLevel === 'Senior' ? 'hard' : 'medium';

  const roleTopics = ROLE_SPECIFIC_TOPICS[role] ?? AI_COHORT_CURRICULUM;
  let selected = roleTopics.filter((t) => t.difficulty === targetDifficulty);
  if (selected.length === 0) {
    selected = roleTopics;
  }

  return selected.map((t) => ({
    area: t.topic,
    focus: t.focus,
    difficulty: t.difficulty,
    day: t.day,
    module: t.module,
  }));
}



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
];

const frontendQuestionBank: QuestionItem[] = [
  { day: 1, topic: 'JS Event Loop & Async', module: 'Frontend Core', difficulty: 'easy', text: 'Explain the JavaScript Event Loop, Call Stack, and Microtask queue (Promises) versus Macrotask queue (setTimeout).', keyConcepts: ['event loop', 'async', 'promise', 'microtask', 'call stack'] },
  { day: 2, topic: 'React Virtual DOM', module: 'React Internals', difficulty: 'easy', text: 'How does the React Virtual DOM work under the hood, and how does reconciliation/diffing optimize browser renders?', keyConcepts: ['virtual dom', 'reconciliation', 'diffing', 'fiber', 'render'] },
  { day: 3, topic: 'React Hooks & Memoization', module: 'React Hooks', difficulty: 'medium', text: 'How do useEffect, useMemo, and useCallback work? When should you avoid over-using memoization in React?', keyConcepts: ['useeffect', 'usememo', 'usecallback', 'hooks', 'memoization'] },
  { day: 4, topic: 'State Management (Context/Redux)', module: 'State Architecture', difficulty: 'medium', text: 'Compare Context API with Redux Toolkit / Zustand. What are the trade-offs regarding component re-renders?', keyConcepts: ['state management', 'context api', 'redux', 'zustand', 're-render'] },
  { day: 5, topic: 'Browser Rendering Pipeline', module: 'Performance', difficulty: 'hard', text: 'Walk through the browser rendering pipeline (DOM, CSSOM, Render Tree, Layout, Paint). What triggers reflow versus repaint?', keyConcepts: ['rendering pipeline', 'reflow', 'repaint', 'dom', 'cssom'] },
  { day: 6, topic: 'Bundlers (Vite vs Webpack)', module: 'Tooling', difficulty: 'hard', text: 'How do modern bundlers like Vite use native ES modules and perform tree shaking, code splitting, and dynamic imports?', keyConcepts: ['vite', 'webpack', 'tree shaking', 'code splitting', 'bundle'] },
];

const dataAnalystQuestionBank: QuestionItem[] = [
  { day: 1, topic: 'SQL Joins & Aggregations', module: 'SQL Analytics', difficulty: 'easy', text: 'Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN in SQL, and how GROUP BY filters with HAVING.', keyConcepts: ['sql', 'join', 'group by', 'having', 'aggregate'] },
  { day: 2, topic: 'SQL Window Functions', module: 'SQL Analytics', difficulty: 'medium', text: 'How do SQL Window Functions like ROW_NUMBER(), RANK(), and DENSE_RANK() work with OVER (PARTITION BY)?', keyConcepts: ['window function', 'rank', 'dense_rank', 'partition by', 'over'] },
  { day: 3, topic: 'Pandas Data Wrangling', module: 'Python Data', difficulty: 'medium', text: 'How do you handle missing values, group data, and perform pivot operations efficiently in Python Pandas DataFrames?', keyConcepts: ['pandas', 'dataframe', 'fillna', 'groupby', 'pivot'] },
  { day: 4, topic: 'Statistical Analysis', module: 'Statistics', difficulty: 'hard', text: 'What is a p-value in statistical hypothesis testing, and how do you determine statistical significance during A/B testing?', keyConcepts: ['statistics', 'p-value', 'hypothesis testing', 'a/b testing', 'correlation'] },
];

const devopsQuestionBank: QuestionItem[] = [
  { day: 1, topic: 'Docker Containerization', module: 'Containers', difficulty: 'easy', text: 'What is the difference between Docker images and containers, and how do multi-stage Docker builds reduce image size?', keyConcepts: ['docker', 'container', 'dockerfile', 'multi-stage', 'image'] },
  { day: 2, topic: 'Kubernetes Orchestration', module: 'Orchestration', difficulty: 'medium', text: 'Explain Kubernetes Pods, Deployments, and Services. How does Ingress route traffic to backend pods?', keyConcepts: ['kubernetes', 'k8s', 'pod', 'deployment', 'service'] },
  { day: 3, topic: 'CI/CD & Zero-Downtime Rollouts', module: 'CI/CD Pipelines', difficulty: 'hard', text: 'How do you design an automated CI/CD pipeline using Canary or Blue-Green deployment strategies for zero downtime?', keyConcepts: ['ci/cd', 'canary', 'blue-green', 'pipeline', 'automation'] },
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

  // Select appropriate question bank for candidate's selected role
  let roleBank = cohortQuestionBank;
  if (role === 'Java Backend Developer' || (role === 'Backend Developer' && !role.includes('AI'))) {
    roleBank = javaBackendQuestionBank;
  } else if (role === 'Frontend Developer') {
    roleBank = frontendQuestionBank;
  } else if (role === 'Data Analyst') {
    roleBank = dataAnalystQuestionBank;
  } else if (role === 'DevOps Engineer') {
    roleBank = devopsQuestionBank;
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
      `You brought up a valid point about ${matchedConcept}. Let's elaborate on the missing architectural aspect: ${chosen.text}`,
      `That touches on the basics of ${matchedConcept}. Can you expand on how this functions under the hood: ${chosen.text}`,
      `Good start with ${matchedConcept}. Let's address the key concept in more detail: ${chosen.text}`,
    ];

    const incorrectPhrases = [
      `Let me clarify ${matchedConcept}: ${chosen.text}`,
      `Not quite. Let's revisit ${matchedConcept} from a foundational perspective: ${chosen.text}`,
      `That's a common misconception regarding ${matchedConcept}. Let's test fundamental understanding: ${chosen.text}`,
      `Let's break down ${matchedConcept} step by step: ${chosen.text}`,
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
    questionId: `q-${role.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
    text: questionText,
    topic: `${chosen.topic}`,
    difficulty: chosen.difficulty,
  };
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
      const wordCount = answerText.split(/\s+/).filter(Boolean).length;

      // 1. Strict Meaningless & Anti-Gaming Check
      const badCheck = isMeaninglessOrInjection(answerText);
      if (badCheck.isBad) {
        return {
          correctness: 0,
          relevance: 0,
          technicalDepth: 0,
          communication: 10,
          strengths: [],
          weaknesses: [`Evaluation Failed: ${badCheck.reason}. Response provided zero technical substance.`],
          missingConcepts: ['Valid technical explanation addressing the question prompt'],
          assessment: `ZERO SCORE AWARDED: ${badCheck.reason}. Candidate answer failed technical evaluation guidelines.`,
        } as AIEvaluation;
      }

      // 2. Identify Question-Specific Key Technical Concepts
      const currentQuestionItem = cohortQuestionBank.concat(javaBackendQuestionBank, frontendQuestionBank, dataAnalystQuestionBank, devopsQuestionBank).find((q) => questionText.includes(q.topic.toLowerCase()) || questionText.includes(q.text.toLowerCase().slice(0, 30)));
      const requiredConcepts = currentQuestionItem?.keyConcepts ?? ['system', 'architecture', 'data', 'rag', 'vector', 'model', 'agent', 'mcp', 'context', 'token'];

      const lowerAnswer = answerText.toLowerCase();
      const matchedConcepts = requiredConcepts.filter((concept) => lowerAnswer.includes(concept));

      let correctnessScore = 0;
      let relevanceScore = 0;
      let technicalDepthScore = 0;
      let communicationScore = 0;

      // If zero cohort concepts match and word count is generic
      if (matchedConcepts.length === 0) {
        correctnessScore = 15;
        relevanceScore = 20;
        technicalDepthScore = 10;
        communicationScore = Math.min(40, wordCount * 2);
      } else {
        correctnessScore = Math.min(98, 70 + matchedConcepts.length * 10 + Math.min(10, wordCount));
        relevanceScore = Math.min(98, 80 + matchedConcepts.length * 6);
        technicalDepthScore = Math.min(98, 65 + matchedConcepts.length * 10);
        communicationScore = Math.min(98, 75 + Math.min(20, wordCount * 2));
      }

      const isCorrect = correctnessScore >= 75;
      const isPartial = correctnessScore >= 50 && correctnessScore < 75;

      const strengths = matchedConcepts.length > 0
        ? [`Correctly explained key technical concepts: ${matchedConcepts.join(', ')}`]
        : ['Provided clear communication structure'];

      // DO NOT invent weaknesses for correct answers!
      const weaknesses = isCorrect
        ? []
        : matchedConcepts.length === 0
        ? [`Answer lacked required technical concepts (${requiredConcepts.slice(0, 3).join(', ')})`]
        : [`Answer could elaborate deeper on production trade-offs`];

      const missingConcepts = isCorrect
        ? []
        : requiredConcepts.filter((c) => !matchedConcepts.includes(c));

      let assessmentText = `Correct answer. Candidate demonstrated solid technical understanding of ${matchedConcepts.join(', ')}.`;
      if (isPartial) {
        assessmentText = `Partially correct. Candidate addressed ${matchedConcepts.join(', ')}, but missed ${missingConcepts.join(', ')}.`;
      } else if (!isCorrect && !isPartial) {
        assessmentText = `Incorrect response. Answer failed to address required technical concepts (${requiredConcepts.join(', ')}).`;
      }

      return {
        correctness: correctnessScore,
        relevance: relevanceScore,
        technicalDepth: technicalDepthScore,
        communication: communicationScore,
        strengths,
        weaknesses,
        missingConcepts,
        assessment: assessmentText,
      } as AIEvaluation;
    },

    async generateFeedback(context) {
      const evaluations: AIEvaluation[] = context.evaluations || [];
      const history = context.history || [];
      const candidateMsgs = history.filter((m: any) => m.sender === 'candidate');

      let totalOverall = 0;
      let totalTech = 0;
      let totalComm = 0;

      if (evaluations.length > 0) {
        evaluations.forEach((e) => {
          const qScore = Math.round((e.correctness + e.relevance + e.technicalDepth + e.communication) / 4);
          totalOverall += qScore;
          totalTech += Math.round((e.correctness + e.technicalDepth) / 2);
          totalComm += Math.round((e.relevance + e.communication) / 2);
        });
      }

      const avgScore = evaluations.length > 0 ? Math.round(totalOverall / evaluations.length) : 0;
      const avgTech = evaluations.length > 0 ? Math.round(totalTech / evaluations.length) : 0;
      const avgComm = evaluations.length > 0 ? Math.round(totalComm / evaluations.length) : 0;
      const role = context.candidate?.role ?? 'AI Engineer';

      const allStrengths = Array.from(new Set(evaluations.flatMap((e) => e.strengths || []))).filter(Boolean);
      const allWeaknesses = Array.from(new Set(evaluations.flatMap((e) => e.weaknesses || []))).filter(Boolean);

      return {
        overallScore: avgScore,
        technicalScore: avgTech,
        communicationScore: avgComm,
        problemSolvingScore: Math.max(0, Math.min(99, avgScore)),
        strengths: allStrengths.length > 0 ? allStrengths : ['Completed 31-Day AI Cohort Interview Session'],
        weaknesses: allWeaknesses.length > 0 ? allWeaknesses : ['Submitted zero-score or irrelevant answers during technical evaluation'],
        improvementAreas: [
          `Review 31-Day AI Cohort curriculum modules (RAG, Vector Search, MCP, Agentic Workflows)`,
          'Ensure answers directly include core technical concepts rather than generic responses',
          'Practice structured technical reasoning with concrete system architecture examples',
        ],
        recommendedTopics: ['RAG Architectures & Vector DBs', 'Model Context Protocol (MCP)', 'Agentic AI & LangGraph', 'AI Security & Guardrails'],
        summary: `31-Day AI Cohort Assessment Report: Candidate evaluated for target role ${role} across ${candidateMsgs.length} technical questions. Overall Score: ${avgScore}/100. ${
          avgScore >= 70
            ? 'Candidate demonstrated verified technical mastery across AI Cohort topics.'
            : 'Candidate submitted incomplete, incorrect, or unverified responses. Review core AI Cohort study areas.'
        }`,
      } as AIFeedback;
    },
  };
}

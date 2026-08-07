import { InterviewConfig, InterviewFullSession, SessionQuestion } from '../types/interview';
import { startInterview as apiStart } from './api';

const STORAGE_KEY = 'aiInterviewFullSession';

const FAKE_QUESTIONS_POOL = [
  'Explain the difference between REST API and GraphQL.',
  'How would you design a scalable notification system?',
  'Describe a time you resolved a production incident.',
  'How do you ensure accessibility in a frontend application?',
  'What are the benefits of containerization for CI/CD?',
  'How do you approach cross-browser testing?',
  'Describe your approach to component-driven development.',
  'How do you measure and improve frontend performance?',
  'Explain a time you mentored a junior engineer.',
  'What is your process for reviewing PRs and giving feedback?'
];

const randomToken = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
};

export function generateSessionId(): string {
  const year = new Date().getFullYear();
  return `INT-${year}-${randomToken(6)}`;
}

function createQuestions(count: number): SessionQuestion[] {
  const questions: SessionQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const text = FAKE_QUESTIONS_POOL[i % FAKE_QUESTIONS_POOL.length];
    questions.push({ id: `q-${i + 1}`, question: text, completed: false, answer: null });
  }
  return questions;
}

export async function createInterviewSession(config: InterviewConfig): Promise<InterviewFullSession> {
  // Attempt to use the API for initial session metadata (keeps future LLM integration simple)
  try {
    const apiResp = await apiStart(config);
    const sessionId = generateSessionId();
    const total = apiResp.totalQuestions || config.questionCount;
    const questions = createQuestions(total);

    const session: InterviewFullSession = {
      sessionId,
      role: config.role,
      experienceLevel: config.experienceLevel,
      interviewType: config.interviewType,
      questionCount: total,
      currentQuestionIndex: 0,
      questions,
      answers: {},
      createdAt: new Date().toISOString(),
    };

    // persist
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {}

    return session;
  } catch (err) {
    // fallback local-only session creation
    const sessionId = generateSessionId();
    const total = config.questionCount;
    const questions = createQuestions(total);
    const session: InterviewFullSession = {
      sessionId,
      role: config.role,
      experienceLevel: config.experienceLevel,
      interviewType: config.interviewType,
      questionCount: total,
      currentQuestionIndex: 0,
      questions,
      answers: {},
      createdAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {}
    return session;
  }
}

export function loadInterviewSession(): InterviewFullSession | null {
  try {
    const s = window.localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s) as InterviewFullSession;
  } catch {
    return null;
  }
}

export function saveInterviewSession(session: InterviewFullSession) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

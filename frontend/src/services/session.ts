import { InterviewConfig, InterviewFullSession } from '../types/interview';
import { startInterview as apiStart } from './api';

const STORAGE_KEY = 'aiInterviewFullSession';

export function generateSessionId(): string {
  const year = new Date().getFullYear();
  const randomToken = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let out = '';
    for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return out;
  };

  return `INT-${year}-${randomToken(6)}`;
}

export async function createInterviewSession(config: InterviewConfig): Promise<InterviewFullSession> {
  const apiResp = await apiStart(config);
  const sessionId = apiResp.sessionId || generateSessionId();
  const total = apiResp.totalQuestions || config.questionCount;
  const firstQuestion = apiResp.firstQuestion;

  const session: InterviewFullSession = {
    sessionId,
    role: config.role,
    experienceLevel: config.experienceLevel,
    interviewType: config.interviewType,
    questionCount: total,
    currentQuestionIndex: 0,
    questions: [
      {
        id: firstQuestion?.questionId ?? 'q-1',
        question: firstQuestion?.text ?? '',
        completed: false,
        answer: null,
      },
    ],
    answers: {},
    createdAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}

  return session;
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

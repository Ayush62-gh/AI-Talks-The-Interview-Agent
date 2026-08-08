import { InterviewSession, CandidatePayload } from '../models/interview.types.js';
import { saveSession, getSession } from '../store/interview.store.js';
import { getAIProvider } from '../providers/index.js';

const ai = getAIProvider();

export function generateSessionId(): string {
  return `S-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSession(candidate: CandidatePayload): InterviewSession {
  const sessionId = generateSessionId();
  const session: InterviewSession = {
    sessionId,
    candidate,
    currentQuestion: null,
    questionCount: candidate.questionCount,
    progress: 0,
    messages: [],
    status: 'active',
    feedback: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveSession(session);
  return session;
}

export function submitAnswer(sessionId: string, message: string) {
  const s = getSession(sessionId);
  if (!s) return null;
  s.messages.push({ sender: 'candidate', text: message, timestamp: new Date().toISOString() });
  s.updatedAt = new Date().toISOString();
  saveSession(s);
  return s;
}

export function getFeedback(sessionId: string) {
  const s = getSession(sessionId);
  if (!s) return null;
  return s.feedback ?? null;
}

export async function generateFirstQuestion(sessionId: string) {
  const s = getSession(sessionId);
  if (!s) return null;
  // Build context for AI
  const context = {
    candidate: s.candidate,
    progress: s.progress,
    questionCount: s.questionCount,
    history: s.messages,
  };

  const q = await ai.generateQuestion(context);
  // store as currentQuestion and also push an ai message
  s.currentQuestion = { questionId: q.questionId, question: q.text, answer: null, completed: false } as any;
  s.messages.push({ sender: 'ai', text: q.text, timestamp: new Date().toISOString() });
  s.updatedAt = new Date().toISOString();
  saveSession(s);
  return q;
}

export async function evaluateAndNext(sessionId: string, answer: string) {
  const s = getSession(sessionId);
  if (!s) return { error: 'SESSION_NOT_FOUND' } as any;
  // append candidate answer
  s.messages.push({ sender: 'candidate', text: answer, timestamp: new Date().toISOString() });

  const evalCtx = {
    candidate: s.candidate,
    question: s.currentQuestion,
    answer,
    history: s.messages,
    progress: s.progress,
  };

  const evaluation = await ai.evaluateAnswer(evalCtx);
  // store evaluation in session
  (s as any).lastEvaluation = evaluation;
  s.progress = Math.min(s.questionCount, s.progress + 1);

  // decide completion
  if (s.progress >= s.questionCount) {
    s.status = 'completed';
    // generate final feedback
    const fb = await ai.generateFeedback({ candidate: s.candidate, history: s.messages, evaluations: (s as any).lastEvaluation });
    s.feedback = fb as any;
    saveSession(s);
    return { done: true, feedback: fb };
  }

  // generate next question
  const nextQ = await ai.generateQuestion({ candidate: s.candidate, progress: s.progress, history: s.messages });
  s.currentQuestion = { questionId: nextQ.questionId, question: nextQ.text, answer: null, completed: false } as any;
  s.messages.push({ sender: 'ai', text: nextQ.text, timestamp: new Date().toISOString() });
  saveSession(s);

  return { done: false, nextQuestion: nextQ, evaluation };
}

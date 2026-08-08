import { InterviewSession } from '../models/interview.types.js';

const sessions = new Map<string, InterviewSession>();

export function saveSession(session: InterviewSession) {
  sessions.set(session.sessionId, session);
}

export function getSession(sessionId: string): InterviewSession | undefined {
  return sessions.get(sessionId);
}

export function hasSession(sessionId: string): boolean {
  return sessions.has(sessionId);
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export function listSessions(): InterviewSession[] {
  return Array.from(sessions.values());
}

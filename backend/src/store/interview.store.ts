import { InterviewSession } from '../models/interview.types.js';
import { deleteSessionRecord, getSessionRecord, hasSessionRecord, listSessionRecords, saveSessionRecord } from '../repositories/interview.repository.js';

export function saveSession(session: InterviewSession) {
  return saveSessionRecord(session);
}

export function getSession(sessionId: string): InterviewSession | undefined {
  return getSessionRecord(sessionId);
}

export function hasSession(sessionId: string): boolean {
  return hasSessionRecord(sessionId);
}

export function deleteSession(sessionId: string): boolean {
  return deleteSessionRecord(sessionId);
}

export function listSessions(): InterviewSession[] {
  return listSessionRecords();
}

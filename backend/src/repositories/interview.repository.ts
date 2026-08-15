import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { InterviewSession } from '../models/interview.types.js';

interface RepositoryFile {
  sessions: Record<string, InterviewSession>;
}

function getDataPaths() {
  const isVercel = Boolean(process.env.VERCEL);
  const dataDir = isVercel ? '/tmp/data' : path.resolve(process.cwd(), 'data');
  const dataFile = path.join(dataDir, 'interviews.json');
  return { dataDir, dataFile };
}

let initialized = false;
let sessionsCache = new Map<string, InterviewSession>();

function ensureInitialized() {
  if (initialized) {
    return;
  }

  initialized = true;

  try {
    const { dataDir, dataFile } = getDataPaths();
    try {
      mkdirSync(dataDir, { recursive: true });
    } catch {
      // Directory creation ignored if read-only
    }

    if (!existsSync(dataFile)) {
      try {
        writeFileSync(dataFile, JSON.stringify({ sessions: {} }, null, 2), 'utf8');
      } catch {
        // File creation ignored if read-only
      }
    }

    if (existsSync(dataFile)) {
      const raw = readFileSync(dataFile, 'utf8');
      const parsed = JSON.parse(raw) as Partial<RepositoryFile>;
      const entries = parsed.sessions ?? {};
      sessionsCache = new Map(Object.entries(entries) as Array<[string, InterviewSession]>);
    }
  } catch (err: any) {
    console.warn(`[Repository] Disk persistence unavailable: ${err?.message ?? err}. Operating in-memory.`);
  }
}

function persist() {
  ensureInitialized();
  try {
    const { dataDir, dataFile } = getDataPaths();
    try {
      mkdirSync(dataDir, { recursive: true });
    } catch {
      // Ignore
    }
    const payload: RepositoryFile = {
      sessions: Object.fromEntries(sessionsCache.entries()),
    };
    writeFileSync(dataFile, JSON.stringify(payload, null, 2), 'utf8');
  } catch (err: any) {
    // Disk write error caught silently; in-memory state preserved
  }
}

export function saveSessionRecord(session: InterviewSession): InterviewSession {
  ensureInitialized();
  sessionsCache.set(session.sessionId, session);
  persist();
  return session;
}

export function getSessionRecord(sessionId: string): InterviewSession | undefined {
  ensureInitialized();
  return sessionsCache.get(sessionId);
}

export function hasSessionRecord(sessionId: string): boolean {
  ensureInitialized();
  return sessionsCache.has(sessionId);
}

export function deleteSessionRecord(sessionId: string): boolean {
  ensureInitialized();
  const deleted = sessionsCache.delete(sessionId);
  persist();
  return deleted;
}

export function listSessionRecords(): InterviewSession[] {
  ensureInitialized();
  return Array.from(sessionsCache.values());
}

export function addMessageRecord(sessionId: string, sender: 'candidate' | 'ai', text: string, timestamp: string, _orderIndex: number) {
  ensureInitialized();
  const session = sessionsCache.get(sessionId);
  if (session) {
    session.messages.push({ sender, text, timestamp });
    session.updatedAt = new Date().toISOString();
    persist();
  }
}

export function saveEvaluationRecord(sessionId: string, evaluation: any) {
  ensureInitialized();
  const session = sessionsCache.get(sessionId);
  if (session) {
    session.evaluations.push(evaluation);
    session.updatedAt = new Date().toISOString();
    persist();
  }
}

export function saveFeedbackRecord(sessionId: string, feedback: any) {
  ensureInitialized();
  const session = sessionsCache.get(sessionId);
  if (session) {
    session.feedback = feedback;
    session.updatedAt = new Date().toISOString();
    persist();
  }
}

export function markSessionCompleted(sessionId: string) {
  ensureInitialized();
  const session = sessionsCache.get(sessionId);
  if (session) {
    session.status = 'completed';
    session.updatedAt = new Date().toISOString();
    persist();
  }
}

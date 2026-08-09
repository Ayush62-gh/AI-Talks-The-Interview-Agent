import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { initializeDatabase, getDatabasePath } from '../src/db/index.js';
import { saveSessionRecord, getSessionRecord, deleteSessionRecord } from '../src/repositories/interview.repository.sqlite.js';

test('persists sessions in sqlite-backed storage', () => {
  const dbPath = getDatabasePath();
  if (existsSync(dbPath)) {
    unlinkSync(dbPath);
  }

  initializeDatabase();

  assert.equal(existsSync(dbPath), true);

  const session = {
    sessionId: 'db-session-1',
    candidate: {
      role: 'Software Engineer',
      experienceLevel: 'Mid Level',
      interviewType: 'Technical Interview',
      questionCount: 3,
    },
    currentQuestion: { questionId: 'q-1', text: 'Describe a React hook.' },
    questionCount: 3,
    progress: 1,
    messages: [{ sender: 'ai', text: 'Describe a React hook.', timestamp: '2024-01-01T00:00:00.000Z' }],
    evaluations: [],
    status: 'active',
    feedback: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  saveSessionRecord(session);
  const loaded = getSessionRecord(session.sessionId);

  assert.ok(loaded);
  assert.equal(loaded?.sessionId, session.sessionId);
  assert.equal(loaded?.candidate.role, 'Software Engineer');
  assert.equal(loaded?.messages.length, 1);

  deleteSessionRecord(session.sessionId);
  assert.equal(getSessionRecord(session.sessionId), undefined);
});

import { eq, desc } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { interviewEvaluations, interviewFeedback, interviewMessages, interviews } from '../db/schema.js';
import type { InterviewEvaluation, InterviewFeedback, InterviewSession } from '../models/interview.types.js';
import * as jsonRepo from './interview.repository.js';

function normalizeSession(row: any): InterviewSession {
  return {
    sessionId: row.sessionId,
    candidate: {
      role: row.role as any,
      experienceLevel: row.experienceLevel as any,
      interviewType: row.interviewType as any,
      questionCount: row.questionCount,
    },
    currentQuestion: row.currentQuestionId && row.currentQuestionText ? { questionId: row.currentQuestionId, text: row.currentQuestionText } : null,
    questionCount: row.questionCount,
    progress: row.progress,
    messages: [],
    evaluations: [],
    status: row.status as 'active' | 'completed',
    feedback: null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function normalizeMessage(row: any) {
  return { sender: row.sender as 'candidate' | 'ai', text: row.text, timestamp: row.timestamp };
}

function parseJson<T>(value: unknown): T[] {
  if (!value) return [] as T[];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T[];
    } catch {
      return [] as T[];
    }
  }
  return [] as T[];
}

export function saveSessionRecord(session: InterviewSession): InterviewSession {
  const db = getDb();
  if (!db) return jsonRepo.saveSessionRecord(session);
  const now = new Date().toISOString();

  db.insert(interviews)
    .values({
      sessionId: session.sessionId,
      role: session.candidate.role,
      experienceLevel: session.candidate.experienceLevel,
      interviewType: session.candidate.interviewType,
      questionCount: session.questionCount,
      currentQuestionId: session.currentQuestion?.questionId ?? null,
      currentQuestionText: session.currentQuestion?.text ?? null,
      progress: session.progress,
      status: session.status,
      createdAt: session.createdAt || now,
      updatedAt: session.updatedAt || now,
    })
    .onConflictDoUpdate({
      target: interviews.sessionId,
      set: {
        role: session.candidate.role,
        experienceLevel: session.candidate.experienceLevel,
        interviewType: session.candidate.interviewType,
        questionCount: session.questionCount,
        currentQuestionId: session.currentQuestion?.questionId ?? null,
        currentQuestionText: session.currentQuestion?.text ?? null,
        progress: session.progress,
        status: session.status,
        updatedAt: now,
      },
    })
    .run();

  return session;
}

export function getSessionRecord(sessionId: string): InterviewSession | undefined {
  const db = getDb();
  if (!db) return jsonRepo.getSessionRecord(sessionId);
  const row = db.select().from(interviews).where(eq(interviews.sessionId, sessionId)).get();
  if (!row) return undefined;
  const session = normalizeSession(row);
  const rows = db.select().from(interviewMessages).where(eq(interviewMessages.sessionId, sessionId)).orderBy(desc(interviewMessages.orderIndex)).all();
  session.messages = rows.map(normalizeMessage).reverse();

  const evalRows = db.select().from(interviewEvaluations).where(eq(interviewEvaluations.sessionId, sessionId)).all();
  session.evaluations = evalRows.map((evalRow: any) => ({
    questionId: evalRow.questionId ?? undefined,
    score: evalRow.score ?? undefined,
    correctness: evalRow.correctness ?? undefined,
    relevance: evalRow.relevance ?? undefined,
    technicalDepth: evalRow.technicalDepth ?? undefined,
    communication: evalRow.communication ?? undefined,
    strengths: parseJson<string>(evalRow.strengths),
    weaknesses: parseJson<string>(evalRow.weaknesses),
    missingConcepts: parseJson<string>(evalRow.missingConcepts),
    assessment: evalRow.assessment ?? undefined,
  }));

  const feedbackRow = db.select().from(interviewFeedback).where(eq(interviewFeedback.sessionId, sessionId)).get();
  if (feedbackRow) {
    session.feedback = {
      score: feedbackRow.score,
      summary: feedbackRow.summary,
      categories: {
        technicalKnowledge: feedbackRow.technicalKnowledge,
        problemSolving: feedbackRow.problemSolving,
        communicationSkills: feedbackRow.communicationSkills,
        answerQuality: feedbackRow.answerQuality,
        confidence: feedbackRow.confidence,
      },
      strengths: parseJson<string>(feedbackRow.strengths),
      weaknesses: parseJson<string>(feedbackRow.weaknesses),
      suggestions: parseJson<string>(feedbackRow.suggestions),
    };
  }

  return session;
}

export function hasSessionRecord(sessionId: string): boolean {
  const db = getDb();
  if (!db) return jsonRepo.hasSessionRecord(sessionId);
  const row = db.select({ count: interviews.id }).from(interviews).where(eq(interviews.sessionId, sessionId)).get();
  return Boolean(row && row.count);
}

export function deleteSessionRecord(sessionId: string): boolean {
  const db = getDb();
  if (!db) return jsonRepo.deleteSessionRecord(sessionId);
  const result = db.delete(interviews).where(eq(interviews.sessionId, sessionId)).run();
  db.delete(interviewMessages).where(eq(interviewMessages.sessionId, sessionId)).run();
  db.delete(interviewEvaluations).where(eq(interviewEvaluations.sessionId, sessionId)).run();
  db.delete(interviewFeedback).where(eq(interviewFeedback.sessionId, sessionId)).run();
  return result.changes > 0;
}

export function listSessionRecords(): InterviewSession[] {
  const db = getDb();
  if (!db) return jsonRepo.listSessionRecords();
  const rows = db.select().from(interviews).all();
  return rows.map((row: any) => getSessionRecord(row.sessionId)).filter(Boolean) as InterviewSession[];
}

export function addMessageRecord(sessionId: string, sender: 'candidate' | 'ai', text: string, timestamp: string, orderIndex: number) {
  const db = getDb();
  if (!db) return jsonRepo.addMessageRecord(sessionId, sender, text, timestamp, orderIndex);
  db.insert(interviewMessages).values({ sessionId, sender, text, timestamp, orderIndex }).run();
}

export function saveEvaluationRecord(sessionId: string, evaluation: InterviewEvaluation) {
  const db = getDb();
  if (!db) return jsonRepo.saveEvaluationRecord(sessionId, evaluation);
  db.insert(interviewEvaluations).values({
    sessionId,
    questionId: evaluation.questionId ?? null,
    score: evaluation.score ?? null,
    correctness: evaluation.correctness ?? null,
    relevance: evaluation.relevance ?? null,
    technicalDepth: evaluation.technicalDepth ?? null,
    communication: evaluation.communication ?? null,
    strengths: evaluation.strengths ? JSON.stringify(evaluation.strengths) : null,
    weaknesses: evaluation.weaknesses ? JSON.stringify(evaluation.weaknesses) : null,
    missingConcepts: evaluation.missingConcepts ? JSON.stringify(evaluation.missingConcepts) : null,
    assessment: evaluation.assessment ?? null,
    createdAt: new Date().toISOString(),
  }).run();
}

export function saveFeedbackRecord(sessionId: string, feedback: InterviewFeedback) {
  const db = getDb();
  if (!db) return jsonRepo.saveFeedbackRecord(sessionId, feedback);
  db.insert(interviewFeedback).values({
    sessionId,
    score: feedback.score,
    summary: feedback.summary,
    technicalKnowledge: feedback.categories.technicalKnowledge ?? 0,
    problemSolving: feedback.categories.problemSolving ?? 0,
    communicationSkills: feedback.categories.communicationSkills ?? 0,
    answerQuality: feedback.categories.answerQuality ?? 0,
    confidence: feedback.categories.confidence ?? 0,
    strengths: JSON.stringify(feedback.strengths),
    weaknesses: JSON.stringify(feedback.weaknesses),
    suggestions: JSON.stringify(feedback.suggestions),
    createdAt: new Date().toISOString(),
  }).onConflictDoUpdate({
    target: interviewFeedback.sessionId,
    set: {
      score: feedback.score,
      summary: feedback.summary,
      technicalKnowledge: feedback.categories.technicalKnowledge ?? 0,
      problemSolving: feedback.categories.problemSolving ?? 0,
      communicationSkills: feedback.categories.communicationSkills ?? 0,
      answerQuality: feedback.categories.answerQuality ?? 0,
      confidence: feedback.categories.confidence ?? 0,
      strengths: JSON.stringify(feedback.strengths),
      weaknesses: JSON.stringify(feedback.weaknesses),
      suggestions: JSON.stringify(feedback.suggestions),
      createdAt: new Date().toISOString(),
    },
  }).run();
}

export function markSessionCompleted(sessionId: string) {
  const db = getDb();
  if (!db) return jsonRepo.markSessionCompleted(sessionId);
  db.update(interviews).set({ status: 'completed', updatedAt: new Date().toISOString() }).where(eq(interviews.sessionId, sessionId)).run();
}

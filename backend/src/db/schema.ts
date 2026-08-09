import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const interviews = sqliteTable('interviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull().unique(),
  role: text('role').notNull(),
  experienceLevel: text('experience_level').notNull(),
  interviewType: text('interview_type').notNull(),
  questionCount: integer('question_count').notNull(),
  currentQuestionId: text('current_question_id'),
  currentQuestionText: text('current_question_text'),
  progress: integer('progress').notNull().default(0),
  status: text('status').notNull().default('active'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const interviewMessages = sqliteTable('interview_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull(),
  sender: text('sender').notNull(),
  text: text('text').notNull(),
  timestamp: text('timestamp').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
});

export const interviewEvaluations = sqliteTable('interview_evaluations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull(),
  questionId: text('question_id'),
  score: integer('score'),
  correctness: integer('correctness'),
  relevance: integer('relevance'),
  technicalDepth: integer('technical_depth'),
  communication: integer('communication'),
  strengths: text('strengths', { mode: 'json' }),
  weaknesses: text('weaknesses', { mode: 'json' }),
  missingConcepts: text('missing_concepts', { mode: 'json' }),
  assessment: text('assessment'),
  createdAt: text('created_at').notNull(),
});

export const interviewFeedback = sqliteTable('interview_feedback', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull().unique(),
  score: integer('score').notNull(),
  summary: text('summary').notNull(),
  technicalKnowledge: integer('technical_knowledge').notNull(),
  problemSolving: integer('problem_solving').notNull(),
  communicationSkills: integer('communication_skills').notNull(),
  answerQuality: integer('answer_quality').notNull(),
  confidence: integer('confidence').notNull(),
  strengths: text('strengths', { mode: 'json' }),
  weaknesses: text('weaknesses', { mode: 'json' }),
  suggestions: text('suggestions', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
});

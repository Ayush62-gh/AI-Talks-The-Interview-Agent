import { InterviewSession, CandidatePayload, InterviewEvaluation, InterviewFeedback } from '../models/interview.types.js';
import { saveSession, getSession } from '../store/interview.store.js';
import { getAIProvider } from '../providers/index.js';
import { addMessageRecord, markSessionCompleted, saveEvaluationRecord, saveFeedbackRecord } from '../repositories/interview.repository.js';

export { getSession } from '../store/interview.store.js';

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
    evaluations: [],
    askedQuestions: [],
    coveredTopics: [],
    evaluatedConcepts: [],
    weakConcepts: [],
    strongConcepts: [],
    currentDifficulty: candidate.experienceLevel === 'Fresher' ? 'easy' : candidate.experienceLevel === 'Senior' ? 'hard' : 'medium',
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

  s.askedQuestions = s.askedQuestions ?? [];
  s.coveredTopics = s.coveredTopics ?? [];
  s.evaluatedConcepts = s.evaluatedConcepts ?? [];
  s.weakConcepts = s.weakConcepts ?? [];
  s.strongConcepts = s.strongConcepts ?? [];

  const context = {
    candidate: s.candidate,
    progress: s.progress,
    questionCount: s.questionCount,
    history: s.messages,
    askedQuestions: s.askedQuestions,
    coveredTopics: s.coveredTopics,
    evaluatedConcepts: s.evaluatedConcepts,
    weakConcepts: s.weakConcepts,
    strongConcepts: s.strongConcepts,
    currentDifficulty: s.currentDifficulty ?? 'medium',
    interviewType: s.candidate.interviewType,
    experienceLevel: s.candidate.experienceLevel,
  };

  const q = await ai.generateQuestion(context);
  s.currentQuestion = { questionId: q.questionId, text: q.text };
  if (!s.askedQuestions.includes(q.text)) {
    s.askedQuestions.push(q.text);
  }
  if (q.topic && !s.coveredTopics.includes(q.topic)) {
    s.coveredTopics.push(q.topic);
  }

  const messageTs = new Date().toISOString();
  s.messages.push({ sender: 'ai', text: q.text, timestamp: messageTs });
  s.updatedAt = new Date().toISOString();
  addMessageRecord(sessionId, 'ai', q.text, messageTs, s.messages.length - 1);
  saveSession(s);
  return q;
}

export async function evaluateAndNext(sessionId: string, answer: string) {
  const s = getSession(sessionId);
  if (!s) return { error: 'SESSION_NOT_FOUND' } as any;

  s.askedQuestions = s.askedQuestions ?? [];
  s.coveredTopics = s.coveredTopics ?? [];
  s.evaluatedConcepts = s.evaluatedConcepts ?? [];
  s.weakConcepts = s.weakConcepts ?? [];
  s.strongConcepts = s.strongConcepts ?? [];

  const candidateTs = new Date().toISOString();
  s.messages.push({ sender: 'candidate', text: answer, timestamp: candidateTs });
  addMessageRecord(sessionId, 'candidate', answer, candidateTs, s.messages.length - 1);

  const evalCtx = {
    candidate: s.candidate,
    question: s.currentQuestion,
    answer,
    history: s.messages,
    progress: s.progress,
    askedQuestions: s.askedQuestions,
    coveredTopics: s.coveredTopics,
    evaluatedConcepts: s.evaluatedConcepts,
    weakConcepts: s.weakConcepts,
    strongConcepts: s.strongConcepts,
    currentDifficulty: s.currentDifficulty ?? 'medium',
  };

  const evaluation = await ai.evaluateAnswer(evalCtx);
  const evaluationRecord: InterviewEvaluation = {
    questionId: s.currentQuestion?.questionId,
    score: Math.round((evaluation.correctness + evaluation.relevance + evaluation.technicalDepth + evaluation.communication) / 4),
    correctness: evaluation.correctness,
    relevance: evaluation.relevance,
    technicalDepth: evaluation.technicalDepth,
    communication: evaluation.communication,
    strengths: evaluation.strengths,
    weaknesses: evaluation.weaknesses,
    missingConcepts: evaluation.missingConcepts,
    assessment: evaluation.assessment,
  };

  // Update strengths/weaknesses in session state
  if (evaluation.strengths && evaluation.strengths.length > 0) {
    evaluation.strengths.forEach((st) => {
      if (!s.strongConcepts!.includes(st)) s.strongConcepts!.push(st);
    });
  }
  if (evaluation.missingConcepts && evaluation.missingConcepts.length > 0) {
    evaluation.missingConcepts.forEach((mc) => {
      if (!s.weakConcepts!.includes(mc)) s.weakConcepts!.push(mc);
    });
  }

  // Update difficulty based on evaluation score
  if (evaluationRecord.correctness! >= 80) {
    s.currentDifficulty = 'hard';
  } else if (evaluationRecord.correctness! < 50) {
    s.currentDifficulty = 'easy';
  }

  s.evaluations.push(evaluationRecord);
  s.progress = Math.min(s.questionCount, s.progress + 1);
  saveEvaluationRecord(sessionId, evaluationRecord);

  if (s.progress >= s.questionCount) {
    s.status = 'completed';
    const feedbackPayload = await ai.generateFeedback({
      candidate: s.candidate,
      history: s.messages,
      evaluations: s.evaluations,
    });

    const feedback: InterviewFeedback = {
      score: feedbackPayload.overallScore,
      summary: feedbackPayload.summary,
      categories: {
        technicalKnowledge: feedbackPayload.technicalScore,
        problemSolving: feedbackPayload.problemSolvingScore,
        communicationSkills: feedbackPayload.communicationScore,
        answerQuality: feedbackPayload.technicalScore,
        confidence: feedbackPayload.communicationScore,
      },
      strengths: feedbackPayload.strengths,
      weaknesses: feedbackPayload.weaknesses,
      suggestions: feedbackPayload.improvementAreas,
    };

    s.feedback = feedback;
    s.updatedAt = new Date().toISOString();
    saveFeedbackRecord(sessionId, feedback);
    markSessionCompleted(sessionId);
    saveSession(s);
    return { done: true, feedback };
  }

  const nextQ = await ai.generateQuestion({
    candidate: s.candidate,
    progress: s.progress,
    history: s.messages,
    askedQuestions: s.askedQuestions,
    coveredTopics: s.coveredTopics,
    evaluatedConcepts: s.evaluatedConcepts,
    weakConcepts: s.weakConcepts,
    strongConcepts: s.strongConcepts,
    currentDifficulty: s.currentDifficulty,
    previousEvaluation: evaluationRecord,
    interviewType: s.candidate.interviewType,
    experienceLevel: s.candidate.experienceLevel,
  });

  s.currentQuestion = { questionId: nextQ.questionId, text: nextQ.text };
  if (!s.askedQuestions.includes(nextQ.text)) {
    s.askedQuestions.push(nextQ.text);
  }
  if (nextQ.topic && !s.coveredTopics.includes(nextQ.topic)) {
    s.coveredTopics.push(nextQ.topic);
  }

  const nextMessageTs = new Date().toISOString();
  s.messages.push({ sender: 'ai', text: nextQ.text, timestamp: nextMessageTs });
  s.updatedAt = new Date().toISOString();
  addMessageRecord(sessionId, 'ai', nextQ.text, nextMessageTs, s.messages.length - 1);
  saveSession(s);

  return { done: false, nextQuestion: nextQ, evaluation: evaluationRecord };
}

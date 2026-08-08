import { Request, Response, NextFunction } from 'express';
import { createSession, getSession, generateFirstQuestion, evaluateAndNext, getFeedback } from '../services/interview.service.js';
import type {
  StartInterviewRequest,
  StartInterviewResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from '../models/interview.types.js';

export async function postInterview(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as StartInterviewRequest | SubmitAnswerRequest;

    // Distinguish start vs submit by presence of sessionId and message
    const isSubmit = Boolean((body as SubmitAnswerRequest).sessionId && (body as SubmitAnswerRequest).message);

    if (!isSubmit) {
      // Start interview
      const startReq = body as StartInterviewRequest;
      if (!startReq.candidate) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'candidate is required' } });
      }

      // Basic validation
      const { role, experienceLevel, interviewType, questionCount } = startReq.candidate;
      if (!role || !experienceLevel || !interviewType || !questionCount || typeof questionCount !== 'number') {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid candidate payload' } });
      }

        const session = createSession(startReq.candidate);

        try {
          const q = await generateFirstQuestion(session.sessionId);
          const resp: StartInterviewResponse = {
            sessionId: session.sessionId,
            firstQuestion: q ? { questionId: q.questionId, text: q.text } : null,
            reply: q ? 'First question generated' : null,
            progress: session.progress,
            totalQuestions: session.questionCount,
            done: false,
            feedback: null,
          };
          return res.status(201).json(resp);
        } catch (err: any) {
          // if AI not configured or provider error
          return res.status(503).json({ error: { code: 'ENGINE_NOT_CONFIGURED', message: err?.message ?? 'AI engine error' } });
        }
    }

    // Handle submit
    const submitReq = body as SubmitAnswerRequest;
    if (!submitReq.sessionId) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'sessionId is required for submitting answers' } });
    }
    if (!submitReq.message || String(submitReq.message).trim() === '') {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'message is required' } });
    }

    const s = getSession(submitReq.sessionId);
    if (!s) {
      return res.status(404).json({ error: { code: 'SESSION_NOT_FOUND', message: 'Session not found' } });
    }

    if (s.status === 'completed') {
      return res.status(400).json({ error: { code: 'SESSION_ALREADY_COMPLETED', message: 'Session already completed' } });
    }

    try {
      const result = await evaluateAndNext(submitReq.sessionId, submitReq.message);
      if (result.error) {
        return res.status(500).json({ error: { code: 'AI_REQUEST_FAILED', message: 'AI processing failed' } });
      }

      if (result.done) {
        const resp: SubmitAnswerResponse = { nextQuestion: null, reply: 'Interview complete', progress: s.progress, done: true, feedback: result.feedback } as any;
        return res.json(resp);
      }

      const resp: SubmitAnswerResponse = { nextQuestion: result.nextQuestion ? { questionId: result.nextQuestion.questionId, text: result.nextQuestion.text } : null, reply: null, progress: s.progress, done: false } as any;
      return res.json(resp);
    } catch (err: any) {
      return res.status(503).json({ error: { code: 'ENGINE_NOT_CONFIGURED', message: err?.message ?? 'AI engine error' } });
    }
  } catch (err) {
    next(err);
  }
}

export async function getInterviewFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'sessionId is required' } });
    }

    const f = getFeedback(sessionId);
    if (!f) {
      return res.status(404).json({ error: { code: 'FEEDBACK_NOT_READY', message: 'Interview feedback is not available yet.' } });
    }

    return res.json(f);
  } catch (err) {
    next(err);
  }
}

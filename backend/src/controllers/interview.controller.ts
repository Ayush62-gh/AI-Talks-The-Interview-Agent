import { Request, Response, NextFunction } from 'express';
import { createSession, getSession, generateFirstQuestion, evaluateAndNext, getFeedback } from '../services/interview.service.js';
import { validateStartInterviewRequest, validateSubmitAnswerRequest } from '../utils/validation.js';
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
      const startReq = body as StartInterviewRequest;
      const validation = validateStartInterviewRequest(startReq);
      if (validation.error) {
        return res.status(400).json({ error: validation.error });
      }

      const session = createSession(startReq.candidate);

        try {
          const q = await generateFirstQuestion(session.sessionId);
          const resp: StartInterviewResponse = {
            sessionId: session.sessionId,
            firstQuestion: q ? { questionId: q.questionId, text: q.text } : null,
            reply: q ? q.text : null,
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
    const validation = validateSubmitAnswerRequest(submitReq);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const s = getSession(validation.value.sessionId);
    if (!s) {
      return res.status(404).json({ error: { code: 'SESSION_NOT_FOUND', message: 'Session not found' } });
    }

    if (s.status === 'completed') {
      return res.status(400).json({ error: { code: 'SESSION_ALREADY_COMPLETED', message: 'Session already completed' } });
    }

    try {
      const result = await evaluateAndNext(validation.value.sessionId, validation.value.message);
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

import { Router } from 'express';
import { postInterview, getInterviewFeedback } from '../controllers/interview.controller.js';

const router = Router();

router.post('/interview', postInterview);
router.get('/interview/:sessionId/feedback', getInterviewFeedback);

export default router;

import { InterviewFeedback } from '../types/interview';
import { fetchInterviewFeedback } from './api';

export async function getInterviewFeedback(sessionId: string): Promise<InterviewFeedback> {
  return fetchInterviewFeedback(sessionId);
}

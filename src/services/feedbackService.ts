import { InterviewFeedback } from '../types/interview';

export async function getInterviewFeedback(sessionId: string): Promise<InterviewFeedback> {
  // Placeholder structured response. Replace with LLM call later.
  await new Promise((r) => setTimeout(r, 600));
  return {
    score: 0,
    summary: '',
    categories: {
      technicalKnowledge: 0,
      problemSolving: 0,
      communicationSkills: 0,
      answerQuality: 0,
      confidence: 0,
    },
    strengths: [],
    weaknesses: [],
    suggestions: [],
  };
}

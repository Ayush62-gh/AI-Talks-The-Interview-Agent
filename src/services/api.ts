import axios from 'axios';
import {
  InterviewConfig,
  InterviewQuestion,
  StartInterviewResponse,
  SubmitAnswerResponse,
  InterviewFeedback,
} from '../types/interview';

const apiBaseUrl = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

export async function startInterview(config: InterviewConfig): Promise<StartInterviewResponse> {
  const { data } = await apiClient.post<StartInterviewResponse>('/interview/start', {
    role: config.role,
    experienceLevel: config.experienceLevel,
    interviewType: config.interviewType,
    questionCount: config.questionCount,
  });

  return {
    sessionId: data.sessionId,
    firstQuestion: data.firstQuestion,
    progress: data.progress ?? 1,
    totalQuestions: data.totalQuestions ?? config.questionCount,
  };
}

export async function submitAnswer(sessionId: string, questionId: string, answer: string): Promise<SubmitAnswerResponse> {
  const { data } = await apiClient.post<SubmitAnswerResponse>('/interview/answer', {
    sessionId,
    questionId,
    answer,
  });

  return {
    ...data,
    progress: data.progress ?? 1,
  };
}

export async function fetchInterviewFeedback(sessionId: string): Promise<InterviewFeedback> {
  const { data } = await apiClient.get<InterviewFeedback | Record<string, unknown>>(
    `/interview/${encodeURIComponent(sessionId)}/feedback`,
  );

  return {
    score: Number((data as Record<string, unknown>).score ?? (data as Record<string, unknown>).overallScore ?? 0),
    summary: String((data as Record<string, unknown>).summary ?? ''),
    categories: {
      technicalKnowledge: Number((data as Record<string, unknown>).technicalKnowledge ?? (data as Record<string, unknown>).technicalScore ?? 0),
      problemSolving: Number((data as Record<string, unknown>).problemSolving ?? (data as Record<string, unknown>).problemSolvingScore ?? 0),
      communicationSkills: Number((data as Record<string, unknown>).communicationSkills ?? (data as Record<string, unknown>).communicationScore ?? 0),
      answerQuality: Number((data as Record<string, unknown>).answerQuality ?? (data as Record<string, unknown>).answerQualityScore ?? 0),
      confidence: Number((data as Record<string, unknown>).confidence ?? (data as Record<string, unknown>).confidenceScore ?? 0),
    },
    strengths: Array.isArray((data as Record<string, unknown>).strengths) ? ((data as Record<string, unknown>).strengths as string[]) : [],
    weaknesses: Array.isArray((data as Record<string, unknown>).weaknesses) ? ((data as Record<string, unknown>).weaknesses as string[]) : [],
    suggestions: Array.isArray((data as Record<string, unknown>).suggestions) ? ((data as Record<string, unknown>).suggestions as string[]) : [],
  };
}

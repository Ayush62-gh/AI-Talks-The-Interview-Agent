import axios from 'axios';
import {
  InterviewConfig,
  InterviewQuestion,
  StartInterviewResponse,
  SubmitAnswerResponse,
  InterviewFeedback,
} from '../types/interview';

const apiBaseUrl =
  (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string; VITE_API_URL?: string } }).env?.VITE_API_BASE_URL ||
  (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string; VITE_API_URL?: string } }).env?.VITE_API_URL ||
  'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
});

function getApiErrorMessage(error: unknown): string {
  const status = typeof error === 'object' && error !== null && 'response' in error && (error as { response?: { status?: number } }).response?.status;
  const serverMessage =
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message;

  if (status === 400) {
    return serverMessage || 'Please complete the interview details and try again.';
  }

  if (status === 404) {
    return serverMessage || 'This interview session is no longer available. Please start a new session.';
  }

  if (status === 503) {
    return 'The AI interview service is temporarily unavailable. Please try again.';
  }

  if (status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (!status) {
    return 'Unable to connect to the interview server. Please check your connection and try again.';
  }

  return serverMessage || 'Unable to complete your request right now.';
}

export async function startInterview(config: InterviewConfig): Promise<StartInterviewResponse> {
  try {
    const { data } = await apiClient.post<StartInterviewResponse>('/interview', {
      sessionId: '',
      candidate: {
        role: config.role,
        experienceLevel: config.experienceLevel,
        interviewType: config.interviewType,
        questionCount: config.questionCount,
      },
    });

    const initialReply = data.firstQuestion?.text || data.reply || '';

    return {
      sessionId: data.sessionId,
      firstQuestion: initialReply
        ? {
            questionId: data.firstQuestion?.questionId ?? 'initial-question',
            text: initialReply,
          }
        : data.firstQuestion,
      progress: data.progress ?? 0,
      totalQuestions: data.totalQuestions ?? config.questionCount,
      reply: initialReply,
      done: data.done ?? false,
      feedback: data.feedback,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function submitAnswer(sessionId: string, questionId: string, answer: string): Promise<SubmitAnswerResponse> {
  try {
    const { data } = await apiClient.post<SubmitAnswerResponse>('/interview', {
      sessionId,
      message: answer,
    });

    const reply = data.nextQuestion?.text || data.reply || '';

    return {
      ...data,
      nextQuestion: reply
        ? {
            questionId: data.nextQuestion?.questionId ?? `follow-up-${Date.now()}`,
            text: reply,
          }
        : data.nextQuestion,
      progress: data.progress ?? 0,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function fetchInterviewFeedback(sessionId: string): Promise<InterviewFeedback> {
  try {
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
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export type RoleOption =
  | 'Software Engineer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Product Manager'
  | 'Data Scientist'
  | 'DevOps Engineer'
  | 'Java Backend Developer'
  | 'Data Analyst'
  | 'AI Engineer';

export type ExperienceLevelOption = 'Fresher' | 'Junior' | 'Mid Level' | 'Senior';

export type InterviewTypeOption = 'Technical Interview' | 'Behavioral Interview' | 'System Design Interview';

export interface InterviewConfig {
  role: RoleOption;
  experienceLevel: ExperienceLevelOption;
  interviewType: InterviewTypeOption;
  questionCount: number;
}

export interface Candidate {
  name: string;
}

export interface InterviewSession {
  sessionId: string;
  config: InterviewConfig;
  currentQuestionId: string;
  totalQuestions: number;
}

export interface SessionQuestion {
  id: string;
  question: string;
  answer?: string | null;
  completed: boolean;
}

export interface InterviewFullSession {
  sessionId: string;
  role: RoleOption;
  experienceLevel: ExperienceLevelOption;
  interviewType: InterviewTypeOption;
  questionCount: number;
  currentQuestionIndex: number;
  questions: SessionQuestion[];
  answers: Record<string, string>;
  createdAt: string;
}

export type InterviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface InterviewTopicMetadata {
  day: number;
  topic: string;
  module: string;
  difficulty: InterviewDifficulty;
  isFollowUp?: boolean;
}

export interface InterviewQuestion {
  questionId: string;
  text: string;
  metadata?: InterviewTopicMetadata;
}

export interface StartInterviewResponse {
  sessionId?: string;
  firstQuestion?: InterviewQuestion;
  progress?: number;
  totalQuestions?: number;
  reply?: string;
  done?: boolean;
  feedback?: InterviewFeedback;
}

export interface SubmitAnswerResponse {
  nextQuestion?: InterviewQuestion;
  done: boolean;
  progress?: number;
  feedback?: InterviewFeedback;
  reply?: string;
}

export interface InterviewFeedback {
  score: number;
  summary: string;
  categories: {
    technicalKnowledge: number;
    problemSolving: number;
    communicationSkills: number;
    answerQuality: number;
    confidence: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface Message {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  timestamp: string;
  type?: 'question' | 'followup' | 'answer';
  day?: number;
  topic?: string;
  difficulty?: InterviewDifficulty;
  isFollowUp?: boolean;
}

export type RoleOption =
  | 'Software Engineer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Product Manager'
  | 'Data Scientist'
  | 'DevOps Engineer';

export type ExperienceLevelOption = 'Fresher' | 'Junior' | 'Mid Level' | 'Senior';
export type InterviewTypeOption = 'Technical Interview' | 'Behavioral Interview' | 'System Design Interview';

export interface CandidatePayload {
  role: RoleOption;
  experienceLevel: ExperienceLevelOption;
  interviewType: InterviewTypeOption;
  questionCount: number;
}

export interface StartInterviewRequest {
  sessionId?: string;
  candidate: CandidatePayload;
}

export interface InterviewQuestion {
  questionId: string;
  text: string;
}

export interface StartInterviewResponse {
  sessionId?: string;
  firstQuestion?: InterviewQuestion | null;
  reply?: string | null;
  progress?: number;
  totalQuestions?: number;
  done?: boolean;
  feedback?: null;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  message: string;
}

export interface SubmitAnswerResponse {
  nextQuestion?: InterviewQuestion | null;
  reply?: string | null;
  progress?: number;
  done: boolean;
  feedback?: null;
}

export interface InterviewFeedback {
  score: number;
  summary: string;
  categories: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface InterviewSession {
  sessionId: string;
  candidate: CandidatePayload;
  currentQuestion?: InterviewQuestion | null;
  questionCount: number;
  progress: number;
  messages: { sender: 'candidate' | 'ai'; text: string; timestamp: string }[];
  status: 'active' | 'completed';
  feedback?: InterviewFeedback | null;
  createdAt: string;
  updatedAt: string;
}

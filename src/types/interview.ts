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
  nextQuestion?: InterviewQuestion | null;
  done: boolean;
  progress?: number;
  feedback?: InterviewFeedback;
  reply?: string;
}

export type PerformanceCategory =
  | 'Exceptional'
  | 'Strong'
  | 'Good'
  | 'Average'
  | 'Needs Improvement'
  | 'Weak';

export interface QuestionEvaluationDetail {
  questionId?: string;
  questionText: string;
  answerText: string;
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  difficultyWeight: number;
  accuracy: number;
  relevance: number;
  depth: number;
  clarity: number;
  baseScore: number;
  weightedScore: number;
  assessment: string;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
}

export interface InterviewFeedback {
  score: number;
  finalScore?: number;
  performanceCategory?: PerformanceCategory;
  summary: string;
  categories: {
    technicalKnowledge: number;
    problemSolving: number;
    communicationSkills: number;
    answerQuality: number;
    confidence: number;
  };
  metrics?: {
    totalQuestions: number;
    answeredQuestions: number;
    averageAccuracy: number;
    averageRelevance: number;
    averageDepth: number;
    averageClarity: number;
    sumWeightedScores: number;
    sumDifficultyWeights: number;
  };
  questionEvaluations?: QuestionEvaluationDetail[];
  coveredTopics?: string[];
  strongTopics?: string[];
  weakTopics?: string[];
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

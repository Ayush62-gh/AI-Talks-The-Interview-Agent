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
  sourceDay?: number;
  sourceModule?: string;
  sourceTopic?: string;
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
  sourceDay?: number;
  sourceModule?: string;
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

export interface CurriculumCoverageItem {
  area: string;
  covered: boolean;
  dayCount: number;
  daysList: number[];
}

export interface InterviewFeedback {
  score: number;
  finalScore: number;
  performanceCategory: PerformanceCategory;
  summary: string;
  categories: {
    technicalKnowledge: number;
    problemSolving: number;
    communicationSkills: number;
    answerQuality: number;
    confidence: number;
  };
  metrics: {
    totalQuestions: number;
    answeredQuestions: number;
    coveredDaysCount?: number;
    coveredDaysList?: number[];
    averageAccuracy: number;
    averageRelevance: number;
    averageDepth: number;
    averageClarity: number;
    sumWeightedScores: number;
    sumDifficultyWeights: number;
  };
  questionEvaluations?: QuestionEvaluationDetail[];
  curriculumCoverage?: CurriculumCoverageItem[];
  coveredTopics: string[];
  strongTopics: string[];
  weakTopics: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface InterviewEvaluation {
  questionId?: string;
  questionText?: string;
  answerText?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  difficultyWeight?: number;
  accuracy?: number;
  relevance?: number;
  depth?: number;
  clarity?: number;
  baseScore?: number;
  weightedScore?: number;
  score?: number;
  correctness?: number;
  strengths?: string[];
  weaknesses?: string[];
  missingConcepts?: string[];
  assessment?: string;
}

export interface InterviewSession {
  sessionId: string;
  candidate: CandidatePayload;
  currentQuestion?: InterviewQuestion | null;
  questionCount: number;
  progress: number;
  messages: { sender: 'candidate' | 'ai'; text: string; timestamp: string }[];
  evaluations: InterviewEvaluation[];
  askedQuestions?: string[];
  coveredTopics?: string[];
  evaluatedConcepts?: string[];
  weakConcepts?: string[];
  strongConcepts?: string[];
  currentDifficulty?: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed';
  feedback?: InterviewFeedback | null;
  createdAt: string;
  updatedAt: string;
}

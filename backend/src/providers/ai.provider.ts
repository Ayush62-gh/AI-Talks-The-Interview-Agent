export interface AIQuestion {
  questionId: string;
  text: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AIEvaluation {
  correctness: number; // 0-100
  relevance: number;
  technicalDepth: number;
  communication: number;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  assessment?: string;
}

export interface AIFeedback {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  recommendedTopics: string[];
  summary: string;
}

export interface AIProvider {
  generateQuestion(context: Record<string, any>): Promise<AIQuestion>;
  evaluateAnswer(context: Record<string, any>): Promise<AIEvaluation>;
  generateFeedback(context: Record<string, any>): Promise<AIFeedback>;
}

import type { AIProvider, AIQuestion, AIEvaluation, AIFeedback } from './ai.provider.js';

function simpleQuestion(topic = 'general', idx = 1): AIQuestion {
  return {
    questionId: `mock-q-${idx}`,
    text: `Mock question ${idx} about ${topic}. Explain briefly.`,
    topic,
    difficulty: 'medium',
  };
}

export default function createMockProvider(): AIProvider {
  return {
    async generateQuestion(context) {
      const idx = (context.progress ?? 0) + 1;
      const topic = context.candidate?.role ?? 'general';
      return simpleQuestion(topic, idx);
    },

    async evaluateAnswer(context) {
      // Very lightweight deterministic evaluation for tests
      const text = String(context.answer ?? '');
      const length = Math.min(100, text.length);
      const score = Math.min(90, Math.floor((length / 100) * 80) + 10);
      return {
        correctness: score,
        relevance: score,
        technicalDepth: Math.max(20, score - 10),
        communication: Math.max(20, score - 5),
        strengths: [],
        weaknesses: [],
        missingConcepts: [],
        assessment: 'Mock evaluation',
      } as AIEvaluation;
    },

    async generateFeedback(context) {
      const overall = 70;
      return {
        overallScore: overall,
        technicalScore: overall,
        communicationScore: overall,
        problemSolvingScore: overall,
        strengths: ['Provides clear answers'],
        weaknesses: ['Needs deeper technical detail'],
        improvementAreas: ['Read documentation', 'Practice coding problems'],
        recommendedTopics: ['Data structures', 'Concurrency'],
        summary: 'Mock feedback generated for tests.',
      } as AIFeedback;
    },
  };
}

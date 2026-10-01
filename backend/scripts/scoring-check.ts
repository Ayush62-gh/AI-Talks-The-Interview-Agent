import { buildFeedbackScores, buildMetrics } from '../src/services/scoring.js';
import { InterviewEvaluation } from '../src/models/interview.types.js';

const dummyEvals: InterviewEvaluation[] = [
  {
    id: 1,
    sessionId: 'sess-1',
    questionId: 'q-1',
    correctness: 85,
    relevance: 90,
    technicalDepth: 80,
    communication: 95,
    score: 87.5,
    strengths: [],
    weaknesses: [],
    missingConcepts: [],
    assessment: 'Good',
    createdAt: new Date(),
  },
  {
    id: 2,
    sessionId: 'sess-1',
    questionId: 'q-2',
    correctness: 70,
    relevance: 75,
    technicalDepth: 65,
    communication: 80,
    score: 72.5,
    strengths: [],
    weaknesses: [],
    missingConcepts: [],
    assessment: 'Okay',
    createdAt: new Date(),
  },
];

const scores = buildFeedbackScores(dummyEvals);
const metrics = buildMetrics(dummyEvals, 2);

console.log('Scores:', scores);
console.log('Metrics:', metrics);

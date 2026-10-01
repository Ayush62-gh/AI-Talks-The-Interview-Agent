import { InterviewEvaluation, PerformanceCategory } from '../models/interview.types.js';

export function buildFeedbackScores(evaluations: InterviewEvaluation[]) {
  if (!evaluations || evaluations.length === 0) {
    throw new Error('Cannot build feedback scores: no evaluations provided.');
  }

  const avg = (arr: number[]) => arr.reduce((sum, v) => sum + v, 0) / arr.length;

  const technicalScore = Math.round(avg(evaluations.map(e => e.correctness ?? 0)));
  const problemSolvingScore = Math.round(avg(evaluations.map(e => e.technicalDepth ?? 0)));
  const communicationScore = Math.round(avg(evaluations.map(e => e.communication ?? 0)));
  const relevanceScore = Math.round(avg(evaluations.map(e => e.relevance ?? 0)));
  const overallScore = Math.round(avg(evaluations.map(e => e.score ?? 0)));

  let performanceCategory: PerformanceCategory = 'Weak';
  if (overallScore >= 90) performanceCategory = 'Exceptional';
  else if (overallScore >= 80) performanceCategory = 'Strong';
  else if (overallScore >= 70) performanceCategory = 'Good';
  else if (overallScore >= 60) performanceCategory = 'Average';
  else if (overallScore >= 50) performanceCategory = 'Needs Improvement';

  return {
    overallScore,
    technicalScore,
    problemSolvingScore,
    communicationScore,
    relevanceScore,
    performanceCategory,
  };
}

export function buildMetrics(evaluations: InterviewEvaluation[], totalQuestions: number) {
  if (!evaluations || evaluations.length === 0) {
    throw new Error('Cannot build metrics: no evaluations provided.');
  }

  const avg = (arr: number[]) => arr.reduce((sum, v) => sum + v, 0) / arr.length;

  const averageAccuracy = Number((avg(evaluations.map(e => e.correctness ?? 0)) / 10).toFixed(1));
  const averageRelevance = Number((avg(evaluations.map(e => e.relevance ?? 0)) / 10).toFixed(1));
  const averageDepth = Number((avg(evaluations.map(e => e.technicalDepth ?? 0)) / 10).toFixed(1));
  const averageClarity = Number((avg(evaluations.map(e => e.communication ?? 0)) / 10).toFixed(1));
  const sumWeightedScores = Number((evaluations.reduce((sum, e) => sum + (e.score ?? 0), 0) / 10).toFixed(1));

  return {
    totalQuestions,
    answeredQuestions: evaluations.length,
    averageAccuracy,
    averageRelevance,
    averageDepth,
    averageClarity,
    sumWeightedScores,
    sumDifficultyWeights: evaluations.length,
  };
}

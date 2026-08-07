import {
  InterviewConfig,
  InterviewQuestion,
  StartInterviewResponse,
  SubmitAnswerResponse,
  InterviewFeedback,
} from '../types/interview';

const FAKE_QUESTIONS = [
  'Explain the difference between REST API and GraphQL.',
  'How would you design a scalable notification system?',
  'Describe a time you resolved a production incident.',
  'How do you ensure accessibility in a frontend application?',
  'What are the benefits of containerization for CI/CD?',
];

const delay = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createFeedback = (): InterviewFeedback => ({
  score: 87,
  summary: 'Your interview session showed strong technical reasoning and thoughtful answers with room to strengthen architecture details.',
  categories: {
    technicalKnowledge: 88,
    problemSolving: 86,
    communicationSkills: 84,
    answerQuality: 88,
    confidence: 86,
  },
  strengths: ['Structured problem-solving', 'Clear explanations', 'Good collaboration mindset'],
  weaknesses: ['More concrete metrics', 'Deeper discussion of trade-offs', 'Stronger testing details'],
  suggestions: ['Practice system design case studies', 'Frame answers with STAR', 'Review API versioning patterns'],
});

const createQuestion = (index: number): InterviewQuestion => ({
  questionId: `q-${index}`,
  text: FAKE_QUESTIONS[(index - 1) % FAKE_QUESTIONS.length],
});

export async function startInterview(config: InterviewConfig): Promise<StartInterviewResponse> {
  await delay(1200);
  return {
    sessionId: `INT-${Date.now().toString().slice(-8).toUpperCase()}`,
    firstQuestion: createQuestion(1),
    progress: 1,
    totalQuestions: config.questionCount,
  };
}

export async function submitAnswer(sessionId: string, questionId: string, answer: string): Promise<SubmitAnswerResponse> {
  await delay(1400);
  const currentIndex = Number(questionId.replace('q-', '')) || 1;
  const nextIndex = currentIndex + 1;
  const isDone = nextIndex > 5;

  if (!answer.trim()) {
    return {
      done: false,
      progress: currentIndex,
    };
  }

  if (isDone) {
    return {
      done: true,
      progress: currentIndex,
      feedback: createFeedback(),
    };
  }

  return {
    done: false,
    nextQuestion: createQuestion(nextIndex),
    progress: nextIndex,
  };
}

export async function fetchInterviewFeedback(sessionId: string): Promise<InterviewFeedback> {
  await delay(800);
  return createFeedback();
}

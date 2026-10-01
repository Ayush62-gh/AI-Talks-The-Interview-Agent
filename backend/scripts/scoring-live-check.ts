import 'dotenv/config';
import { getSession } from '../src/services/interview.service.js';
import { getAIProvider } from '../src/providers/index.js';
import { InterviewSession } from '../src/models/interview.types.js';

async function run() {
  const ai = getAIProvider();
  const session: InterviewSession = {
    id: 'test-sess',
    sessionId: 'test-sess',
    candidate: { role: 'AI Engineer' },
    status: 'in_progress',
    progress: 2,
    questionCount: 2,
    evaluations: [], // Zero evaluations!
    messages: [],
    currentDifficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const { submitAnswer } = await import('../src/services/interview.service.js');
    await submitAnswer('test-sess', 'dummy', 'hello');
    console.error('FAIL: Expected error to be thrown for missing evaluations.');
  } catch (err: any) {
    if (err.message.includes('no evaluations were recorded')) {
      console.log('PASS: Caught expected error:', err.message);
    } else {
      console.error('FAIL: Unexpected error:', err);
    }
  }
}

run();

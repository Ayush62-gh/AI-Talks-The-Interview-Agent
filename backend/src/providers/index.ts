import createMockProvider from './mock.provider.js';
import createOpenAIProvider from './openai.provider.js';

export function getAIProvider() {
  const provider = String(process.env.AI_PROVIDER ?? 'mock').toLowerCase();
  if (provider === 'mock') return createMockProvider();
  if (provider === 'openai') return createOpenAIProvider();
  return createMockProvider();
}

import createMockProvider from './mock.provider.js';
import createOpenAIProvider from './openai.provider.js';

export function getAIProvider() {
  const provider = process.env.AI_PROVIDER ?? 'openai';
  if (provider === 'mock') return createMockProvider();
  // default to openai
  return createOpenAIProvider();
}

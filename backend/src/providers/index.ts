import env from '../config/env.js';
import createGeminiProvider from './gemini.provider.js';

export function getAIProvider() {
  const provider = String(env.AI_PROVIDER || process.env.AI_PROVIDER || '').toLowerCase().trim();
  if (provider === 'gemini') {
    return createGeminiProvider();
  }
  throw new Error(`Invalid or unsupported AI_PROVIDER "${provider}". Gemini is the required AI Provider.`);
}

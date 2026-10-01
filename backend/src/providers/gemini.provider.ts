import { GoogleGenAI } from '@google/genai';
import env from '../config/env.js';
import type { AIProvider, AIQuestion, AIEvaluation, AIFeedback } from './ai.provider.js';
import { buildQuestionPrompt, buildEvaluationPrompt, buildFeedbackPrompt } from './prompts.js';

function getGeminiApiKey(): string {
  const key = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  return key.trim().replace(/^['"]|['"]$/g, '');
}

function getGeminiModel(): string {
  const raw = env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  return raw.trim().replace(/^['"]|['"]$/g, '');
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment');
  }
  return new GoogleGenAI({ apiKey });
}

function formatGeminiError(err: any): string {
  if (!err) return 'Unknown Gemini Error';

  const constructorName = err?.constructor?.name || typeof err;
  const status = err?.status ?? err?.code ?? 'N/A';
  const rawMessage = err?.message ?? (typeof err === 'string' ? err : '');

  let parsedInnerMessage = '';
  if (typeof rawMessage === 'string' && rawMessage.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawMessage);
      parsedInnerMessage = parsed.error?.message || parsed.message || rawMessage;
    } catch {
      parsedInnerMessage = rawMessage;
    }
  } else {
    parsedInnerMessage = String(rawMessage);
  }

  const innerErr = err?.error || {};
  const innerMsg = innerErr.message || parsedInnerMessage || 'No message provided';
  const innerCode = err?.code || innerErr.code || 'N/A';
  const statusText = err?.statusText || innerErr.status || 'N/A';

  const stringifiedObj = (() => {
    try {
      return JSON.stringify(err, Object.getOwnPropertyNames(err));
    } catch {
      return String(err);
    }
  })();

  const summaryText = `[Constructor: ${constructorName}] [Status: ${status}] [Code: ${innerCode}] [StatusText: ${statusText}] [Message: ${innerMsg}] [FullBody: ${stringifiedObj}]`;
  return summaryText.replace(/AIzaSy[A-Za-z0-9_-]{35}/g, '[REDACTED_KEY]');
}

function parseJSONResponse<T>(text: string): T {
  let cleaned = (text || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned) as T;
}

export async function generateWithRetry(ai: GoogleGenAI, prompt: string, modelName: string, config: any): Promise<any> {
  const fallbackModel = env.GEMINI_FALLBACK_MODEL || process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash';
  const startTime = Date.now();
  const TIME_CAP = 25000;
  
  let primary503Retries = 0;
  let primary429Retries = 0;
  let fallback503Retries = 0;
  let useFallback = false;

  while (true) {
    if (Date.now() - startTime > TIME_CAP) {
      throw { status: 503, message: 'AI Provider timeout (25s cap reached)' };
    }

    const currentModel = useFallback ? fallbackModel : modelName;

    try {
      return await ai.models.generateContent({
        model: currentModel,
        contents: prompt,
        config,
      });
    } catch (err: any) {
      const status = err?.status ?? err?.code ?? err?.response?.status;
      const isTransient = status === 503 || status === 429 || status === 500 || 
                          err?.message?.includes('ETIMEDOUT') || 
                          err?.message?.includes('ECONNRESET');
      const isFatal = status === 400 || status === 401 || status === 403 || status === 404;

      if (isFatal) {
        if (useFallback && status === 404) {
          console.log(`[Gemini] fallback model ${currentModel} is not available for this key. Update GEMINI_FALLBACK_MODEL.`);
        }
        throw err;
      }
      
      if (!isTransient) {
        throw err;
      }

      let delayMs = 1000;

      if (!useFallback) {
        if (status === 503 || status === 500 || err?.message?.includes('ETIMEDOUT') || err?.message?.includes('ECONNRESET')) {
          if (primary503Retries < 2) {
            console.log(`[Gemini] retry ${primary503Retries + 1} after ${status}`);
            delayMs = primary503Retries === 0 ? 1000 : 2000;
            primary503Retries++;
          } else {
            console.log(`[Gemini] using fallback model ${fallbackModel}`);
            useFallback = true;
            continue;
          }
        } else if (status === 429) {
          if (primary429Retries < 1) {
            console.log(`[Gemini] retry ${primary429Retries + 1} after ${status}`);
            delayMs = 1000;
            primary429Retries++;
          } else {
            console.log(`[Gemini] using fallback model ${fallbackModel}`);
            useFallback = true;
            continue;
          }
        }
      } else {
        if (status === 503 || status === 500 || err?.message?.includes('ETIMEDOUT') || err?.message?.includes('ECONNRESET')) {
          if (fallback503Retries < 2) {
            console.log(`[Gemini] retry ${fallback503Retries + 1} after ${status}`);
            delayMs = fallback503Retries === 0 ? 1000 : 2000;
            fallback503Retries++;
          } else {
            throw err;
          }
        } else if (status === 429) {
          throw err;
        }
      }

      delayMs += Math.random() * 500;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
}

export default function createGeminiProvider(): AIProvider {
  return {
    async generateQuestion(context: Record<string, any>): Promise<AIQuestion> {
      const role = String(context.candidate?.role ?? 'AI Engineer');
      const modelName = getGeminiModel();
      const hasApiKey = Boolean(getGeminiApiKey());
      console.log(`[AI Provider] Gemini - Generating question for role "${role}" | GEMINI_MODEL=${modelName} | API key configured: ${hasApiKey}`);

      try {
        const ai = getGeminiClient();
        const model = getGeminiModel();
        const prompt = buildQuestionPrompt(context);

        const response = await generateWithRetry(ai, prompt, model, {
          responseMimeType: 'application/json',
        });

        const responseText = response.text ?? '';
        if (!responseText) {
          throw new Error('Received empty response from Gemini API');
        }

        const parsed = parseJSONResponse<{ question?: string; text?: string; topic?: string; difficulty?: 'easy' | 'medium' | 'hard' }>(responseText);
        const questionText = String(parsed.question || parsed.text || '').trim();

        if (!questionText) {
          throw new Error('Gemini API returned JSON without a valid question string');
        }

        return {
          questionId: `q-gemini-${Date.now()}`,
          text: questionText,
          topic: parsed.topic || 'Role Competencies',
          difficulty: parsed.difficulty || 'medium',
        };
      } catch (err: any) {
        const formatted = formatGeminiError(err);
        console.error(`[Gemini Error] generateQuestion failed | GEMINI_MODEL=${modelName} | API key configured: ${hasApiKey} | Error:\n${formatted}`);
        throw new Error(`Gemini Provider Error: ${formatted}`);
      }
    },

    async evaluateAnswer(context: Record<string, any>): Promise<AIEvaluation> {
      const modelName = getGeminiModel();
      const hasApiKey = Boolean(getGeminiApiKey());
      console.log(`[AI Provider] Gemini - Evaluating candidate answer | GEMINI_MODEL=${modelName} | API key configured: ${hasApiKey}`);

      try {
        const ai = getGeminiClient();
        const model = getGeminiModel();
        const prompt = buildEvaluationPrompt(context);

        let parsed: any = {};
        for (let attempt = 1; attempt <= 2; attempt++) {
          const response = await generateWithRetry(ai, prompt, model, {
            responseMimeType: 'application/json',
          });
          const responseText = response.text ?? '';
          if (!responseText) {
            throw new Error('Received empty evaluation response from Gemini API');
          }
          parsed = parseJSONResponse<{
            correctness?: number;
            relevance?: number;
            technicalDepth?: number;
            communication?: number;
            strengths?: string[];
            weaknesses?: string[];
            missingConcepts?: string[];
            assessment?: string;
          }>(responseText);

          const { correctness, relevance, technicalDepth, communication } = parsed;
          if (Number.isFinite(correctness) && Number.isFinite(relevance) && Number.isFinite(technicalDepth) && Number.isFinite(communication)) {
            break;
          }
          if (attempt === 2) {
            throw new Error('Gemini API returned invalid numeric scores for evaluation after retry.');
          }
          console.log('[Gemini] Retrying evaluation due to missing/invalid numeric scores');
        }

        const clamp = (val: number) => Math.max(0, Math.min(100, Number(val)));

        return {
          correctness: clamp(parsed.correctness),
          relevance: clamp(parsed.relevance),
          technicalDepth: clamp(parsed.technicalDepth),
          communication: clamp(parsed.communication),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Demonstrated role technical understanding'],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
          assessment: String(parsed.assessment || 'Answer evaluated by Gemini LLM.'),
        };
      } catch (err: any) {
        const formatted = formatGeminiError(err);
        console.error(`[Gemini Error] evaluateAnswer failed | GEMINI_MODEL=${modelName} | API key configured: ${hasApiKey} | Error:\n${formatted}`);
        throw new Error(`Gemini Provider Error: ${formatted}`);
      }
    },

    async generateFeedback(context: Record<string, any>): Promise<AIFeedback> {
      const role = String(context.candidate?.role ?? 'AI Engineer');
      const modelName = getGeminiModel();
      const hasApiKey = Boolean(getGeminiApiKey());
      console.log(`[AI Provider] Gemini - Generating final feedback report for "${role}" | GEMINI_MODEL=${modelName} | API key configured: ${hasApiKey}`);

      try {
        const ai = getGeminiClient();
        const model = getGeminiModel();
        const prompt = buildFeedbackPrompt(context);

        const response = await generateWithRetry(ai, prompt, model, {
          responseMimeType: 'application/json',
        });

        const responseText = response.text ?? '';
        if (!responseText) {
          throw new Error('Received empty feedback response from Gemini API');
        }

        const parsed = parseJSONResponse<{
          strengths?: string[];
          weaknesses?: string[];
          improvementAreas?: string[];
          recommendedTopics?: string[];
          summary?: string;
        }>(responseText);

        return {
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          improvementAreas: Array.isArray(parsed.improvementAreas) ? parsed.improvementAreas : [],
          recommendedTopics: Array.isArray(parsed.recommendedTopics) ? parsed.recommendedTopics : [],
          summary: String(parsed.summary || ''),
        } as any;
      } catch (err: any) {
        const formatted = formatGeminiError(err);
        console.error(`[Gemini Error] generateFeedback failed | GEMINI_MODEL=${modelName} | API key configured: ${hasApiKey} | Error:\n${formatted}`);
        throw new Error(`Gemini Provider Error: ${formatted}`);
      }
    },
  };
}

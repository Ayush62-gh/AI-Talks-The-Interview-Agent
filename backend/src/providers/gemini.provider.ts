import { GoogleGenAI } from '@google/genai';
import env from '../config/env.js';
import type { AIProvider, AIQuestion, AIEvaluation, AIFeedback } from './ai.provider.js';
import { buildQuestionPrompt, buildEvaluationPrompt, buildFeedbackPrompt } from './prompts.js';

function getGeminiApiKey(): string {
  const key = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  return key.trim().replace(/^['"]|['"]$/g, '');
}

function getGeminiModel(): string {
  const raw = env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
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
  if (typeof err === 'string') return err;

  const msg = err.message || err.error?.message || err.statusText || (typeof err.error === 'string' ? err.error : '');
  const code = err.code || err.status || err.error?.code || '';
  const status = err.statusText || err.status || err.error?.status || '';

  const parts = [
    code ? `[Code ${code}]` : '',
    status && status !== code ? `[Status ${status}]` : '',
    msg ? msg : JSON.stringify(err),
  ].filter(Boolean);

  return parts.join(' ') || 'Gemini API call failed';
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

export default function createGeminiProvider(): AIProvider {
  return {
    async generateQuestion(context: Record<string, any>): Promise<AIQuestion> {
      const role = String(context.candidate?.role ?? 'AI Engineer');
      console.log(`[AI Provider] Gemini - Generating question for role "${role}"`);

      try {
        const ai = getGeminiClient();
        const model = getGeminiModel();
        const prompt = buildQuestionPrompt(context);

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
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
        console.error(`[Gemini Error] generateQuestion failed (Model "${getGeminiModel()}"): ${formatted}`);
        throw new Error(`Gemini Provider Error: ${formatted}`);
      }
    },

    async evaluateAnswer(context: Record<string, any>): Promise<AIEvaluation> {
      console.log('[AI Provider] Gemini - Evaluating candidate answer');

      try {
        const ai = getGeminiClient();
        const model = getGeminiModel();
        const prompt = buildEvaluationPrompt(context);

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const responseText = response.text ?? '';
        if (!responseText) {
          throw new Error('Received empty evaluation response from Gemini API');
        }

        const parsed = parseJSONResponse<{
          correctness?: number;
          relevance?: number;
          technicalDepth?: number;
          communication?: number;
          strengths?: string[];
          weaknesses?: string[];
          missingConcepts?: string[];
          assessment?: string;
        }>(responseText);

        return {
          correctness: Number(parsed.correctness ?? 70),
          relevance: Number(parsed.relevance ?? 70),
          technicalDepth: Number(parsed.technicalDepth ?? 70),
          communication: Number(parsed.communication ?? 70),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Demonstrated role technical understanding'],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
          assessment: String(parsed.assessment || 'Answer evaluated by Gemini LLM.'),
        };
      } catch (err: any) {
        const formatted = formatGeminiError(err);
        console.error(`[Gemini Error] evaluateAnswer failed (Model "${getGeminiModel()}"): ${formatted}`);
        throw new Error(`Gemini Provider Error: ${formatted}`);
      }
    },

    async generateFeedback(context: Record<string, any>): Promise<AIFeedback> {
      const role = String(context.candidate?.role ?? 'AI Engineer');
      console.log(`[AI Provider] Gemini - Generating final feedback report for "${role}"`);

      try {
        const ai = getGeminiClient();
        const model = getGeminiModel();
        const prompt = buildFeedbackPrompt(context);

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const responseText = response.text ?? '';
        if (!responseText) {
          throw new Error('Received empty feedback response from Gemini API');
        }

        const parsed = parseJSONResponse<{
          overallScore?: number;
          technicalScore?: number;
          communicationScore?: number;
          problemSolvingScore?: number;
          strengths?: string[];
          weaknesses?: string[];
          improvementAreas?: string[];
          recommendedTopics?: string[];
          summary?: string;
        }>(responseText);

        return {
          overallScore: Number(parsed.overallScore ?? 75),
          technicalScore: Number(parsed.technicalScore ?? 75),
          communicationScore: Number(parsed.communicationScore ?? 75),
          problemSolvingScore: Number(parsed.problemSolvingScore ?? 75),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Completed technical interview session'],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          improvementAreas: Array.isArray(parsed.improvementAreas) ? parsed.improvementAreas : ['Review core domain topics'],
          recommendedTopics: Array.isArray(parsed.recommendedTopics) ? parsed.recommendedTopics : [role],
          summary: String(parsed.summary || `Executive Evaluation Report for ${role}.`),
        };
      } catch (err: any) {
        const formatted = formatGeminiError(err);
        console.error(`[Gemini Error] generateFeedback failed (Model "${getGeminiModel()}"): ${formatted}`);
        throw new Error(`Gemini Provider Error: ${formatted}`);
      }
    },
  };
}

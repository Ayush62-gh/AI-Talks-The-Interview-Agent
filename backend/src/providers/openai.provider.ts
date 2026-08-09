import env from '../config/env.js';
import type { AIProvider, AIQuestion, AIEvaluation, AIFeedback } from './ai.provider.js';
import { buildQuestionPrompt, buildEvaluationPrompt, buildFeedbackPrompt } from './prompts.js';
import createMockProvider from './mock.provider.js';

const OPENAI_API_BASE = 'https://api.openai.com/v1';
const AI_TIMEOUT_MS = 15_000;

function isValidApiKey(): boolean {
  const key = process.env.AI_API_KEY ? String(process.env.AI_API_KEY).trim() : '';
  return Boolean(key && key.startsWith('sk-') && !key.includes('your-actual') && key.length > 20);
}

function assertApiKey() {
  if (!isValidApiKey()) {
    throw new Error('AI API key not configured or invalid');
  }
}

async function callOpenAI(payload: any) {
  assertApiKey();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY?.trim()}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`OpenAI error: ${res.status}`);
    }
    const json = await res.json();
    return json;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export default function createOpenAIProvider(): AIProvider {
  const fallback = createMockProvider();

  return {
    async generateQuestion(context) {
      if (!isValidApiKey()) {
        return fallback.generateQuestion(context);
      }
      try {
        const model = process.env.AI_MODEL || 'gpt-4o';
        const systemPrompt = buildQuestionPrompt(context);
        const userPrompt = `Context: ${JSON.stringify(context)}`;

        const payload = {
          model,
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
          max_tokens: 400,
          temperature: 0.2,
        };

        const out = await callOpenAI(payload);
        const text = out.choices?.[0]?.message?.content ?? '';
        let parsed: any = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          const m = text.match(/\{[\s\S]*\}/);
          parsed = m ? JSON.parse(m[0]) : { question: text };
        }

        const safeQuestion = String(parsed?.question ?? '').trim();
        if (!safeQuestion) {
          return fallback.generateQuestion(context);
        }

        return {
          questionId: `q-${Date.now()}`,
          text: safeQuestion,
          topic: parsed?.topic,
          difficulty: parsed?.difficulty,
        } as AIQuestion;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[AI Warning] OpenAI request failed (${err instanceof Error ? err.message : err}). Falling back to mock question.`);
        return fallback.generateQuestion(context);
      }
    },

    async evaluateAnswer(context) {
      if (!isValidApiKey()) {
        return fallback.evaluateAnswer(context);
      }
      try {
        const model = process.env.AI_MODEL || 'gpt-4o';
        const systemPrompt = buildEvaluationPrompt(context);
        const userPrompt = `Context: ${JSON.stringify(context)}`;

        const payload = {
          model,
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
          max_tokens: 500,
          temperature: 0.0,
        };

        const out = await callOpenAI(payload);
        const text = out.choices?.[0]?.message?.content ?? '';
        let parsed: any = {};
        try {
          parsed = JSON.parse(text);
        } catch {
          const m = text.match(/\{[\s\S]*\}/);
          parsed = m ? JSON.parse(m[0]) : {};
        }

        return {
          correctness: Number(parsed.correctness ?? 0),
          relevance: Number(parsed.relevance ?? 0),
          technicalDepth: Number(parsed.technicalDepth ?? 0),
          communication: Number(parsed.communication ?? 0),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
          assessment: String(parsed.assessment ?? ''),
        } as AIEvaluation;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[AI Warning] OpenAI evaluateAnswer failed (${err instanceof Error ? err.message : err}). Falling back to mock evaluation.`);
        return fallback.evaluateAnswer(context);
      }
    },

    async generateFeedback(context) {
      if (!isValidApiKey()) {
        return fallback.generateFeedback(context);
      }
      try {
        const model = process.env.AI_MODEL || 'gpt-4o';
        const systemPrompt = buildFeedbackPrompt(context);
        const userPrompt = `Context: ${JSON.stringify(context)}`;

        const payload = {
          model,
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
          max_tokens: 800,
          temperature: 0.2,
        };

        const out = await callOpenAI(payload);
        const text = out.choices?.[0]?.message?.content ?? '';
        let parsed: any = {};
        try {
          parsed = JSON.parse(text);
        } catch {
          const m = text.match(/\{[\s\S]*\}/);
          parsed = m ? JSON.parse(m[0]) : {};
        }

        return {
          overallScore: Number(parsed.overallScore ?? 0),
          technicalScore: Number(parsed.technicalScore ?? 0),
          communicationScore: Number(parsed.communicationScore ?? 0),
          problemSolvingScore: Number(parsed.problemSolvingScore ?? 0),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          improvementAreas: Array.isArray(parsed.improvementAreas) ? parsed.improvementAreas : [],
          recommendedTopics: Array.isArray(parsed.recommendedTopics) ? parsed.recommendedTopics : [],
          summary: String(parsed.summary ?? ''),
        } as AIFeedback;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[AI Warning] OpenAI generateFeedback failed (${err instanceof Error ? err.message : err}). Falling back to mock feedback.`);
        return fallback.generateFeedback(context);
      }
    },
  };
}

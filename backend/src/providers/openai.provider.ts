import env from '../config/env.js';
import type { AIProvider, AIQuestion, AIEvaluation, AIFeedback } from './ai.provider.js';

const OPENAI_API_BASE = 'https://api.openai.com/v1';

function assertApiKey() {
  if (!process.env.AI_API_KEY) {
    throw new Error('AI API key not configured');
  }
}

async function callOpenAI(payload: any) {
  assertApiKey();
  const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${txt}`);
  }
  const json = await res.json();
  return json;
}

export default function createOpenAIProvider(): AIProvider {
  return {
    async generateQuestion(context) {
      const model = process.env.AI_MODEL || 'gpt-4o';
      const prompt = `You are a professional technical interviewer. Based on the context: ${JSON.stringify(
        context,
      )} generate a single clear interview question as JSON: {"question":"...","topic":"...","difficulty":"easy|medium|hard"}. Respond with JSON only.`;

      const payload = {
        model,
        messages: [{ role: 'system', content: 'You are a technical interviewer.' }, { role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.2,
      };

      const out = await callOpenAI(payload);
      const text = out.choices?.[0]?.message?.content ?? '';
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        // fallback - attempt to extract JSON
        const m = text.match(/\{[\s\S]*\}/);
        parsed = m ? JSON.parse(m[0]) : { question: text };
      }

      return {
        questionId: `q-${Date.now()}`,
        text: parsed.question ?? String(parsed),
        topic: parsed.topic,
        difficulty: parsed.difficulty,
      } as AIQuestion;
    },

    async evaluateAnswer(context) {
      const model = process.env.AI_MODEL || 'gpt-4o';
      const prompt = `You are a technical interviewer evaluator. Given context: ${JSON.stringify(
        context,
      )} respond with JSON: {"correctness":0..100,"relevance":0..100,"technicalDepth":0..100,"communication":0..100,"strengths":[],"weaknesses":[],"missingConcepts":[],"assessment":"..."}`;

      const payload = {
        model,
        messages: [{ role: 'system', content: 'You are an interviewer evaluator.' }, { role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.0,
      };

      const out = await callOpenAI(payload);
      const text = out.choices?.[0]?.message?.content ?? '';
      let parsed = {} as any;
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
        assessment: parsed.assessment ?? '',
      } as AIEvaluation;
    },

    async generateFeedback(context) {
      const model = process.env.AI_MODEL || 'gpt-4o';
      const prompt = `You are a professional interviewer producing detailed feedback. Given context: ${JSON.stringify(
        context,
      )} respond with JSON: {"overallScore":0..100,"technicalScore":0..100,"communicationScore":0..100,"problemSolvingScore":0..100,"strengths":[],"weaknesses":[],"improvementAreas":[],"recommendedTopics":[],"summary":"..."}`;

      const payload = {
        model,
        messages: [{ role: 'system', content: 'You are a professional interviewer providing final feedback.' }, { role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.2,
      };

      const out = await callOpenAI(payload);
      const text = out.choices?.[0]?.message?.content ?? '';
      let parsed = {} as any;
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
    },
  };
}

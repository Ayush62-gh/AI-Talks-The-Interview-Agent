import test from 'node:test';
import assert from 'node:assert/strict';
import { validateStartInterviewRequest, validateSubmitAnswerRequest } from '../dist/utils/validation.js';

test('rejects incomplete start request payloads', () => {
  const result = validateStartInterviewRequest({});

  assert.equal(result.error?.code, 'VALIDATION_ERROR');
  assert.match(result.error?.message, /candidate/i);
});

test('rejects submit payloads with missing session or message', () => {
  const invalidSession = validateSubmitAnswerRequest({ sessionId: '' });
  const invalidMessage = validateSubmitAnswerRequest({ sessionId: 'session-1', message: '' });

  assert.equal(invalidSession.error?.code, 'VALIDATION_ERROR');
  assert.match(invalidSession.error?.message, /sessionId/i);
  assert.equal(invalidMessage.error?.code, 'VALIDATION_ERROR');
  assert.match(invalidMessage.error?.message, /message/i);
});

test('rejects unsupported role values and invalid question counts', () => {
  const result = validateStartInterviewRequest({
    candidate: {
      role: 'Space Explorer',
      experienceLevel: 'Mid Level',
      interviewType: 'Technical Interview',
      questionCount: 12,
    },
  });

  assert.equal(result.error?.code, 'VALIDATION_ERROR');
});

test('rejects answers that are excessively long', () => {
  const result = validateSubmitAnswerRequest({
    sessionId: 'session-1',
    message: 'x'.repeat(5001),
  });

  assert.equal(result.error?.code, 'VALIDATION_ERROR');
});

test('accepts valid interview payloads', () => {
  const start = validateStartInterviewRequest({
    candidate: {
      role: 'Software Engineer',
      experienceLevel: 'Mid Level',
      interviewType: 'Technical Interview',
      questionCount: 3,
    },
  });

  const submit = validateSubmitAnswerRequest({
    sessionId: 'session-1',
    message: 'I have used React hooks before.',
  });

  assert.equal(start.error, undefined);
  assert.equal(submit.error, undefined);
});

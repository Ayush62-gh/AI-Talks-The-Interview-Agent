export interface ValidationErrorLike {
  code: string;
  message: string;
}

export interface ValidationResult<T> {
  value?: T;
  error?: ValidationErrorLike;
}

const VALID_ROLES = new Set(['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'AI Engineer', 'Java Backend Developer', 'Data Analyst']);
const VALID_EXPERIENCE = new Set(['Fresher', 'Junior', 'Mid Level', 'Senior']);
const VALID_INTERVIEW_TYPES = new Set(['Technical Interview', 'Behavioral Interview', 'System Design Interview']);

export function validateStartInterviewRequest(body: any): ValidationResult<any> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: { code: 'VALIDATION_ERROR', message: 'candidate is required' } };
  }

  const candidate = body.candidate;
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return { error: { code: 'VALIDATION_ERROR', message: 'candidate is required' } };
  }

  const { role, experienceLevel, interviewType, questionCount } = candidate;
  if (!role || !experienceLevel || !interviewType || typeof questionCount !== 'number') {
    return { error: { code: 'VALIDATION_ERROR', message: 'Invalid candidate payload' } };
  }

  if (!VALID_ROLES.has(String(role))) {
    return { error: { code: 'VALIDATION_ERROR', message: 'Unsupported role value' } };
  }

  if (!VALID_EXPERIENCE.has(String(experienceLevel))) {
    return { error: { code: 'VALIDATION_ERROR', message: 'Unsupported experience level' } };
  }

  if (!VALID_INTERVIEW_TYPES.has(String(interviewType))) {
    return { error: { code: 'VALIDATION_ERROR', message: 'Unsupported interview type' } };
  }

  if (questionCount < 1 || questionCount > 15) {
    return { error: { code: 'VALIDATION_ERROR', message: 'questionCount must be between 1 and 15' } };
  }

  return { value: body };
}

export function validateSubmitAnswerRequest(body: any): ValidationResult<any> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: { code: 'VALIDATION_ERROR', message: 'sessionId and message are required' } };
  }

  const sessionId = String(body.sessionId ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!sessionId || sessionId.length > 128) {
    return { error: { code: 'VALIDATION_ERROR', message: 'sessionId is required for submitting answers' } };
  }

  if (!message || message.length > 4000) {
    return { error: { code: 'VALIDATION_ERROR', message: 'message is required' } };
  }

  return { value: { sessionId, message } };
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewConfig, InterviewFeedback, InterviewQuestion, Message, InterviewFullSession, InterviewTopicMetadata } from '../types/interview';
import * as api from '../services/api';
import { loadInterviewSession, saveInterviewSession } from '../services/session';

interface InterviewContextValue {
  config: InterviewConfig | null;
  sessionId: string;
  currentQuestion: InterviewQuestion | null;
  totalQuestions: number;
  messages: Message[];
  loading: boolean;
  error: string | null;
  questionNumber: number;
  interviewCompleted: boolean;
  feedback: InterviewFeedback | null;
  progress: number;
  startInterview: (config: InterviewConfig) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  restartInterview: () => void;
  clearError: () => void;
}

interface PersistedInterviewState {
  config: InterviewConfig | null;
  sessionId: string;
  currentQuestion: InterviewQuestion | null;
  totalQuestions: number;
  messages: Message[];
  questionNumber: number;
  interviewCompleted: boolean;
  feedback: InterviewFeedback | null;
  sessionStartedAt: string | null;
  sessionData: InterviewFullSession | null;
}

const InterviewContext = createContext<InterviewContextValue | undefined>(undefined);
const STORAGE_KEY = 'aiInterviewSessionState';

const fallbackTopicMetadata = (step: number): InterviewTopicMetadata => {
  const topics: InterviewTopicMetadata[] = [
    { day: 7, topic: 'Embeddings', module: 'AI Foundations', difficulty: 'Medium' },
    { day: 12, topic: 'RAG', module: 'AI Foundations', difficulty: 'Medium' },
    { day: 23, topic: 'MCP', module: 'AI Systems', difficulty: 'Hard' },
    { day: 28, topic: 'Deployment', module: 'Production AI', difficulty: 'Medium' },
  ];

  return topics[(step - 1) % topics.length];
};

const createMessage = (
  sender: Message['sender'],
  text: string,
  type: Message['type'],
  metadata?: InterviewTopicMetadata,
  isFollowUp = false,
): Message => ({
  id: `${Date.now()}-${sender}`,
  sender,
  text,
  timestamp: new Date().toISOString(),
  type,
  day: metadata?.day,
  topic: metadata?.topic,
  difficulty: metadata?.difficulty,
  isFollowUp,
});

const initialSessionState = (): PersistedInterviewState => {
  if (typeof window === 'undefined') {
    return {
      config: null,
      sessionId: '',
      currentQuestion: null,
      totalQuestions: 0,
      messages: [],
      questionNumber: 0,
      interviewCompleted: false,
      feedback: null,
      sessionStartedAt: null,
      sessionData: null,
    };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        config: null,
        sessionId: '',
        currentQuestion: null,
        totalQuestions: 0,
        messages: [],
        questionNumber: 0,
        interviewCompleted: false,
        feedback: null,
        sessionStartedAt: null,
        sessionData: null,
      };
    }
    return JSON.parse(stored) as PersistedInterviewState;
  } catch {
    return {
      config: null,
      sessionId: '',
      currentQuestion: null,
      totalQuestions: 0,
      messages: [],
      questionNumber: 0,
      interviewCompleted: false,
      feedback: null,
      sessionStartedAt: null,
      sessionData: null,
    };
  }
};

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const storedState = initialSessionState();

  const [config, setConfig] = useState<InterviewConfig | null>(storedState.config);
  const [sessionId, setSessionId] = useState(storedState.sessionId);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(storedState.currentQuestion);
  const [totalQuestions, setTotalQuestions] = useState(storedState.totalQuestions);
  const [sessionData, setSessionData] = useState<InterviewFullSession | null>(storedState.sessionData ?? loadInterviewSession());
  const [messages, setMessages] = useState<Message[]>(storedState.messages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(storedState.questionNumber);
  const [interviewCompleted, setInterviewCompleted] = useState(storedState.interviewCompleted);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(storedState.feedback);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(storedState.sessionStartedAt);

  const progress = useMemo(() => {
    if (totalQuestions <= 0) return 0;
    return Math.round((questionNumber / totalQuestions) * 100);
  }, [questionNumber, totalQuestions]);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          config,
          sessionId,
          currentQuestion,
          totalQuestions,
          messages,
          questionNumber,
          interviewCompleted,
          feedback,
          sessionStartedAt,
          sessionData,
        }),
      );
    }
  }, [config, currentQuestion, feedback, interviewCompleted, messages, questionNumber, sessionId, sessionStartedAt, totalQuestions]);

  const startInterview = useCallback(
    async (setupConfig: InterviewConfig) => {
      if (loading) {
        return;
      }

      setLoading(true);
      setError(null);
      setConfig(setupConfig);
      setInterviewCompleted(false);
      setFeedback(null);
      setQuestionNumber(0);
      setTotalQuestions(setupConfig.questionCount);
      setSessionStartedAt(new Date().toISOString());

      try {
        const response = await api.startInterview(setupConfig);
        const sessionIdFromServer = response.sessionId ?? '';
        const firstQuestionText = response.firstQuestion?.text ?? response.reply ?? '';

        if (!sessionIdFromServer) {
          throw new Error('No session id returned by the server');
        }

        const initialMetadata = fallbackTopicMetadata(1);
        const nextSession: InterviewFullSession = {
          sessionId: sessionIdFromServer,
          role: setupConfig.role,
          experienceLevel: setupConfig.experienceLevel,
          interviewType: setupConfig.interviewType,
          questionCount: response.totalQuestions ?? setupConfig.questionCount,
          currentQuestionIndex: 0,
          questions: [
            {
              id: response.firstQuestion?.questionId ?? 'server-question',
              question: firstQuestionText,
              completed: false,
              answer: null,
            },
          ],
          answers: {},
          createdAt: new Date().toISOString(),
        };

        setSessionData(nextSession);
        setSessionId(sessionIdFromServer);
        setTotalQuestions(nextSession.questionCount);
        setQuestionNumber(1);
        setCurrentQuestion({ questionId: response.firstQuestion?.questionId ?? 'server-question', text: firstQuestionText, metadata: initialMetadata });
        setMessages([createMessage('ai', firstQuestionText, 'question', initialMetadata, false)]);
        saveInterviewSession(nextSession);
        navigate('/interview');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unable to connect to the interview server. Please try again.';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (loading || !sessionId || !currentQuestion || !config) {
        setError('Your session is not initialized correctly. Please restart the interview.');
        return;
      }
      setLoading(true);
      setError(null);
      appendMessage(createMessage('candidate', answer, 'answer'));

      try {
        const s = sessionData;
        if (s) {
          const idx = s.currentQuestionIndex;
          if (!s.questions[idx]) {
            s.questions[idx] = {
              id: currentQuestion?.questionId ?? `q-${Date.now()}`,
              question: currentQuestion?.text ?? '',
              completed: false,
              answer: null,
            };
          }
          const q = s.questions[idx];
          if (q) {
            q.answer = answer;
            q.completed = true;
            s.answers[q.id] = answer;
          }
          s.currentQuestionIndex = s.currentQuestionIndex + 1;
          setSessionData({ ...s });
          saveInterviewSession(s);
        }

        const askedQuestionsList = messages.filter((m) => m.sender === 'ai').map((m) => m.text);
        const response = await api.submitAnswer(sessionId, currentQuestion.questionId, answer, {
          role: config.role,
          experienceLevel: config.experienceLevel,
          interviewType: config.interviewType,
          questionCount: totalQuestions,
          currentQuestionIndex: questionNumber,
          askedQuestions: askedQuestionsList,
        });

        if (response.done) {
          setInterviewCompleted(true);
          const feedbackPayload = response.feedback ?? null;
          setFeedback(feedbackPayload);
          navigate('/complete', { state: { feedback: feedbackPayload } });
          return;
        }

        const nextText = response.nextQuestion?.text ?? response.reply ?? '';
        if (nextText) {
          const nextMetadata = fallbackTopicMetadata(questionNumber + 1);
          const followUp = questionNumber > 0;
          const nextQId = response.nextQuestion?.questionId ?? `${Date.now()}-next`;
          setCurrentQuestion({ questionId: nextQId, text: nextText, metadata: nextMetadata });
          appendMessage(createMessage('ai', nextText, followUp ? 'followup' : 'question', nextMetadata, followUp));

          if (s) {
            s.questions.push({
              id: nextQId,
              question: nextText,
              completed: false,
              answer: null,
            });
            setSessionData({ ...s });
            saveInterviewSession(s);
          }
        }
        if (typeof response.progress === 'number') {
          setQuestionNumber(response.progress);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to connect to the interview server. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [appendMessage, config, currentQuestion, navigate, sessionId],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const restartInterview = useCallback(() => {
    setSessionId('');
    setConfig(null);
    setCurrentQuestion(null);
    setTotalQuestions(0);
    setMessages([]);
    setLoading(false);
    setError(null);
    setQuestionNumber(0);
    setInterviewCompleted(false);
    setFeedback(null);
    setSessionStartedAt(null);
    setSessionData(null);
    window.localStorage.removeItem(STORAGE_KEY);
    navigate('/setup');
  }, [navigate]);

  const value = useMemo(
    () => ({
      config,
      sessionId,
      currentQuestion,
      totalQuestions,
      messages,
      loading,
      error,
      questionNumber,
      interviewCompleted,
      feedback,
      progress,
      startInterview,
      submitAnswer,
      restartInterview,
      clearError,
    }),
    [config, currentQuestion, error, feedback, interviewCompleted, loading, messages, progress, questionNumber, restartInterview, clearError, sessionId, startInterview, submitAnswer, totalQuestions],
  );

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}

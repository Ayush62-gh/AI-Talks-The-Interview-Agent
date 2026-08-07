import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewConfig, InterviewFeedback, InterviewQuestion, Message, InterviewFullSession } from '../types/interview';
import * as api from '../services/api';
import { createInterviewSession, loadInterviewSession, saveInterviewSession } from '../services/session';

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
      navigate('/interview');
      setLoading(true);
      setError(null);
      setConfig(setupConfig);
      setInterviewCompleted(false);
      setFeedback(null);
      setQuestionNumber(0);
      setTotalQuestions(setupConfig.questionCount);
      setSessionStartedAt(new Date().toISOString());

      try {
        const session = await createInterviewSession(setupConfig);
        setSessionData(session);
        setSessionId(session.sessionId);
        setTotalQuestions(session.questionCount);
        setQuestionNumber(1);
        const first = session.questions[0];
        setCurrentQuestion({ questionId: first.id, text: first.question });
        setMessages([
          {
            id: `${Date.now()}-ai`,
            sender: 'ai',
            text: first.question,
            timestamp: new Date().toISOString(),
          },
        ]);
        saveInterviewSession(session);
      } catch (err) {
        setError('Unable to initialize the interview. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!sessionId || !currentQuestion || !config) {
        setError('Your session is not initialized correctly. Please restart the interview.');
        return;
      }
      setLoading(true);
      setError(null);
      appendMessage({ id: `${Date.now()}-candidate`, sender: 'candidate', text: answer, timestamp: new Date().toISOString() });

      try {
        // store locally
        const s = sessionData;
        if (s) {
          const idx = s.currentQuestionIndex;
          const q = s.questions[idx];
          q.answer = answer;
          q.completed = true;
          s.answers[q.id] = answer;
          s.currentQuestionIndex = Math.min(s.questionCount - 1, s.currentQuestionIndex + 1);
          setSessionData({ ...s });
          saveInterviewSession(s);
        }

        // Call API to get next question / completion state (keeps architecture LLM-ready)
        const response = await api.submitAnswer(sessionId, currentQuestion.questionId, answer);

        if (response.done) {
          setInterviewCompleted(true);
          setFeedback(response.feedback || null);
          navigate('/complete', { state: { feedback: response.feedback } });
          return;
        }

        if (response.nextQuestion) {
          setCurrentQuestion(response.nextQuestion);
          setQuestionNumber(response.progress);
          appendMessage({ id: `${Date.now()}-ai`, sender: 'ai', text: response.nextQuestion.text, timestamp: new Date().toISOString() });
        }
      } catch (err) {
        setError('There was a problem sending your answer. Retry to continue.');
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

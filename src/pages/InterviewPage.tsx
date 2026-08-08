import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowLeft, FaCommentDots, FaStopwatch, FaTasks } from 'react-icons/fa';
import MessageBubble from '../components/MessageBubble';
import Button from '../components/Button';
import TypingIndicator from '../components/TypingIndicator';
import Toast from '../components/Toast';
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

export default function InterviewPage() {
  const {
    messages,
    loading,
    error,
    questionNumber,
    currentQuestion,
    submitAnswer,
    config,
    totalQuestions,
    sessionId,
  } = useInterview();
  const [draftMessage, setDraftMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const currentTopic = useMemo(() => currentQuestion?.metadata ?? null, [currentQuestion]);
  const questionCount = Math.max(questionNumber, messages.filter((message) => message.sender === 'candidate').length);
  const followUpCount = messages.filter((message) => message.isFollowUp).length;

  useEffect(() => {
    if (messages.length === 0) {
      navigate('/setup');
    }
  }, [messages.length, navigate]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    setOpenError(Boolean(error));
  }, [error]);

  const handleRetry = async () => {
    setOpenError(false);
    if (!draftMessage.trim()) {
      return;
    }
    await submitAnswer(draftMessage.trim());
    setDraftMessage('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!draftMessage.trim() || loading) {
      return;
    }

    await submitAnswer(draftMessage.trim());
    setDraftMessage('');
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_25%)] px-4 py-6 text-slate-900 transition-colors duration-300 sm:px-6 lg:px-10 dark:text-slate-100">
      <Toast
        message={error ?? ''}
        onClose={() => setOpenError(false)}
        onRetry={error ? handleRetry : undefined}
      />

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1.1fr]">
        <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-glass">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Candidate</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{config?.role ?? 'Candidate'}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{config?.interviewType ?? 'Interview session'}</p>
            </div>
            <button onClick={() => navigate('/')} className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">
              <FaArrowLeft />
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <ProgressBar currentQuestion={questionNumber} totalQuestions={totalQuestions} />
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <div className="text-xs uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Current Topic</div>
              <div className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{currentTopic?.topic ?? 'Adaptive interview'}</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {currentTopic?.day ? `Day ${currentTopic.day}` : 'Curriculum-driven'}
                {currentTopic?.module ? ` • ${currentTopic.module}` : ''}
              </div>
              <div className="mt-3 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
                {currentTopic?.difficulty ?? 'Medium'}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Questions answered</span>
                <span className="text-lg font-semibold text-slate-950 dark:text-white">{questionCount}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Follow-ups</span>
                <span className="font-semibold text-slate-950 dark:text-white">{followUpCount}</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <FaStopwatch />
                <span>Live session ready</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4 rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <h2 className="text-sm uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Curriculum Coverage</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {[
                { state: '✓', label: 'Day 7', detail: 'Embeddings' },
                { state: '●', label: 'Day 12', detail: 'RAG' },
                { state: '○', label: 'Day 23', detail: 'MCP' },
                { state: '○', label: 'Day 28', detail: 'Deployment' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 dark:bg-slate-950/70">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</div>
                  </div>
                  <span className="text-base font-semibold text-sky-600 dark:text-sky-300">{item.state}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-96px)] flex-col rounded-[2rem] border border-slate-200/70 bg-white/75 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-glass">
          <div className="border-b border-slate-200/70 px-6 py-5 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Interview Workspace</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">AI Technical Interview</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>LIVE</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{questionCount} Questions</span>
              <span>•</span>
              <span>2 Curriculum Days</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-6 py-6">
            <div className="flex h-full flex-col gap-4 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="grid h-full place-items-center text-slate-500">Preparing your interview…</div>
              ) : (
                messages.map((message) => <MessageBubble key={message.id} message={message} />)
              )}
              {loading ? <TypingIndicator /> : null}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200/70 bg-white/70 px-6 py-5 dark:border-white/10 dark:bg-slate-950/80">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="relative flex-1">
                <textarea
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  disabled={loading}
                  maxLength={320}
                  rows={2}
                  placeholder="Type your answer..."
                  className="min-h-[96px] w-full resize-none rounded-[1.35rem] border border-slate-200/70 bg-slate-50/90 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100"
                />
                <div className="pointer-events-none absolute bottom-3 right-4 text-xs text-slate-500 dark:text-slate-400">
                  {draftMessage.length}/320
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={loading || draftMessage.trim().length === 0}>
                  {loading ? 'Analyzing...' : 'Send Answer'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setDraftMessage('')}>
                  Clear
                </Button>
              </div>
            </div>
          </form>

          <div className="border-t border-slate-200/70 px-6 py-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            <p>All interactions are driven by the API response payload. This UI is fully API-ready.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

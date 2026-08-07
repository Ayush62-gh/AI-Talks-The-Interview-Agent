import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowLeft, FaCommentDots, FaStopwatch, FaTasks } from 'react-icons/fa';
import { motion } from 'framer-motion';
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
    progress,
    currentQuestion,
    submitAnswer,
    restartInterview,
    config,
    totalQuestions,
    sessionId,
  } = useInterview();
  const [draftMessage, setDraftMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const currentTopic = useMemo(() => currentQuestion?.text ?? 'Waiting for the first question', [currentQuestion]);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!draftMessage.trim() || loading) {
      return;
    }

    await submitAnswer(draftMessage.trim());
    setDraftMessage('');
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_25%)] px-4 py-6 sm:px-6 lg:px-10">
      <Toast message={error ?? ''} onClose={() => setOpenError(false)} />

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1.2fr]">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-glass backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Candidate</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">{config?.role ?? 'Candidate'}</h1>
              <p className="text-sm text-slate-400">{config?.interviewType ?? 'Interview session'}</p>
            </div>
            <div className="text-sm text-slate-400 text-right">
              <div>Session ID</div>
              <div className="mt-1 text-slate-200">{sessionId ?? '—'}</div>
            </div>
            <button onClick={() => navigate('/')} className="rounded-2xl bg-white/5 px-3 py-2 text-slate-300 transition hover:bg-white/10">
              <FaArrowLeft />
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <ProgressBar currentQuestion={questionNumber} totalQuestions={totalQuestions} />
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-300">
              <p className="text-slate-200">Current Topic</p>
              <p className="mt-3 text-sm leading-6">{currentTopic}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Questions answered</span>
                <span className="text-slate-100">{questionNumber}</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-400">
                <FaStopwatch />
                <span>Live session ready</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-sm uppercase tracking-[0.24em] text-sky-300">Helpful shortcuts</h2>
            <div className="space-y-3 text-sm text-slate-300">
              <p><span className="font-semibold text-slate-100">Enter</span> send reply</p>
              <p><span className="font-semibold text-slate-100">Esc</span> clear input</p>
              <p className="flex items-center gap-2"><FaTasks /> Responsive interview workspace</p>
            </div>
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-96px)] flex-col rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-glass backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5 text-sm text-slate-300">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Interview Workspace</p>
                <h2 className="mt-1 text-lg font-semibold text-white">AI conversation</h2>
              </div>
              <div className="mt-3 flex items-center gap-2 text-slate-400 sm:mt-0">
                <FaCommentDots />
                <span>{messages.length} messages</span>
              </div>
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

          <form onSubmit={handleSubmit} className="border-t border-white/10 bg-slate-950/80 px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="relative flex-1">
                <textarea
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  disabled={loading}
                  maxLength={320}
                  rows={2}
                  placeholder="Type your answer here..."
                  className="min-h-[96px] w-full resize-none rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-70"
                />
                <div className="pointer-events-none absolute bottom-3 right-4 text-xs text-slate-500">
                  {draftMessage.length}/320
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={loading || draftMessage.trim().length === 0}>
                  {loading ? 'Waiting for AI…' : 'Send Answer'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setDraftMessage('')}>
                  Clear
                </Button>
              </div>
            </div>
          </form>

          <div className="border-t border-white/10 px-6 py-4 text-xs text-slate-500">
            <p>All interactions are driven by the API response payload. This UI is fully API-ready.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { InterviewFeedback } from '../types/interview';
import { useInterview } from '../hooks/useInterview';
import { getInterviewFeedback } from '../services/feedbackService';
import { useEffect, useState } from 'react';

interface LocationState {
  feedback?: InterviewFeedback;
}

export default function CompletePage() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { feedback: fallbackFeedback, restartInterview, sessionId } = useInterview();
  const feedback = state?.feedback ?? fallbackFeedback;

  const [remote, setRemote] = useState<InterviewFeedback | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback && sessionId) {
      (async () => {
        setRemoteLoading(true);
        setRemoteError(null);
        try {
          const fetched = await getInterviewFeedback(sessionId);
          setRemote(fetched);
        } catch {
          setRemoteError('Unable to retrieve feedback from the interview server.');
        } finally {
          setRemoteLoading(false);
        }
      })();
    }
  }, [feedback, sessionId]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glass backdrop-blur-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-blue-500/20 via-violet-500/15 to-fuchsia-500/20 p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Interview completed</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">You’ve reached the end of the session.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              The summary below is driven by the backend feedback response. The UI stays unchanged while the data comes from the API.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="text-lg font-semibold text-white">Summary</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {remoteLoading ? 'Fetching feedback…' : remoteError ? remoteError : feedback?.summary ?? remote?.summary ?? 'No summary available yet.'}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="text-lg font-semibold text-white">Strengths</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {(feedback?.strengths?.length ? feedback.strengths : remote?.strengths || []).length ? (
                  (feedback?.strengths?.length ? feedback.strengths : remote?.strengths || []).map((item) => <li key={item} className="rounded-2xl bg-white/5 p-3">{item}</li>)
                ) : (
                  <li className="rounded-2xl bg-white/5 p-3">No strengths provided.</li>
                )}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="text-lg font-semibold text-white">Gaps</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {(feedback?.weaknesses?.length ? feedback.weaknesses : remote?.weaknesses || []).length ? (
                  (feedback?.weaknesses?.length ? feedback.weaknesses : remote?.weaknesses || []).map((item) => <li key={item} className="rounded-2xl bg-white/5 p-3">{item}</li>)
                ) : (
                  <li className="rounded-2xl bg-white/5 p-3">No weaknesses provided.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-lg font-semibold text-white">Recommended next topics</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {(feedback?.suggestions?.length ? feedback.suggestions : remote?.suggestions || []).length ? (
                (feedback?.suggestions?.length ? feedback.suggestions : remote?.suggestions || []).map((topic) => (
                  <span key={topic} className="rounded-3xl bg-blue-500/10 px-4 py-2 text-sm text-slate-100">{topic}</span>
                ))
              ) : (
                <span className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-200">No recommendations returned.</span>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button onClick={restartInterview}>Restart Interview</Button>
            <Button variant="ghost" onClick={() => window.location.assign('/')}>
              Return to landing page
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

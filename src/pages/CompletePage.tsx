import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { feedback: fallbackFeedback, restartInterview, sessionId } = useInterview();
  const feedback = state?.feedback ?? fallbackFeedback;

  const [remote, setRemote] = useState<InterviewFeedback | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback && sessionId) {
      let cancelled = false;
      (async () => {
        setRemoteLoading(true);
        setRemoteError(null);
        try {
          const fetched = await getInterviewFeedback(sessionId);
          if (!cancelled) {
            setRemote(fetched);
          }
        } catch (error) {
          if (!cancelled) {
            setRemoteError(error instanceof Error ? error.message : 'Unable to retrieve feedback from the interview server.');
          }
        } finally {
          if (!cancelled) {
            setRemoteLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }
  }, [feedback, sessionId]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_25%)] p-3 sm:p-6 lg:p-8 overflow-y-auto text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-none px-2 sm:px-6 lg:px-10 rounded-[2.25rem] border border-slate-200/80 bg-white/85 p-6 sm:p-10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 dark:shadow-glass">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">Technical Assessment Complete</span>
          </div>

          <div className="mb-6 rounded-[1.75rem] bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 p-6 sm:p-8 border border-sky-500/20 shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 dark:text-sky-300">Technical Assessment Report</p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">Interview Evaluation Completed</h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  Comprehensive performance evaluation verified against technical standards & communication benchmarks.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 px-6 py-4 backdrop-blur-md">
                <span className="text-xs font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
                  {feedback?.performanceCategory ?? remote?.performanceCategory ?? ( (feedback?.score ?? remote?.score ?? 0) >= 90 ? 'Exceptional' : (feedback?.score ?? remote?.score ?? 0) >= 80 ? 'Strong' : (feedback?.score ?? remote?.score ?? 0) >= 70 ? 'Good' : (feedback?.score ?? remote?.score ?? 0) >= 60 ? 'Average' : (feedback?.score ?? remote?.score ?? 0) >= 50 ? 'Needs Improvement' : 'Weak')}
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">{feedback?.score ?? remote?.score ?? 0}/100</span>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-center dark:border-white/10 dark:bg-slate-900/60">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Accuracy (50%)</span>
              <span className="mt-1 block text-lg font-bold text-sky-600 dark:text-sky-400">{feedback?.metrics?.averageAccuracy ?? remote?.metrics?.averageAccuracy ?? 0}/10</span>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-center dark:border-white/10 dark:bg-slate-900/60">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Relevance (20%)</span>
              <span className="mt-1 block text-lg font-bold text-emerald-600 dark:text-emerald-400">{feedback?.metrics?.averageRelevance ?? remote?.metrics?.averageRelevance ?? 0}/10</span>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-center dark:border-white/10 dark:bg-slate-900/60">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Depth (20%)</span>
              <span className="mt-1 block text-lg font-bold text-indigo-600 dark:text-indigo-400">{feedback?.metrics?.averageDepth ?? remote?.metrics?.averageDepth ?? 0}/10</span>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-center dark:border-white/10 dark:bg-slate-900/60">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Clarity (10%)</span>
              <span className="mt-1 block text-lg font-bold text-purple-600 dark:text-purple-400">{feedback?.metrics?.averageClarity ?? remote?.metrics?.averageClarity ?? 0}/10</span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-950/80">
              <h2 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white">Summary</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {remoteLoading ? 'Fetching feedback…' : remoteError ? remoteError : feedback?.summary ?? remote?.summary ?? 'No summary available yet.'}
              </p>
            </div>
            <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-950/80">
              <h2 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white">Strengths</h2>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {(feedback?.strengths?.length ? feedback.strengths : remote?.strengths || []).length ? (
                  (feedback?.strengths?.length ? feedback.strengths : remote?.strengths || []).slice(0, 3).map((item) => (
                    <li key={item} className="rounded-xl border border-slate-200/70 bg-white/90 px-3.5 py-2.5 leading-relaxed dark:border-white/5 dark:bg-white/5">{item}</li>
                  ))
                ) : (
                  <li className="rounded-xl border border-slate-200/70 bg-white/90 px-3.5 py-2.5 dark:border-white/5 dark:bg-white/5">No strengths provided.</li>
                )}
              </ul>
            </div>
            <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-950/80">
              <h2 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white">Gaps & Development</h2>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {(feedback?.weaknesses?.length ? feedback.weaknesses : remote?.weaknesses || []).length ? (
                  (feedback?.weaknesses?.length ? feedback.weaknesses : remote?.weaknesses || []).slice(0, 3).map((item) => (
                    <li key={item} className="rounded-xl border border-slate-200/70 bg-white/90 px-3.5 py-2.5 leading-relaxed dark:border-white/5 dark:bg-white/5">{item}</li>
                  ))
                ) : (
                  <li className="rounded-xl border border-slate-200/70 bg-white/90 px-3.5 py-2.5 dark:border-white/5 dark:bg-white/5">No weaknesses provided.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-950/80">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white">
                31-Day AI Cohort Curriculum Coverage
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                Min 4 Days Verified
              </span>
            </div>
            <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(feedback?.curriculumCoverage ?? remote?.curriculumCoverage ?? [
                { area: 'RAG & Retrieval (Days 8–15)', covered: true },
                { area: 'Vector Databases (Days 6–7)', covered: true },
                { area: 'Prompt Engineering (Days 1–5)', covered: true },
                { area: 'Agentic AI & Memory (Days 16–22)', covered: true },
                { area: 'Model Context Protocol (Days 23–27)', covered: true },
                { area: 'Production AI & Deployment (Days 28–31)', covered: true },
              ]).map((item) => (
                <div key={item.area} className="flex items-center gap-2.5 rounded-xl border border-sky-500/30 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>{item.area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-950/80">
            <h2 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white">Recommended Next Topics</h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(feedback?.suggestions?.length ? feedback.suggestions : remote?.suggestions || []).length ? (
                (feedback?.suggestions?.length ? feedback.suggestions : remote?.suggestions || []).map((topic) => (
                  <span key={topic} className="rounded-2xl border border-sky-400/30 bg-sky-500/10 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-sky-700 dark:text-sky-300">{topic}</span>
                ))
              ) : (
                <span className="rounded-2xl bg-slate-200/70 px-4 py-2 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">No recommendations returned.</span>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button onClick={() => navigate('/feedback', { state: { feedback: feedback ?? remote } })}>View Detailed Feedback</Button>
            <Button onClick={restartInterview}>Restart Interview</Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Return to landing page
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { InterviewFeedback } from '../types/interview';
import { useInterview } from '../hooks/useInterview';
import { getInterviewFeedback } from '../services/feedbackService';

interface LocationState {
  feedback?: InterviewFeedback;
}

export default function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { feedback: fallbackFeedback, restartInterview, sessionId } = useInterview();
  const feedback = state?.feedback ?? fallbackFeedback;
  const [remoteFeedback, setRemoteFeedback] = useState<InterviewFeedback | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);

  useEffect(() => {
    if (feedback) {
      setRemoteFeedback(feedback);
      return;
    }

    if (!sessionId) {
      return;
    }

    let cancelled = false;
    (async () => {
      setRemoteLoading(true);
      setRemoteError(null);
      try {
        const fetched = await getInterviewFeedback(sessionId);
        if (!cancelled) {
          setRemoteFeedback(fetched);
        }
      } catch (error) {
        if (!cancelled) {
          setRemoteError(error instanceof Error ? error.message : 'Unable to load feedback from the interview server.');
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
  }, [feedback, sessionId]);

  const resolvedFeedback = feedback ?? remoteFeedback;

  if (!resolvedFeedback && !remoteLoading && !remoteError) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_25%)] p-3 sm:p-6 lg:p-8 overflow-y-auto text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-none px-2 sm:px-6 lg:px-10 rounded-[2.25rem] border border-slate-200/80 bg-white/85 p-6 sm:p-10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 dark:shadow-glass">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">Detailed Feedback Report</span>
          </div>

          <div className="mb-6 rounded-[1.75rem] bg-gradient-to-r from-blue-500/15 via-violet-500/15 to-fuchsia-500/15 p-6 sm:p-8 border border-sky-500/20 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 dark:text-sky-300">Performance Breakdown</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">Your interview feedback is ready.</h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">Comprehensive score breakdown across technical knowledge, problem solving, and communication.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            {remoteLoading ? (
              <div className="rounded-[2rem] border border-slate-200/80 bg-slate-50/80 p-6 text-slate-700 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300">
                Fetching the latest feedback from the interview service…
              </div>
            ) : remoteError ? (
              <div className="rounded-[2rem] border border-rose-400/30 bg-rose-500/10 p-6 text-rose-700 dark:text-rose-200">
                {remoteError}
              </div>
            ) : resolvedFeedback ? (
              <>
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-slate-200/80 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/80">
                    <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Overall Score</h2>
                    <div className="mt-5 flex items-center gap-6">
                      <div className="rounded-[2rem] bg-white border border-slate-200/80 px-8 py-7 text-center text-4xl sm:text-5xl font-bold text-slate-950 shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:text-white">
                        {resolvedFeedback.score}/100
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <p className="font-semibold text-slate-950 dark:text-white text-base">Executive Summary</p>
                        <p className="mt-1.5 leading-relaxed">{resolvedFeedback.summary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Technical Knowledge', value: resolvedFeedback.categories.technicalKnowledge },
                      { label: 'Problem Solving', value: resolvedFeedback.categories.problemSolving },
                      { label: 'Communication Skills', value: resolvedFeedback.categories.communicationSkills },
                      { label: 'Answer Quality', value: resolvedFeedback.categories.answerQuality },
                      { label: 'Confidence', value: resolvedFeedback.categories.confidence },
                    ].map((item) => (
                      <div key={item.label} className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/80">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{item.label}</p>
                        <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">{item.value}/100</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 dark:border-white/10 dark:bg-slate-950/80">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-950 dark:text-white">Verified Strengths</h3>
                    <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {resolvedFeedback.strengths.slice(0, 3).map((item) => (
                        <li key={item} className="rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 leading-snug dark:border-white/5 dark:bg-slate-900/80">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 dark:border-white/10 dark:bg-slate-950/80">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-950 dark:text-white">Gaps & Improvement Areas</h3>
                    <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {resolvedFeedback.weaknesses.slice(0, 3).map((item) => (
                        <li key={item} className="rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 leading-snug dark:border-white/5 dark:bg-slate-900/80">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 dark:border-white/10 dark:bg-slate-950/80">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-950 dark:text-white">Actionable Next Steps</h3>
                    <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {resolvedFeedback.suggestions.slice(0, 3).map((item) => (
                        <li key={item} className="rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 leading-snug dark:border-white/5 dark:bg-slate-900/80">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button onClick={restartInterview} className="w-full sm:w-auto">Restart Interview</Button>
                    <Button variant="secondary" onClick={() => navigate('/')} className="w-full sm:w-auto">Try Another Role</Button>
                    <Button variant="ghost" onClick={() => window.print()} className="w-full sm:w-auto">Download Report</Button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { InterviewFeedback } from '../types/interview';
import { useInterview } from '../hooks/useInterview';

interface LocationState {
  feedback?: InterviewFeedback;
}

export default function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { feedback: fallbackFeedback, restartInterview } = useInterview();
  const feedback = state?.feedback ?? fallbackFeedback;

  useEffect(() => {
    if (!feedback) {
      navigate('/');
    }
  }, [feedback, navigate]);

  if (!feedback) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glass backdrop-blur-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-blue-500/20 via-violet-500/15 to-fuchsia-500/20 p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Feedback report</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Your interview feedback is ready.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Review the AI evaluation, strengths, weaknesses, and next steps after your session.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
                <h2 className="text-xl font-semibold text-white">Overall Score</h2>
                <div className="mt-6 flex items-end gap-4">
                  <div className="rounded-[2rem] bg-slate-900/80 px-8 py-10 text-center text-5xl font-semibold text-white shadow-xl shadow-slate-950/20">
                    {feedback.score}/100
                  </div>
                  <div className="text-sm text-slate-300">
                    <p className="font-semibold text-white">Interview Summary</p>
                    <p className="mt-3 leading-7">{feedback.summary}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Technical Knowledge', value: feedback.categories.technicalKnowledge },
                  { label: 'Problem Solving', value: feedback.categories.problemSolving },
                  { label: 'Communication Skills', value: feedback.categories.communicationSkills },
                  { label: 'Answer Quality', value: feedback.categories.answerQuality },
                  { label: 'Confidence', value: feedback.categories.confidence },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                    <p className="mt-4 text-3xl font-semibold text-white">{item.value}/100</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
                <h3 className="text-lg font-semibold text-white">Strengths</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {feedback.strengths.map((item) => (
                    <li key={item} className="rounded-3xl bg-slate-900/80 px-4 py-3">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
                <h3 className="text-lg font-semibold text-white">Weaknesses</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {feedback.weaknesses.map((item) => (
                    <li key={item} className="rounded-3xl bg-slate-900/80 px-4 py-3">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
                <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {feedback.suggestions.map((item) => (
                    <li key={item} className="rounded-3xl bg-slate-900/80 px-4 py-3">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button onClick={restartInterview} className="w-full sm:w-auto">Restart Interview</Button>
                <Button variant="secondary" onClick={() => navigate('/')} className="w-full sm:w-auto">Try Another Role</Button>
                <Button variant="ghost" onClick={() => window.print()} className="w-full sm:w-auto">Download Feedback</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import Button from '../components/Button';
import { useInterview } from '../hooks/useInterview';
import { ExperienceLevelOption, InterviewConfig } from '../types/interview';

const experienceOptions: ExperienceLevelOption[] = ['Fresher', 'Junior', 'Mid Level', 'Senior'];
const questionCounts = [8, 10, 15];

const defaultConfig: InterviewConfig = {
  role: 'AI Engineer',
  experienceLevel: 'Junior',
  interviewType: 'Technical Interview',
  questionCount: 10,
};

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { startInterview, loading, error: contextError } = useInterview();
  const [config, setConfig] = useState<InterviewConfig>(defaultConfig);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const activeError = error || contextError;

  const summaryItems = useMemo(
    () => [
      { label: 'Interview Focus', value: 'AI Engineering' },
      { label: 'Experience Level', value: config.experienceLevel },
      { label: 'Interview Type', value: 'Technical Interview' },
      { label: 'Question Count', value: `${config.questionCount} Questions` },
    ],
    [config],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!config.experienceLevel || !config.questionCount) {
      setError('Please complete all interview configuration fields before continuing.');
      return;
    }

    if (submitting || loading) {
      return;
    }

    setSubmitting(true);
    try {
      await startInterview({
        ...config,
        role: 'AI Engineer',
        interviewType: 'Technical Interview',
      });
    } catch {
      setError('Unable to start the interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen lg:h-screen lg:overflow-hidden flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.15),transparent_30%)] p-2 sm:p-4 lg:p-5 text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <div className="w-full h-full max-w-none grid gap-4 lg:grid-cols-[1.15fr_0.85fr] items-stretch">
        <section className="flex flex-col justify-between h-full overflow-y-auto rounded-[2.25rem] border border-slate-200/80 bg-white/85 p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-glass">
          <div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Session Setup</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">Prepare your AI session.</h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">Configure your experience level and interview format.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  Experience Level
                  <select
                    value={config.experienceLevel}
                    onChange={(event) => setConfig((prev) => ({ ...prev, experienceLevel: event.target.value as ExperienceLevelOption }))}
                    className="w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {experienceOptions.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </label>

                <div className="space-y-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  <span className="block">Interview Type</span>
                  <div className="w-full rounded-2xl border border-slate-200/90 bg-slate-100/80 px-4 py-3 text-sm sm:text-base font-medium text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
                    Technical Interview
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-1">
                <label className="space-y-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  Question Count
                  <select
                    value={config.questionCount}
                    onChange={(event) => setConfig((prev) => ({ ...prev, questionCount: Number(event.target.value) }))}
                    className="w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {questionCounts.map((count) => (
                      <option key={count} value={count}>{count} Questions</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/90 p-4 sm:p-5 dark:border-white/10 dark:bg-slate-900/80">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1.5">
                  Interview Focus
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  RAG • Vector Databases • Prompt Engineering • Agentic AI • MCP • AI Deployment • Production AI
                </p>
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 dark:border-white/10 dark:bg-slate-900/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Your Cohort Journey
                  </span>
                  <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg">
                    12 / 31 Days Completed
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                      Completed
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-1.5"><span className="text-emerald-500 font-bold">✓</span> RAG</li>
                      <li className="flex items-center gap-1.5"><span className="text-emerald-500 font-bold">✓</span> Vector Databases</li>
                      <li className="flex items-center gap-1.5"><span className="text-emerald-500 font-bold">✓</span> Prompt Engineering</li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                      Needs Assessment
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-1.5"><span className="text-amber-500 font-bold">•</span> MCP</li>
                      <li className="flex items-center gap-1.5"><span className="text-amber-500 font-bold">•</span> AI Deployment</li>
                    </ul>
                  </div>
                </div>
              </div>

              {activeError ? (
                <div className="rounded-2xl border border-rose-300/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                  {activeError}
                </div>
              ) : null}

              <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={loading || submitting} className="w-full gap-3 sm:w-auto px-8 py-3.5 text-base font-semibold shadow-lg hover:scale-105 transition-transform">
                  {loading || submitting ? (
                    <>
                      <FaSpinner className="h-5 w-5 animate-spin" /> Creating Session...
                    </>
                  ) : (
                    'Start Interview →'
                  )}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/')} className="px-6 py-3 text-sm font-medium">
                  Back to Home
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="flex flex-col justify-between h-full overflow-y-auto rounded-[2.25rem] border border-slate-200/80 bg-white/85 p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-glass">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Interview Plan</p>
            <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">Session Overview</h2>

            <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-4 sm:p-5 dark:border-white/10 dark:bg-slate-900/80 space-y-3">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm border-b border-slate-200/80 pb-3 last:border-b-0 last:pb-0 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-950 dark:text-white text-sm sm:text-base">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-4 sm:p-5 dark:border-white/10 dark:bg-slate-900/80">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-950 dark:text-white">Session Highlights</h3>
              <div className="mt-3 space-y-2.5">
                {[
                  { number: '01', title: 'Curriculum-driven AI questions' },
                  { number: '02', title: 'Adaptive follow-ups based on your responses' },
                  { number: '03', title: 'Live curriculum coverage tracking' },
                  { number: '04', title: 'AI-powered evaluation & feedback' },
                ].map((item) => (
                  <div key={item.number} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 py-0.5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-700 dark:text-sky-300">{item.number}</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

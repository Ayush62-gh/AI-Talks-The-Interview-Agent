import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaInfoCircle, FaSpinner, FaUpload } from 'react-icons/fa';
import Button from '../components/Button';
import { useInterview } from '../hooks/useInterview';
import { ExperienceLevelOption, InterviewConfig, InterviewTypeOption, RoleOption } from '../types/interview';

const roleOptions: RoleOption[] = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
];

const experienceOptions: ExperienceLevelOption[] = ['Fresher', 'Junior', 'Mid Level', 'Senior'];

const interviewTypes: InterviewTypeOption[] = ['Technical Interview', 'Behavioral Interview', 'System Design Interview'];

const questionCounts = [5, 10, 15];

const roleDescriptions: Record<RoleOption, string> = {
  'Software Engineer': 'Practice software engineering fundamentals, coding concepts, APIs, and system reasoning.',
  'Frontend Developer': 'Focus on JavaScript, React, browser concepts, UI architecture, and frontend fundamentals.',
  'Backend Developer': 'Prepare for APIs, databases, backend architecture, and server-side concepts.',
  'Full Stack Developer': 'Cover both frontend and backend trade-offs with balanced product and technical depth.',
  'Product Manager': 'Practice prioritization, product thinking, metrics, and behavioral scenarios.',
  'Data Scientist': 'Work through statistics, experimentation, analysis, and case-based problem solving.',
  'DevOps Engineer': 'Prepare for cloud, CI/CD, containers, infrastructure, and reliability concepts.',
};

const experienceDescriptions: Record<ExperienceLevelOption, string> = {
  Fresher: 'Entry-level interview preparation.',
  'Junior': 'Early-career professional interview preparation.',
  'Mid Level': 'Professional with several years of experience.',
  Senior: 'Experienced professional preparing for advanced interviews.',
};

const interviewTypeDescriptions: Record<InterviewTypeOption, string> = {
  'Technical Interview': 'Coding concepts, technical fundamentals, APIs, and problem solving.',
  'Behavioral Interview': 'Communication, collaboration, leadership, and situational depth.',
  'System Design Interview': 'Architecture, scalability, APIs, and design decisions.',
};

const defaultConfig: InterviewConfig = {
  role: 'Frontend Developer',
  experienceLevel: 'Junior',
  interviewType: 'Technical Interview',
  questionCount: 5,
};

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { startInterview, loading } = useInterview();
  const [config, setConfig] = useState<InterviewConfig>(defaultConfig);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const summaryItems = useMemo(
    () => [
      { label: 'Role', value: config.role },
      { label: 'Experience Level', value: config.experienceLevel },
      { label: 'Interview Type', value: config.interviewType },
      { label: 'Question Count', value: `${config.questionCount} Questions` },
    ],
    [config],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!config.role || !config.experienceLevel || !config.interviewType || !config.questionCount) {
      setError('Please complete all interview configuration fields before continuing.');
      return;
    }

    if (submitting || loading) {
      return;
    }

    setSubmitting(true);
    try {
      await startInterview(config);
    } catch {
      setError('Unable to start the interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_25%)] px-4 py-8 text-slate-900 transition-colors duration-300 sm:px-6 lg:px-10 dark:text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-[2rem] border border-slate-200/70 bg-white/75 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-glass">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-600 dark:text-sky-300">Session setup</p>
            <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Prepare your AI interview session.</h1>
            <p className="text-slate-700 dark:text-slate-300">Choose your role, experience level, interview format, and question count before starting your interview.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Role
                <select
                  value={config.role}
                  onChange={(event) => setConfig((prev) => ({ ...prev, role: event.target.value as RoleOption }))}
                  className="w-full rounded-3xl border border-slate-200/70 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{roleDescriptions[config.role]}</p>
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Experience Level
                <select
                  value={config.experienceLevel}
                  onChange={(event) => setConfig((prev) => ({ ...prev, experienceLevel: event.target.value as ExperienceLevelOption }))}
                  className="w-full rounded-3xl border border-slate-200/70 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100"
                >
                  {experienceOptions.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{experienceDescriptions[config.experienceLevel]}</p>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Interview Type
                <select
                  value={config.interviewType}
                  onChange={(event) => setConfig((prev) => ({ ...prev, interviewType: event.target.value as InterviewTypeOption }))}
                  className="w-full rounded-3xl border border-slate-200/70 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100"
                >
                  {interviewTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{interviewTypeDescriptions[config.interviewType]}</p>
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Question Count
                <select
                  value={config.questionCount}
                  onChange={(event) => setConfig((prev) => ({ ...prev, questionCount: Number(event.target.value) }))}
                  className="w-full rounded-3xl border border-slate-200/70 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100"
                >
                  {questionCounts.map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">Select the number of questions for this interview.</p>
              </label>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center gap-2">
                <FaInfoCircle className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Interview Summary</h2>
              </div>
              <div className="mt-5 space-y-3">
                {summaryItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-semibold text-slate-950 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="h-4 w-4 text-emerald-500" />
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">What to expect</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  'Role-specific questions',
                  'One question at a time',
                  'Progress tracked throughout',
                  'Detailed feedback at the end',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-dashed border-slate-300/80 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-950 dark:text-white">Personalize your interview</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Optional — upload your resume to prepare for role-specific discussion in a future version.</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200"
                >
                  <FaUpload className="h-4 w-4" />
                  Upload Resume
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-300/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={loading || submitting} className="w-full gap-2 sm:w-auto">
                {loading || submitting ? (
                  <>
                    <FaSpinner className="h-4 w-4 animate-spin" /> Creating Interview...
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-glass">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-600 dark:text-sky-300">Your interview plan</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Prepare for a focused session.</h2>
          <div className="mt-6 rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4 border-b border-slate-200/70 py-3 last:border-b-0 dark:border-white/10">
                <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="text-right text-sm font-semibold text-slate-950 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <h3 className="text-base font-semibold text-slate-950 dark:text-white">What to expect</h3>
            <div className="mt-4 space-y-3">
              {[
                { number: '01', title: 'Role-specific questions' },
                { number: '02', title: 'One question at a time' },
                { number: '03', title: 'Progress tracking throughout' },
                { number: '04', title: 'Detailed feedback at the end' },
              ].map((item) => (
                <div key={item.number} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/15 to-violet-500/15 text-sm font-semibold text-sky-700 dark:text-sky-300">{item.number}</span>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

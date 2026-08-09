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
  'Java Backend Developer',
  'AI Engineer',
  'Data Analyst',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
];

const experienceOptions: ExperienceLevelOption[] = ['Fresher', 'Junior', 'Mid Level', 'Senior'];

const interviewTypes: InterviewTypeOption[] = ['Technical Interview', 'Behavioral Interview', 'System Design Interview'];

const questionCounts = [8, 10, 15];

const roleDescriptions: Record<RoleOption, string> = {
  'Software Engineer': 'Practice software engineering fundamentals, coding concepts, APIs, and system reasoning.',
  'Frontend Developer': 'Focus on JavaScript, React, browser concepts, UI architecture, and frontend fundamentals.',
  'Backend Developer': 'Prepare for APIs, databases, backend architecture, and server-side concepts.',
  'Full Stack Developer': 'Cover both frontend and backend trade-offs with balanced product and technical depth.',
  'Java Backend Developer': 'Practice Java core, JVM internals, Spring Boot, REST APIs, JPA/Hibernate, and concurrency.',
  'AI Engineer': 'Practice 31-Day AI Cohort topics: LLMs, Prompting, RAG, Vector DBs, MCP, Agents, and Guardrails.',
  'Data Analyst': 'Focus on SQL queries, window functions, Pandas data wrangling, and statistical analysis.',
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
  role: 'AI Engineer',
  experienceLevel: 'Junior',
  interviewType: 'Technical Interview',
  questionCount: 8,
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
    <main className="min-h-screen lg:h-screen lg:overflow-hidden flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.15),transparent_30%)] p-2 sm:p-4 lg:p-5 text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <div className="w-full h-full max-w-none grid gap-4 lg:grid-cols-[1.15fr_0.85fr] items-stretch">
        <section className="flex flex-col justify-between h-full overflow-y-auto rounded-[2.25rem] border border-slate-200/80 bg-white/85 p-8 sm:p-10 lg:p-12 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-glass">
          <div>
            <div className="space-y-2.5">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Session Setup</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 dark:text-white tracking-tight">Prepare your AI session.</h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">Configure your target role, experience level, and interview format.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 lg:mt-10 space-y-6 lg:space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  Role Target
                  <select
                    value={config.role}
                    onChange={(event) => setConfig((prev) => ({ ...prev, role: event.target.value as RoleOption }))}
                    className="w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3.5 text-sm sm:text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  Experience Level
                  <select
                    value={config.experienceLevel}
                    onChange={(event) => setConfig((prev) => ({ ...prev, experienceLevel: event.target.value as ExperienceLevelOption }))}
                    className="w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3.5 text-sm sm:text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {experienceOptions.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  Interview Format
                  <select
                    value={config.interviewType}
                    onChange={(event) => setConfig((prev) => ({ ...prev, interviewType: event.target.value as InterviewTypeOption }))}
                    className="w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3.5 text-sm sm:text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {interviewTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  Question Count
                  <select
                    value={config.questionCount}
                    onChange={(event) => setConfig((prev) => ({ ...prev, questionCount: Number(event.target.value) }))}
                    className="w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3.5 text-sm sm:text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {questionCounts.map((count) => (
                      <option key={count} value={count}>{count} Questions</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/90 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-900/80">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-sky-700 dark:text-sky-300">Target Focus: </span>
                  {roleDescriptions[config.role]}
                </p>
              </div>

              {activeError ? (
                <div className="rounded-2xl border border-rose-300/80 bg-rose-50/90 px-5 py-4 text-sm sm:text-base text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                  {activeError}
                </div>
              ) : null}

              <div className="pt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={loading || submitting} className="w-full gap-3 sm:w-auto px-8 py-4 text-base sm:text-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                  {loading || submitting ? (
                    <>
                      <FaSpinner className="h-5 w-5 animate-spin" /> Creating Session...
                    </>
                  ) : (
                    'Start Interview →'
                  )}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/')} className="px-6 py-3.5 text-sm sm:text-base font-medium">
                  Back to Home
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="flex flex-col justify-between h-full overflow-y-auto rounded-[2.25rem] border border-slate-200/80 bg-white/85 p-8 sm:p-10 lg:p-12 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-glass">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Interview Plan</p>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 dark:text-white tracking-tight">Session Overview</h2>

            <div className="mt-8 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-900/80 space-y-4">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm sm:text-base border-b border-slate-200/80 pb-3.5 last:border-b-0 last:pb-0 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-950 dark:text-white text-base sm:text-lg">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-900/80">
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-950 dark:text-white">Session Highlights</h3>
              <div className="mt-4 space-y-3">
                {[
                  { number: '01', title: 'Curriculum & role-specific questions' },
                  { number: '02', title: 'Dynamic follow-up based on your response' },
                  { number: '03', title: 'Live progress & topic coverage tracking' },
                  { number: '04', title: 'Factual verification & score report' },
                ].map((item) => (
                  <div key={item.number} className="flex items-center gap-3.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 py-1">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-700 dark:text-sky-300">{item.number}</span>
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

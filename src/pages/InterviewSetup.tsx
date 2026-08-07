import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await startInterview(config);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_25%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-glass backdrop-blur-xl">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Session setup</p>
            <h1 className="text-4xl font-semibold text-white">Prepare your AI interview session.</h1>
            <p className="text-slate-300">Choose a role, experience level, interview format, and question count before starting the AI-powered interview.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Role
                <select
                  value={config.role}
                  onChange={(event) => setConfig((prev) => ({ ...prev, role: event.target.value as RoleOption }))}
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                Experience Level
                <select
                  value={config.experienceLevel}
                  onChange={(event) => setConfig((prev) => ({ ...prev, experienceLevel: event.target.value as ExperienceLevelOption }))}
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                >
                  {experienceOptions.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Interview Type
                <select
                  value={config.interviewType}
                  onChange={(event) => setConfig((prev) => ({ ...prev, interviewType: event.target.value as InterviewTypeOption }))}
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                >
                  {interviewTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                Question Count
                <select
                  value={config.questionCount}
                  onChange={(event) => setConfig((prev) => ({ ...prev, questionCount: Number(event.target.value) }))}
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                >
                  {questionCounts.map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 text-slate-300 shadow-xl shadow-slate-950/30">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Selected Role</span>
                <span className="text-white">{config.role}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Experience Level</span>
                <span className="text-white">{config.experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Interview Type</span>
                <span className="text-white">{config.interviewType}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Question Count</span>
                <span className="text-white">{config.questionCount}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Preparing session...' : 'Start Interview'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Interview platform</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Build confidence with structured AI feedback.</h2>
          <p className="mt-4 text-slate-300 leading-7">
            Configure your session with expert-designed roles and interview types, then answer questions in a modern chat experience with progress tracking and final evaluation.
          </p>

          <div className="mt-8 grid gap-4">
            {[
              'Personalized interview sessions',
              'Role-specific AI questions',
              'Professional feedback report',
              'Session progress and review',
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-slate-300 shadow-lg shadow-slate-950/10">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

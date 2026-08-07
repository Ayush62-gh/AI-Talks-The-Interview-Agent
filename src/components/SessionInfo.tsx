import { InterviewConfig } from '../types/interview';

interface SessionInfoProps {
  sessionId: string;
  config: InterviewConfig;
  currentQuestionNumber: number;
  totalQuestions: number;
}

export default function SessionInfo({ sessionId, config, currentQuestionNumber, totalQuestions }: SessionInfoProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 text-slate-300 shadow-glass backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Session ID</p>
          <p className="mt-2 text-sm text-white">{sessionId}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/90 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">Live interview</div>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-slate-300">
        <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-3">
          <span>Role</span>
          <span className="text-slate-100">{config.role}</span>
        </div>
        <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-3">
          <span>Type</span>
          <span className="text-slate-100">{config.interviewType}</span>
        </div>
        <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-3">
          <span>Level</span>
          <span className="text-slate-100">{config.experienceLevel}</span>
        </div>
        <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-3">
          <span>Progress</span>
          <span className="text-slate-100">{currentQuestionNumber}/{totalQuestions}</span>
        </div>
      </div>
    </div>
  );
}

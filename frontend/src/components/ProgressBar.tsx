import React from 'react';

export default function ProgressBar({ currentQuestion, totalQuestions }: { currentQuestion: number; totalQuestions: number }) {
  const progressTarget = Math.max(8, totalQuestions);
  const pct = progressTarget > 0 ? Math.min(100, Math.round((currentQuestion / progressTarget) * 100)) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Interview Progress</div>
          <div className="mt-1 font-medium text-slate-200">Question {currentQuestion}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Minimum</div>
          <div className="mt-1 font-medium text-slate-200">8 questions</div>
        </div>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80">
        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 text-right text-sm font-medium text-slate-300">{pct}%</div>
    </div>
  );
}


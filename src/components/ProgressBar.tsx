import React from 'react';

export default function ProgressBar({ currentQuestion, totalQuestions }: { currentQuestion: number; totalQuestions: number }) {
  const pct = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>Question {currentQuestion} / {totalQuestions}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}


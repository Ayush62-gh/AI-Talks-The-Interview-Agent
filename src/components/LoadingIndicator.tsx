export default function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-200 shadow-sm shadow-slate-950/20">
      <div className="flex h-3 items-center gap-2">
        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-300" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-300 animation-delay-200" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-300 animation-delay-400" />
      </div>
      <span>Interviewer is thinking...</span>
    </div>
  );
}

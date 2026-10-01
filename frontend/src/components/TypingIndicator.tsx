import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
      <div className="max-w-[88%] rounded-[1.35rem] border border-slate-800/80 bg-slate-900/90 p-4 text-sm text-slate-100 shadow-lg shadow-slate-950/10">
        <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">AI INTERVIEWER</div>
        <div className="mt-3 text-sm font-medium text-slate-200">● ● ●</div>
        <div className="mt-2 text-sm text-slate-400">Analyzing your response…</div>
      </div>
    </motion.div>
  );
}

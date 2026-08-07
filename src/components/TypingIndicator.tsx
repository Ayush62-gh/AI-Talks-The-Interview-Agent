import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300 shadow-sm shadow-slate-950/20">
      <span className="h-3 w-3 animate-pulse rounded-full bg-slate-300" />
      <span className="h-3 w-3 animate-pulse rounded-full bg-slate-300 animation-delay-200" />
      <span className="h-3 w-3 animate-pulse rounded-full bg-slate-300 animation-delay-400" />
      <span className="ml-2">AI is typing...</span>
    </motion.div>
  );
}

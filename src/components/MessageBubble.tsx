import { motion } from 'framer-motion';
import { Message } from '../types/interview';

interface MessageBubbleProps {
  message: Message;
}

const bubbleStyles = {
  ai: 'bg-slate-900/95 text-slate-100 self-start rounded-br-3xl rounded-tr-3xl rounded-bl-3xl border border-slate-700/80 shadow-[0_10px_25px_rgba(2,6,23,0.25)]',
  candidate: 'bg-sky-100 text-slate-900 self-end rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl border border-sky-400/40 shadow-[0_10px_25px_rgba(2,6,23,0.2)] dark:bg-sky-700/30 dark:text-slate-100',
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAi = message.sender === 'ai';
  const roleLabel = isAi ? 'AI INTERVIEWER' : 'YOU';
  const metadataLabel = message.isFollowUp ? 'FOLLOW-UP • Based on your previous answer' : message.type === 'followup' ? 'FOLLOW-UP' : 'QUESTION';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`max-w-[88%] break-words rounded-[1.35rem] p-4 text-sm shadow-lg shadow-slate-950/10 ${bubbleStyles[message.sender]}`}
    >
      <div className={`flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] ${isAi ? 'text-slate-400' : 'text-sky-600 dark:text-sky-200'}`}>
        <span className={`font-semibold ${isAi ? 'text-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>{roleLabel}</span>
        {message.day ? <span>• Day {message.day}</span> : null}
        {message.topic ? <span>• {message.topic}</span> : null}
        {message.difficulty ? <span>• {message.difficulty}</span> : null}
      </div>
      {isAi ? (
        <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-sky-400/90">{metadataLabel}</div>
      ) : null}
      <p className={`mt-3 whitespace-pre-line leading-6 ${isAi ? 'text-slate-100' : 'text-slate-900 dark:text-slate-100'}`}>{message.text}</p>
    </motion.div>
  );
}

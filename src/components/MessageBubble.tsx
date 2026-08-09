import { motion } from 'framer-motion';
import { Message } from '../types/interview';

interface MessageBubbleProps {
  message: Message;
}

const bubbleStyles = {
  ai: 'bg-slate-900/95 text-slate-100 self-start rounded-br-2xl rounded-tr-2xl rounded-bl-2xl border border-slate-700/80 shadow-md',
  candidate: 'bg-sky-50/90 text-slate-900 self-end rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl border border-sky-200/80 shadow-sm dark:bg-sky-950/40 dark:border-sky-500/20 dark:text-slate-100',
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAi = message.sender === 'ai';
  const roleLabel = isAi ? 'AI INTERVIEWER' : 'YOU';
  const metadataLabel = message.isFollowUp ? 'FOLLOW-UP QUESTION' : message.type === 'followup' ? 'FOLLOW-UP' : 'QUESTION';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`max-w-[85%] break-words p-4 sm:p-5 text-base shadow-md ${bubbleStyles[message.sender]}`}
    >
      <div className={`flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] ${isAi ? 'text-slate-400' : 'text-sky-700 dark:text-sky-300'}`}>
        <span className={`font-semibold ${isAi ? 'text-slate-200' : 'text-slate-900 dark:text-slate-100'}`}>{roleLabel}</span>
        {message.day ? <span>• Day {message.day}</span> : null}
        {message.topic ? <span>• {message.topic}</span> : null}
        {message.difficulty ? <span>• {message.difficulty}</span> : null}
      </div>
      {isAi ? (
        <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-400">{metadataLabel}</div>
      ) : null}
      <p className={`mt-3 whitespace-pre-line text-base sm:text-lg leading-relaxed font-normal ${isAi ? 'text-slate-100' : 'text-slate-900 dark:text-slate-100'}`}>{message.text}</p>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Message } from '../types/interview';

interface MessageBubbleProps {
  message: Message;
}

const bubbleStyles = {
  ai: 'bg-slate-900/80 text-slate-100 self-start rounded-br-3xl rounded-tr-3xl rounded-bl-3xl',
  candidate: 'bg-blue-500/15 text-slate-100 self-end rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl',
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`max-w-[84%] break-words p-4 text-sm shadow-lg shadow-slate-950/10 ${bubbleStyles[message.sender]}`}
    >
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{message.sender === 'ai' ? 'AI Interviewer' : 'Candidate'}</div>
      <p className="mt-2 whitespace-pre-line">{message.text}</p>
    </motion.div>
  );
}

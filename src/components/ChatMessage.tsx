import { Message } from '../types/interview';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.sender === 'ai';
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[78%] rounded-3xl p-4 text-sm shadow-lg shadow-slate-950/15 ${isAi ? 'bg-slate-900/85 text-slate-100' : 'bg-blue-500/15 text-slate-100'}`}>
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
          <span>{isAi ? 'AI Interviewer' : 'Candidate'}</span>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p className="mt-3 whitespace-pre-line leading-6">{message.text}</p>
      </div>
    </div>
  );
}

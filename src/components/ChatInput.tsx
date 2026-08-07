import { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react';
import Button from './Button';

interface ChatInputProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({ value, disabled, onChange, onSend }: ChatInputProps) {
  const [rows, setRows] = useState(3);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    const lineCount = event.target.value.split('\n').length;
    setRows(Math.min(6, Math.max(3, lineCount)));
  };

  return (
    <form onSubmit={(event: FormEvent) => { event.preventDefault(); onSend(); }} className="space-y-3">
      <textarea
        rows={rows}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your answer here..."
        className="w-full resize-none rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-70"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">{value.length}/600</span>
        <Button type="submit" disabled={disabled || value.trim().length === 0} className="min-w-[140px]">
          {disabled ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  );
}

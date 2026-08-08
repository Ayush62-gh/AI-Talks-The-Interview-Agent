import { AnimatePresence, motion } from 'framer-motion';

interface ToastProps {
  message: string;
  onClose: () => void;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function Toast({ message, onClose, onRetry, retryLabel = 'Retry' }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-[1.35rem] border border-rose-400/20 bg-slate-900/95 px-5 py-4 text-sm text-slate-100 shadow-2xl shadow-slate-950"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div>
              <div className="font-semibold text-rose-300">Connection interrupted</div>
              <div className="mt-1 text-slate-300">{message}</div>
            </div>
            <button onClick={onClose} className="ml-auto text-slate-400 transition hover:text-slate-100">
              ✕
            </button>
          </div>
          {onRetry ? (
            <button onClick={onRetry} className="mt-3 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-sky-400 hover:text-sky-300">
              {retryLabel}
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

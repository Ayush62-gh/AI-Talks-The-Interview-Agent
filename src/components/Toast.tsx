import { AnimatePresence, motion } from 'framer-motion';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-50 rounded-3xl bg-slate-900/95 px-5 py-4 text-sm text-slate-100 shadow-2xl shadow-slate-950"
          role="alert"
        >
          <div className="flex items-center gap-3">
            <span className="font-medium">Error:</span>
            <span className="text-slate-300">{message}</span>
            <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-100">
              ✕
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

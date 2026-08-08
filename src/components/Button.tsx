import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'className'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700',
  ghost: 'bg-transparent border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800/70',
};

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

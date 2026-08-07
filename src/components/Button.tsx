import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'className'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

const variants = {
  primary: 'bg-blue-500 text-white hover:bg-blue-400',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
  ghost: 'bg-transparent border border-slate-700 text-slate-200 hover:border-slate-500',
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

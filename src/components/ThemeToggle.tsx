import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
    >
      {mode === 'dark' ? <FaSun /> : <FaMoon />}
      <span>{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}

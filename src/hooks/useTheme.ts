import { useEffect, useState } from 'react';

const STORAGE_KEY = 'aiInterviewTheme';

export type ThemeMode = 'dark' | 'light';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return (stored as ThemeMode) || getSystemTheme();
    } catch {
      return getSystemTheme();
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.classList.toggle('light', mode === 'light');
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return { mode, setMode, toggle } as const;
}

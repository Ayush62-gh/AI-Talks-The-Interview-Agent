import { useEffect, useState } from 'react';

const STORAGE_KEY = 'aiInterviewTheme';

export type ThemeMode = 'dark' | 'light';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return (stored as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return { mode, setMode, toggle } as const;
}

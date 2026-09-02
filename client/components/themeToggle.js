// components/ThemeToggle.js
'use client';
import { useEffect, useState } from 'react';

const themeKey = 'theme';

function getPreferredTheme() {
  if (typeof window === 'undefined') return 'light';

  try {
    const savedTheme = window.localStorage.getItem(themeKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch {
    // ignore storage access errors and fall back to system preference
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => getPreferredTheme());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    try {
      window.localStorage.setItem(themeKey, theme);
    } catch {
      // ignore localStorage write errors
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    try {
      window.localStorage.setItem(themeKey, nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    } catch {
      // ignore localStorage write errors
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-10 h-10 rounded-full border border-border dark:border-[#2a3543] bg-surface dark:bg-[#17202c] text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-cool"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
// components/DashboardHeader.js
import ThemeToggle from '../components/themeToggle';

export default function DashboardHeader({ generatedAt }) {
  const time = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-mono text-4xl uppercase tracking-wider  dark:text-[#ffffff] mb-1">
          Weather Analytics
        </h1>
        <p className="font-display text-ink-muted font-bold text-2xl">Comfort Index</p>
        {time && (
          <p className="font-mono text-sm text-ink-muted dark:text-[#9aa6b5] mt-2">
            Readings updated {time}
          </p>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
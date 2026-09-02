// components/DashboardHeader.js
import ThemeToggle from './themeToggle';
import LogoutButton from './logoutbutton';

export default function DashboardHeader({ generatedAt }) {
  const time = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="flex items-start justify-between mb-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted dark:text-[#9aa6b5] mb-1">
          Weather Analytics
        </p>
        <h1 className="font-display font-bold text-4xl">Comfort Index</h1>
        {time && (
          <p className="font-mono text-sm text-ink-muted dark:text-[#9aa6b5] mt-2">
            Readings updated {time}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LogoutButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
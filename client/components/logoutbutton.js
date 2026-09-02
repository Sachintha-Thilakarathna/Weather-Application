// components/LogoutButton.js
'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, { method: 'POST' });
    } finally {
      document.cookie = 'token=; path=/; max-age=0';
      router.push('/login');
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-mono text-ink-muted dark:text-[#9aa6b5] border border-border dark:border-[#2a3543] rounded-lg px-3 py-1.5 hover:text-ink dark:hover:text-[#edf1f6]"
    >
      Log out
    </button>
  );
}
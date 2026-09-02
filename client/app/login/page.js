// app/login/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../../components/themeToggle';

export default function LoginPage() {
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasToken = document.cookie
      .split('; ')
      .some((cookie) => cookie.startsWith('token='));

    if (hasToken) {
      router.replace('/');
    }
  }, [router]);

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('unauthorized');

      const data = await res.json();
      if (data.mfaRequired) setStep('otp');
    } catch (err) {
      alert('Sorry! You are not authorized for access this application');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-mfa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) throw new Error('unauthorized');

      const { accessToken } = await res.json();
      document.cookie = `token=${accessToken}; path=/; max-age=3600`;
      router.push('/');
    } catch (err) {
      alert('Sorry! You are not authorized for access this application');
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    'mt-1 w-full px-3.5 py-2.5 rounded-lg border border-border dark:border-[#2a3543] bg-transparent text-ink dark:text-[#edf1f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cool';

  return (
    <>
      <main className="relative min-h-screen flex items-center justify-center bg-[#eef1f6] dark:bg-[#0f1620]">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm bg-surface dark:bg-[#17202c] border border-border dark:border-[#2a3543] rounded-2xl p-8">
          <p className="font-display font-bold text-lg mb-1 text-black dark:text-[#edf1f6]">
            Welcome! Please Sign In
          </p>
          <p className="font-mono text-xs uppercase tracking-wider mb-1 dark:text-[#9aa6b5]" style={{ color: '#374151' }}>
            Weather Analytics
          </p>

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
              <h1 className="font-display font-bold text-2xl text-black dark:text-[#edf1f6]">
                Sign in
              </h1>

              <label className="text-sm font-body dark:text-[#9aa6b5]" style={{ color: '#374151' }}>
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses} />
              </label>

              <label className="text-sm font-body dark:text-[#9aa6b5]" style={{ color: '#374151' }}>
                Password
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses} />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 py-2.5 rounded-lg bg-cool text-black dark:text-[#edf1f6] font-display font-bold disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <h1 className="font-display font-bold text-2xl text-ink dark:text-[#edf1f6]">
                Check your email
              </h1>
              <p className="text-sm text-ink-muted dark:text-[#9aa6b5]">
                We sent a 6-digit code to <span className="font-mono">{email}</span>.
                It expires in 5 minutes.
              </p>

              <label className="text-sm font-body text-ink-muted dark:text-[#9aa6b5]">
                Verification code
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`${inputClasses} font-mono tracking-[0.3em] text-center`} />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 py-2.5 rounded-lg bg-cool text-white font-display font-bold disabled:opacity-60"
              >
                {loading ? 'Verifying…' : 'Verify & sign in'}
              </button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-sm text-ink-muted dark:text-[#9aa6b5] underline"
              >
                Use a different account
              </button>
            </form>
          )}
        </div>
      </main></>
  );
}
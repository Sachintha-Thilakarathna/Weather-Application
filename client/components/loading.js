// app/dashboard/loading.js
// Next.js renders this automatically while the route segment is loading
// (it's a Suspense boundary under the hood). The setTimeout here just delays
// *showing* it by 300ms, so a fast load never flashes "Loading..." on screen.
'use client';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!showLoading) return null;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="font-display text-ink-muted font-bold text-6xl text-center">
        Loading...
      </h1>
    </div>
  );
}
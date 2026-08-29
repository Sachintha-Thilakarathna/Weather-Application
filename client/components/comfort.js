// components/ComfortGauge.js
// Semicircular instrument dial. Fill + needle both encode the score so it
// still reads correctly for colorblind users; the mono readout underneath
// gives the exact number.
//
// Note: the gradient stop colors below are literal hex, not Tailwind classes
// — SVG <stop> has no Tailwind utility for stopColor, so this is one spot
// that can't be pure utility classes. Everything else in the file is.

export default function ComfortGauge({ score }) {
  const clamped = Math.max(0, Math.min(100, score));
  const rotation = -90 + (clamped / 100) * 180;
  const arcLength = 157;

  const label = clamped >= 70 ? 'Comfortable' : clamped >= 40 ? 'Mild' : 'Harsh';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-[130px]" aria-hidden="true">
        <defs>
          <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c1594a" />
            <stop offset="50%" stopColor="#2f8fa6" />
            <stop offset="100%" stopColor="#e2a63b" />
          </linearGradient>
        </defs>

        <path
          d="M10,60 A50,50 0 0 1 110,60"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-surface-muted dark:stroke-[#1e2836]"
        />

        <path
          d="M10,60 A50,50 0 0 1 110,60"
          fill="none"
          stroke="url(#gaugeTrack)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * arcLength} ${arcLength}`}
        />

        <line
          x1="60"
          y1="60"
          x2="60"
          y2="18"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-ink dark:stroke-[#edf1f6]"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '60px 60px' }}
        />
        <circle cx="60" cy="60" r="4.5" className="fill-ink dark:fill-[#edf1f6]" />
      </svg>

      <div className="-mt-2 font-mono text-center">
        <span className="text-xl font-semibold">{clamped.toFixed(0)}</span>
        <span className="text-sm text-ink-muted dark:text-[#9aa6b5]">/100</span>
      </div>
      <span className="text-xs uppercase tracking-wide text-ink-muted dark:text-[#9aa6b5]">
        {label}
      </span>
    </div>
  );
}
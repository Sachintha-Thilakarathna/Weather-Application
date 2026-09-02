// components/EmptyState.js
export default function EmptyState({ serverDown = false }) {
  return (
    <div className="border border-dashed border-border dark:border-[#2a3543] rounded-2xl px-6 py-10 text-center">
      <p className="font-display font-bold mb-1">
        {serverDown ? 'Server is Down.' : 'No results found.'}
      </p>
      <p className="text-ink-muted dark:text-[#9aa6b5]">
        {serverDown ? 'Turn ON the server.' : 'Try searching for a different city.'}
      </p>
    </div>
  );
}
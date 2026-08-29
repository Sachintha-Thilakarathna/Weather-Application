// components/EmptyState.js


export default function EmptyState({ query }) {
  
  return (
    <div className="border border-dashed border-border dark:border-[#2a3543] rounded-2xl px-6 py-10 text-center">
      <p className="font-display font-bold mb-1">Server is Down.</p>
      <p className="text-ink-muted dark:text-[#9aa6b5]">
        Turn ON the server.
      </p>
    </div>
  );
}
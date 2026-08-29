// components/SortFilterBar.js
'use client';

export default function SortFilterBar({ query, onQueryChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search a city…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search cities"
        className="flex-1 min-w-[220px] px-3.5 py-2.5 rounded-lg border border-border dark:border-[#2a3543] bg-surface dark:bg-[#17202c] text-ink dark:text-[#edf1f6] font-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-cool"
      />

      <label className="flex items-center gap-2 text-sm font-mono text-ink-muted dark:text-[#9aa6b5]">
        Sort by
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-2.5 py-2 rounded-lg border border-border dark:border-[#2a3543] bg-surface dark:bg-[#17202c] text-ink dark:text-[#edf1f6]"
        >
          <option value="comfort">Comfort index</option>
          <option value="temp">Temperature</option>
          <option value="name">City name</option>
        </select>
      </label>
    </div>
  );
}

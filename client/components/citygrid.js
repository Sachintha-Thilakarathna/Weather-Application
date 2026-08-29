// components/CityGrid.js
'use client';
import { useMemo, useState } from 'react';
import CityCard from './citycard';
import SortFilterBar from './searchbar';
import EmptyState from './searchempty';

export default function CityGrid({ cities }) {
  const [ query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('comfort');

 const visible = useMemo(() => {
    const filtered = cities.filter((c) =>
      c.cityName.toLowerCase().includes(query.toLowerCase()),
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === 'comfort') return b.comfortIndex - a.comfortIndex;
      if (sortBy === 'temp') return b.temperature - a.temperature;
      return a.cityName.localeCompare(b.cityName);
    });
  }, [cities, query, sortBy]);

  return (
    <div>
      <SortFilterBar
        query={query}
        onQueryChange={setQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {visible.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {visible.map((city) => (
            <CityCard key={city.cityId} city={city} />
          ))}
        </div>
      )}
    </div>
  );
}
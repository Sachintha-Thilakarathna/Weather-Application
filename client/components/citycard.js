// components/CityCard.js
import ComfortGauge from './comfort';

export default function CityCard({ city }) {
  const { rank, cityName, description, temperature, comfortIndex } = city;

  return (
    <article className="relative bg-surface dark:bg-[#17202c] border border-border dark:border-[#2a3543] rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
      <div className="self-start font-mono text-xs tracking-wide text-ink-muted dark:text-[#9aa6b5]">
        Comfort Rank #{rank}
      </div>

      <div>
        <h3 className="font-display font-bold text-xl">{cityName}</h3>
        <p className="text-sm capitalize text-ink-muted dark:text-[#9aa6b5]">{description}</p>
        <p className="font-mono text-2xl font-semibold mt-1">
          {temperature.toFixed(1)}
          <span className="text-base text-ink-muted dark:text-[#9aa6b5]">°C</span>
        </p>
      </div>

      <ComfortGauge score={comfortIndex} />
    </article>
  );
}
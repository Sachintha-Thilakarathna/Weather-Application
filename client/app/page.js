import DashboardHeader from '../components/navigation';
import CityGrid from '../components/citygrid';

async function getCities() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/cities';
  const res = await fetch(apiUrl, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
  return res.json();
}

export default async function DashboardPage() {
  let weather = { cities: [], generatedAt: null };

  try {
    weather = await getCities();
  } catch (error) {
    console.error('Unable to load weather data:', error);
  }

  return (
    <main className="max-w-[1080px] mx-auto px-6 pt-10 pb-16">
      <DashboardHeader generatedAt={weather.generatedAt} />
      <CityGrid cities={Array.isArray(weather.cities) ? weather.cities : []} />
    </main>
  );
}
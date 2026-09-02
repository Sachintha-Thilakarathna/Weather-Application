import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import DashboardHeader from '../components/navigation';
import CityGrid from '../components/citygrid';

async function getCities() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/cities';
  const res = await fetch(apiUrl, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Weather API returned ERROR`);
  return res.json();
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let weather = { cities: [], generatedAt: null };
  let serverDown = false;

  try {
    weather = await getCities();
  } catch (error) {
    console.error('Unable to load weather data:', error);
    serverDown = true;
  }

  return (
    <main className="max-w-270 mx-auto px-6 pt-10 pb-16">
      <DashboardHeader generatedAt={weather.generatedAt} />
      <CityGrid
        cities={Array.isArray(weather.cities) ? weather.cities : []}
        serverDown={serverDown}
      />
    </main>
  );
}
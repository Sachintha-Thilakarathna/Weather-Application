// server/src/app.service.js
import { firstValueFrom } from 'rxjs';
import cities from './cities.json';

export class AppService {
  constructor(http, config, cache) {
    this.http = http;
    this.config = config;
    this.cache = cache;
  }

  getHello() {
    return 'Hello World!';
  }

  // --- fetch one city's raw weather, cached for 5 minutes ---
  async fetchWeather(cityId) {
    const key = `weather:${cityId}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;

    const apiKey = this.config.get('OWM_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;

    const { data } = await firstValueFrom(this.http.get(url));

    await this.cache.set(key, data, 300 * 1000); // 5 min, ms
    return data;
  }

  // --- Comfort Index formula (same as the earlier guide) ---
  tempScore(t) {
    const min = 20, max = 25;
    if (t >= min && t <= max) return 100;
    const d = t < min ? min - t : t - max;
    return Math.max(0, 100 - d * 4);
  }
  humidityScore(h) {
    return h <= 60 ? 100 : Math.max(0, 100 - (h - 60) * 2);
  }
  windScore(speedMs) {
    const kmh = speedMs * 3.6;
    return kmh <= 15 ? 100 : Math.max(0, 100 - (kmh - 15) * 3);
  }
  cloudScore(pct) {
    const min = 20, max = 50;
    if (pct >= min && pct <= max) return 100;
    const d = pct < min ? min - pct : pct - max;
    return Math.max(0, 100 - d * 1.2);
  }
  computeComfortIndex(weather) {
    const t = this.tempScore(weather.main.temp);
    const h = this.humidityScore(weather.main.humidity);
    const w = this.windScore(weather.wind.speed);
    const c = this.cloudScore(weather.clouds.all);
    const score = t * 0.4 + h * 0.3 + w * 0.2 + c * 0.1;
    return Math.round(score * 100) / 100;
  }

  // --- fetch + score + rank all 10 cities ---
  async getCities() {
    const results = await Promise.all(
      cities.map(async (city) => {
        const data = await this.fetchWeather(city.CityCode);
        return {
          cityId: city.CityCode,
          cityName: data.name,
          description: data.weather[0].description,
          temperature: data.main.temp.toFixed(0),
          comfortIndex: this.computeComfortIndex(data),
        };
      }),
    );

    const ranked = results
      .sort((a, b) => b.comfortIndex - a.comfortIndex)
      .map((c, i) => ({ ...c, rank: i + 1 }));

    return { cities: ranked, generatedAt: new Date().toISOString() };
  }
}
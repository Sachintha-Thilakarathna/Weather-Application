import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }

  getCities() {
    const cities = [
      { cityId: 1, cityName: 'Colombo', description: 'tropical', temperature: 29.4, comfortIndex: 78 },
      { cityId: 2, cityName: 'London', description: 'mild and cloudy', temperature: 15.2, comfortIndex: 72 },
      { cityId: 3, cityName: 'Tokyo', description: 'warm and humid', temperature: 24.8, comfortIndex: 68 },
      { cityId: 4, cityName: 'Reykjavik', description: 'cool and breezy', temperature: 8.6, comfortIndex: 61 },
    ].sort((a, b) => b.comfortIndex - a.comfortIndex)
      .map((city, index) => ({ ...city, rank: index + 1 }));

    return { cities, generatedAt: new Date().toISOString() };
  }
}

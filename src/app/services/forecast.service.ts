import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addDays, format, fromUnixTime, isSameDay, isWithinInterval, parse } from 'date-fns';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Forecast } from '../models/forecast';

const API_KEY = 'de4ed12119240cb2f95d4e4b9f3c22c5';
const FORECAST_DAYS_AHEAD = 15;

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  openWeatherMap = 'http://api.openweathermap.org/data/2.5/forecast/daily';
  constructor(private http: HttpClient) {}

  getForecastCityDate(city: string, date: Date): Observable<Forecast> {
    if (this.isForecastSearchableForDate(date)) {
      return this.http.get<Forecast>(`${this.openWeatherMap}?q=${city}&cnt=16&appid=${API_KEY}`)
        .pipe(map(forecast => {
          const fc: Forecast[] = this.extractWeatherForecastForDate(forecast, date);
          return fc && fc.length ? fc[0] : null;
        }));
    }
    return of(null);
  }

  isForecastSearchableForDate(date: Date): boolean {
    const refDate = new Date();
    const baseDate = this.parseToDateOnly(new Date(date), refDate);
    
    return isWithinInterval(baseDate, this.forecastAvailableInterval(refDate));
  }

  forecastAvailableInterval(refDate = new Date()) {
    const start = this.parseToDateOnly(new Date(), refDate);
    const end = this.parseToDateOnly(addDays(new Date(), FORECAST_DAYS_AHEAD), refDate);
    return { start, end };
  }

  private extractWeatherForecastForDate(forecast, date: Date): Forecast[] {
    const { list, city } = forecast;
    const refDate = new Date();

    return list.filter(fc => {
      const baseDate = this.parseToDateOnly(new Date(date), refDate);
      const forecastDate = this.parseToDateOnly(fromUnixTime(fc.dt), refDate);
      return isSameDay(baseDate, forecastDate);
    })
    .map(fc => {
      const [ weather = {} ] = fc.weather;
      return {
        date,
        city: city.name,
        main: weather.main,
        description: weather.description,
        icon: weather.icon
      } as Forecast;
    });
  }

  private parseToDateOnly(date: Date, refDate: Date) {
    const pattern = 'yyyy-MM-dd';
    const formatted = format(date, 'yyyy-MM-dd');
    return parse(formatted, pattern, refDate);
  }
}

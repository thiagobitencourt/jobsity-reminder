import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { addDays, isSameDay, isToday, parse, subDays } from 'date-fns';
import { of } from 'rxjs';

import { ForecastService } from './forecast.service';

describe('ForecastService', () => {
  let service: ForecastService;

  const httpClient = {
    get: jasmine.createSpy('get').and.returnValue(of({}))
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }]
    });
    service = TestBed.inject(ForecastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isForecastSearchableForDate should return true only for 15 days ahead', () => {
    expect(service.isForecastSearchableForDate(subDays(new Date(), 1))).toBeFalse();
    expect(service.isForecastSearchableForDate(new Date())).toBeTrue();
    expect(service.isForecastSearchableForDate(addDays(new Date(), 7))).toBeTrue();
    expect(service.isForecastSearchableForDate(addDays(new Date(), 15))).toBeTrue();
    expect(service.isForecastSearchableForDate(addDays(new Date(), 16))).toBeFalse();
  });

  it('forecastAvailableInterval should return an interval of 15 days', () => {
    const { start, end } = service.forecastAvailableInterval(new Date());
    expect(isToday(start)).toBeTrue();
    expect(isSameDay(end, addDays(start, 15))).toBeTrue();
  });
  
  it('getForecastCityDate load the forecast for a searchable date', () => {
    const city = 'London';
    const date = new Date();
    service.getForecastCityDate(city, date).subscribe(() => {
      expect(httpClient.get).toHaveBeenCalled();
    });
  });

  it('getForecastCityDate should not load the forecast for a date that is not searchable', () => {
    const city = 'London';
    const date = addDays(new Date(), 20);

    spyOn(service, 'isForecastSearchableForDate').and.returnValue(false);
    httpClient.get = jasmine.createSpy('get').and.returnValue(of({}));

    service.getForecastCityDate(city, date).subscribe(() => {
      expect(service.isForecastSearchableForDate).toHaveBeenCalled();
      expect(httpClient.get).not.toHaveBeenCalled();
    });
  });

  it('getForecastCityDate should return the forecast information for the given date', () => {
    const city = 'London';
    const date = parse('2020-09-29', 'yyyy-MM-dd', new Date());
  
    const openWeatherSampleForecast = {
      city: { id: 2643743, name: 'London' },
      cnt: 1,
      list: [
        {
          dt: 1601377200,
          weather: [{
            main: 'Rain',
            description: 'light rain',
            icon: '10d'
          }]
        }
      ]
    };

    const expectedForecast = { date, city, main: 'Rain', description: 'light rain', icon: '10d' };
    httpClient.get = jasmine.createSpy('get').and.returnValue(of(openWeatherSampleForecast));

    service.getForecastCityDate(city, date).subscribe(forecast => {
      expect(httpClient.get).toHaveBeenCalled();
      expect(forecast).toEqual(expectedForecast);
    });
  });
});

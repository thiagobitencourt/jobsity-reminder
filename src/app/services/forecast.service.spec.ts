import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ForecastService } from './forecast.service';

describe('ForecastService', () => {
  let service: ForecastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }]
    });
    service = TestBed.inject(ForecastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ForecastService } from './forecast.service';
import { ReminderService } from './reminder.service';
import { StorageService } from './storage.service';

describe('ReminderService', () => {
  let service: ReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provider: StorageService, useValue: {} },
        { provider: ForecastService, useValue: {} }
      ],
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

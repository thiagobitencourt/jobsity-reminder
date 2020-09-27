import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CalendarService } from './calendar.service';
import { ReminderService } from './reminder.service';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provider: ReminderService, useValue: {} }
      ],
      imports: [HttpClientModule]
    });
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

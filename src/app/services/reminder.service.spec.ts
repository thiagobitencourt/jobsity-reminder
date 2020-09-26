import { TestBed } from '@angular/core/testing';
import { ReminderService } from './reminder.service';
import { StorageService } from './storage.service';

describe('ReminderService', () => {
  let service: ReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provider: StorageService, useValue: {} }]
    });
    service = TestBed.inject(ReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

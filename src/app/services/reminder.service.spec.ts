import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { format, parse } from 'date-fns';
import { Observable, of } from 'rxjs';
import { RemindersDateMap } from '../models/reminders-date-map';
import { ForecastService } from './forecast.service';
import { ReminderService } from './reminder.service';
import { StorageService } from './storage.service';

describe('ReminderService', () => {
  let service: ReminderService;

  const storageService = {
    getReminders: jasmine.createSpy('getReminders').and.returnValue({}),
    setReminders: jasmine.createSpy('setReminders').and.stub()
  };

  const forecastService = jasmine.createSpyObj('forecastService', ['isForecastSearchableForDate', 'getForecastCityDate']);

  const snackBakAction = {
    onAction: jasmine.createSpy('open').and.returnValue(new Observable())
  }

  const snackBar = {
    open: jasmine.createSpy('open').and.returnValue(snackBakAction)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: ForecastService, useValue: forecastService },
        { provide: MatSnackBar, useValue: snackBar }
      ],
      imports: [HttpClientModule, MatSnackBarModule]
    });
    service = TestBed.inject(ReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of reminders within the given date interval', done => {
    const expectedRemindersMap: RemindersDateMap = {
      '2020-09-10': [{ description: 'reminder 1', datetime: new Date('2020-09-10') }],
      '2020-09-11': [{ description: 'reminder 2', datetime: new Date('2020-09-11') }],
      '2020-09-12': [{ description: 'reminder 3', datetime: new Date('2020-09-12') }]
    }

    const start = parse('2020-09-10', 'yyyy-MM-dd', new Date());
    const end = parse('2020-09-12', 'yyyy-MM-dd', new Date());
    const remindersMock = {
      '2020-09-09': [{ description: 'reminder 0', datetime: new Date('2020-09-09') }],
      '2020-09-10': [{ description: 'reminder 1', datetime: new Date('2020-09-10') }],
      '2020-09-11': [{ description: 'reminder 2', datetime: new Date('2020-09-11') }],
      '2020-09-12': [{ description: 'reminder 3', datetime: new Date('2020-09-12') }],
      '2020-09-13': [{ description: 'reminder 4', datetime: new Date('2020-09-13') }]
    }

    storageService.getReminders = jasmine.createSpy('getReminders').and.returnValue(remindersMock);
    forecastService.isForecastSearchableForDate = jasmine.createSpy('isForecastSearchableForDate').and.returnValue(false);
    
    service.getReminders(start, end).subscribe(resultReminders => {
      expect(storageService.getReminders).toHaveBeenCalled();
      expect(resultReminders).toEqual(expectedRemindersMap);
      done();
    });
  });

  it('should load the forecast for the reminders', done => {
    const start = parse('2020-09-10', 'yyyy-MM-dd', new Date());
    const end = parse('2020-09-12', 'yyyy-MM-dd', new Date());
    const forecast = {
      city: 'London',
      date: start,
      main: 'Rain',
      description: 'a lot',
      icon: 'test-icon'
    }

    const remindersMock = {
      '2020-09-09': [{ description: 'reminder 0', datetime: new Date('2020-09-09') }],
      '2020-09-10': [{ description: 'reminder 1', datetime: new Date('2020-09-10') }],
      '2020-09-11': [{ description: 'reminder 2', datetime: new Date('2020-09-11') }],
      '2020-09-12': [{ description: 'reminder 3', datetime: new Date('2020-09-12') }],
      '2020-09-13': [{ description: 'reminder 4', datetime: new Date('2020-09-13') }]
    }

    const expectedRemindersMap: RemindersDateMap = {
      '2020-09-10': [{ description: 'reminder 1', datetime: new Date('2020-09-10'), forecast }],
      '2020-09-11': [{ description: 'reminder 2', datetime: new Date('2020-09-11'), forecast }],
      '2020-09-12': [{ description: 'reminder 3', datetime: new Date('2020-09-12'), forecast }]
    }

    storageService.getReminders = jasmine.createSpy('getReminders').and.returnValue(remindersMock);
    forecastService.isForecastSearchableForDate = jasmine.createSpy('isForecastSearchableForDate').and.returnValue(true);
    forecastService.getForecastCityDate = jasmine.createSpy('getForecastCityDate').and.returnValue(of(forecast));

    service.getReminders(start, end).subscribe(resultReminders => {
      expect(forecastService.isForecastSearchableForDate).toHaveBeenCalledTimes(3);
      expect(forecastService.getForecastCityDate).toHaveBeenCalledTimes(3);
      expect(resultReminders).toEqual(expectedRemindersMap);
      done();
    });
  });

  it('should save a reminder', () => {
    const datetime = new Date();
    const newReminder = { datetime, description: 'new reminder' };

    const remindersMock = {
      '2020-09-09': [{ description: 'reminder 0', datetime: new Date('2020-09-09') }]
    }

    storageService.getReminders = jasmine.createSpy('getReminders').and.returnValue(remindersMock);

    service.saveReminder(newReminder).subscribe(savedReminder => {
      expect(savedReminder.id).toBeTruthy();
      expect(remindersMock[format(datetime, 'yyyy-MM-dd')]).toContain(savedReminder);
      expect(storageService.setReminders).toHaveBeenCalledWith(remindersMock);
    });
  });

  it('should edit an existing reminder', () => {
    const reminderId = '12345';
    const datetime = parse('2020-09-09', 'yyyy-MM-dd', new Date());
    
    const remindersMock = {
      '2020-09-09': [{ id: reminderId, description: 'reminder 0', datetime }]
    }

    const expectedReminders = {
      '2020-09-09': [{ id: reminderId, description: 'new description', datetime }]
    }

    storageService.getReminders = jasmine.createSpy('getReminders').and.returnValue(remindersMock);
    storageService.setReminders = jasmine.createSpy('setReminders').and.stub();

    service.saveReminder({ id: reminderId, description: 'new description', datetime }).subscribe(savedReminder => {
      expect(savedReminder.id).toBe(reminderId);
      expect(storageService.setReminders).toHaveBeenCalledWith(expectedReminders);
    });
  });

  it('should correctly move a reminder from a date to another', () => {
    const reminderId = '12345';
    const datetime = parse('2020-09-09', 'yyyy-MM-dd', new Date());
    const newDatetime = parse('2020-09-10', 'yyyy-MM-dd', new Date());
    
    const remindersMock = {
      '2020-09-09': [{ id: reminderId, description: 'reminder 0', datetime }]
    }

    const expectedReminders = {
      '2020-09-09': [],
      '2020-09-10': [{ id: reminderId, description: 'reminder 0', datetime: newDatetime }]
    }

    storageService.getReminders = jasmine.createSpy('getReminders').and.returnValue(remindersMock);
    storageService.setReminders = jasmine.createSpy('setReminders').and.stub();

    service.saveReminder({ id: reminderId, description: 'reminder 0', datetime: newDatetime }).subscribe(savedReminder => {
      expect(savedReminder.id).toBe(reminderId);
      expect(storageService.setReminders).toHaveBeenCalledWith(expectedReminders);
    });
  });
});

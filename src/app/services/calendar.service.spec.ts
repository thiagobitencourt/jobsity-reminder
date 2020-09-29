import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { endOfMonth, isSaturday, isSunday, parse, format, startOfMonth } from 'date-fns';
import { of } from 'rxjs';
import { CalendarDate } from '../models/calendar-date';

import { CalendarService } from './calendar.service';
import { ReminderService } from './reminder.service';

describe('CalendarService', () => {
  let service: CalendarService;

  const reminderService = {
    getReminders: jasmine.createSpy('getReminders').and.returnValue(of({}))
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ReminderService, useValue: reminderService }
      ],
      imports: [HttpClientModule, MatSnackBarModule]
    });
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('"getCalendarDates" should load the reminder for the given month', () => {
    service.getCalendarDates(new Date()).subscribe(() => {
      expect(reminderService.getReminders).toHaveBeenCalledWith(startOfMonth(new Date), endOfMonth(new Date()));
    });
  });

  it('"getCalendarDates" should return a list starting from Sunday and ending on Saturday', () => {
    service.getCalendarDates(new Date()).subscribe((calendarDates: CalendarDate[]) => {
      expect(isSunday(calendarDates[0].date)).toBeTrue();
      expect(isSaturday(calendarDates[calendarDates.length - 1].date)).toBeTrue();
    });
  });

  it('"getCalendarDates" should map the reminders to the correct date', () => {
    const month = parse('2020-09-09', 'yyyy-MM-dd', new Date());
    const reminders = {
      '2020-09-01': [{ datetime: parse('2020-09-01', 'yyyy-MM-dd', new Date()), description: 'reminder 1'}],
      '2020-09-02': [{ datetime: parse('2020-09-02', 'yyyy-MM-dd', new Date()), description: 'reminder 2'}],
      '2020-09-15': [{ datetime: parse('2020-09-15', 'yyyy-MM-dd', new Date()), description: 'reminder 3'}]
    };

    reminderService.getReminders = jasmine.createSpy('getReminders').and.returnValue(of(reminders));
    service.getCalendarDates(month).subscribe((calendarDates: CalendarDate[]) => {
      const datesWithReminders = calendarDates.filter(calendar => calendar.reminders && calendar.reminders.length);
      expect(datesWithReminders.length).toEqual(3);

      datesWithReminders.forEach(calendarDate => {
        expect(calendarDate.reminders).toEqual(reminders[format(calendarDate.date, 'yyyy-MM-dd')]);
      });
    });
  });
});

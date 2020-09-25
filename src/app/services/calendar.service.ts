import { Injectable } from '@angular/core';
import { addDays, eachDayOfInterval, endOfMonth, format, getDay, startOfMonth, subDays } from 'date-fns';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarDate } from '../models/calendar-date';
import { RemindersDateMap } from '../models/reminders-date-map';

const SATURDAY = 6;

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor() {}

  getCalendarDates(month: Date): Observable<CalendarDate[]> {
    const firstDayOfMonth = startOfMonth(month);
    const lastDayOfMonth = endOfMonth(month);

    return forkJoin([
      this.getCalendarDatesList(firstDayOfMonth, lastDayOfMonth),
      this.getMonthReminders(firstDayOfMonth, lastDayOfMonth),
      this.getMonthForecast(firstDayOfMonth, lastDayOfMonth)
    ]).pipe(map(([ calendarDates, remindersDateMap, forecast ]: any[]) => {
      console.log('here: ', calendarDates, remindersDateMap);

      return calendarDates.map((calendarDate: CalendarDate) => {
        const dateKey = format(calendarDate.date, 'yyyy-MM-dd');
        calendarDate.reminders = remindersDateMap[dateKey] || [];
        calendarDate.forecast = [];
        return calendarDate;
      });
    }));
  }

  private getCalendarDatesList(firstDayOfMonth: Date, lastDayOfMonth: Date): Observable<CalendarDate[]> {
    // Always starts at Sunday
    const start = subDays(firstDayOfMonth, getDay(firstDayOfMonth));
    // Always ends at Saturday
    const end = addDays(lastDayOfMonth, SATURDAY - getDay(lastDayOfMonth));
    return of(eachDayOfInterval({ start, end }).map((date: Date) => ({ date, reminders: [], forecast: [] })));
  }

  private getMonthReminders(firstDayOfMonth: Date, lastDayOfMonth: Date): Observable<RemindersDateMap> {
    return of({
      '2020-09-25': [
        {
          datetime: new Date('2020-09-25'),
          description: 'reminder 1',
          color: '#CCCCCC',
          city: 'New York'
        }
      ]
    });
  }

  private getMonthForecast(firstDayOfMonth: Date, lastDayOfMonth: Date) {
    return of([]);
  }
}

import { Injectable } from '@angular/core';
import { compareAsc, eachDayOfInterval, parse, format } from 'date-fns';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reminder } from '../models/reminder';
import { RemindersDateMap } from '../models/reminders-date-map';
import { ForecastService } from './forecast.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  reminderChangesSubject = new Subject();
  constructor(private storage: StorageService, private forecastService: ForecastService) {}

  reminderChanges(): Observable<any> {
    return this.reminderChangesSubject.asObservable();
  }

  getReminders(start: Date, end: Date): Observable<RemindersDateMap> {
    const allReminders = this.storage.getReminders();
    const periodReminders = {};

    eachDayOfInterval({ start, end })
      .map(date => this.dateString(date))
      .forEach(dateString => {
        periodReminders[dateString] = allReminders[dateString] || [];
      });

    let forecastRequest = [];
    for(let date in periodReminders) {
      const remindersDate = parse(date, 'yyyy-MM-dd', new Date());
      if (this.forecastService.isForecastSearchableForDate(remindersDate)) {
        forecastRequest = [
          ...forecastRequest,
          ...periodReminders[date].map(reminder => this.getForecastForReminder(reminder))
        ]
      }
    }

    if (forecastRequest.length) {
      return forkJoin(forecastRequest).pipe(map(() => periodReminders));
    }
    return of(periodReminders);
  }

  saveReminder(reminder: Reminder): Observable<Reminder> {
    let allReminders = this.storage.getReminders();
    const dateString = this.dateString(reminder.datetime);
    const reminders = allReminders[dateString] || [];
    
    if (reminder.id) {
      const existingReminderIndex = reminders.findIndex(rem => rem.id === reminder.id);
      if (existingReminderIndex > -1) {
        reminders[existingReminderIndex] = reminder;
      } else {
        allReminders = this.remove(allReminders, reminder);
        reminders.push(reminder);
      }
    } else {
      reminder.id = this.generateReminderId();
      reminders.push(reminder);
    }

    reminders.sort((reminderA, reminderB) => compareAsc(new Date(reminderA.datetime), new Date(reminderB.datetime)));
    allReminders[dateString] = reminders;
    this.setReminders(allReminders);
    return of(reminder);
  }

  removeReminder(reminder: Reminder): Observable<boolean> {
    let allReminders = this.storage.getReminders();
    allReminders = this.remove(allReminders, reminder);
    this.setReminders(allReminders);
    return of(true);
  }

  removeAllRemindersByDate(date: Date): Observable<boolean> {
    const allReminders = this.storage.getReminders();
    const dateString = this.dateString(date);
    allReminders[dateString] = [];
    this.setReminders(allReminders);
    return of(true);
  }

  private getForecastForReminder(reminder) {
    return new Observable<Reminder>(resolve => {
      this.forecastService.getForecastCityDate(reminder.city, reminder.datetime)
        .subscribe(forecast => {
          reminder.forecast = forecast;
        })
        .add(() => {
          resolve.next(reminder);
          resolve.complete();
        });
    });
  }

  private setReminders(reminders) {
    this.storage.setReminders(reminders);
    this.reminderChangesSubject.next();
  }

  private remove(allReminders, reminder): RemindersDateMap {
    if (reminder.id) {
      for (let date in allReminders) {
        if (allReminders[date] && allReminders[date].length) {
          allReminders[date] = allReminders[date].filter(rem => rem.id !== reminder.id);
        }
      }
    }

    return allReminders;
  }

  private generateReminderId(): string {
    return Date.now().toString();
  }

  private dateString(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }
}

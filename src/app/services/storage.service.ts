import { Injectable } from '@angular/core';
import { RemindersDateMap } from '../models/reminders-date-map';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly remindersKey = 'JOBSITY_REMINDERS';

  constructor() {}

  getReminders(): RemindersDateMap {
    const reminders = localStorage.getItem(this.remindersKey) || '{}';
    return JSON.parse(reminders);
  }

  setReminders(reminders: RemindersDateMap) {
    const remindersString = JSON.stringify(reminders);
    localStorage.setItem(this.remindersKey, remindersString);
  }
}

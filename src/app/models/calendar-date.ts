import { Reminder } from './reminder';

export interface CalendarDate {
  date: Date;
  reminders?: Reminder[];
}

import { Reminder } from './reminder';

export interface RemindersDateMap {
  [key: string]: Reminder[]; // format key: yyyy-mm-dd
}

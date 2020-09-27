import { Forecast } from './forecast';

export interface Reminder {
  id?: string;
  datetime: Date;
  description: string;
  color?: string;
  city?: string;
  forecast?: Forecast;
}

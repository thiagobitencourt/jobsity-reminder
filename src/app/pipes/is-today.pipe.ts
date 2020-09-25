import { Pipe, PipeTransform } from '@angular/core';
import { isToday } from 'date-fns';

@Pipe({
  name: 'isToday'
})
export class IsTodayPipe implements PipeTransform {
  transform(date: Date): boolean {
    return isToday(date);
  }
}

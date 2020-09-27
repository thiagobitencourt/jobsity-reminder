import { Pipe, PipeTransform } from '@angular/core';
import { isSameMonth } from 'date-fns';

@Pipe({
  name: 'isOutOfMonth'
})
export class IsOutOfMonthPipe implements PipeTransform {
  transform(date: Date, month: Date): boolean {
    return !isSameMonth(date, month);
  }
}

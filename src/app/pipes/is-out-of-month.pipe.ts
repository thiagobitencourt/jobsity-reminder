import { Pipe, PipeTransform } from '@angular/core';
import { isThisMonth } from 'date-fns';

@Pipe({
  name: 'isOutOfMonth'
})
export class IsOutOfMonthPipe implements PipeTransform {
  transform(date: Date): boolean {
    return !isThisMonth(date);
  }
}

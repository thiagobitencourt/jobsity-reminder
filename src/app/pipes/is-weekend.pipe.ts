import { Pipe, PipeTransform } from '@angular/core';
import { isWeekend } from 'date-fns';

@Pipe({
  name: 'isWeekend'
})
export class IsWeekendPipe implements PipeTransform {
  transform(date: Date): boolean {
    return isWeekend(date);
  }
}

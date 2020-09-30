import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekLabel'
})
export class WeekLabelPipe implements PipeTransform {
  constructor() {}

  transform(weekLabel: string, isMobile: boolean): unknown {
    if (weekLabel) {
      return isMobile ? weekLabel.substr(0, 3) : weekLabel;
    }
  }
}

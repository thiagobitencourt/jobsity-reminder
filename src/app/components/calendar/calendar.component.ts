import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalendarDate } from 'src/app/models/calendar-date';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarDatesSubscription: Subscription;
  calendarDates: CalendarDate[];
  month = new Date();

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.loadCalendar();
  }

  ngOnDestroy() {
    if (this.calendarDatesSubscription) {
      this.calendarDatesSubscription.unsubscribe();
    }
  }

  private loadCalendar() {
    this.calendarDatesSubscription = this.calendarService.getCalendarDates(this.month).subscribe(calendarDates => {
      this.calendarDates = calendarDates;
    });
  }
}

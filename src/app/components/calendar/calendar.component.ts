import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalendarDate } from 'src/app/models/calendar-date';
import { Reminder } from 'src/app/models/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReminderService } from 'src/app/services/reminder.service';

const MOBILE_BREAKPOINT = 800;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() month;

  reminderChangesSubscription: Subscription;
  loadCalendarSubscription: Subscription;
  calendarDates: CalendarDate[] = [];
  isMobileSize = false;

  constructor(
    private calendarService: CalendarService,
    private reminderService: ReminderService,
    private dialogService: DialogService
  ) {}

  @HostListener('window:resize', ['$event'])
  pageResize(event) {
    this.isMobileSize = event.target.innerWidth <= MOBILE_BREAKPOINT;
    console.log(this.isMobileSize);
  }

  ngOnInit(): void {
    this.pageResize({ target: { innerWidth: window.innerWidth }});
    this.setReminderChangesListener();
  }

  ngOnDestroy() {
    this.cancelReminderChangesListener();
    this.cancelCalendarExistingLoader();
  }

  ngOnChanges() {
    this.loadCalendar();
  }

  removeReminder(reminder: Reminder) {
    this.reminderService.removeReminder(reminder);
  }

  removeAllReminders(date: Date) {
    this.reminderService.removeAllRemindersByDate(date);
  }

  editReminder(reminder: Reminder) {
    this.dialogService.openReminderDialog(reminder).subscribe();
  }

  private loadCalendar() {
    this.cancelCalendarExistingLoader();
    this.loadCalendarSubscription = this.calendarService.getCalendarDates(this.month).subscribe(calendarDates => {
        this.calendarDates = calendarDates || [];
      });
  }

  private setReminderChangesListener() {
    this.cancelReminderChangesListener();
    this.reminderChangesSubscription = this.reminderService.reminderChanges().subscribe(this.loadCalendar.bind(this));
  }

  private cancelCalendarExistingLoader() {
    if (this.loadCalendarSubscription) {
      this.loadCalendarSubscription.unsubscribe();
    }
  }

  private cancelReminderChangesListener() {
    if (this.reminderChangesSubscription) {
      this.reminderChangesSubscription.unsubscribe();
    }
  }
}

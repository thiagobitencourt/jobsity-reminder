import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalendarDate } from 'src/app/models/calendar-date';
import { Reminder } from 'src/app/models/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReminderService } from 'src/app/services/reminder.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy, OnChanges {
  reminderChangesSubscription: Subscription;
  loadCalendarSubscription: Subscription;
  calendarDates: CalendarDate[] = [];
  @Input() month;

  constructor(
    private calendarService: CalendarService,
    private reminderService: ReminderService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
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

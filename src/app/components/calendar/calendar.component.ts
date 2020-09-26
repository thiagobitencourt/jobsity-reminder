import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class CalendarComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  calendarDates: CalendarDate[];
  month = new Date();

  constructor(
    private calendarService: CalendarService,
    private reminderService: ReminderService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadCalendar();
    this.setReminderChangesListener();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  removeReminder(reminder: Reminder) {
    this.reminderService.removeReminder(reminder);
  }

  removeAllReminders(date: Date) {
    this.reminderService.removeAllRemindersByDate(date);
  }

  editReminder(reminder: Reminder) {
    this.subscriptions.add(
      this.dialogService.openReminderDialog(reminder).subscribe()
    );
  }

  private loadCalendar() {
    this.subscriptions.add(
      this.calendarService.getCalendarDates(this.month).subscribe(calendarDates => {
       this.calendarDates = calendarDates;
      })
    );
  }

  private setReminderChangesListener() {
    this.subscriptions.add(
      this.reminderService.reminderChanges().subscribe(this.loadCalendar.bind(this))
    );
  }
}

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IsOutOfMonthPipe } from 'src/app/pipes/is-out-of-month.pipe';
import { IsTodayPipe } from 'src/app/pipes/is-today.pipe';
import { IsWeekendPipe } from 'src/app/pipes/is-weekend.pipe';
import { CalendarService } from 'src/app/services/calendar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReminderService } from 'src/app/services/reminder.service';
import { of } from 'rxjs';

import { CalendarComponent } from './calendar.component';
import { CalendarDate } from 'src/app/models/calendar-date';
import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { By } from '@angular/platform-browser';
import { ReminderItemComponent } from '../reminder-item/reminder-item.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  const reminderService = {
    reminderChanges: jasmine.createSpy('reminderChanges').and.returnValue(of({})),
    removeReminder: jasmine.createSpy('removeReminder').and.returnValue(of({})),
    removeAllRemindersByDate: jasmine.createSpy('removeAllRemindersByDate').and.returnValue(of({}))
  };

  const calendarService = {
    getCalendarDates: jasmine.createSpy('getCalendarDates').and.returnValue(of([]))
  };

  const dialogService = jasmine.createSpyObj('dialogService', ['openReminderDialog']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsTodayPipe, IsWeekendPipe, IsOutOfMonthPipe, CalendarComponent, ReminderItemComponent],
      providers: [
        { provide: ReminderService, useValue: reminderService },
        { provide: CalendarService, useValue: calendarService },
        { provide: DialogService, useValue: dialogService }
      ],
      imports: [MatDialogModule, HttpClientModule, MatSnackBarModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the calendar items for the given month', () => {
    component.month = new Date();
    component.ngOnChanges();
    expect(calendarService.getCalendarDates).toHaveBeenCalledWith(component.month);
  });

  it('should subscribe to reminder changes', () => {
    component.ngOnInit();
    expect(reminderService.reminderChanges).toHaveBeenCalled();
  });

  it('should display the week days names', () => {
    const calendarDates: CalendarDate[] = [];
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    eachDayOfInterval({ start, end }).forEach(date => calendarDates.push({ date, reminders: [] }));

    calendarService.getCalendarDates = jasmine.createSpy('getCalendarDates').and.returnValue(of(calendarDates));
    
    component.month = new Date();
    component.ngOnChanges();
    fixture.detectChanges();

    const calendarWeekLabels = fixture.debugElement.queryAll(By.css('.calendar-header .header-label'));
    
    expect(calendarService.getCalendarDates).toHaveBeenCalledWith(component.month);
    expect(component.calendarDates.length).toEqual(7);
    expect(calendarWeekLabels.length).toEqual(7);
    expect(calendarWeekLabels[0].nativeElement.textContent).toContain('Sunday');
    expect(calendarWeekLabels[1].nativeElement.textContent).toContain('Monday');
    expect(calendarWeekLabels[2].nativeElement.textContent).toContain('Tuesday');
    expect(calendarWeekLabels[3].nativeElement.textContent).toContain('Wednesday');
    expect(calendarWeekLabels[4].nativeElement.textContent).toContain('Thursday');
    expect(calendarWeekLabels[5].nativeElement.textContent).toContain('Friday');
    expect(calendarWeekLabels[6].nativeElement.textContent).toContain('Saturday');
  });

  it('should display all the calendar days', () => {
    const calendarDates: CalendarDate[] = [];
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    eachDayOfInterval({ start, end }).forEach(date => calendarDates.push({ date, reminders: [] }));

    calendarService.getCalendarDates = jasmine.createSpy('getCalendarDates').and.returnValue(of(calendarDates));
    component.ngOnChanges();
    fixture.detectChanges();
    
    const calendarDateItems = fixture.debugElement.queryAll(By.css('.calendar-grid .calendar-item'));

    expect(component.calendarDates.length).toEqual(calendarDates.length);
    expect(calendarDateItems.length).toEqual(calendarDates.length);
  });

  it('should display the reminders for the corresponding date', () => {
    const calendarDates: CalendarDate[] = [];
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    eachDayOfInterval({ start, end }).forEach((date, index) => calendarDates.push({ date, reminders: [
      { datetime: date, description: 'reminder ' + index }
    ] }));

    calendarService.getCalendarDates = jasmine.createSpy('getCalendarDates').and.returnValue(of(calendarDates));
    component.ngOnChanges();
    fixture.detectChanges();
    
    const calendarDateItems = fixture.debugElement.query(By.css('.calendar-item .calendar-item-body app-reminder-item'));
    
    expect(component.calendarDates[0].reminders[0]).toEqual({ datetime: component.calendarDates[0].date, description: 'reminder 0' });
    expect(calendarDateItems.nativeElement.textContent).toContain('reminder 0');
  });

  it('should have an action to remove all the reminders for a specific date, when there are reminders', () => {
    const calendarDates: CalendarDate[] = [];
    const start = startOfMonth(new Date());
    eachDayOfInterval({ start, end: addDays(start, 1) }).forEach(date => calendarDates.push({ date, reminders: [] }));
    calendarDates[0].reminders = [{
      datetime: calendarDates[0].date,
      description: 'reminder 0'
    }];

    calendarService.getCalendarDates = jasmine.createSpy('getCalendarDates').and.returnValue(of(calendarDates));
    
    component.month = new Date();
    component.ngOnChanges();
    fixture.detectChanges();

    const removeAllItems = fixture.debugElement.queryAll(By.css('.calendar-grid .calendar-item .calendar-item-header .remove-all'));
    // There are two dates
    expect(component.calendarDates.length).toBe(2);
    // There are reminders for only one of the dates
    expect(removeAllItems.length).toBe(1);
  });

  it('should be able to open the dialog to edit a reminder', () => {
    dialogService.openReminderDialog = jasmine.createSpy('openReminderDialog').and.returnValue(of());
    const reminder = { datetime: new Date(), description: 'reminder test' };
    component.editReminder(reminder);

    expect(dialogService.openReminderDialog).toHaveBeenCalledWith(reminder);
  });

  it('should be able to remove a specific reminder', () => {
    reminderService.removeReminder = jasmine.createSpy('removeReminder').and.returnValue(of());
    const reminder = { datetime: new Date(), description: 'reminder test' };
    component.removeReminder(reminder);

    expect(reminderService.removeReminder).toHaveBeenCalledWith(reminder);
  });

  it('should be able to remove all reminders for a specific date', () => {
    reminderService.removeAllRemindersByDate = jasmine.createSpy('removeAllRemindersByDate').and.returnValue(of());
    const date = new Date();
    component.removeAllReminders(date);

    expect(reminderService.removeAllRemindersByDate).toHaveBeenCalledWith(date);
  });

  it('should highlight the today item of the calendar', () => {
    const calendarDates: CalendarDate[] = [];
    const start = subDays(new Date(), 1);
    const end = addDays(new Date(), 1);
    eachDayOfInterval({ start, end }).forEach(date => calendarDates.push({ date, reminders: [] }));
    calendarService.getCalendarDates = jasmine.createSpy('getCalendarDates').and.returnValue(of(calendarDates));

    component.ngOnChanges();
    fixture.detectChanges();

    const todayItem = fixture.debugElement.queryAll(By.css('.calendar-item.is-today'));
    const todayNumber = fixture.debugElement.query(By.css('.calendar-item.is-today .calendar-day-number'));

    expect(component.calendarDates.length).toBe(3);
    expect(todayItem.length).toBe(1);
    expect(todayNumber.nativeElement.textContent).toContain(format(new Date(), 'dd'));
  });

  it('should display as "disabled" the days out of the current month', () => {
    const calendarDates: CalendarDate[] = [];
    const end = startOfMonth(new Date());
    const start = subDays(end, 1);
    eachDayOfInterval({ start, end }).forEach(date => calendarDates.push({ date, reminders: [] }));
    calendarService.getCalendarDates = jasmine.createSpy('getCalendarDates').and.returnValue(of(calendarDates));

    component.month = new Date();
    component.ngOnChanges();
    fixture.detectChanges();

    const calendarItems = fixture.debugElement.queryAll(By.css('.calendar-item'));
    const [lastMonthDate, currentMonthDate] = calendarItems;
    expect(lastMonthDate.nativeElement.classList).toContain('is-disabled');
    expect(currentMonthDate.nativeElement.classList).not.toContain('is-disabled');
  });

  it('should hightlight the weekend dates', () => {
    const calendarDates: CalendarDate[] = [];
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    eachDayOfInterval({ start, end }).forEach(date => calendarDates.push({ date, reminders: [] }));

    calendarService.getCalendarDates = jasmine.createSpy('getCalendarDates').and.returnValue(of(calendarDates));
    
    component.month = new Date();
    component.ngOnChanges();
    fixture.detectChanges();

    const calendarItems = fixture.debugElement.queryAll(By.css('.calendar-item'));
    expect(calendarItems[0].nativeElement.classList).toContain('is-weekend');
    expect(calendarItems[6].nativeElement.classList).toContain('is-weekend');
    expect(calendarItems[1].nativeElement.classList).not.toContain('is-weekend');
    expect(calendarItems[5].nativeElement.classList).not.toContain('is-weekend');
  });
});

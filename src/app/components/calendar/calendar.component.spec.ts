import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { IsOutOfMonthPipe } from 'src/app/pipes/is-out-of-month.pipe';
import { IsTodayPipe } from 'src/app/pipes/is-today.pipe';
import { IsWeekendPipe } from 'src/app/pipes/is-weekend.pipe';
import { CalendarService } from 'src/app/services/calendar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReminderService } from 'src/app/services/reminder.service';

import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsTodayPipe, IsWeekendPipe, IsOutOfMonthPipe, CalendarComponent],
      providers: [
        { provider: ReminderService, useValue: {} },
        { provider: DialogService, useValue: {} },
        { provider: CalendarService, useValue: {} }
      ],
      imports: [MatDialogModule]
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
});
